/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines */
/* eslint-disable fp/no-let */
/* eslint-disable consistent-return */
/* eslint-disable @scandipwa/scandipwa-guidelines/create-config-files */
import Payment from 'payment';
import { connect } from 'react-redux';

import { KLARNA, PURCHASE_ORDER } from 'Component/CheckoutPayments/CheckoutPayments.config';
import { STORE_IN_PICK_UP_METHOD_CODE } from 'Component/StoreInPickUp/StoreInPickUp.config';
import {
    CheckoutBillingContainer as SourceCheckoutBillingContainer,
    mapDispatchToProps, mapStateToProps as sourcemapStateToProps
} from 'SourceComponent/CheckoutBilling/CheckoutBilling.container';
import {
    trimCheckoutCustomerAddress
} from 'Util/Address';
import {
    formatCreditCardNumber
} from 'Util/CreditCardValidation';
import transformToNameValuePair from 'Util/Form/Transform';

export const PAYTRIOT_PAYMENT_CODE = 'paytriot_gateway';
export const NMI_PAYMENT_CODE = 'rootways_nmi_option';
export const ACH_PAYMENT_CODE = 'accept_blue_ach';

/** @namespace Seedsman/Component/CheckoutBilling/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    ...sourcemapStateToProps(state),
    step: state.CheckoutReducer.editingStep,
    usedLoyalityPoint: state.CheckoutReducer.used_loyality_points
});

/** @namespace Seedsman/Component/CheckoutBilling/Container */
export class CheckoutBillingContainer extends SourceCheckoutBillingContainer {
    __construct(props) {
        super.__construct(props);

        const { paymentMethods, customer } = props;
        const [method] = paymentMethods;
        const { code: paymentMethod } = method || {};

        this.state = {
            isSameAsShipping: this.isSameShippingAddress(customer),
            selectedCustomerAddressId: 0,
            prevPaymentMethods: paymentMethods,
            paymentMethod,
            isValidCardDetails: true
        };
    }

    containerProps() {
        const {
            cartTotalSubPrice,
            paymentMethods,
            selectedShippingMethod,
            setDetailsStep,
            setLoading,
            shippingAddress,
            termsAndConditions,
            termsAreEnabled,
            totals,
            saveAddressInformation,
            handleApplyStoreCredit,
            useStoreCredit,
            step,
            saveBillingAddress,
            selectedPaymentMethodCode
        } = this.props;
        const { isSameAsShipping, isValidCardDetails } = this.state;

        return {
            cartTotalSubPrice,
            paymentMethods,
            isSameAsShipping,
            selectedShippingMethod,
            setDetailsStep,
            setLoading,
            shippingAddress,
            termsAndConditions,
            termsAreEnabled,
            totals,
            saveAddressInformation,
            handleApplyStoreCredit,
            useStoreCredit,
            isValidCardDetails,
            step,
            saveBillingAddress,
            selectedPaymentMethodCode
        };
    }

    isSameShippingAddress({ default_billing, default_shipping }) {
        const {
            totals: { is_virtual },
            selectedShippingMethod,
            newShippingId,
            newShippingStreet
        } = this.props;

        if (is_virtual) {
            return false;
        }

        return (
            (!newShippingId && !newShippingStreet?.length && default_billing === default_shipping)
            || (default_billing && parseInt(default_billing, 10) === newShippingId)
            || (!default_billing)
        )
        && selectedShippingMethod !== STORE_IN_PICK_UP_METHOD_CODE;
    }

    _getAddress() {
        const {
            isSameAsShipping,
            selectedCustomerAddressId
        } = this.state;
        const { customer } = this.props;

        if (isSameAsShipping) {
            return this.getBillingSameAsShipping();
        }

        if (!selectedCustomerAddressId) {
            const defaultKey = 'default_billing';
            const { [defaultKey]: defaultAddressId, addresses } = customer;

            if (parseInt(defaultAddressId, 10)) {
                const address = addresses.find(({ id }) => id === parseInt(defaultAddressId, 10));

                return {
                    ...trimCheckoutCustomerAddress(address),
                    save_in_address_book: false
                };
            }
        }

        const { customer: { addresses } } = this.props;
        const address = addresses.find(({ id }) => id === selectedCustomerAddressId);

        return {
            ...trimCheckoutCustomerAddress(address),
            save_in_address_book: false
        };
    }

    _getPaymentData(fields, asyncData) {
        const { paymentMethod: code } = this.state;

        switch (code) {
        case KLARNA:
            const [{ authorization_token }] = asyncData;

            return {
                code,
                additional_data: {
                    authorization_token
                }
            };

        case PURCHASE_ORDER:
            const { purchaseOrderNumber } = fields;

            return {
                code,
                purchase_order_number: purchaseOrderNumber
            };

        case NMI_PAYMENT_CODE: {
            const {
                creditCardNumber, expireDate, cvc
            } = fields;

            const splitExpireDate = expireDate.split('/');
            const joinCardNumber = creditCardNumber.split(' ').join('');
            let cardTypeCode;

            switch (Payment.fns.cardType(creditCardNumber)) {
            case 'visa':
                cardTypeCode = 'VI';
                break;
            case 'mastercard':
                cardTypeCode = 'MC';
                break;
            case 'amex':
                cardTypeCode = 'AE';
                break;

            default:
                break;
            }

            return {
                code,
                additional_data: {
                    cc_number: joinCardNumber,
                    cc_exp_month: splitExpireDate[0],
                    cc_exp_year: `20${splitExpireDate[1]}`,
                    cc_cid: cvc,
                    cc_type: cardTypeCode
                }
            };
        }

        case PAYTRIOT_PAYMENT_CODE: {
            const {
                creditCardNumber, expireDate, cvc
            } = fields;

            const splitExpireDate = expireDate.split('/');
            const joinCardNumber = creditCardNumber.split(' ').join('');
            // let cardTypeCode;

            // switch (Payment.fns.cardType(creditCardNumber)) {
            // case 'visa':
            //     cardTypeCode = 'VI';
            //     break;
            // case 'mastercard':
            //     cardTypeCode = 'MC';
            //     break;
            // case 'amex':
            //     cardTypeCode = 'AE';
            //     break;

            // default:
            //     break;
            // }

            return {
                code,
                additional_data: {
                    cc_number: joinCardNumber,
                    cc_exp_month: splitExpireDate[0],
                    cc_exp_year: `20${splitExpireDate[1]}`,
                    cc_cid: cvc
                    // cc_type: Payment.fns.cardType(creditCardNumber)
                }
            };
        }

        case ACH_PAYMENT_CODE: {
            const {
                Routing_Number,
                Account_Number
            } = fields;

            return {
                code,
                additional_data: {
                    routing_number: Routing_Number,
                    account_number: Account_Number
                }
            };
        }

        default:
            return { code };
        }
    }

    _getValidCardDetails(fields) {
        const {
            creditCardNumber, expireDate, cvc
        } = fields;

        if (!creditCardNumber || !expireDate || !cvc) {
            this.setState({
                isValidCardDetails: false
            });

            return false;
        }

        this.setState({
            isValidCardDetails: true
        });

        return true;
    }

    onPaymentMethodSelect(code) {
        const { setPaymentMethod } = this.props;

        this.setState({ paymentMethod: code });
        setPaymentMethod(code);
    }

    onBillingSuccess(form, fields, asyncData) {
        const { savePaymentInformation, showErrorNotification } = this.props;
        const { isSameAsShipping } = this.state;
        const extractedFields = transformToNameValuePair(fields);
        const address = this._getAddress(extractedFields);
        const paymentMethod = this._getPaymentData(extractedFields, asyncData);
        const isCreditCardDetailsValid = this._getValidCardDetails(extractedFields);

        const { code } = paymentMethod;
        const { creditCardNumber, cvc } = extractedFields;

        if (creditCardNumber && !formatCreditCardNumber(creditCardNumber, code)?.isCardAvailable) {
            return showErrorNotification('Invalid Card Number!');
        }

        if (cvc && cvc.length < 3) {
            return showErrorNotification('Invalid Cvc Number!');
        }

        if ((code === PAYTRIOT_PAYMENT_CODE || code === NMI_PAYMENT_CODE)) {
            if (isCreditCardDetailsValid) {
                savePaymentInformation({
                    billing_address: address,
                    paymentMethod,
                    same_as_shipping: isSameAsShipping
                });
            }
        } else {
            savePaymentInformation({
                billing_address: address,
                paymentMethod,
                same_as_shipping: isSameAsShipping
            });
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutBillingContainer);
