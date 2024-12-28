import CheckoutAchForm from 'Component/CheckoutAchForm';
import CheckoutCreditCardForm from 'Component/CheckoutCreditCardForm';

export const PAYTRIOT_PAYMENT_CODE = 'paytriot_gateway';
export const NMI_PAYMENT_CODE = 'rootways_nmi_option';
export const ACH_PAYMENT_CODE = 'accept_blue_ach';
/**
 *
 * @param {*} args argument of this plugin method
 * @param {*} callback original method
 * @param {*} instance [Optional] - Use this to access the props ex: instance.props
 * @returns
 */
const newRender = (args, callback) => {
    const { method: { code } = {}, isSelected, isValidCardDetails } = args[0] || [];
    switch (code) {
    case PAYTRIOT_PAYMENT_CODE:
        if (isSelected) {
            return (
                <CheckoutCreditCardForm
                  isValidCardDetails={ isValidCardDetails }
                  code={ code }
                />
            );
        }
        break;

    case NMI_PAYMENT_CODE:
        if (isSelected) {
            return (
                <CheckoutCreditCardForm
                  isValidCardDetails={ isValidCardDetails }
                  code={ code }
                />
            );
        }
        break;
    case ACH_PAYMENT_CODE:
        if (isSelected) {
            return (
                <CheckoutAchForm />
            );
        }
        break;

    default:
        break;
    }

    return (
        <>
            { callback(...args) }
        </>
    );
};

export default {
    'Component/CheckoutPayment/Component': {
        'member-function': {
            renderPaymentField: newRender
        }
    }
};
