import { GTM_EVENT_KEY_PROMOTION_PAGE } from '../util/events';
import { pushToDataLayer } from '../util/push';
import { debounceCallback } from '../util/wait';

/** @namespace Seedsman/@Scandiweb/Gtm/Event/Promotion */
export const firePromotionEvent = debounceCallback(async () => {
    pushToDataLayer({
        event: GTM_EVENT_KEY_PROMOTION_PAGE
    });
});

export default firePromotionEvent;
