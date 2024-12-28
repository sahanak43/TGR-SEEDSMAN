import {
    ADD_PRODUCT_TO_CART as SOURCE_ADD_PRODUCT_TO_CART,
    addProductToCart as sourceAddProductToCart,
    APPLY_COUPON_TO_CART as SOURCE_APPLY_COUPON_TO_CART,
    applyCouponToCart as sourceApplyCouponToCart,
    REMOVE_COUPON_FROM_CART as SOURCE_REMOVE_COUPON_FROM_CART,
    REMOVE_PRODUCT_FROM_CART as SOURCE_REMOVE_PRODUCT_FROM_CART,
    removeCouponFromCart as sourceRemoveCouponFromCart,
    removeProductFromCart as sourceRemoveProductFromCart,
    UPDATE_IS_LOADING_CART as SOURCE_UPDATE_IS_LOADING_CART,
    UPDATE_SHIPPING_PRICE as SOURCE_UPDATE_SHIPPING_PRICE,
    UPDATE_TOTALS as SOURCE_UPDATE_TOTALS,
    updateIsLoadingCart as sourceUpdateIsLoadingCart,
    updateShippingPrice as sourceUpdateShippingPrice,
    updateTotals as sourceUpdateTotals
} from 'SourceStore/Cart/Cart.action';

export const ADD_PROMO_PRODUCT_TO_CART = 'ADD_PROMO_PRODUCT_TO_CART';
export const APPLY_STORE_CREDIT = 'APPLY_STORE_CREDIT';
export const REMOVE_STORE_CREDIT = 'REMOVE_STORE_CREDIT';
export const UPDATE_COUPON_CODE = 'UPDATE_COUPON_CODE';

// TODO: implement ADD_PRODUCT_TO_CART
export const ADD_PRODUCT_TO_CART = SOURCE_ADD_PRODUCT_TO_CART;

// TODO: implement REMOVE_PRODUCT_FROM_CART
export const REMOVE_PRODUCT_FROM_CART = SOURCE_REMOVE_PRODUCT_FROM_CART;

// TODO: implement UPDATE_TOTALS
export const UPDATE_TOTALS = SOURCE_UPDATE_TOTALS;

// TODO: implement APPLY_COUPON_TO_CART
export const APPLY_COUPON_TO_CART = SOURCE_APPLY_COUPON_TO_CART;

// TODO: implement REMOVE_COUPON_FROM_CART
export const REMOVE_COUPON_FROM_CART = SOURCE_REMOVE_COUPON_FROM_CART;

// TODO: implement UPDATE_SHIPPING_PRICE
export const UPDATE_SHIPPING_PRICE = SOURCE_UPDATE_SHIPPING_PRICE;

// TODO: implement UPDATE_IS_LOADING_CART
export const UPDATE_IS_LOADING_CART = SOURCE_UPDATE_IS_LOADING_CART;

// TODO: implement addProductToCart
export const addProductToCart = sourceAddProductToCart;

// TODO: implement removeProductFromCart
export const removeProductFromCart = sourceRemoveProductFromCart;

// TODO: implement updateTotals
export const updateTotals = sourceUpdateTotals;

// TODO: implement updateShippingPrice
export const updateShippingPrice = sourceUpdateShippingPrice;

// TODO: implement applyCouponToCart
export const applyCouponToCart = sourceApplyCouponToCart;

// TODO: implement removeCouponFromCart
export const removeCouponFromCart = sourceRemoveCouponFromCart;

// TODO: implement updateIsLoadingCart
export const updateIsLoadingCart = sourceUpdateIsLoadingCart;

/**
 * Update product list with new list (rewrite if already exists).
 * @param  {Array<Object>} items List of products returned from fetch
 * @param  {Number} totalItems Total number of products in this filter
 * @return {void}
 * @namespace Seedsman/Store/Cart/Action/addPromoProductToCart */
export const addPromoProductToCart = (promoProduct) => ({
    type: ADD_PROMO_PRODUCT_TO_CART,
    promoProduct
});

/** @namespace Seedsman/Store/Cart/Action/applyStoreCredit */
export const applyStoreCredit = (cartId) => ({
    type: APPLY_STORE_CREDIT,
    cartId
});

/** @namespace Seedsman/Store/Cart/Action/removeStoreCredit */
export const removeStoreCredit = (cartId) => ({
    type: REMOVE_STORE_CREDIT,
    cartId
});

/** @namespace Seedsman/Store/Cart/Action/updateCouponCode */
export const updateCouponCode = (status) => ({
    type: UPDATE_COUPON_CODE,
    status
});
