/**
 * Google Tag Manager frontend compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import { getCustomerData } from '../data/customer';
import { GTM_EVENT_KEY_SEARCH, GTM_EVENT_KEY_SEARCH_STARTED } from '../util/events';
import { pushToDataLayer } from '../util/push';
import { debounceCallback } from '../util/wait';

export const DL_VAL_SEARCH_NO_RESULTS = 'No Results Found';
export const DL_VAL_SEARCH_WITH_RESULTS = 'Results loaded';

/** @namespace Scandiweb/Gtm/Event/General/fireGeneralEvent */
export const fireSearchEvent = debounceCallback(async ({
    totalItems,
    searchTerm
}) => {
    const { customerId } = await getCustomerData();

    pushToDataLayer({
        event: GTM_EVENT_KEY_SEARCH,
        customerId,
        searchTerm,
        searchResults: totalItems > 0
            ? DL_VAL_SEARCH_NO_RESULTS
            : DL_VAL_SEARCH_WITH_RESULTS
    });
});

/** @namespace Scandiweb/Gtm/Event/General/fireGeneralEvent */
export const fireSearchStartedEvent = debounceCallback(async () => {
    const { customerId } = await getCustomerData();

    pushToDataLayer({
        event: GTM_EVENT_KEY_SEARCH_STARTED,
        customerId
    });
});
