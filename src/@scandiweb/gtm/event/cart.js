/**
 * Google Tag Manager frontend compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */
import { htmlParse } from 'Util/HtmlParser';

import { getAddToCartData, getCartData, getRemoveFromCartData } from '../data/cart';
import { getCustomerData } from '../data/customer';
import {
    GTM_EVENT_KEY_ADD_TO_CART, GTM_EVENT_KEY_ADD_TO_CART_FROM_CATEGORY,
    GTM_EVENT_KEY_CART,
    GTM_EVENT_KEY_LOYALITY_POINTS,
    GTM_EVENT_KEY_PROMOTION_CODE_FROM_CART_PAGE,
    GTM_EVENT_KEY_REMOVE_FROM_CART, GTM_EVENT_KEY_SEEDSMAN_ADD_TO_CART,
    GTM_EVENT_KEY_SEEDSMAN_REMOVE_FROM_CART
} from '../util/events';
import { pushToDataLayer } from '../util/push';

/** @namespace Seedsman/@Scandiweb/Gtm/Event/Cart/fireAddToCartEvent */
export const fireAddToCartEvent = async (item, currencyCode, customerId) => {
    const {
        product: {
            attributes: {
                brand:
        { attribute_value: brands, attribute_options = {} } = {}
            } = {}
        } = {}
    } = item;
    const value = attribute_options[brands]?.label;
    const aTag = new RegExp(/<a[^>]*>([^<]+)<\/a>/g);
    const test = aTag.test(value);
    const title = value.replace(/'/g, '');

    if (value && test === true) {
        if (htmlParse(value)?.props?.title === 'Seedsman') {
            pushToDataLayer({
                event: GTM_EVENT_KEY_SEEDSMAN_ADD_TO_CART,
                customerId,
                ...await getAddToCartData(item, currencyCode)
            });
        }
    } else if (value && title === 'Seedsman') {
        pushToDataLayer({
            event: GTM_EVENT_KEY_SEEDSMAN_ADD_TO_CART,
            customerId,
            ...await getAddToCartData(item, currencyCode)
        });
    } else {
        pushToDataLayer({
            event: GTM_EVENT_KEY_ADD_TO_CART,
            customerId,
            ...await getAddToCartData(item, currencyCode)
        });
    }
    // ^^^ not using debounce, as many cart edits may happen at once
};
/** @namespace Seedsman/@Scandiweb/Gtm/Event/Cart/fireAddToCartFromCategoryPage */
export const fireAddToCartFromCategoryPage = async (item, currencyCode, customerId) => {
    pushToDataLayer({
        event: GTM_EVENT_KEY_ADD_TO_CART_FROM_CATEGORY,
        customerId,
        ...await getAddToCartData(item, currencyCode)
    });
};

/** @namespace Seedsman/@Scandiweb/Gtm/Event/Cart/fireRemoveFromCartEvent */
export const fireRemoveFromCartEvent = async (item, currencyCode, customerId) => {
    const {
        product: {
            attributes: {
                brand:
        { attribute_value: brands, attribute_options = {} } = {}
            } = {}
        } = {}
    } = item;
    const value = attribute_options[brands]?.label;
    const aTag = new RegExp(/<a[^>]*>([^<]+)<\/a>/g);
    const test = aTag.test(value);
    const title = value.replace(/'/g, '');

    if (value && test === true) {
        if (htmlParse(value)?.props?.title === 'Seedsman') {
            pushToDataLayer({
                event: GTM_EVENT_KEY_SEEDSMAN_REMOVE_FROM_CART,
                customerId,
                ...await getRemoveFromCartData(item, currencyCode)
            });
        }
    } else if (value && title === 'Seedsman') {
        pushToDataLayer({
            event: GTM_EVENT_KEY_SEEDSMAN_REMOVE_FROM_CART,
            customerId,
            ...await getRemoveFromCartData(item, currencyCode)
        });
    } else {
        pushToDataLayer({
            event: GTM_EVENT_KEY_REMOVE_FROM_CART,
            customerId,
            ...await getRemoveFromCartData(item, currencyCode)
        });
    }

    // ^^^ not using debounce, as many cart edits may happen at once
};

/** @namespace Seedsman/@Scandiweb/Gtm/Event/Cart/fireCartEvent */
export const fireCartEvent = async (items, currencyCode) => {
    const { customerId } = await getCustomerData();
    pushToDataLayer({
        event: GTM_EVENT_KEY_CART,
        customerId,
        ...await getCartData(items, currencyCode)
    });
};

/** @namespace Seedsman/@Scandiweb/Gtm/Event/Cart/firePromotionCodeFromCartPage */
export const firePromotionCodeFromCartPage = async (coupon_code) => {
    pushToDataLayer({
        event: GTM_EVENT_KEY_PROMOTION_CODE_FROM_CART_PAGE,
        coupon_code
    });
};
/** @namespace Seedsman/@Scandiweb/Gtm/Event/Cart/fireLoyalityPoints */
export const fireLoyalityPoints = async (point) => {
    pushToDataLayer({
        event: GTM_EVENT_KEY_LOYALITY_POINTS,
        point
    });
};
