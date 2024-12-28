/* eslint-disable no-unused-vars */
/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import { CartReducer as sourceCartReducer } from 'SourceStore/Cart/Cart.reducer';
import BrowserDatabase from 'Util/BrowserDatabase';
import { getIndexedProduct } from 'Util/Product';

import {
    UPDATE_COUPON_CODE, UPDATE_IS_LOADING_CART, UPDATE_SHIPPING_PRICE, UPDATE_TOTALS
} from './Cart.action';

export const CART_TOTALS = 'cart_totals';

/** @namespace Seedsman/Store/Cart/Reducer/updateCartTotals */
export const updateCartTotals = (action) => {
    const { cartData: { items = [], ...rest } = {} } = action;

    const cartTotals = {
        ...rest,
        items: []
    };

    if (items.length) {
        const normalizedItemsProduct = items.map((item) => {
            const { variants, ...normalizedItem } = item;
            normalizedItem.product = getIndexedProduct(item.product, item.sku);

            return normalizedItem;
        });

        cartTotals.items = normalizedItemsProduct;
    }

    BrowserDatabase.setItem(
        cartTotals,
        CART_TOTALS
    );

    return { cartTotals, isLoading: false };
};

/** @namespace Seedsman/Store/Cart/Reducer/updateShippingPrice */
export const updateShippingPrice = (action, state) => {
    const {
        data: {
            items,
            ...rest
        } = {}
    } = action;

    return {
        cartTotals: {
            ...state.cartTotals,
            ...rest
        }
    };
};

/** @namespace Seedsman/Store/Cart/Reducer/getInitialState */
export const getInitialState = () => ({
    isLoading: false,
    isCouponCodeValid: '',
    cartTotals: BrowserDatabase.getItem(CART_TOTALS) || {}
});

/** @namespace Seedsman/Store/Cart/Reducer/CartReducer */
export const CartReducer = (
    state = getInitialState(),
    action
) => {
    const {
        type,
        status
    } = action;

    if (type === UPDATE_COUPON_CODE) {
        return {
            ...sourceCartReducer(state, action),
            isCouponCodeValid: status
        };
    }

    return sourceCartReducer(state, action);
};

export default CartReducer;
