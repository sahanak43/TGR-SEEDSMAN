import {
    UPDATE_EMAIL as SOURCE_UPDATE_EMAIL,
    UPDATE_EMAIL_AVAILABLE as SOURCE_UPDATE_EMAIL_AVAILABLE,
    updateEmail as sourceUpdateEmail,
    updateEmailAvailable as sourceUpdateEmailAvailable
} from 'SourceStore/Checkout/Checkout.action';

// TODO: implement UPDATE_EMAIL
export const UPDATE_EMAIL = SOURCE_UPDATE_EMAIL;

// TODO: implement UPDATE_EMAIL_AVAILABLE
export const UPDATE_EMAIL_AVAILABLE = SOURCE_UPDATE_EMAIL_AVAILABLE;

// TODO: implement updateShippingFields

// TODO: implement updateEmail
export const updateEmail = sourceUpdateEmail;

// TODO: implement updateEmailAvailable
export const updateEmailAvailable = sourceUpdateEmailAvailable;

export const SET_SHIPPING_METHOD = 'SET_SHIPPING_METHOD';
export const SET_SHIPPING_METHODS = 'SET_SHIPPING_METHODS';
export const UPDATE_SHIPPING_FIELDS = 'UPDATE_SHIPPING_FIELDS';
export const LAST_ADDRESS_UPDATED = 'LAST_ADDRESS_UPDATED';
export const UPDATE_TOTALS_LOAD_STATUS = 'UPDATE_TOTALS_LOAD_STATUS';
export const SET_CREDIT_CARD_DETAILS = 'SET_CREDIT_CARD_DETAILS';
export const UPDATE_EDITING_STEP = 'UPDATE_EDITING_STEP';
export const UPDATE_BILLING_FIELDS = 'UPDATE_BILLING_FIELDS';
export const SET_PAYMENT_METHOD = 'SET_PAYMENT_METHOD';
export const SET_FOOMAN_CHARGES = 'SET_FOOMAN_CHARGES';

/** @namespace Seedsman/Store/Checkout/Action/updateShippingFields */
export const updateShippingFields = (shippingFields) => ({
    type: UPDATE_SHIPPING_FIELDS,
    shippingFields
});

/** @namespace Seedsman/Store/Checkout/Action/setShippingMethod */
export const setShippingMethod = (code) => ({
    type: SET_SHIPPING_METHOD,
    payload: code
});
/** @namespace Seedsman/Store/Checkout/Action/setPaymentMethod */
export const setPaymentMethod = (code) => ({
    type: SET_PAYMENT_METHOD,
    payload: code
});

/** @namespace Seedsman/Store/Checkout/Action/setAvailableShippingMethods */
export const setAvailableShippingMethods = (methods) => ({
    type: SET_SHIPPING_METHODS,
    methods
});

/** @namespace Seedsman/Store/Checkout/Action/addLastAddressUpdated */
export const addLastAddressUpdated = (address) => ({
    type: LAST_ADDRESS_UPDATED,
    address
});

/** @namespace Seedsman/Store/Checkout/Action/setCreditCardDetails */
export const setCreditCardDetails = (key, value) => ({
    type: SET_CREDIT_CARD_DETAILS,
    key,
    value
});

/**
 * Update loading status
 * @param {Boolean} status Loading indication boolean
 * @return {void}
 * @namespace Seedsman/Store/Checkout/Action/updateLoadStatus */
export const updateLoadStatus = (status) => ({
    type: UPDATE_TOTALS_LOAD_STATUS,
    isLoading: status
});

/** @namespace Seedsman/Store/Checkout/Action/updateEditingStep */
export const updateEditingStep = (step) => ({
    type: UPDATE_EDITING_STEP,
    editingStep: step
});

/** @namespace Seedsman/Store/Checkout/Action/updateBillingFields */
export const updateBillingFields = (billingFields) => ({
    type: UPDATE_BILLING_FIELDS,
    billingFields
});

/** @namespace Seedsman/Store/Checkout/Action/updateFoomanCharges */
export const updateFoomanCharges = (foomanCharge) => ({
    type: SET_FOOMAN_CHARGES,
    foomanCharge
});
