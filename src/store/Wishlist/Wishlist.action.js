import {
    CLEAR_WISHLIST as SOURCE_CLEAR_WISHLIST,
    clearWishlist as sourceClearWishlist,
    REMOVE_ITEM_FROM_WISHLIST as SOURCE_REMOVE_ITEM_FROM_WISHLIST,
    removeItemFromWishlist as sourceRemoveItemFromWishlist,
    UPDATE_ALL_PRODUCTS_IN_WISHLIST as SOURCE_UPDATE_ALL_PRODUCTS_IN_WISHLIST,
    UPDATE_IS_LOADING_IN_WISHLIST as SOURCE_UPDATE_IS_LOADING_IN_WISHLIST,
    UPDATE_ITEM_OPTIONS as SOURCE_UPDATE_ITEM_OPTIONS,
    updateAllProductsInWishlist as sourceUpdateAllProductsInWishlist,
    updateIsLoading as sourceUpdateIsLoading,
    updateItemOptions as sourceUpdateItemOptions
} from 'SourceStore/Wishlist/Wishlist.action';

// TODO: implement CLEAR_WISHLIST
export const CLEAR_WISHLIST = SOURCE_CLEAR_WISHLIST;

// TODO: implement UPDATE_ITEM_OPTIONS
export const UPDATE_ITEM_OPTIONS = SOURCE_UPDATE_ITEM_OPTIONS;

// TODO: implement REMOVE_ITEM_FROM_WISHLIST
export const REMOVE_ITEM_FROM_WISHLIST = SOURCE_REMOVE_ITEM_FROM_WISHLIST;

// TODO: implement UPDATE_ALL_PRODUCTS_IN_WISHLIST
export const UPDATE_ALL_PRODUCTS_IN_WISHLIST = SOURCE_UPDATE_ALL_PRODUCTS_IN_WISHLIST;

// TODO: implement UPDATE_IS_LOADING_IN_WISHLIST
export const UPDATE_IS_LOADING_IN_WISHLIST = SOURCE_UPDATE_IS_LOADING_IN_WISHLIST;

// TODO: implement removeItemFromWishlist
export const removeItemFromWishlist = sourceRemoveItemFromWishlist;

// TODO: implement updateAllProductsInWishlist
export const updateAllProductsInWishlist = sourceUpdateAllProductsInWishlist;

// TODO: implement updateIsLoading
export const updateIsLoading = sourceUpdateIsLoading;

// TODO: implement updateItemOptions
export const updateItemOptions = sourceUpdateItemOptions;

// TODO: implement clearWishlist
export const clearWishlist = sourceClearWishlist;

export const GET_SHARING_CODE = 'GET_SHARING_CODE';

/** @namespace Seedsman/Store/Wishlist/Action/getSharingcode */
export const getSharingcode = (value) => ({
    type: GET_SHARING_CODE,
    value
});
