/**
 * Adobe Recommendations compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import { isHomePageUrl } from 'Util/Url';

import Recommendations from '../component/Recommendations';
import { POSITION_ABOVE_CONTENT, POSITION_BELLOW_CONTENT } from '../component/Recommendations/Recommendations.config';

/**
 * This file is compatible with original extension entrypoints, located here:
 * vendor/magento/module-product-recommendations-layout/view/frontend/layout
 */

const addReccomendationsToHomepage = (args, callback) => {
    if (!isHomePageUrl(window.location.pathname)) {
        return callback(...args);
    }

    return (
        <>
            <Recommendations placementType={ POSITION_ABOVE_CONTENT } />
            { callback(...args) }
            <Recommendations placementType={ POSITION_BELLOW_CONTENT } />
        </>
    );
};

const addReccomendationsToCategoryPage = (args, callback) => (
    <>
        <Recommendations placementType={ POSITION_ABOVE_CONTENT } />
        { callback(...args) }
        <Recommendations placementType={ POSITION_BELLOW_CONTENT } />
    </>
);

const addReccomendationsToPage = (args, callback) => (
    <>
        { callback(...args) }
        <Recommendations placementType={ POSITION_BELLOW_CONTENT } />
    </>
);

export default {
    // vvv cms_index_index compatibility
    'Route/CmsPage/Component': {
        // ^^^ made to CmsPage, due to hardly-extensible HomePage component
        'member-function': {
            render: addReccomendationsToHomepage
        }
    },
    // vvv checkout_onepage_success compatibility
    'Component/CheckoutSuccess/Component': {
        'member-function': {
            render: addReccomendationsToPage
        }
    },
    // vvv checkout_cart_index compatibility
    'Route/CartPage/Component': {
        'member-function': {
            renderCrossSellProducts: addReccomendationsToPage
        }
    },
    // vvv catalog_product_view compatibility
    'Route/ProductPage/Component': {
        'member-function': {
            renderProductTabs: addReccomendationsToPage
        }
    },
    // vvv catalog_category_view compatibility
    'Route/CategoryPage/Component': {
        'member-function': {
            render: addReccomendationsToCategoryPage
        }
    }
};
