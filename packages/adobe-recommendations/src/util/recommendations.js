/**
 * Adobe Recommendations compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import RecommendationsClient from '@magento/recommendations-js-sdk';

import getStore from 'SourceUtil/Store';

import { POSITION_ABOVE_CONTENT, POSITION_BELLOW_CONTENT } from '../component/Recommendations/Recommendations.config';
import { waitForCallback } from './wait';

export const DEFAULT_UNITS = {
    [POSITION_ABOVE_CONTENT]: [],
    [POSITION_BELLOW_CONTENT]: []
};

/** @namespace Scandiweb/AdobeRecommendations/Util/Recommendations/processProductPrice */
export const processProductPrice = (currency = 'USD', price = 0) => ({
    default_price: {
        currency,
        value: parseFloat(price).toFixed(2) || 0
    },
    default_final_price: {
        currency,
        value: parseFloat(price).toFixed(2) || 0
    },
    default_final_price_excl_tax: {
        currency,
        value: parseFloat(price).toFixed(2) || 0
    },
    final_price: {
        currency,
        value: parseFloat(price).toFixed(2) || 0
    },
    regular_price: {
        currency,
        value: parseFloat(price).toFixed(2) || 0
    },
    regular_price_excl_tax: {
        currency,
        value: parseFloat(price).toFixed(2) || 0
    },
    final_price_excl_tax: {
        currency,
        value: parseFloat(price).toFixed(2) || 0
    },
    discount: { amount_off: 0, percent_off: 0 }
});

/** @namespace Scandiweb/AdobeRecommendations/Util/Recommendations/processProductImage */
export const processProductImage = ({ url: rawUrl = '' }) => {
    const { imagePlaceholderUrl } = getStore().getState().ConfigReducer;

    if (rawUrl) {
        const url = rawUrl.startsWith('//') ? `${window.location.protocol}${rawUrl}` : rawUrl;
        const { pathname, href } = new URL(url);

        return {
            path: pathname,
            url: href
        };
    }

    if (!imagePlaceholderUrl) {
        return {};
    }

    const { pathname, href } = new URL(imagePlaceholderUrl);

    return {
        path: pathname,
        url: href
    };
};

/** @namespace Scandiweb/AdobeRecommendations/Util/Recommendations/processProduct */
export const processProduct = (product) => {
    const {
        prices: {
            minimum: { final = 0.00 } = {},
            maximum: { final: finalMax = 0.00 } = {}
        } = {},
        currency = 'USD'
    } = product;

    return ({
        ...product,
        price_range: {
            maximum_price: {
                ...processProductPrice(currency, finalMax)
            },
            minimum_price: {
                ...processProductPrice(currency, final)
            }
        },
        url: product.url || '',
        image: processProductImage(product.image || {}),
        thumbnail: processProductImage(product.thumbnailImage || {}),
        small_image: processProductImage(product.smallImage || {}),
        id: product.sku
    });
};

/** @namespace Scandiweb/AdobeRecommendations/Util/Recommendations/processUnit */
export const processUnit = (unit) => {
    const { products } = unit;

    return {
        ...unit,
        // vvv maybe refactor to use just products
        products: products?.reduce((acc, product) => {
            const { prices, sku } = product;

            if (!prices || !sku) {
                return acc;
            }

            return [...acc, processProduct(product)];
        }, [])
    };
};

/** @namespace Scandiweb/AdobeRecommendations/Util/Recommendations/processUntis */
export const processUntis = (units) => (
    units.reduce((acc, unit) => {
        const { pagePlacement, products, unitId } = unit;

        if (products.length === 0 || unitId === undefined) {
            return acc;
        }

        // vvv Index by pagePlacement, process products
        const processedUnit = processUnit(unit);

        return {
            ...acc,
            // vvv Can not simply push, ref is used
            [pagePlacement]: [
                ...acc[pagePlacement],
                processedUnit
            ]
        };
    }, DEFAULT_UNITS)
);

/** @namespace Scandiweb/AdobeRecommendations/Util/Recommendations/getReccomendationUnits */
export const getReccomendationUnits = async () => {
    const { pageType } = window.magentoStorefrontEvents.context.getPage();
    const { environmentId } = window.magentoStorefrontEvents.context.getStorefrontInstance();

    if (!pageType || !environmentId) {
        // ^^^ Return default object if failed to load
        return DEFAULT_UNITS;
    }

    // vvv Options are not passed, assuming the client will read the from window.magentoStorefrontEvents
    const client = new RecommendationsClient();
    const { data: { results: newUnits } } = await client.fetchPreconfigured();
    return processUntis(newUnits);
};

/** @namespace Scandiweb/AdobeRecommendations/Util/Recommendations/getPageBuilderReccomendationUnitById */
export const getPageBuilderReccomendationUnitById = async (rawUnitId) => {
    // vvv This is taken from original file
    // eslint-disable-next-line no-magic-numbers
    const unitId = rawUnitId.substring(0, 36);

    await waitForCallback(() => window.magentoStorefrontEvents.context.getStorefrontInstance()?.environmentId);
    const { environmentId } = window.magentoStorefrontEvents.context.getStorefrontInstance();

    if (!environmentId) {
        // ^^^ Return default object if failed to load
        return undefined;
    }

    const options = {
        unitId,
        pageType: 'PageBuilder'
    };

    const { alternateEnvironmentId } = getStore().getState().ConfigReducer;

    if (alternateEnvironmentId) {
        options.alternateEnvironmentId = alternateEnvironmentId;
    }

    const client = new RecommendationsClient(options);
    const res = await client.fetchPreconfigured(options);
    const { data: newUnit } = res;

    if (!newUnit) {
        return null;
    }

    return processUnit(newUnit);
};
