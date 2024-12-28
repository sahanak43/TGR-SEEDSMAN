import WishlistQuery from 'Query/Wishlist.query';
import {
    isWishlistEnabled as sourceIsWishlistEnabled,
    WishlistDispatcher as SourceWishlistDispatcher
} from 'SourceStore/Wishlist/Wishlist.dispatcher';
import { showNotification } from 'Store/Notification/Notification.action';
import { getSharingcode, updateIsLoading } from 'Store/Wishlist/Wishlist.action';
import { getAuthorizationToken, isSignedIn } from 'Util/Auth';
import { fetchMutation, fetchQuery } from 'Util/Request';

// TODO: implement isWishlistEnabled
export const isWishlistEnabled = sourceIsWishlistEnabled;

/** @namespace Seedsman/Store/Wishlist/Dispatcher */
export class WishlistDispatcher extends SourceWishlistDispatcher {
    async addItemToWishlist(dispatch, options) {
        if (!isSignedIn()) {
            return;
        }

        try {
            const { items = [], wishlistId = '' } = options;
            dispatch(updateIsLoading(true));
            await fetchMutation(WishlistQuery.addProductsToWishlist(wishlistId, items));
            await this._syncWishlistWithBE(dispatch);
            dispatch(showNotification('success', 'Product added to wish-list!'));
        } catch {
            dispatch(showNotification('error', 'Error updating wish list!'));
        } finally {
            dispatch(updateIsLoading(false));
        }
    }

    getShareCode(dispatch) {
        if (isSignedIn() && isWishlistEnabled()) {
            this._syncWishlistShareCode(dispatch);
        } else {
            dispatch(getSharingcode({}));
        }
    }

    _syncWishlistShareCode(dispatch) {
        // Need to get current wishlist from BE, update wishlist
        return fetchQuery(WishlistQuery.getWishlistQuery()).then(
            /** @namespace Seedsman/Store/Wishlist/Dispatcher/WishlistDispatcher/_syncWishlistShareCode/fetchQuery/then */
            (data) => {
                if (!getAuthorizationToken()) {
                    return;
                }
                if (data && data.wishlist) {
                    const { wishlist: { sharing_code } } = data;

                    dispatch(getSharingcode(sharing_code));
                }
                dispatch(updateIsLoading(false));
            },
            /** @namespace Seedsman/Store/Wishlist/Dispatcher/WishlistDispatcher/_syncWishlistShareCode/fetchQuery/then/catch */
            () => {
                dispatch(updateIsLoading(false));
            }
        );
    }
}

export default new WishlistDispatcher();
