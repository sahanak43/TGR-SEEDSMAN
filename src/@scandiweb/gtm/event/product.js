/**
 * Google Tag Manager frontend compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import { htmlParse } from 'Util/HtmlParser';

import { getCustomerData } from '../data/customer';
import { getProductDetailsData } from '../data/product';
import { GTM_EVENT_KEY_PRODUCT_DETAIL, GTM_EVENT_KEY_SEEDSMAN_PRODUCT } from '../util/events';
import { pushToDataLayer } from '../util/push';
import { debounceCallback } from '../util/wait';

/** @namespace Scandiweb/Gtm/Event/General/fireNotFoundEvent */
export const fireProductDetailsEvent = debounceCallback(async (product) => {
    const { customerId } = await getCustomerData();
    const { attributes: { brand: { attribute_value: brands, attribute_options = {} } = {} } = {} } = product;
    const value = attribute_options[brands]?.label;
    const aTag = new RegExp(/<a[^>]*>([^<]+)<\/a>/g);
    const test = aTag.test(value);
    if (value) {
        if (test === true) {
            if (htmlParse(value)?.props?.title === 'Seedsman') {
                pushToDataLayer({
                    event: GTM_EVENT_KEY_SEEDSMAN_PRODUCT,
                    customerId,
                    ...await getProductDetailsData(product)
                });
            }
        } else {
            const title = value.replace(/'/g, '');
            if (title === 'Seedsman') {
                pushToDataLayer({
                    event: GTM_EVENT_KEY_SEEDSMAN_PRODUCT,
                    customerId,
                    ...await getProductDetailsData(product)
                });
            }
        }
    } else {
        pushToDataLayer({
            event: GTM_EVENT_KEY_PRODUCT_DETAIL,
            customerId,
            ...await getProductDetailsData(product)
        });
    }
});
