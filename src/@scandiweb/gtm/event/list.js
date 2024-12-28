/**
 * Google Tag Manager frontend compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import getStore from 'Util/Store';

import { getCustomerData } from '../data/customer';
import { getProductClickData, getProductImpressionsData } from '../data/list';
import { GTM_EVENT_KEY_IMPRESSIONS, GTM_EVENT_KEY_PRODUCT_CLICK } from '../util/events';
import { pushToDataLayer } from '../util/push';
import { debounceCallback } from '../util/wait';

export const IMPRESSION_PUSH_TIMER = 2000;
export const MAX_IMPRESSION_BATCH = 24;
export const MIN_IMPRESSION_BATCH = 1;
export const DEFAULT_IMPRESSION_BATCH = 6;

export const products = [];
export const positions = [];

/** @namespace Seedsman/@Scandiweb/Gtm/Event/List/fireImpressionEvent */
export const fireImpressionEvent = async (
    product, position, forcedList
) => {
    const { gtm_impressions_batch_limit } = getStore().getState().ConfigReducer?.gtm?.events || {};
    const impressionBatchLimit = (gtm_impressions_batch_limit >= MIN_IMPRESSION_BATCH
    && gtm_impressions_batch_limit <= MAX_IMPRESSION_BATCH)
        ? gtm_impressions_batch_limit : DEFAULT_IMPRESSION_BATCH;

    products.push(product);
    positions.push(position);

    // eslint-disable-next-line fp/no-let
    let pushTimer;
    if (products.length === 1) {
        pushTimer = setTimeout(async () => {
            if (product.length === 0) {
                return;
            }

            pushToDataLayer({
                event: GTM_EVENT_KEY_IMPRESSIONS,
                ...await getProductImpressionsData(products, positions, forcedList)
            });

            products.splice(0, products.length);
            positions.splice(0, positions.length);
        }, IMPRESSION_PUSH_TIMER);
    }

    if (products.length >= impressionBatchLimit) {
        clearTimeout(pushTimer);

        const productsToPush = products.splice(0, impressionBatchLimit);
        const positionsToPush = positions.splice(0, impressionBatchLimit);

        pushToDataLayer({
            event: GTM_EVENT_KEY_IMPRESSIONS,
            ...await getProductImpressionsData(productsToPush, positionsToPush, forcedList)
        });
    }
    // ^^^ not using debounce, as many impressions can come together
    const { customerId } = await getCustomerData();

    // TODO: join multiple impressions
    pushToDataLayer({
        event: GTM_EVENT_KEY_IMPRESSIONS,
        customerId,
        ...await getProductImpressionsData(product, position, forcedList)
    });
};

/** @namespace Scandiweb/Gtm/Event/Card/fireProductClickEvent */
export const fireProductClickEvent = debounceCallback(async (
    product, position, forcedList
) => {
    const { customerId } = await getCustomerData();

    pushToDataLayer({
        event: GTM_EVENT_KEY_PRODUCT_CLICK,
        customerId,
        ...await getProductClickData(product, position, forcedList)
    });
});
