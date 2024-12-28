/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-props-destruction */
/* eslint-disable max-lines */
/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
/* eslint-disable spaced-comment */
/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import PropTypes from 'prop-types';

import FIELD_TYPE from 'Component/Field/Field.config';
import FieldForm from 'Component/FieldForm';
import Form from 'Component/Form';
import { MyAccountAddressForm as SourceMyAccountAddressForm } from 'SourceComponent/MyAccountAddressForm/MyAccountAddressForm.component';
import { Addresstype } from 'Type/Account.type';
import { CountriesType } from 'Type/Config.type';
import { trimCustomerAddress } from 'Util/Address';
import transformToNameValuePair from 'Util/Form/Transform';
import GooglemapContainer from 'Util/GoogleMap';

import myAccountAddressForm from './MyAccountAddressForm.form';
import myAccountAddressPopUpForm from './MyAccountAddressPopUpForm.form';

import './MyAccountAddressForm.style.scss';
/** @namespace Seedsman/Component/MyAccountAddressForm/Component */
export class MyAccountAddressFormComponent extends SourceMyAccountAddressForm {
    static propTypes = {
        address: Addresstype.isRequired,
        countries: CountriesType.isRequired,
        defaultCountry: PropTypes.string.isRequired,
        addressLinesQty: PropTypes.number.isRequired,
        showVatNumber: PropTypes.bool.isRequired,
        regionDisplayAll: PropTypes.bool.isRequired,
        onCountryChange: PropTypes.func.isRequired,
        onZipcodeChange: PropTypes.func.isRequired,
        onCityChange: PropTypes.func.isRequired,
        onAddressSearchTypeChange: PropTypes.func.isRequired,
        onConsentChecked: PropTypes.func.isRequired,
        onRegionChange: PropTypes.func.isRequired,
        onAddressTypeChange: PropTypes.func.isRequired,
        onAlternateNumberChange: PropTypes.func.isRequired,
        onRegionIdChange: PropTypes.func.isRequired,
        countryId: PropTypes.string.isRequired,
        isStateRequired: PropTypes.bool,
        currentCity: PropTypes.string,
        currentRegion: PropTypes.string,
        currentZipcode: PropTypes.string,
        currentRegionId: PropTypes.number,
        isDisabled: PropTypes.bool.isRequired,
        title: PropTypes.string.isRequired,
        onStreetValueChange: PropTypes.func.isRequired
    };

    static defaultProps = {
        currentZipcode: null,
        currentCity: null,
        currentRegion: null,
        currentRegionId: null,
        isStateRequired: false
    };

    //#region GETTERS
    get fieldMap() {
        const {
            address,
            countries,
            addressLinesQty,
            regionDisplayAll,
            showVatNumber,
            defaultCountry,
            availableRegions,
            isStateRequired,
            countryId,
            currentRegion,
            currentCity,
            currentRegionId,
            currentZipcode,
            onCountryChange,
            onZipcodeChange,
            onCityChange,
            onAddressSearchTypeChange,
            onConsentChecked,
            onStreetValueChange,
            onRegionChange,
            onRegionIdChange,
            isPopUp,
            onAddressTypeChange,
            onAlternateNumberChange,
            addressType,
            alternateNumber,
            handleAddressType,
            addressTypeOptions,
            isGoogleSearchEnabled,
            is_shipping_address,
            is_billing_address,
            handleAddressCheckbox,
            defaultAddress,
            isAddressToggled,
            StreetAddress
        } = this.props;

        const renderForm = isPopUp
            ? myAccountAddressPopUpForm
            : myAccountAddressForm;

        return renderForm(
            {
                address,
                countries,
                addressLinesQty,
                regionDisplayAll,
                showVatNumber,
                defaultCountry,
                availableRegions,
                isStateRequired,
                countryId,
                currentRegion,
                currentCity,
                currentRegionId,
                currentZipcode,
                addressType,
                alternateNumber,
                addressTypeOptions,
                isGoogleSearchEnabled,
                is_shipping_address,
                is_billing_address,
                defaultAddress,
                isAddressToggled,
                StreetAddress
            },
            {
                onCountryChange,
                onZipcodeChange,
                onCityChange,
                onAddressSearchTypeChange,
                onConsentChecked,
                onStreetValueChange,
                onRegionChange,
                onRegionIdChange,
                onAddressTypeChange,
                onAlternateNumberChange,
                handleAddressType,
                handleAddressCheckbox
            }
        );
    }

    getFormProps() {
        return {
            onSubmit: this.onSubmit.bind(this)
        };
    }

    /**
     * Creates / Updates address from entered data
     * @param form
     * @param fields
     */
    onSubmit(form, fields) {
        const { onSave, addressLinesQty } = this.props;
        // eslint-disable-next-line no-param-reassign
        fields = fields.filter((field) => {
            if (field.name === 'c_address_type') {
                return field.value !== false;
            }

            return field;
        });

        const newAddress = transformToNameValuePair(fields);
        const {
            c_address_type,
            alternate_phone_number,
            is_billing_address,
            is_shipping_address
        } = newAddress;
        const attributes = [
            {
                attribute_code: 'c_address_type',
                value: c_address_type || ''
            },
            {
                attribute_code: 'alternate_phone_number',
                value: alternate_phone_number
            },
            {
                attribute_code: 'is_billing_address',
                value: is_billing_address ? '1' : '0'
            },
            {
                attribute_code: 'is_shipping_address',
                value: is_shipping_address ? '1' : '0'
            }
        ];

        newAddress.custom_attributes = attributes || [];

        // Joins streets into one variable
        if (addressLinesQty > 1) {
            newAddress.street = [];
            // eslint-disable-next-line fp/no-loops,fp/no-let
            for (let i = 0; i < addressLinesQty; i++) {
                if (newAddress[`street_${i}`]) {
                    newAddress.street.push(newAddress[`street_${i}`]);
                }
            }
        }

        // Fixes region variable format
        const { region_id = 0, region_string: region } = newAddress;
        newAddress.region = { region_id: +region_id, region };

        // Filters out non-required options and save address
        onSave(trimCustomerAddress(newAddress));
    }

    renderTitle() {
        const { address, title } = this.props;
        return (
            <div>
                <div block="MyAccountAddressForm" elem="Title">{ title }</div>
            </div>
        );
    }

    //#region RENDERERS
    renderActions() {
        const { isPopUp, handleRemovePopup, isDisabled } = this.props;
        return (
            <div block="Action-block">
                { isPopUp ? (
                    <button
                      block="Button"
                      mix={ { block: 'MyAccount', elem: 'Button_Cancel' } }
                      mods={ { isHollow: true } }
                      onClick={ handleRemovePopup }
                    >
                        Cancel
                    </button>
                ) : (
                    <button
                      type={ FIELD_TYPE.submit }
                      block="Button"
                      mix={ { block: 'MyAccount', elem: 'Button_Cancel' } }
                      mods={ { isHollow: true } }
                    >
                        Cancel
                    </button>
                ) }
                <button
                  type={ FIELD_TYPE.submit }
                  block="Button"
                  mix={ { block: 'MyAccount', elem: 'Button' } }
                  disabled={ !isDisabled }
                >
                    Save
                </button>
            </div>
        );
    }

    getGoogleSearch() {
        const {
            handleAutoComplete, isAddressToggled, isGoogleSearchEnabled, onAddressSearchTypeChange,
            countries
        } = this.props;

        if (!isGoogleSearchEnabled) {
            return null;
        }

        return (
            <div>
                { !isAddressToggled
                    ? <GooglemapContainer onAutoComplete={ handleAutoComplete } countries={ countries } />
                    : null }
                <button
                  block="MyAccountAddressForm"
                  elem="searchToggle"
                  onClick={ onAddressSearchTypeChange }
                  type="button"
                >
                    { !isAddressToggled ? 'Enter address manually' : 'Search address' }
                </button>
            </div>
        );
    }

    render() {
        return (
            <div>
                <Form { ...this.getFormProps() } block="FieldForm">
                    { this.renderTitle() }
                    { this.getGoogleSearch() }
                    { this.renderFormBody() }
                </Form>
            </div>
        );
    }
}

export default MyAccountAddressFormComponent;
