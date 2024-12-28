/**
 * Amasty Extra Fee compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import { formatPrice, roundPrice } from 'Util/Price';
import { fetchQuery } from 'Util/Request';
import getStore from 'Util/Store';

import ExtraFeeQuery from '../query/ExtraFee.query';

export const CartDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Cart/Cart.dispatcher'
);

/** @namespace Seedsman/@Scandiweb/AmastyExtraFee/Util/AmastyExtraFees/getQuoteFees */
export const getQuoteFees = async (cartId) => {
    const { getFeeItemsForQuote } = await fetchQuery(ExtraFeeQuery.getFeeItemsForQuote({ cartId }));

    // vvv this get's items Array<{ entity_id: string, name... }>
    const indexedFeeItems = getFeeItemsForQuote.reduce((acc, feeItem) => {
        const { entity_id } = feeItem;
        return { ...acc, [entity_id]: feeItem };
    }, {});

    await Promise.all(getFeeItemsForQuote.map(async (fee) => {
        const { entity_id } = fee;

        // vvv these are options of specific item Array<{ entity_id: String, name... }>
        const { s_getFeeOptions: { items } } = await fetchQuery(
            ExtraFeeQuery.s_getFeeOptions({ feeId: entity_id })
        );

        indexedFeeItems[entity_id].options = items.reduce((acc, option) => {
            const { entity_id } = option;
            return { ...acc, [entity_id]: option };
        }, {});
    }));

    return indexedFeeItems;
};

/** @namespace Seedsman/@Scandiweb/AmastyExtraFee/Util/AmastyExtraFees/updateCart */
export const updateCart = () => {
    CartDispatcher.then(
        ({ default: dispatcher }) => dispatcher.updateInitialCartData(
            getStore().dispatch
        )
    );
};

/** @namespace Seedsman/@Scandiweb/AmastyExtraFee/Util/AmastyExtraFees/getPriceFromType */
export const getPriceFromType = (price, price_type, currencyCode) => {
    // const currencyCode = getStore().getState().CartReducer.cartTotals.quote_currency_code;
    const { subtotal } = getStore().getState().CartReducer.cartTotals;

    const formattedPrice = formatPrice(roundPrice(price), currencyCode);
    const HUNDRED = 100;
    const priceInPercents = roundPrice(price * subtotal) / HUNDRED;
    const percentPrice = formatPrice(priceInPercents, currencyCode);
    const priceFromType = price_type === 'fixed' ? formattedPrice : percentPrice;
    return priceFromType;
};
