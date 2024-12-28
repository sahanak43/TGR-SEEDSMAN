/* eslint-disable max-lines */
import { CONFIRMATION_REQUIRED } from 'Component/MyAccountCreateAccount/MyAccountCreateAccount.config';
import MyAccountQuery from 'Query/MyAccount.query';
import MyAccountRewardStoreQuery from 'Query/MyAccountRewardStore.query';
import {
    MyAccountDispatcher as SourceMyAccountDispatcher
} from 'SourceStore/MyAccount/MyAccount.dispatcher';
// import getStore from 'SourceUtil/Store';
import {
    getRewardPoints,
    updateCustomerDetails,
    updateCustomerSignInStatus,
    updateIsLoading,
    updateIsLocked
} from 'Store/MyAccount/MyAccount.action';
import { showNotification } from 'Store/Notification/Notification.action';
import { hideActiveOverlay } from 'Store/Overlay/Overlay.action';
import { clearComparedProducts } from 'Store/ProductCompare/ProductCompare.action';
import {
    deleteAuthorizationToken, getAuthorizationToken, GRAPHQL_AUTH, GRAPHQL_AUTHO, isSignedIn,
    setAuthorizationToken
} from 'Util/Auth';
import BrowserDatabase from 'Util/BrowserDatabase';
import { deleteGuestQuoteId, getGuestQuoteId, setGuestQuoteId } from 'Util/Cart';
import { removeUid } from 'Util/Compare';
import { fireInsiderEvent } from 'Util/Insider';
import { prepareQuery } from 'Util/Query';
import {
    executePost, fetchMutation, fetchQuery,
    getErrorMessage
} from 'Util/Request';

export const CartDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Cart/Cart.dispatcher'
);

export const ProductCompareDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/ProductCompare/ProductCompare.dispatcher'
);

export const WishlistDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Wishlist/Wishlist.dispatcher'
);

export const CUSTOMER = 'customer';

export const ONE_MONTH_IN_SECONDS = 2628000;

/**
 * My account actions
 * @class MyAccount
 * @namespace Seedsman/Store/MyAccount/Dispatcher */
export class MyAccountDispatcher extends SourceMyAccountDispatcher {
    requestCustomerData(dispatch, isLogin = false) {
        const query = MyAccountQuery.getCustomerQuery();

        return executePost(prepareQuery([query])).then(
            /** @namespace Seedsman/Store/MyAccount/Dispatcher/MyAccountDispatcher/requestCustomerData/executePost/then */
            ({ customer }) => {
                if (!getAuthorizationToken()) {
                    return;
                }

                dispatch(updateIsLocked(false));
                dispatch(updateCustomerDetails(customer));
                if (isLogin) {
                    fireInsiderEvent('user', customer);
                }
                BrowserDatabase.setItem(customer, CUSTOMER, ONE_MONTH_IN_SECONDS);
            },
            /** @namespace Seedsman/Store/MyAccount/Dispatcher/MyAccountDispatcher/requestCustomerData/executePost/then/catch */
            // eslint-disable-next-line consistent-return
            (error) => {
                const { extensions: { category } } = error[0];

                dispatch(showNotification('error', getErrorMessage(error)));

                if (category === GRAPHQL_AUTH) {
                    dispatch(updateIsLocked(true));
                }

                if (category === GRAPHQL_AUTHO) {
                    if (isSignedIn()) {
                        fetchMutation(MyAccountQuery.getRevokeAccountToken());
                        deleteAuthorizationToken();
                    }

                    dispatch(showNotification('success', 'You are successfully logged out!'));
                }

                deleteGuestQuoteId();
                BrowserDatabase.deleteItem(CUSTOMER);
                removeUid();

                dispatch(updateCustomerSignInStatus(false));
                dispatch(updateCustomerDetails({}));

                // After logout cart, wishlist and compared product list is always empty.
                // There is no need to fetch it from the backend.
                CartDispatcher.then(
                    ({ default: dispatcher }) => {
                        dispatcher.resetGuestCart(dispatch);
                        dispatcher.createGuestEmptyCart(dispatch);
                    }
                );
                WishlistDispatcher.then(
                    ({ default: dispatcher }) => dispatcher.resetWishlist(dispatch)
                );

                dispatch(clearComparedProducts());
                dispatch(updateCustomerDetails({}));
            }
        );
    }

    /**
     * Create account action
     * @param {{customer: Object, password: String}} [options={}]
     * @memberof MyAccountDispatcher
     */
    createAccount(options = {}, dispatch) {
        const { customer: { email }, password } = options;
        const mutation = MyAccountQuery.getCreateAccountMutation(options);
        dispatch(updateIsLoading(true));

        return fetchMutation(mutation).then(
            /** @namespace Seedsman/Store/MyAccount/Dispatcher/MyAccountDispatcher/createAccount/fetchMutation/then */
            (data) => {
                const { createCustomerV2: { customer } } = data;
                const { confirmation_required } = customer;

                if (confirmation_required) {
                    dispatch(updateIsLoading(false));

                    return CONFIRMATION_REQUIRED;
                }
                fireInsiderEvent('user', customer);
                return this.signIn({ email, password }, dispatch);
            },

            /** @namespace Seedsman/Store/MyAccount/Dispatcher/MyAccountDispatcher/createAccount/fetchMutation/then/catch */
            (error) => {
                dispatch(updateIsLoading(false));
                dispatch(showNotification('error', getErrorMessage(error)));
                return false;
            }
        );
    }

    /**
     * Sign in action
     * @param {{email: String, password: String}} [options={}]
     * @memberof MyAccountDispatcher
     */
    async signIn(options = {}, dispatch) {
        const mutation = MyAccountQuery.getSignInMutation(options);

        const result = await fetchMutation(mutation);
        const { generateCustomerToken: { token } } = result;

        setAuthorizationToken(token);

        ProductCompareDispatcher.then(
            ({ default: dispatcher }) => dispatcher.assignCompareList(dispatch)
        );

        const cartDispatcher = (await CartDispatcher).default;
        const guestCartToken = getGuestQuoteId();
        // if customer is authorized, `createEmptyCart` mutation returns customer cart token
        const customerCartToken = await cartDispatcher.createGuestEmptyCart(dispatch);

        if (guestCartToken && guestCartToken !== customerCartToken) {
            // merge guest cart id and customer cart id using magento capabilities
            await cartDispatcher.mergeCarts(guestCartToken, customerCartToken, dispatch);
        }

        setGuestQuoteId(customerCartToken);
        cartDispatcher.updateInitialCartData(dispatch, true);

        WishlistDispatcher.then(
            ({ default: dispatcher }) => dispatcher.updateInitialWishlistData(dispatch)
        );

        await this.requestCustomerData(dispatch, true);

        dispatch(updateCustomerSignInStatus(true));
        dispatch(updateIsLoading(false));
        dispatch(hideActiveOverlay());
        dispatch(showNotification('success', 'You are successfully logged in!'));

        return true;
    }

    logout(authTokenExpired = false, isWithNotification = true, dispatch) {
        if (authTokenExpired) {
            if (isWithNotification) {
                dispatch(showNotification('error', __('Your session is over, you are logged out!')));
            }

            this.handleForceRedirectToLoginPage();
        } else {
            if (isSignedIn()) {
                fetchMutation(MyAccountQuery.getRevokeAccountToken());
                deleteAuthorizationToken();
            }

            if (isWithNotification) {
                dispatch(showNotification('success', __('You are successfully logged out!')));
            }
        }

        fireInsiderEvent('user', null);
        deleteGuestQuoteId();
        BrowserDatabase.deleteItem(CUSTOMER);
        removeUid();

        dispatch(updateCustomerSignInStatus(false));
        dispatch(updateCustomerDetails({}));

        // After logout cart, wishlist and compared product list is always empty.
        // There is no need to fetch it from the backend.
        CartDispatcher.then(
            ({ default: dispatcher }) => {
                dispatcher.resetGuestCart(dispatch);
                dispatcher.createGuestEmptyCart(dispatch);
            }
        );
        WishlistDispatcher.then(
            ({ default: dispatcher }) => dispatcher.resetWishlist(dispatch)
        );

        dispatch(clearComparedProducts());
        dispatch(updateCustomerDetails({}));
    }

    async getCustomerQueryDetails(dispatch) {
        if (!isSignedIn()) {
            return null;
        }

        dispatch(updateIsLoading(true));
        const rewards = await fetchQuery(MyAccountRewardStoreQuery._getRewardPointsHistoryDetails());
        dispatch(getRewardPoints(rewards));
        dispatch(updateIsLoading(false));
        return true;
    }
}

export default new MyAccountDispatcher();
