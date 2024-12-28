/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
// import RadioButton from 'Component/RadioButtonIcon';
import Loader from 'Component/Loader';
import {
    CheckoutAddressTable as SourceCheckoutAddressTable
} from 'SourceComponent/CheckoutAddressTable/CheckoutAddressTable.component';

import './CheckoutAddressTable.override.style';

/** @namespace Seedsman/Component/CheckoutAddressTable/Component */
export class CheckoutAddressTableComponent extends SourceCheckoutAddressTable {
    renderTable() {
        const { isSelected } = this.props;

        return (
            <button
              block="CheckoutAddressTable"
              elem="Button"
              type="button"
              mods={ { isSelected } }
              onClick={ this.onAddressClick }
            >
                { this.renderAddress() }
            </button>
        );
    }

    renderAddressType() {
        return (
            <span className="Addresstype">
                Primary
            </span>
        );
    }

    renderCountryName() {
        const {
            countries,
            allCountries = [],
            address: {
                country_id
            } = {}
        } = this.props;

        const allowedCountry = countries.find((val) => val.id === country_id);
        const allCountry = allCountries.find((val) => val.id === country_id);

        if (allowedCountry?.label) {
            return <p block="country">{ allowedCountry?.label }</p>;
        }
        if (allCountry?.label) {
            return <p block="country">{ allCountry?.label }</p>;
        }

        return null;
    }

    renderAddress() {
        const {
            address: {
                id,
                firstname,
                lastname,
                telephone,
                city,
                street,
                postcode
            },
            isPrimary
        } = this.props;

        return (
            <div
              className="AddressContainer"
            >
                <label htmlFor={ id }>
                    <div className="AddressContent">
                        <div block="AccountAddress">
                            <address>
                                <p className="FullName">
                                    { firstname }
                                    { ' ' }
                                    { lastname }
                                </p>
                                <p block="Telephone-no">
                                    <span block="Phone-no">{ telephone }</span>
                                </p>
                                <p className="Address">{ `${street[0]}` }</p>
                                <p className="Address">{ `${city} ${postcode}` }</p>
                                { this.renderCountryName() }
                                { this.renderActions() }
                            </address>
                            { isPrimary && this.renderAddressType() }
                            { this.renderAddressLabels() }
                        </div>
                    </div>
                </label>
            </div>
        );
    }

    renderAddressLabels() {
        const { address: { default_billing, default_shipping } = {} } = this.props;

        if (default_billing && default_shipping) {
            return (
                <div block="DefaultAddress" elem="Wrapper">
                    <span className="DefaultAddress-label">
                        Billing Address
                    </span>
                    <span className="DefaultAddress-label">
                        Shipping Address
                    </span>
                </div>
            );
        }

        if (default_billing || default_shipping) {
            const label = default_billing ? 'Billing Address' : 'Shipping Address';
            return (
                <div block="DefaultAddress" elem="Wrapper">
                    <span className="DefaultAddress-label">
                        { label }
                    </span>
                </div>
            );
        }

        return null;
    }

    renderChangeAddressButton() {
        const {
            isSelected, handleAddressChange, showAddress, addresses
        } = this.props;

        if (!isSelected || showAddress || addresses.length <= 1) {
            return null;
        }

        return (
            <button
              type="button"
              block="Button"
              mods={ { isHollow: true, isWithoutBorder: true } }
              onClick={ handleAddressChange }
            >
                Change Address
            </button>
        );
    }

    renderActions() {
        const {
            onEditClick,
            showActions
        } = this.props;

        if (!showActions) {
            return null;
        }

        return (
            <div className="Address-Action">
                <span className="Action-Buttons">
                    <button
                      type="button"
                      block="Button"
                      mods={ { isHollow: true, isWithoutBorder: true } }
                      onClick={ onEditClick }
                    >
                        Edit
                    </button>
                </span>
                { this.renderChangeAddressButton() }
            </div>
        );
    }

    render() {
        const { countries } = this.props;

        return (
            <div block="CheckoutAddressTable">
                <Loader isLoading={ !countries.length } />
                { this.renderTable() }
            </div>
        );
    }
}

export default CheckoutAddressTableComponent;
