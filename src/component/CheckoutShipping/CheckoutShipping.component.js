/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
import CheckoutAddressBook from 'Component/CheckoutAddressBook';
import CheckoutDeliveryOptions from 'Component/CheckoutDeliveryOptions';
import TextPlaceholder from 'Component/TextPlaceholder';
import { DELIVERY_METHOD, SHIPPING_ADDRESS } from 'Route/Checkout/Checkout.config';
import {
    CheckoutShipping as SourceCheckoutShipping
} from 'SourceComponent/CheckoutShipping/CheckoutShipping.component';

import './CheckoutShipping.override.style';

/** @namespace Seedsman/Component/CheckoutShipping/Component */
export class CheckoutShippingComponent extends SourceCheckoutShipping {
    // eslint-disable-next-line @scandipwa/scandipwa-guidelines/only-render-in-component
    isDisabled() {
        const {
            selectedShippingMethod = {}, shippingMethods = [],
            customer: { addresses = [] } = {}, showError, step
        } = this.props;

        if (shippingMethods.length === 1 && !shippingMethods[0].available) {
            return true;
        }

        if (!selectedShippingMethod || !shippingMethods.length
            || !addresses.length || showError || step !== DELIVERY_METHOD) {
            return true;
        }

        return false;
    }

    renderActions() {
        const { step } = this.props;

        if (step !== DELIVERY_METHOD) {
            return null;
        }

        return (
            <div block="Checkout" elem="StickyButtonWrapper">
                <button
                  type="submit"
                  block="Button"
                  disabled={ this.isDisabled() }
                  mix={ { block: 'CheckoutShipping', elem: 'Button' } }
                >
                    Continue
                </button>
            </div>
        );
    }

    renderCustomerDetails() {
        const {
            customer: { firstname: name } = {},
            rewards_points
        } = this.props;

        if (!rewards_points) {
            return null;
        }

        return (
            <div block="CheckoutShipping" elem="customerDetails">
                <div className="NameBlock">
                    <p>{ name ? `Hello ${name}` : <TextPlaceholder length="small" /> }</p>
                    <p>Welcome Back</p>
                </div>
                <div className="LoyaltyPoints">
                    <p>Loyalty Points</p>
                    <p>{ rewards_points.rewards.balance }</p>
                </div>
            </div>
        );
    }

    renderContinueBtn() {
        const {
            handleAddressSubmit, showError, customer: { addresses = [] } = {},
            step
        } = this.props;

        if (step !== SHIPPING_ADDRESS) {
            return null;
        }

        return (
            <button
              block="Button"
              mix={ { block: 'CheckoutShipping', elem: 'ContinueButton' } }
              type="button"
              onClick={ handleAddressSubmit }
              disabled={ showError || !addresses.length > 0 }
            >
                Continue
            </button>
        );
    }

    renderAddressBook() {
        const {
            onAddressSelect,
            onShippingEstimationFieldsChange,
            isSubmitted,
            saveAddressInformation,
            showError,
            showCountrySelectionPopup,
            showCountrySelection,
            isSameAsShipping,
            onSameAsShippingChange,
            totals: { is_virtual },
            selectedShippingMethod,
            saveBillingAddress,
            step,
            removePaymentMethodCode
        } = this.props;

        return (
            <>
                { this.renderCustomerDetails() }
                <CheckoutAddressBook
                  saveAddressInformation={ saveAddressInformation }
                  onAddressSelect={ onAddressSelect }
                  onShippingEstimationFieldsChange={ onShippingEstimationFieldsChange }
                  isSubmitted={ isSubmitted }
                  showError={ showError }
                  showCountrySelectionPopup={ showCountrySelectionPopup }
                  showCountrySelection={ showCountrySelection }
                  isSameAsShipping={ isSameAsShipping }
                  onSameAsShippingChange={ onSameAsShippingChange }
                  is_virtual={ is_virtual }
                  selectedShippingMethod={ selectedShippingMethod }
                  saveBillingAddress={ saveBillingAddress }
                  removePaymentMethodCode={ removePaymentMethodCode }
                />
                { (!(isSameAsShipping && !is_virtual) && step === SHIPPING_ADDRESS)
                    ? (
                        <CheckoutAddressBook
                          saveBillingAddress={ saveBillingAddress }
                          saveAddressInformation={ saveAddressInformation }
                          onAddressSelect={ onAddressSelect }
                          isBilling
                          is_virtual
                        />
                    ) : null }
                { this.renderContinueBtn() }
            </>
        );
    }

    renderDelivery() {
        const {
            shippingMethods,
            onShippingMethodSelect,
            estimateAddress,
            onStoreSelect,
            handleSelectDeliveryMethod,
            selectedShippingMethod,
            isBilling,
            removePaymentMethodCode
        } = this.props;

        return (
            <CheckoutDeliveryOptions
              isBilling={ isBilling }
              shippingMethods={ shippingMethods }
              onShippingMethodSelect={ onShippingMethodSelect }
              estimateAddress={ estimateAddress }
              onStoreSelect={ onStoreSelect }
              handleSelectDeliveryMethod={ handleSelectDeliveryMethod }
              selectedShippingMethod={ selectedShippingMethod }
              removePaymentMethodCode={ removePaymentMethodCode }
            />
        );
    }

    renderContent() {
        const { isPickInStoreMethodSelected } = this.props;

        if (isPickInStoreMethodSelected) {
            return this.renderPickInStoreMethod();
        }

        return (
            <>
                { this.renderAddressBook() }
                <div>
                    { this.renderDelivery() }
                    { this.renderActions() }
                </div>
            </>
        );
    }
}

export default CheckoutShippingComponent;
