/* eslint-disable max-lines */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable max-len */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
import CheckoutAddressForm from 'Component/CheckoutAddressForm';
import CheckoutAddressTable from 'Component/CheckoutAddressTable';
import Field from 'Component/Field';
import FIELD_TYPE from 'Component/Field/Field.config';
import {
    STORE_IN_PICK_UP_METHOD_CODE
} from 'Component/StoreInPickUp/StoreInPickUp.config';
import StoreSwitcherV2 from 'Component/StoreSwitcherV2';
import {
    BILLING_STEP, SHIPPING_ADDRESS, SHIPPING_STEP
} from 'Route/Checkout/Checkout.config';
import {
    CheckoutAddressBook as SourceCheckoutAddressBook
} from 'SourceComponent/CheckoutAddressBook/CheckoutAddressBook.component';
import { getDefaultAddressLabel } from 'Util/Address';
import { isSignedIn } from 'Util/Auth';

import './CheckoutAddressBook.override.style';

/** @namespace Seedsman/Component/CheckoutAddressBook/Component */
export class CheckoutAddressBookComponent extends SourceCheckoutAddressBook {
    ToggleAddressAdd = () => {
        this.setState({
            isCustomAddressExpanded: !this.state.isCustomAddressExpanded
        });
    };

    renderHeading() {
        const { handleAddressEdit, step, isBilling } = this.props;

        if (isBilling) {
            return null;
        }

        return (
            <div block="Checkout-Default">
                <h2 block="Checkout" elem="Heading">
                    1. Delivery details
                </h2>
                { step !== SHIPPING_ADDRESS ? <button type="button" onClick={ handleAddressEdit }>Edit</button> : null }
            </div>
        );
    }

    renderErrorMsg() {
        const { showError, handleAddressChange } = this.props;

        if (!showError) {
            return null;
        }

        return (
            <>
            <div block="CheckoutShipping" elem="ErrorMsg">
                <span>
                    Please choose your delivery destination in order to Place order or
                    <span
                      className="ChangeCountryLink"
                      onClick={ handleAddressChange }
                    >
                        Change the Shipping Address
                    </span>
                </span>
            </div>
             <StoreSwitcherV2 key={ 1 } isCheckout />
            </>
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

    renderSignedInContent() {
        const { step, isBilling, showError } = this.props;

        if (!isSignedIn()) {
            return null;
        }

        if (step === SHIPPING_ADDRESS) {
            return (
                <>
                  { this.renderOptionalCustomAddress() }
                  <div block="CheckoutAddressBook" elem="Wrapper">
                      { this.renderAddressList() }
                  </div>
                  { this.renderErrorMsg() }
                  { !showError ? this.renderSameAsShippingCheckbox() : null }
                </>
            );
        }

        if (isBilling) {
            return (
                <>
                { this.renderOptionalCustomAddress() }
                <div block="CheckoutAddressBook" elem="Wrapper">
                    { this.renderAddressList() }
                </div>
                </>
            );
        }

        return null;
    }

    renderAddress(address, index) {
        const {
            onAddressSelect, selectedAddressId,
            customer: { default_shipping } = {}
        } = this.props;
        const addressNumber = index + 1;
        const { id } = address;
        const postfix = getDefaultAddressLabel(address);

        const { showAddress, handleAddressChange } = this.props;

        if (selectedAddressId !== id && !showAddress) {
            return null;
        }

        return (
            <CheckoutAddressTable
              onClick={ onAddressSelect }
              isSelected={ selectedAddressId === id }
              title={ __('Address #%s%s', addressNumber, postfix) }
              address={ address }
              key={ id }
              isPrimary={ Number(default_shipping) === id }
              showAddress={ showAddress }
              handleAddressChange={ handleAddressChange }
            />
        );
    }

    renderCustomAddress() {
        const {
            isBilling, onShippingEstimationFieldsChange, isSubmitted, prepareAddressAndSetToQuote
        } = this.props;
        const formPortalId = isBilling ? BILLING_STEP : SHIPPING_STEP;

        return (
            <CheckoutAddressForm
              prepareAddressAndSetToQuote={ prepareAddressAndSetToQuote }
              onShippingEstimationFieldsChange={ onShippingEstimationFieldsChange }
              address={ {} }
              id={ formPortalId }
              isSubmitted={ isSubmitted }
              onAddressUpdate={ this.ToggleAddressAdd }
            />
        );
    }

    renderAddNewAddressBtn() {
        const { isCustomAddressExpanded } = this.state;
        const { showCreateNewPopup, customer: { addresses = [] } = {} } = this.props;

        if (!addresses.length) {
            return null;
        }

        return (
            <button
              block="CheckoutAddressBook"
              elem="Button"
              mods={ { isCustomAddressExpanded } }
              type="button"
              onClick={ showCreateNewPopup }
            >
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.5 19C12.2167 19 11.9793 18.904 11.788 18.712C11.596 18.5207 11.5 18.2833 11.5 18V13H6.5C6.21667 13 5.979 12.904 5.787 12.712C5.59567 12.5207 5.5 12.2833 5.5 12C5.5 11.7167 5.59567 11.479 5.787 11.287C5.979 11.0957 6.21667 11 6.5 11H11.5V6C11.5 5.71667 11.596 5.479 11.788 5.287C11.9793 5.09567 12.2167 5 12.5 5C12.7833 5 13.021 5.09567 13.213 5.287C13.4043 5.479 13.5 5.71667 13.5 6V11H18.5C18.7833 11 19.0207 11.0957 19.212 11.287C19.404 11.479 19.5 11.7167 19.5 12C19.5 12.2833 19.404 12.5207 19.212 12.712C19.0207 12.904 18.7833 13 18.5 13H13.5V18C13.5 18.2833 13.4043 18.5207 13.213 18.712C13.021 18.904 12.7833 19 12.5 19Z" fill="black" />
              </svg>
              Add New Address
            </button>
        );
    }

    renderOptionalCustomAddress() {
        const { isCustomAddressExpanded } = this.state;
        const { isBilling } = this.props;

        return (
            <div
              block="CheckoutAddressBook"
              elem="CustomAddressWrapper"
            >
                <div block="TopContent">
                    { isBilling ? <h4>Billing address</h4> : <h4>Delivery address</h4> }
                    { this.renderAddNewAddressBtn() }
                </div>
                { isCustomAddressExpanded && this.renderCustomAddress() }
            </div>
        );
    }
}

export default CheckoutAddressBookComponent;
