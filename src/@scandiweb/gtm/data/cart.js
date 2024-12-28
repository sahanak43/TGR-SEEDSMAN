/**
 * Google Tag Manager frontend compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import getStore from 'SourceUtil/Store';

import { waitForCallback } from '../util/wait';
import { getProductData } from './product';

/** @namespace Seedsman/@Scandiweb/Gtm/Data/Cart/getCartItemData */
export const getCartItemData = async (item) => {
    const {
        qty: quantity,
        price,
        product
    } = item;

    return {
        ...await getProductData(product),
        price,
        quantity
    };
};

/** @namespace Seedsman/@Scandiweb/Gtm/Data/Cart/getCartItemsData */
export const getCartItemsData = async () => {
    // // vvv Wait for cart id
    await waitForCallback(() => getStore().getState().CartReducer?.cartTotals?.id);

    const {
        cartTotals: {
            items: cartItems = []
        } = {}
    } = getStore().getState().CartReducer;

    if (cartItems.length === 0) {
        return {};
    }

    return Promise.all(cartItems.map(getCartItemData));
};

/** @namespace Seedsman/@Scandiweb/Gtm/Data/Cart/getRemoveFromCartData */
export const getRemoveFromCartData = async (item, currencyCode) => ({
    ecommerce: {
        currencyCode,
        // ^^^ We can not read currencyCode via getStore (Redux limitation) => forced to pass
        remove: {
            products: [await getCartItemData(item)]
        }
    }
});

/** @namespace Seedsman/@Scandiweb/Gtm/Data/Cart/getAddToCartData */
export const getAddToCartData = async (item, currencyCode) => ({
    ecommerce: {
        currencyCode,
        // ^^^ We can not read currencyCode via getStore (Redux limitation) => forced to pass
        add: {
            products: [await getCartItemData(item)]
        }
    }
});

/** @namespace Seedsman/@Scandiweb/Gtm/Data/Cart/getCartData */
export const getCartData = async (items, currencyCode) => ({
    ecommerce: {
        currencyCode,
        cart: {
            products: await getCartItemsData(items)
        }
    }
});
