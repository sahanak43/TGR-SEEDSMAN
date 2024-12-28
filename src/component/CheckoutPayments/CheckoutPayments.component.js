/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
import CheckoutAddressBook from 'Component/CheckoutAddressBook';
import CheckoutPayment from 'Component/CheckoutPayment';
import Field from 'Component/Field';
import FIELD_TYPE from 'Component/Field/Field.config';
import { STORE_IN_PICK_UP_METHOD_CODE } from 'Component/StoreInPickUp/StoreInPickUp.config';
import { PAYMENT_METHOD } from 'Route/Checkout/Checkout.config';
import {
    CheckoutPayments as SourceCheckoutPayments
} from 'SourceComponent/CheckoutPayments/CheckoutPayments.component';
import { CUSTOMER } from 'SourceStore/MyAccount/MyAccount.dispatcher';
import BrowserDatabase from 'Util/BrowserDatabase';
import { formatPrice } from 'Util/Price';

import './CheckoutPayments.override.style';

/** @namespace Seedsman/Component/CheckoutPayments/Component */
export class CheckoutPaymentsComponent extends SourceCheckoutPayments {
    renderHeading() {
        return (
            <div block="Checkout-Default">
                <h2 block="Checkout" elem="Heading">
                    3. Payment & Billing
                </h2>
            </div>
        );
    }

    renderAddressBook() {
        const {
            onAddressSelect,
            isSameAsShipping,
            is_virtual,
            saveAddressInformation,
            saveBillingAddress
        } = this.props;

        if (isSameAsShipping && !is_virtual) {
            return null;
        }

        return (
            <CheckoutAddressBook
              saveBillingAddress={ saveBillingAddress }
              saveAddressInformation={ saveAddressInformation }
              onAddressSelect={ onAddressSelect }
              isBilling
              is_virtual
            />
        );
    }

    renderSameAsShippingCheckbox() {
        const {
            isSameAsShipping,
            onSameAsShippingChange,
            is_virtual,
            selectedShippingMethod
        } = this.props;

        if (is_virtual) {
            return null;
        }

        return (
            <Field
              type={ FIELD_TYPE.checkbox }
              attr={ {
                  id: 'sameAsShippingAddress',
                  name: 'sameAsShippingAddress',
                  value: 'sameAsShippingAddress',
                  checked: isSameAsShipping && selectedShippingMethod !== STORE_IN_PICK_UP_METHOD_CODE
              } }
              events={ {
                  onChange: onSameAsShippingChange
              } }
              mix={ { block: 'CheckoutBilling', elem: 'Checkbox' } }
              label="Billing & Shipping are the same address"
              onChange={ onSameAsShippingChange }
            />
        );
    }

    renderStoreCredit() {
        const customer = BrowserDatabase.getItem(CUSTOMER);
        const { useStoreCredit, handleApplyStoreCredit, step } = this.props;

        if (!customer || !customer.store_credit || step !== PAYMENT_METHOD) {
            return null;
        }

        if (customer.store_credit.current_balance?.value <= 0) {
            return null;
        }

        const creditValue = formatPrice(customer.store_credit.current_balance?.value,
            customer.store_credit.current_balance?.currency);

        return (
            <div block="Checkout" elem="StoreCredit">
                <div block="Checkout" elem="StoreCreditLabel">
                    Apply Store Credit
                </div>
                <div block="Checkout" elem="StoreCreditData">
                    You have
                    { ' ' }
                    { creditValue }
                    { ' ' }
                    as your Store Credit Balance
                </div>
                <div block="Checkout" elem="StoreCreditInput">
                <Field
                  type={ FIELD_TYPE.checkbox }
                  attr={ {
                      name: 'storeCredit',
                      checked: useStoreCredit
                  } }
                  label="Use Store Credit Balance"
                  events={ { onChange: handleApplyStoreCredit } }
                  mods={ { type: 'Checkbox' } }
                />
                </div>
            </div>
        );
    }

    renderMainContent() {
        const { paymentMethods } = this.props;

        if (!paymentMethods.length) {
            return (
                <span block="Checkout" elem="NoPaymentMethod">
                    No Payment method available
                </span>
            );
        }

        return (
            <>
                { /* { this.renderSameAsShippingCheckbox() } */ }
                { /* { this.renderAddressBook() } */ }
                { this.renderStoreCredit() }
                <ul block="CheckoutPayments" elem="Methods">
                    { this.renderPayments() }
                </ul>
            </>
        );
    }

    renderContent() {
        const { hasError } = this.state;
        const { step } = this.props;

        if (hasError) {
            return (
                <p>{ __('The error occurred during initializing payment methods. Please try again later!') }</p>
            );
        }

        return (
            <>
                { this.renderHeading() }
                { step === PAYMENT_METHOD ? (
                    <>
                        { this.renderMainContent() }
                    </>
                ) : null }
                { this.renderSelectedPayment() }
            </>
        );
    }

    renderPayment(method) {
        const {
            selectPaymentMethod,
            isValidCardDetails,
            totals,
            isOrderButtonVisible,
            isOrderButtonEnabled,
            isTermsAndConditionsAccepted,
            termsAreEnabled,
            paymentMethods,
            onBillingSuccess,
            isCheckedTerms,
            onClickCheckedBox,
            selectedPaymentMethodCode
        } = this.props;

        const { code } = method;
        const isSelected = selectedPaymentMethodCode === code;

        return (
            <CheckoutPayment
              key={ code }
              isSelected={ isSelected }
              method={ method }
              onClick={ selectPaymentMethod }
              isValidCardDetails={ isValidCardDetails }
              totals={ totals }
              isOrderButtonVisible={ isOrderButtonVisible }
              isOrderButtonEnabled={ isOrderButtonEnabled }
              isTermsAndConditionsAccepted={ isTermsAndConditionsAccepted }
              termsAreEnabled={ termsAreEnabled }
              paymentMethods={ paymentMethods }
              onBillingSuccess={ onBillingSuccess }
              isCheckedTerms={ isCheckedTerms }
              onClickCheckedBox={ onClickCheckedBox }
            />
        );
    }
}

export default CheckoutPaymentsComponent;
