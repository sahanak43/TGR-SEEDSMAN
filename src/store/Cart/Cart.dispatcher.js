import CartQuery from 'Query/Cart.query';
import {
    CartDispatcher as SourceCartDispatcher
} from 'SourceStore/Cart/Cart.dispatcher';
import { showNotification } from 'Store/Notification/Notification.action';
import { isSignedIn } from 'Util/Auth';
import { getGuestQuoteId } from 'Util/Cart';
import { fetchMutation, getErrorMessage } from 'Util/Request';

import { updateCouponCode } from './Cart.action.js';

/** @namespace Seedsman/Store/Cart/Dispatcher */
export class CartDispatcher extends SourceCartDispatcher {
    async applyStoreCredit(dispatch, cartId) {
        try {
            const isCustomerSignedIn = isSignedIn();
            const guestQuoteId = getGuestQuoteId();

            if (!isCustomerSignedIn && !guestQuoteId) {
                return false;
            }

            const {
                applyStoreCreditToCart = {},
                applyStoreCreditToCart: { cart = {} } = {}
            } = await fetchMutation(
                CartQuery.applyStoreCreditToCart(cartId)
            );

            if (cart.id) {
                await this.updateInitialCartData(dispatch);
                dispatch(showNotification('success', 'Store Credit applied!'));

                return applyStoreCreditToCart;
            }

            return false;
        } catch (error) {
            dispatch(showNotification('error', getErrorMessage(error)));

            return false;
        }
    }

    async removeStoreCredit(dispatch, cartId) {
        try {
            const isCustomerSignedIn = isSignedIn();
            const guestQuoteId = getGuestQuoteId();

            if (!isCustomerSignedIn && !guestQuoteId) {
                return false;
            }

            const {
                removeStoreCreditFromCart = {},
                removeStoreCreditFromCart: { cart = {} } = {}
            } = await fetchMutation(
                CartQuery.removeStoreCreditFromCart(cartId)
            );

            if (cart.id) {
                await this.updateInitialCartData(dispatch);
                dispatch(showNotification('success', 'Store Credit Removed!'));

                return removeStoreCreditFromCart;
            }

            return false;
        } catch (error) {
            dispatch(showNotification('error', getErrorMessage(error)));

            return false;
        }
    }

    async applyCouponToCart(dispatch, couponCode) {
        try {
            const isCustomerSignedIn = isSignedIn();
            const guestQuoteId = !isCustomerSignedIn && getGuestQuoteId();

            if (!isCustomerSignedIn && !guestQuoteId) {
                return false;
            }

            const { applyCoupon: { cartData = {} } = {} } = await fetchMutation(
                CartQuery.getApplyCouponMutation(couponCode, guestQuoteId)
            );

            this._updateCartData(cartData, dispatch);
            // dispatch(showNotification('success', __('Coupon was applied!')));
            dispatch(updateCouponCode(true));

            return true;
        } catch (error) {
            // dispatch(showNotification('error', getErrorMessage(error)));
            dispatch(updateCouponCode(false));

            return false;
        }
    }

    async addPromoProductToCart(dispatch, options = {}) {
        const { products = [], cartId: userCartId } = options;

        const cartId = userCartId || getGuestQuoteId();

        if (!Array.isArray(products) || products.length === 0) {
            dispatch(showNotification('error', 'No product data!'));
            return Promise.reject();
        }

        try {
            if (!cartId) {
                return Promise.reject();
            }

            const { addPromoProductsToCart: { user_errors: errors = [] } = {} } = await fetchMutation(
                CartQuery.getAddPromoProductsToCartMutation(cartId, products)
            );

            if (Array.isArray(errors) && errors.length > 0) {
                errors.forEach((error) => {
                    dispatch(showNotification('error', getErrorMessage(error)));
                });

                return Promise.reject();
            }

            await this.updateInitialCartData(dispatch);
            dispatch(showNotification('success', 'Product was added to cart!'));
        } catch (error) {
            if (!navigator.onLine) {
                dispatch(showNotification('error', 'Not possible to fetch while offline'));
                return Promise.reject();
            }

            dispatch(showNotification('error', getErrorMessage(error)));
            return Promise.reject();
        }

        return Promise.resolve();
    }
}

export default new CartDispatcher();
