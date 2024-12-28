/* eslint-disable no-param-reassign */
import { getInitialState as sourceGetInitialState } from 'SourceStore/Checkout/Checkout.reducer';

import {
    LAST_ADDRESS_UPDATED,
    SET_CREDIT_CARD_DETAILS,
    SET_FOOMAN_CHARGES,
    SET_PAYMENT_METHOD,
    SET_SHIPPING_METHOD,
    SET_SHIPPING_METHODS,
    UPDATE_BILLING_FIELDS,
    UPDATE_EDITING_STEP,
    UPDATE_EMAIL,
    UPDATE_EMAIL_AVAILABLE,
    UPDATE_SHIPPING_FIELDS,
    UPDATE_TOTALS_LOAD_STATUS
} from './Checkout.action';

/** @namespace Seedsman/Store/Checkout/Reducer/getInitialState */
export const getInitialState = () => ({
    ...sourceGetInitialState(),
    shipping_method_code: null,
    payment_method_code: null,
    all_shipping_methods: [],
    address: {
        isLastUpdated: false,
        address_id: 0
    },
    editingStep: 'SHIPPING_ADDRESS',
    creditCardDetails: {},
    foomanCharges: null,
    isLoading: false
});

/** @namespace Seedsman/Store/Checkout/Reducer/setCardDetails */
export const setCardDetails = (key, value, creditCardDetails) => {
    creditCardDetails[key] = value;

    return creditCardDetails;
};

/** @namespace Seedsman/Store/Checkout/Reducer/CheckoutReducer */
export const CheckoutReducer = (state = getInitialState(), action) => {
    switch (action.type) {
    case UPDATE_SHIPPING_FIELDS:
        const { shippingFields } = action;

        return {
            ...state,
            shippingFields
        };
    case UPDATE_BILLING_FIELDS:
        const { billingFields } = action;

        return {
            ...state,
            billingFields
        };
    case LAST_ADDRESS_UPDATED:
        const { address } = action;
        if (address) {
            return {
                ...state,
                address
            };
        }

        return {
            ...state,
            isLoading: true
        };

    case UPDATE_EDITING_STEP:
        const { editingStep } = action;

        return {
            ...state,
            editingStep
        };

    case UPDATE_TOTALS_LOAD_STATUS:
        const { isLoading } = action;

        return {
            ...state,
            isLoading
        };

    case UPDATE_EMAIL:
        const { email } = action;

        return {
            ...state,
            email
        };

    case SET_SHIPPING_METHOD:
        const { payload } = action;

        return {
            ...state,
            shipping_method_code: payload
        };

    case SET_PAYMENT_METHOD: {
        const { payload } = action;

        return {
            ...state,
            payment_method_code: payload
        };
    }

    case UPDATE_EMAIL_AVAILABLE:
        const { isEmailAvailable } = action;

        return {
            ...state,
            isEmailAvailable
        };

    case SET_SHIPPING_METHODS:
        const { methods } = action;

        return {
            ...state,
            all_shipping_methods: methods
        };

    case SET_CREDIT_CARD_DETAILS:
        const { key, value } = action;
        const { creditCardDetails } = state;

        return {
            ...state,
            creditCardDetails: setCardDetails(key, value, creditCardDetails)
        };

    case SET_FOOMAN_CHARGES:
        const { foomanCharge } = action;

        return {
            ...state,
            foomanCharges: foomanCharge
        };

    default:
        return state;
    }
};

export default CheckoutReducer;
