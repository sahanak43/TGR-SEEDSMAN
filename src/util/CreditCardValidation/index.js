/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable fp/no-let */
/* eslint-disable no-magic-numbers */
import Payment from 'payment';

import { NMI_PAYMENT_CODE } from 'Component/CheckoutBilling/CheckoutBilling.container';

import { checkCardType } from './cardTypes';

export const NMI_PAYMENT_AVAILABLE_CARD = ['amex', 'visa', 'mastercard'];

/** @namespace Seedsman/Util/CreditCardValidation/Index/clearNumber */
export function clearNumber(value = '') {
    return value.replace(/[^0-9]/gi, '');
}

/** @namespace Seedsman/Util/CreditCardValidation/Index/formatCreditCardNumber */
export function formatCreditCardNumber(value, code) {
    if (!value) {
        return value;
    }

    const issuer = Payment.fns.cardType(value);
    const clearValue = clearNumber(value);
    let nextValue;
    let maxCardlength;

    switch (issuer) {
    case 'amex':
        nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 10)} ${clearValue.slice(10, 15)}`;
        maxCardlength = 15;
        break;
    case 'dinersclub':
        nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 10)} ${clearValue.slice(10, 14)}`;
        maxCardlength = 14;
        break;
    case 'visa':
        nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 10)} ${clearValue.slice(10, 16)}`;
        maxCardlength = 16;
        break;
    case 'mastercard':
        nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 10)} ${clearValue.slice(10, 16)}`;
        maxCardlength = 16;
        break;
    default:
        nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 8)} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 19)}`;
        break;
    }

    const cardType = checkCardType(issuer);
    const maxLength = issuer === 'amex' ? 4 : 3;

    switch (code) {
    case NMI_PAYMENT_CODE:
        return {
            number: nextValue.trim(),
            cardType,
            isCardAvailable: NMI_PAYMENT_AVAILABLE_CARD.includes(issuer) && value.split(' ').join('').length === maxCardlength,
            maxLength
        };

    default:
        return {
            number: nextValue.trim(),
            cardType,
            isCardAvailable: value.split(' ').join('').length === maxCardlength,
            maxLength
        };
    }
}

/** @namespace Seedsman/Util/CreditCardValidation/Index/formatCVC */
export function formatCVC(value) {
    const clearValue = clearNumber(value);
    return clearValue;
}

/** @namespace Seedsman/Util/CreditCardValidation/Index/isMonthValid */
export const isMonthValid = (value) => {
    const currentMonth = new Date().getMonth() + 1;
    return (value >= 1 && value <= 12) && (value === currentMonth || value > currentMonth);
};

/** @namespace Seedsman/Util/CreditCardValidation/Index/isYearValid */
export const isYearValid = (value) => {
    const getYear = parseInt(`20${value.slice(2, 4)}`, 10);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const lastMonth = 12;

    if (getYear > currentYear) {
        return (parseInt(value.slice(0, 2), 10) >= 1) && (parseInt(value.slice(0, 2), 10) <= lastMonth);
    } if (getYear === currentYear) {
        return (parseInt(value.slice(0, 2), 10) >= currentMonth) && (parseInt(value.slice(0, 2), 10) <= lastMonth);
    }

    return (getYear >= currentYear) && (getYear < currentYear);
};

/** @namespace Seedsman/Util/CreditCardValidation/Index/formatExpirationDate */
export function formatExpirationDate(value) {
    const clearValue = clearNumber(value);

    if (clearValue.length >= 3) {
        return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`;
    }

    return clearValue;
}

/** @namespace Seedsman/Util/CreditCardValidation/Index/getValidation */
// eslint-disable-next-line consistent-return
export function getValidation(value) {
    const clearValue = clearNumber(value);
    switch (clearValue.length) {
    case 2:
        return isMonthValid(parseInt(clearValue, 10));
    case 4:
        return isYearValid(clearValue);
    default:
        break;
    }
}

/** @namespace Seedsman/Util/CreditCardValidation/Index/formatFormData */
export function formatFormData(data) {
    return Object.keys(data).map((d) => `${d}: ${data[d]}`);
}
