/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable array-callback-return */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
/* eslint-disable max-len */

import PropTypes from 'prop-types';

import CheckoutDeliveryOption from 'Component/CheckoutDeliveryOption';
import { STORE_IN_PICK_UP_METHOD_CODE } from 'Component/StoreInPickUp/StoreInPickUp.config';
import { DELIVERY_METHOD, PAYMENT_METHOD } from 'Route/Checkout/Checkout.config';
import { CheckoutDeliveryOptions as ParentCheckoutDeliveryOptions } from 'SourceComponent/CheckoutDeliveryOptions/CheckoutDeliveryOptions.component';
import { ShippingMethodsType, ShippingMethodType } from 'Type/Checkout.type';

import './CheckoutDeliveryOptions.override.style';

/** @namespace Seedsman/Component/CheckoutDeliveryOptions/Component */
export class CheckoutDeliveryOptionsComponent extends ParentCheckoutDeliveryOptions {
    static propTypes = {
        shippingMethods: ShippingMethodsType.isRequired,
        selectShippingMethod: PropTypes.func.isRequired,
        handleSelectDeliveryMethod: PropTypes.func.isRequired,
        selectedShippingMethod: ShippingMethodType,
        isShippingMethodPreSelected: PropTypes.bool.isRequired
    };

    static defaultProps = {
        selectedShippingMethod: {}
    };

    shippingRenderMap = {
        [STORE_IN_PICK_UP_METHOD_CODE]: this.handleSelectStoreInPickUp.bind(this)
    };

    renderHeading() {
        const { step, handleAddressEdit } = this.props;

        return (
            <div block="Checkout-Default">
            <h2 block="Checkout" elem="Heading">
                2. Delivery method
            </h2>
                { step === PAYMENT_METHOD ? <button type="button" onClick={ handleAddressEdit }>Edit</button> : null }
            </div>
        );
    }

    renderShippingMethodHeading() {
        const { shippingMethods } = this.props;

        if (!shippingMethods.length || (shippingMethods.length === 1 && !shippingMethods[0].available)) {
            return null;
        }

        return (
            <h4 block="Checkout" elem="ShippingTitle">
                Select your delivery method:
            </h4>
        );
    }

    handleSelectStoreInPickUp() {
        const {
            handleSelectDeliveryMethod,
            isShippingMethodPreSelected
        } = this.props;

        if (isShippingMethodPreSelected) {
            return;
        }

        handleSelectDeliveryMethod();
    }

    renderDeliveryOption(option) {
        const {
            selectShippingMethod,
            selectedShippingMethod: { method_code: selectedMethodCode }
        } = this.props;

        const { method_code } = option;
        const isSelected = selectedMethodCode === method_code;

        return (
            <CheckoutDeliveryOption
              key={ method_code }
              isSelected={ isSelected }
              option={ option }
              onClick={ selectShippingMethod }
            />
        );
    }

    renderNoDeliveryOptions() {
        return (
            <p block="CheckoutDeliveryOptions" elem="NoOptions">
                There are no shipping methods available, try different address.
            </p>
        );
    }

    renderShippingMethods() {
        const { shippingMethods } = this.props;

        if (!shippingMethods.length || (shippingMethods.length === 1 && !shippingMethods[0].available)) {
            return this.renderNoDeliveryOptions();
        }

        return shippingMethods.map(this.renderDeliveryOption.bind(this));
    }

    renderSelectedShippingMethod() {
        const { selectedShippingMethod: { method_code } } = this.props;
        const render = this.shippingRenderMap[method_code];

        if (!render) {
            return null;
        }

        return render();
    }

    render() {
        const { step } = this.props;

        return (
            <div block="CheckoutDeliveryOptions">
                { this.renderHeading() }
                { step === DELIVERY_METHOD ? (
                <div block="CheckoutDeliveryOptions" elem="Wrapper">
                    { this.renderShippingMethodHeading() }
                    <div block="CheckoutDeliveryOptions" elem="List">
                        { this.renderShippingMethods() }
                    </div>
                </div>
                ) : null }
                { this.renderSelectedShippingMethod() }
            </div>
        );
    }
}

export default CheckoutDeliveryOptionsComponent;
