/**
 * Adobe Data Services compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import mse from '@adobe/magento-storefront-events-sdk';

import {
    TYPE_CATEGORY,
    TYPE_CMS_PAGE,
    TYPE_PRODUCT
} from 'SourceRoute/UrlRewrites/UrlRewrites.config';
import getStore from 'SourceUtil/Store';
import { isHomePageUrl } from 'Util/Url';

import { waitForCallback } from './wait';

export const EVENT_CONTEXT_LOADED = 'adobe-context-loaded';

// vvv Checkout
export const CART_PN = '/cart';
export const CHECKOUT_SHIPPING_PN = '/checkout/shipping';
export const CHECKOUT_PAYMENT_PN = '/checkout/billing';
export const CHECKOUT_SUCCESS_PN = '/checkout/success';
export const CHECKOUT_PN = '/checkout';

// vvv Account
export const MY_ACCOUNT_PN = '/my-account';
export const MY_ADDRESS_PN = '/my-account/address-book';

// vvv Wishlist
export const WISHLIST_PN = '/my-account/wishlist';

/** @namespace Scandiweb/AdobeDataServices/Util/Context/updateCart */
export const updateCart = async () => {
    /**
     * The code bellow is compatible with following file:
     * vendor/magento/module-data-services/Model/CartContext.php
     */
    const isCartTotalsLoaded = await waitForCallback(() => getStore().getState().CartReducer?.cartTotals);

    if (!isCartTotalsLoaded) {
        return;
    }

    const {
        id,
        items_qty,
        subtotal,
        subtotal_incl_tax,
        items
    } = getStore().getState().CartReducer?.cartTotals;

    window.magentoStorefrontEvents.context.setShoppingCart({
        id,
        totalQuantity: items_qty,
        prices: {
            subtotalExcludingTax: { value: subtotal },
            subtotalIncludingTax: { value: subtotal_incl_tax }
        },
        possibleOnepageCheckout: true,
        items: items.map((item) => {
            const {
                item_id,
                price,
                qty,
                product: {
                    id,
                    name,
                    sku,
                    type_id,
                    thumbnail: { url }
                }
            } = item;

            return {
                id: item_id,
                formattedPrice: price,
                quantity: qty,
                prices: { price: { value: price } },
                product: {
                    // vvv There are missing keys here
                    productId: id,
                    productType: type_id,
                    name,
                    sku,
                    mainImageUrl: url
                }
            };
        })
    });
};

/** @namespace Scandiweb/AdobeDataServices/Util/Context/updateProduct */
export const updateProduct = async () => {
    /**
     * The code bellow is compatible with following file:
     * vendor/magento/module-data-services/Model/ProductContext.php
     */
    const isProductLoaded = await waitForCallback(() => getStore().getState().ProductReducer?.product);

    if (!isProductLoaded) {
        return;
    }

    const {
        id,
        name,
        sku,
        type_id,
        thumbnail: { url } = {}
    } = getStore().getState().ProductReducer?.product;

    window.magentoStorefrontEvents.context.setProduct({
        // vvv There are missing keys here
        productId: id,
        productType: type_id,
        name,
        sku,
        mainImageUrl: url
    });
};

/** @namespace Scandiweb/AdobeDataServices/Util/Context/updateCategory */
export const updateCategory = async () => {
    /**
     * The code bellow is compatible with following file:
     * vendor/magento/module-data-services/ViewModel/CategoryContextProvider.php
     */
    const isCategoryLoaded = await waitForCallback(() => getStore().getState().CategoryReducer?.category?.id);

    if (!isCategoryLoaded) {
        return;
    }

    const { name, url_key, url_path } = getStore().getState().CategoryReducer?.category;

    window.magentoStorefrontEvents.context.setCategory({
        name,
        urlKey: url_key,
        urlPath: url_path
    });
};

/**
 * The code bellow is compatible with files from following folder:
 * vendor/magento/module-data-services/view/frontend/layout
*/
export const pageMap = [
    {
        test: () => waitForCallback(() => {
            const { urlRewrite: { type }, requestedUrl } = getStore().getState().UrlRewritesReducer;

            return isHomePageUrl(window.location.pathname) || (
                type === TYPE_CMS_PAGE && requestedUrl === window.location.pathname
            );
        }),
        config: {
            type: 'CMS',
            step: 'view'
        }
    },
    {
        test: () => waitForCallback(() => {
            const { urlRewrite: { type }, requestedUrl } = getStore().getState().UrlRewritesReducer;
            return type === TYPE_CATEGORY && requestedUrl === window.location.pathname;
        }),
        config: {
            type: 'Category',
            step: 'category-view'
        },
        additional: updateCategory
    },
    {
        test: async () => waitForCallback(() => {
            const { urlRewrite: { type }, requestedUrl } = getStore().getState().UrlRewritesReducer;
            return type === TYPE_PRODUCT && requestedUrl === window.location.pathname;
        }),
        config: {
            type: 'Product',
            step: 'product-view'
        },
        additional: updateProduct
    },
    {
        test: async () => window.location.pathname === CART_PN,
        config: {
            type: 'Cart',
            step: 'cart-view'
        },
        additional: updateCart
    },
    {
        test: async () => window.location.pathname === CHECKOUT_PN,
        config: {
            type: 'Checkout',
            step: 'initiate-checkout'
        },
        additional: updateCart
    },
    {
        test: async () => window.location.pathname === CHECKOUT_PAYMENT_PN,
        config: {
            type: 'Checkout',
            step: 'checkout-payment'
        },
        additional: updateCart
    },
    {
        test: async () => window.location.pathname === CHECKOUT_SHIPPING_PN,
        config: {
            type: 'Checkout',
            step: 'checkout-review'
        },
        additional: updateCart
    },
    {
        test: async () => window.location.pathname === CHECKOUT_SUCCESS_PN,
        config: {
            type: 'Checkout',
            step: 'place-order'
        },
        additional: updateCart
    },
    {
        test: async () => window.location.pathname === MY_ACCOUNT_PN,
        config: {
            type: 'MyAccount',
            step: 'account-edit'
        }
    },
    {
        test: async () => window.location.pathname === MY_ADDRESS_PN,
        config: {
            type: 'MyAccount',
            step: 'address-edit'
        }
    },
    {
        test: async () => window.location.pathname === WISHLIST_PN,
        config: {
            type: 'Wishlist',
            step: 'wishlist-view'
        }
    }
];

/** @namespace Scandiweb/AdobeDataServices/Util/Context/updateContextPage */
export const updateContextPage = async () => {
    // vvv Wait for context to be initialized
    await waitForCallback(() => window.magentoStorefrontEvents);

    // vvv Reset every time page changes
    window.magentoStorefrontEvents.context.setPage({});
    window.magentoStorefrontEvents.context.setContext('pageExtended', {});
    window.magentoStorefrontEvents.context.setShoppingCart({});
    window.magentoStorefrontEvents.context.setProduct({});
    window.magentoStorefrontEvents.context.setCategory({});

    const pageTests = await Promise.all(pageMap.map(({ test: a }) => a()));
    const validIndex = pageTests.findIndex((v) => !!v);

    if (validIndex === -1) {
        // vvv Fallback to defaults (declared in vendor/magento/module-data-services/view/frontend/layout/default.xml)
        window.magentoStorefrontEvents.context.setPage({ pageType: 'Default' });
        window.magentoStorefrontEvents.context.setContext('pageExtended', { action: 'page-view' });
        return;
    }

    const { config: { type, step }, additional } = pageMap[validIndex];

    // vvv This is required for every page
    window.magentoStorefrontEvents.context.setPage({ pageType: type });
    window.magentoStorefrontEvents.context.setContext('pageExtended', { action: step });

    if (additional) {
        // vvv Wait for additional context changes
        await additional();
    }

    document.dispatchEvent(new Event(EVENT_CONTEXT_LOADED));
};

/** @namespace Scandiweb/AdobeDataServices/Util/Context/initContext */
export const initContext = async () => {
    window.magentoStorefrontEvents = mse;

    // vvv Wait for config to be returned
    await waitForCallback(() => getStore().getState().ConfigReducer?.dataServicesConfig?.version);
    const { version, ...config } = getStore().getState().ConfigReducer?.dataServicesConfig;

    window.magentoStorefrontEvents.context.setStorefrontInstance(config);

    window.magentoStorefrontEvents.context.setMagentoExtension({
        magentoExtensionVersion: version
    });

    window.magentoStorefrontEvents.context.setDataServicesExtension({
        version
    });

    updateContextPage();
};
