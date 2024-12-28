/**
 * Google Tag Manager frontend compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

// vvv Requested to use sha256 for hashing
import { sha256 } from 'js-sha256';

import { getCustomerData, getLoginCustomerDetails } from '../data/customer';
import {
    GTM_EVENT_KEY_USER_LOGIN,
    GTM_EVENT_KEY_USER_LOGIN_ATTEMPT,
    GTM_EVENT_KEY_USER_LOGOUT,
    GTM_EVENT_KEY_USER_REGISTER,
    GTM_EVENT_KEY_USER_REGISTER_ATTEMPT
} from '../util/events';
import { pushToDataLayer } from '../util/push';
import { debounceCallback } from '../util/wait';

/** @namespace Scandiweb/Gtm/Event/User/fireUserLoginEvent */
export const fireUserLoginEvent = debounceCallback(async () => {
    pushToDataLayer({
        event: GTM_EVENT_KEY_USER_LOGIN,
        ...await getLoginCustomerDetails()
    });
});
/** @namespace Scandiweb/Gtm/Event/User/fireUserLoginAttemptEvent */

export const fireUserLoginAttemptEvent = debounceCallback(async (customerEmail) => {
    pushToDataLayer({
        event: GTM_EVENT_KEY_USER_LOGIN_ATTEMPT,
        customerHashedEmail: sha256(customerEmail),
        customerEmail,
        customerId: null
    });
});

/** @namespace Scandiweb/Gtm/Event/User/fireUserRegisterEvent */
export const fireUserRegisterEvent = debounceCallback(async () => {
    const { customerId, customerEmail } = await getCustomerData();

    if (!customerEmail) {
        return;
    }
    // ^^^ if there's no email then it means register was unsuccessful somehow so don't push  to data layer

    pushToDataLayer({
        event: GTM_EVENT_KEY_USER_REGISTER,
        customerHashedEmail: sha256(customerEmail),
        customerEmail,
        customerId
    });
});

/** @namespace Scandiweb/Gtm/Event/User/fireUserRegisterAttemptEvent */
export const fireUserRegisterAttemptEvent = debounceCallback(async (customerEmail) => {
    pushToDataLayer({
        event: GTM_EVENT_KEY_USER_REGISTER_ATTEMPT,
        customerHashedEmail: sha256(customerEmail),
        customerEmail,
        customerId: null
    });
});

export const fireUserLogoutEvent = debounceCallback(async (customerId) => {
    pushToDataLayer({
        event: GTM_EVENT_KEY_USER_LOGOUT,
        customerId
    });
});
