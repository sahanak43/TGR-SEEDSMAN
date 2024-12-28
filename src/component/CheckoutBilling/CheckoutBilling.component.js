/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
import CheckoutAddressBook from 'Component/CheckoutAddressBook';
import CheckoutPayments from 'Component/CheckoutPayments';
import Form from 'Component/Form';
import { BILLING_STEP } from 'Route/Checkout/Checkout.config';
import {
    CheckoutBilling as SourceCheckoutBilling
} from 'SourceComponent/CheckoutBilling/CheckoutBilling.component';

import './CheckoutBilling.override.style';

/** @namespace Seedsman/Component/CheckoutBilling/Component */
export class CheckoutBillingComponent extends SourceCheckoutBilling {
    renderPayments() {
        const {
            paymentMethods,
            onPaymentMethodSelect,
            setLoading,
            setDetailsStep,
            shippingAddress,
            isValidCardDetails,
            termsAreEnabled,
            onBillingSuccess,
            isSameAsShipping,
            onSameAsShippingChange,
            totals: { is_virtual },
            selectedShippingMethod,
            onAddressSelect,
            saveAddressInformation,
            handleApplyStoreCredit,
            useStoreCredit,
            saveBillingAddress,
            selectedPaymentMethodCode
        } = this.props;

        const {
            isOrderButtonVisible,
            isOrderButtonEnabled,
            isTermsAndConditionsAccepted
        } = this.state;

        return (
            <CheckoutPayments
              setLoading={ setLoading }
              setDetailsStep={ setDetailsStep }
              paymentMethods={ paymentMethods }
              onPaymentMethodSelect={ onPaymentMethodSelect }
              setOrderButtonVisibility={ this.setOrderButtonVisibility }
              billingAddress={ shippingAddress }
              setOrderButtonEnableStatus={ this.setOrderButtonEnableStatus }
              isValidCardDetails={ isValidCardDetails }
              isOrderButtonVisible={ isOrderButtonVisible }
              isOrderButtonEnabled={ isOrderButtonEnabled }
              isTermsAndConditionsAccepted={ isTermsAndConditionsAccepted }
              termsAreEnabled={ termsAreEnabled }
              onBillingSuccess={ onBillingSuccess }
              isSameAsShipping={ isSameAsShipping }
              onSameAsShippingChange={ onSameAsShippingChange }
              selectedShippingMethod={ selectedShippingMethod }
              is_virtual={ is_virtual }
              onAddressSelect={ onAddressSelect }
              saveAddressInformation={ saveAddressInformation }
              handleApplyStoreCredit={ handleApplyStoreCredit }
              useStoreCredit={ useStoreCredit }
              saveBillingAddress={ saveBillingAddress }
              selectedPaymentMethodCode={ selectedPaymentMethodCode }
            />
        );
    }

    renderActions() {
        const {
            isOrderButtonVisible,
            isOrderButtonEnabled,
            isTermsAndConditionsAccepted
        } = this.state;

        const { termsAreEnabled, paymentMethods } = this.props;

        if (!isOrderButtonVisible) {
            return null;
        }

        // if terms and conditions are enabled, validate for acceptance
        const isDisabled = termsAreEnabled
            ? !isOrderButtonEnabled || !isTermsAndConditionsAccepted
            : !isOrderButtonEnabled;

        return (
            <div block="Checkout" elem="StickyButtonWrapper">
                { this.renderOrderTotal() }
                { paymentMethods.length ? (
                    <button
                      type="submit"
                      block="Button"
                      disabled={ isDisabled }
                      mix={ { block: 'CheckoutBilling', elem: 'Button' } }
                    >
                    Pay Now
                    </button>
                ) : null }
            </div>
        );
    }

    renderAddresses() {
        return (
            <>
                { this.renderHeading() }
                { this.renderSameAsShippingCheckbox() }
            </>
        );
    }

    renderAddressBook() {
        const {
            onAddressSelect,
            isSameAsShipping,
            saveAddressInformation,
            saveBillingAddress,
            totals: { is_virtual }
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

    render() {
        const { onBillingSuccess } = this.props;

        return (
            <Form
              attr={ {
                  id: BILLING_STEP
              } }
              mix={ { block: 'CheckoutBilling' } }
              onSubmit={ onBillingSuccess }
            >
                { this.renderPayments() }
                { this.renderTermsAndConditions() }
                { this.renderPopup() }
            </Form>
        );
    }
}

export default CheckoutBillingComponent;
