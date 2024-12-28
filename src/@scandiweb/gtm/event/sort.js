/**
 * Google Tag Manager frontend compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import { getSortDetailsData } from '../data/sort';
import { GTM_EVENT_KEY_SORT } from '../util/events';
import { pushToDataLayer } from '../util/push';
import { debounceCallback } from '../util/wait';

/** @namespace Scandiweb/Gtm/Event/General/fireNotFoundEvent */
export const fireProductSortEvent = debounceCallback(async (sort, customerId) => {
    pushToDataLayer({
        event: GTM_EVENT_KEY_SORT,
        customerId,
        ...await getSortDetailsData(sort)
    });
});
