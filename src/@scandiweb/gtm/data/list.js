/**
 * Google Tag Manager frontend compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import getStore from 'Util/Store';

import { waitForCallback } from '../util/wait';
import { getPageData } from './page';
import { getProductListEntryData } from './product';

/** @namespace Seedsman/@Scandiweb/Gtm/Data/List/getProductImpressionsData */
export const getProductImpressionsData = async (
    products, positions, forcedList
) => {
    if (!Array.isArray(products)) {
        return null;
    }
    // vvv Wait for currency code
    await waitForCallback(() => getStore().getState().ConfigReducer?.currencyData?.current_currency_code);

    const currencyCode = getStore().getState().ConfigReducer?.currencyData?.current_currency_code;

    const batchedImpressions = await products.map(async (product, index) => ({
        ...await getProductListEntryData(
            product, positions[index], forcedList
        )
    }));

    return {
        ecommerce: {
            currencyCode,
            impressions: await Promise.all(batchedImpressions)
        }
    };
};

/** @namespace Seedsman/@Scandiweb/Gtm/Data/List/getProductClickData */
export const getProductClickData = async (
    product, position, forcedList
) => {
    const { pageType: list } = await getPageData();
    // ^^^ Reuse page data as list information

    return {
        ecommerce: {
            click: {
                actionField: {
                    list: forcedList || list
                },
                products: [await getProductListEntryData(
                    product, position
                )]
            }
        }
    };
};
