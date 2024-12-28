/**
 * Google Tag Manager frontend compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import { getGuestQuoteId } from '@scandipwa/scandipwa/src/util/Cart';

import { getCheckoutEventData, getCheckoutOptionEventData } from '../data/checkout';
import { getCustomerData } from '../data/customer';
import { getPaymonixPurchaseEventData, getPurchaseEventData } from '../data/purchase';
import {
    GTM_EVENT_KEY_CHECKOUT,
    GTM_EVENT_KEY_CHECKOUT_OPTION,
    GTM_EVENT_KEY_PURCHASE
} from '../util/events';
import { pushToDataLayer } from '../util/push';
import { debounceCallback } from '../util/wait';

export const fireCheckoutOptionEvent = debounceCallback(async (step, option) => {
    const { customerId } = await getCustomerData();

    pushToDataLayer({
        event: GTM_EVENT_KEY_CHECKOUT_OPTION,
        customerId,
        ...await getCheckoutOptionEventData(step, option)
    });
});

export const fireCheckoutEvent = debounceCallback(async (step) => {
    const { customerId } = await getCustomerData();

    pushToDataLayer({
        event: GTM_EVENT_KEY_CHECKOUT,
        customerId,
        ...await getCheckoutEventData(step)
    });
});

/** @namespace Seedsman/@Scandiweb/Gtm/Event/Checkout/firePurchaseEvent */
export const firePurchaseEvent = async (orderId, guestQuoteId) => {
    const { customerId } = getCustomerData();

    pushToDataLayer({
        event: GTM_EVENT_KEY_PURCHASE,
        customerId,
        ...await getPurchaseEventData(orderId, guestQuoteId)
    });
};

/** @namespace Seedsman/@Scandiweb/Gtm/Event/Checkout/firePaymonixPurchaseEvent */
export const firePaymonixPurchaseEvent = async (orderId) => {
    const { customerId } = getCustomerData();
    const guestQuoteId = getGuestQuoteId();

    pushToDataLayer({
        event: GTM_EVENT_KEY_PURCHASE,
        customerId,
        ...await getPaymonixPurchaseEventData(orderId, guestQuoteId)
    });
};
