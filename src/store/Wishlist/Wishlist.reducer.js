import {
    clearWishlist as sourceClearWishlist,
    deleteProperty as sourceDeleteProperty,
    getInitialState as sourceGetInitialState,
    PRODUCTS_IN_WISHLIST as SOURCE_PRODUCTS_IN_WISHLIST,
    removeItemFromWishlist as sourceRemoveItemFromWishlist,
    updateAllProductsInWishlist as sourceUpdateAllProductsInWishlist,
    updateItemOptions as sourceUpdateItemOptions
} from 'SourceStore/Wishlist/Wishlist.reducer';

import {
    CLEAR_WISHLIST,
    GET_SHARING_CODE,
    REMOVE_ITEM_FROM_WISHLIST,
    UPDATE_ALL_PRODUCTS_IN_WISHLIST,
    UPDATE_IS_LOADING_IN_WISHLIST,
    UPDATE_ITEM_OPTIONS
} from './Wishlist.action';

// TODO: implement PRODUCTS_IN_WISHLIST
export const PRODUCTS_IN_WISHLIST = SOURCE_PRODUCTS_IN_WISHLIST;

/** @namespace Seedsman/Store/Wishlist/Reducer/getInitialState */
export const getInitialState = () => ({
    ...sourceGetInitialState(),
    sharingCode: ''
});

/** @namespace Seedsman/Store/Wishlist/Reducer/getSharingcode */
export const getSharingcode = (action) => ({ sharingCode: action, isLoading: false });

// TODO: implement deleteProperty
export const deleteProperty = sourceDeleteProperty;

// TODO: implement removeItemFromWishlist
export const removeItemFromWishlist = sourceRemoveItemFromWishlist;

// TODO: implement clearWishlist
export const clearWishlist = sourceClearWishlist;

// TODO: implement updateAllProductsInWishlist
export const updateAllProductsInWishlist = sourceUpdateAllProductsInWishlist;

// TODO: implement updateItemOptions
export const updateItemOptions = sourceUpdateItemOptions;

/** @namespace Seedsman/Store/Wishlist/Reducer/WishlistReducer */
export const WishlistReducer = (
    state = getInitialState(),
    action
) => {
    const { type, options } = action;

    switch (type) {
    case REMOVE_ITEM_FROM_WISHLIST:
        return {
            ...state,
            isLoading: false,
            ...removeItemFromWishlist(action, state)
        };

    case CLEAR_WISHLIST:
        return {
            ...state,
            ...clearWishlist()
        };

    case UPDATE_ALL_PRODUCTS_IN_WISHLIST:
        return {
            ...state,
            isLoading: false,
            ...updateAllProductsInWishlist(action)
        };

    case GET_SHARING_CODE:
        const { value } = action;

        return {
            ...state,
            isLoading: false,
            ...getSharingcode(value)

        };

    case UPDATE_ITEM_OPTIONS:
        return {
            ...state,
            ...updateItemOptions(options, state)
        };

    case UPDATE_IS_LOADING_IN_WISHLIST:
        const { isLoading } = action;

        return {
            ...state,
            isLoading
        };

    default:
        return state;
    }
};

export default WishlistReducer;
