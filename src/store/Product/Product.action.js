import {
    UPDATE_PRODUCT_DETAILS as SOURCE_UPDATE_PRODUCT_DETAILS,
    updateProductDetails as sourceUpdateProductDetails
} from 'SourceStore/Product/Product.action';

// TODO: implement UPDATE_PRODUCT_DETAILS
export const UPDATE_PRODUCT_DETAILS = SOURCE_UPDATE_PRODUCT_DETAILS;

export const SET_CONFIG_PARAMETERS = 'SET_CONFIG_PARAMETERS';

export const updateProductDetails = sourceUpdateProductDetails;

/** @namespace Seedsman/Store/Product/Action/setConfigParameters */
export const setConfigParameters = (parameters) => ({
    type: SET_CONFIG_PARAMETERS,
    parameters
});
