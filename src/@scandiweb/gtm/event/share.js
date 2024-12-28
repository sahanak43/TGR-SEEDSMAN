import { getShareData } from '../data/share';
import { GTM_EVENT_KEY_SHARE } from '../util/events';
import { pushToDataLayer } from '../util/push';

/** @namespace Seedsman/@Scandiweb/Gtm/Event/Share/fireShareEvent */
export const fireShareEvent = async (type, contentType, productId) => {
    pushToDataLayer({
        event: GTM_EVENT_KEY_SHARE,
        ...await getShareData(type, contentType, productId)
    });
};
