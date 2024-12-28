/**
 * Google Tag Manager frontend compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import { sha256 } from 'js-sha256';

import { getCustomerData } from '../data/customer';
import { getPageData } from '../data/page';
import { GTM_EVENT_KEY_GENERAL } from '../util/events';
import { pushToDataLayer } from '../util/push';
import { debounceCallback } from '../util/wait';

/** @namespace Scandiweb/Gtm/Event/General/fireGeneralEvent */
export const fireGeneralEvent = debounceCallback(async () => {
    const {
        userLoginState,
        customerId,
        customerEmail,
        userExistingCustomer,
        userLifetimeValue,
        userLifetimeOrders
    } = await getCustomerData();

    pushToDataLayer({
        event: GTM_EVENT_KEY_GENERAL,
        userLoginState,
        customerId,
        customerEmail,
        customerHashedEmail: sha256(customerEmail),
        userExistingCustomer,
        userLifetimeValue,
        userLifetimeOrders,
        ...await getPageData()
    });
});
