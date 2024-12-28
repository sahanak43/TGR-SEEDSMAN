import { updateCustomerSignInStatus } from 'Store/MyAccount/MyAccount.action';
import BrowserDatabase from 'Util/BrowserDatabase';
import { deleteGuestQuoteId } from 'Util/Cart';
import { removeUid } from 'Util/Compare';
import { debounce } from 'Util/Request';
import getStore from 'Util/Store';

export const AUTH_TOKEN = 'auth_token';

export const ONE_HOUR_IN_SECONDS = 3600;
export const ONE_HOUR = 1;
export const TOKEN_REFRESH_DELAY = 2000;

/** @namespace Seedsman/Util/Auth/Token/setAuthorizationToken */
export const setAuthorizationToken = (token) => {
    if (!token) {
        return;
    }

    const state = getStore().getState();
    const {
        access_token_lifetime = ONE_HOUR
    } = state.ConfigReducer;

    BrowserDatabase.setItem(token, AUTH_TOKEN, access_token_lifetime * ONE_HOUR_IN_SECONDS);
};

/** @namespace Seedsman/Util/Auth/Token/deleteAuthorizationToken */
export const deleteAuthorizationToken = () => BrowserDatabase.deleteItem(AUTH_TOKEN);

/** @namespace Seedsman/Util/Auth/Token/getAuthorizationToken */
export const getAuthorizationToken = () => BrowserDatabase.getItem(AUTH_TOKEN);

/** @namespace Util/Auth/Token/refreshAuthorizationToken */
export const refreshAuthorizationToken = debounce(
    () => setAuthorizationToken(getAuthorizationToken()),
    TOKEN_REFRESH_DELAY
);

/** @namespace Seedsman/Util/Auth/Token/isInitiallySignedIn */
export const isInitiallySignedIn = () => !!getAuthorizationToken();

/** @namespace Seedsman/Util/Auth/Token/isSignedIn */
export const isSignedIn = () => {
    const _isSignedIn = !!getAuthorizationToken();
    const store = getStore();
    const {
        MyAccountReducer: {
            isSignedIn: isCustomerSignedIn
        } = {}
    } = store.getState();
    const { dispatch } = store;

    if (!_isSignedIn && isCustomerSignedIn) {
        // since logout is async and slow, remove cart id / compare uid
        // and set customer sign in status here on auth token expiration
        deleteGuestQuoteId();
        dispatch(updateCustomerSignInStatus(false));
        removeUid();

        const MyAccountDispatcher = import('../../store/MyAccount/MyAccount.dispatcher');
        MyAccountDispatcher.then(
            ({ default: dispatcher }) => dispatcher.logout(true, true, dispatch)
        );
    }

    return _isSignedIn;
};
