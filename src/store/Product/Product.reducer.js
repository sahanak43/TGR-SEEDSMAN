import {
    formatConfigurableOptions as sourceFormatConfigurableOptions,
    getInitialState as sourceGetInitialState
} from 'SourceStore/Product/Product.reducer';
import { getIndexedProduct } from 'Util/Product';

import { SET_CONFIG_PARAMETERS, UPDATE_PRODUCT_DETAILS } from './Product.action';

/** @namespace Seedsman/Store/Product/Reducer/getInitialState */
export const getInitialState = () => ({
    ...sourceGetInitialState(),
    parameters: {}
});

export const formatConfigurableOptions = sourceFormatConfigurableOptions;

/** @namespace Seedsman/Store/Product/Reducer/ProductReducer */
export const ProductReducer = (
    state = getInitialState(),
    action
) => {
    switch (action.type) {
    case UPDATE_PRODUCT_DETAILS:
        const { product } = action;

        return {
            ...state,
            product: getIndexedProduct(product)
        };
    case SET_CONFIG_PARAMETERS:
        const { parameters } = action;
        return {
            ...state,
            parameters
        };
    default:
        return state;
    }
};

export default ProductReducer;
