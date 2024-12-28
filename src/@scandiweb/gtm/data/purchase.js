/**
 * Google Tag Manager frontend compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import { roundPrice } from 'Util/Price';
import { fetchQuery } from 'Util/Request';
import getStore from 'Util/Store';

import PurchaseQuery from '../query/Purchase.query.js';
import { waitForCallback } from '../util/wait';
import { getCustomerData } from './customer';
import { getProductDimensionsData } from './product';

/** @namespace Seedsman/@Scandiweb/Gtm/Data/Purchase/getPurchaseProductsData */
export const getPurchaseProductsData = async (purchase) => {
    const { products } = purchase;

    return Promise.all(products.map(async (product) => {
        const {
            category,
            id,
            name,
            price,
            quantity
        } = product;

        return {
            category,
            id,
            name,
            price: +roundPrice(price),
            quantity,
            dimensions: await getProductDimensionsData(product)
        };
    }));
};

/** @namespace Seedsman/@Scandiweb/Gtm/Data/Purchase/getPurchasePaymonixProductsData */
export const getPurchasePaymonixProductsData = async (items) => Promise.all(items.map(async (item) => {
    const {
        product: {
            name, sku
        },
        price, qty
    } = item;

    return {
        id: sku,
        name,
        price: +roundPrice(price),
        quantity: qty
    };
}));

/** @namespace Seedsman/@Scandiweb/Gtm/Data/Purchase/getPurchaseShippingData */
export const getPurchaseShippingData = (purchase) => {
    const { shippingAddress, additional_data } = purchase;

    if (!additional_data || !shippingAddress) {
        return {};
    }

    const {
        city,
        postcode,
        region,
        region_id,
        street
    } = shippingAddress;

    return {
        shipping_city: city,
        shipping_region: region,
        shipping_country_id: region_id,
        shipping_street: street.replace(/\r?\n|\r/g, ' '),
        shipping_postcode: postcode
    };
};

/** @namespace Seedsman/@Scandiweb/Gtm/Data/Purchase/getPaymonixPurchaseShippingData */
export const getPaymonixPurchaseShippingData = (shipping_address) => {
    const {
        city,
        postcode,
        region,
        street
    } = shipping_address;

    return {
        shipping_city: city,
        shipping_region: region.region || region.region_code,
        shipping_country_id: region.region_id,
        shipping_street: street[0],
        shipping_postcode: postcode
    };
};

/** @namespace Seedsman/@Scandiweb/Gtm/Data/Purchase/getPurchaseCustomerData */
export const getPurchaseCustomerData = async (purchase) => {
    const { additional_data } = purchase;

    if (!additional_data) {
        return {};
    }

    return {
        ...await getCustomerData(),
        shipping_email: getStore().getState().CheckoutReducer?.email || ''
    };
};

/** @namespace Seedsman/@Scandiweb/Gtm/Data/Purchase/getPaymonixPurchaseCustomerData */
export const getPaymonixPurchaseCustomerData = async () => ({
    ...await getCustomerData(),
    shipping_email: getStore().getState().CheckoutReducer?.email || ''
});

/** @namespace Seedsman/@Scandiweb/Gtm/Data/Purchase/getPurchaseEventData */
export const getPurchaseEventData = async (orderId, guestQuoteId) => {
    // vvv Wait for currency code
    await waitForCallback(() => getStore().getState().ConfigReducer?.currencyData?.current_currency_code);

    const currencyCode = getStore().getState().ConfigReducer?.currencyData?.current_currency_code;

    const { purchase } = await fetchQuery(PurchaseQuery.getPurchaseField(orderId, guestQuoteId));
    const {
        orderPaymentMethod,
        orderShippingMethod,
        revenue,
        tax,
        shipping,
        coupon,
        discount_amount
    } = purchase;

    return {
        orderPaymentMethod,
        orderShippingMethod,
        ...await getPurchaseShippingData(purchase),
        discount_amount,
        ...await getPurchaseCustomerData(purchase),
        ecommerce: {
            currencyCode,
            purchase: {
                actionField: {
                    id: orderId,
                    revenue: +roundPrice(revenue),
                    tax: +roundPrice(tax),
                    coupon: coupon === null ? '' : coupon,
                    shipping: +roundPrice(shipping)
                },
                products: await getPurchaseProductsData(purchase)
            }
        }
    };
};

/** @namespace Seedsman/@Scandiweb/Gtm/Data/Purchase/getPaymonixPurchaseEventData */
export const getPaymonixPurchaseEventData = async (orderId) => {
    await waitForCallback(() => getStore().getState().ConfigReducer?.currencyData?.current_currency_code);

    const currencyCode = getStore().getState().ConfigReducer?.currencyData?.current_currency_code;
    const orderShippingMethod = getStore().getState().CheckoutReducer?.shipping_method_code;
    const orderPaymentMethod = getStore().getState().CheckoutReducer?.payment_method_code;
    const revenue = getStore().getState().CartReducer?.cartTotals?.grand_total;
    const tax = getStore().getState().CartReducer?.cartTotals?.tax_amount;
    const shipping = getStore().getState().CartReducer?.cartTotals?.shipping_amount;
    const coupon = getStore().getState().CartReducer?.cartTotals?.coupon_code;
    const discount_amount = getStore().getState().CartReducer?.cartTotals?.discount_amount;
    const items = getStore().getState().CartReducer?.cartTotals?.items;
    const shipping_address = getStore().getState().CheckoutReducer?.shippingFields;

    return {
        orderPaymentMethod,
        orderShippingMethod,
        ...await getPaymonixPurchaseShippingData(shipping_address),
        discount_amount,
        ...await getPaymonixPurchaseCustomerData(),
        ecommerce: {
            currencyCode,
            purchase: {
                actionField: {
                    id: orderId,
                    revenue: +roundPrice(revenue),
                    tax: +roundPrice(tax),
                    coupon: coupon === null ? '' : coupon,
                    shipping: +roundPrice(shipping)
                },
                products: await getPurchasePaymonixProductsData(items)
            }
        }
    };
};
