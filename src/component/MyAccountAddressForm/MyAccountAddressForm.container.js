/* eslint-disable max-lines */
/* eslint-disable react/boolean-prop-naming */
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
import { connect } from 'react-redux';

import { ADDRESS_POPUP_ID } from 'Component/MyAccountAddressPopup/MyAccountAddressPopup.config';
import {
    MyAccountAddressForm as SourceMyAccountAddressForm
} from 'SourceComponent/MyAccountAddressForm/MyAccountAddressForm.component';
import { showPopup } from 'Store/Popup/Popup.action';
import { Addresstype } from 'Type/Account.type';
import { CountriesType } from 'Type/Config.type';
import {
    getAvailableRegions,
    getCityAndRegionFromZipcode,
    getRegionIdFromAvailableRegions
} from 'Util/Address';
import { debounce } from 'Util/Request';
import transformCountriesToOptions from 'Util/Store/Transform';

import MyAccountAddressForm from './MyAccountAddressForm.component';
import { UPDATE_ZIPCODE_FREQUENCY } from './MyAccountAddressForm.config';

/** @namespace Seedsman/Component/MyAccountAddressForm/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    countries: transformCountriesToOptions(state.ConfigReducer.countries || []),
    defaultCountry: state.ConfigReducer.default_country,
    addressLinesQty: state.ConfigReducer.address_lines_quantity,
    showVatNumber: state.ConfigReducer.show_vat_number_on_storefront,
    regionDisplayAll: state.ConfigReducer.region_display_all,
    addressTypeOptions: state.ConfigReducer.getAddressTypeOptions,
    isGoogleSearchEnabled: state.ConfigReducer.enable_google_address_search,
    all_countries: transformCountriesToOptions(state.ConfigReducer.allCountries || [])
});

/** @namespace Seedsman/Component/MyAccountAddressForm/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    showPopup: (payload) => dispatch(showPopup(ADDRESS_POPUP_ID, payload))
});

/** @namespace Seedsman/Component/MyAccountAddressForm/Container */
export class MyAccountAddressFormContainer extends SourceMyAccountAddressForm {
     static propTypes = {
         address: Addresstype.isRequired,
         countries: CountriesType.isRequired,
         all_countries: CountriesType.isRequired,
         defaultCountry: PropTypes.string,
         addressLinesQty: PropTypes.number.isRequired,
         showVatNumber: PropTypes.bool.isRequired,
         regionDisplayAll: PropTypes.bool.isRequired,
         onSave: PropTypes.func.isRequired,
         addressTypeOptions: PropTypes.arrayOf.isRequired,
         isGoogleSearchEnabled: PropTypes.bool.isRequired,
         isDisabled: PropTypes.bool,
         title: PropTypes.string.isRequired
     };

     static defaultProps = {
         defaultCountry: 'US'
     };

     state = {
         countryId: this.getCountry()?.value,
         availableRegions: this.getAvailableRegions() || [],
         isStateRequired: !!this.getCountry()?.is_state_required,
         currentCity: this.getCurrentAddress().city,
         currentRegion: this.getCurrentAddress().region,
         currentZipcode: this.getCurrentAddress().postcode,
         currentRegionId: this.getCurrentAddress().regionId,
         addressType: '',
         alternateNumber: '',
         customAddress: {
             is_shipping_address: '0',
             is_billing_address: '0'
         },
         defaultAddress: {},
         googleAddress: null,
         isAddressToggled: false,
         isDisabled: false,
         StreetAddress: null
     };

     containerFunctions = {
         onCountryChange: this.onCountryChange.bind(this),
         onZipcodeChange: this.onZipcodeChange.bind(this),
         onCityChange: this.onCityChange.bind(this),
         onRegionChange: this.onRegionChange.bind(this),
         onRegionIdChange: this.onRegionIdChange.bind(this),
         onAddressTypeChange: this.onAddressTypeChange.bind(this),
         onAlternateNumberChange: this.onAlternateNumberChange.bind(this),
         handleRemovePopup: this.handleRemovePopup.bind(this),
         handleAddressType: this.handleAddressType.bind(this),
         handleAddressCheckbox: this.handleAddressCheckbox.bind(this),
         handleAutoComplete: this.handleAutoComplete.bind(this),
         onAddressSearchTypeChange: this.onAddressSearchTypeChange.bind(this),
         onConsentChecked: this.onConsentChecked.bind(this),
         onStreetValueChange: this.onStreetValueChange.bind(this)
     };

     containerProps() {
         const {
             address,
             countries,
             defaultCountry,
             addressLinesQty,
             showVatNumber,
             regionDisplayAll,
             onSave,
             isPopUp,
             addressTypeOptions,
             isGoogleSearchEnabled,
             all_countries,
             title
         } = this.props;

         const {
             countryId,
             availableRegions,
             isStateRequired,
             currentCity,
             currentRegion,
             currentZipcode,
             currentRegionId,
             addressType,
             alternateNumber,
             customAddress: {
                 is_shipping_address,
                 is_billing_address
             },
             defaultAddress,
             googleAddress,
             isAddressToggled,
             isDisabled,
             StreetAddress
         } = this.state;

         return {
             address: googleAddress || address,
             countries,
             isAddressToggled,
             defaultCountry,
             addressLinesQty,
             showVatNumber,
             regionDisplayAll,
             countryId,
             availableRegions,
             isStateRequired,
             fieldRef: this.fieldRef,
             onSave,
             currentCity,
             currentRegion,
             currentZipcode,
             currentRegionId,
             isPopUp,
             addressType,
             alternateNumber,
             addressTypeOptions,
             isGoogleSearchEnabled,
             is_shipping_address,
             is_billing_address,
             defaultAddress,
             all_countries,
             isDisabled,
             StreetAddress,
             title
         };
     }

     handleRemovePopup() {
         const { showPopup } = this.props;
         showPopup({
             action: ADDRESS_POPUP_ID
         });
     }

     // #region GETTERS
     getCountry(countryId = null) {
         const { countries, address: { country_id: countryIdAddress } = {} } = this.props;
         const countryIdFixed = countryId || countryIdAddress;
         return countries.find(({ value }) => value === countryIdFixed);
     }

     getCurrentAddress() {
         const { address, address: { id: addressId } } = this.props;

         if (!addressId) {
             return {
                 region: '',
                 regionId: 1,
                 zipCode: '',
                 city: ''
             };
         }

         const { region: { region, region_id: regionId }, postcode, city } = address;

         return {
             region,
             regionId,
             postcode,
             city
         };
     }

     /**
      * Returns available regions based on country and zip
      * @param countryId
      * @param zipCode
      * @returns {Promise<[*, *]|null[]|*>}
      */
     getAvailableRegions(countryId = null, zipCode = null) {
         const { countries, defaultCountry } = this.props;
         const { value: currCountryId = defaultCountry } = this.getCountry(countryId) || {};

         return !zipCode
             ? getAvailableRegions(currCountryId, countries)
             : this.handleSetCityAndRegionDependingOnZipcode(countryId, zipCode);
     }
     // #endregion

     // #region EVENTS
     onCityChange(field) {
         this.setState({ currentCity: field.target.value });
     }

     onRegionChange(field) {
         this.setState({ currentRegion: field.target.value });
     }

     onRegionIdChange(field) {
         this.setState({ currentRegionId: field });
     }

     onAddressTypeChange({ target: { value } }) {
         this.setState({ addressType: value });
     }

     onAlternateNumberChange({ target: { value } }) {
         this.setState({ alternateNumber: value });
     }

     handleAddressCheckbox({ target: { name, checked } }) {
         const { defaultAddress } = this.state;
         defaultAddress[name] = checked;
         this.setState({
             ...this.state,
             defaultAddress
         });
     }

     handleAddressType({ target: { name, checked } }) {
         const { customAddress } = this.state;
         customAddress[name] = checked ? '1' : '0';
         this.setState({
             ...this.state,
             customAddress
         });
     }

     onRegionIdChangeAutoComplete(countryId) {
         const { googleAddress } = this.state;
         if (!googleAddress) {
             return;
         }
         const { region: { region_id } = {} } = this.state.googleAddress;
         const CuurentAvailableRegions = this.getAvailableRegions(countryId);
         const result = CuurentAvailableRegions.find((data) => data.code === region_id);
         if (!result) {
             return;
         }
         const { id } = result;
         this.setState({
             currentRegionId: id
         });
     }

     onEditZipCodeAutoComplete() {
         const { googleAddress } = this.state;

         if (!googleAddress) {
             return;
         }

         const { postcode: GooglePostCode = {} } = googleAddress;

         this.setState({
             currentZipcode: GooglePostCode
         });
     }

     onCountryChange(field, e) {
         // Handles auto fill
         const fieldValue = typeof field === 'object' ? e.value : field;

         const { currentZipcode } = this.state;
         const { countries } = this.props;
         const country = countries.find(({ value }) => value === fieldValue);

         if (!country) {
             this.setState({
                 currentRegion: '',
                 currentRegionId: 1,
                 countryId: '',
                 availableRegions: []
             });

             return;
         }

         const {
             available_regions: availableRegions = [],
             is_state_required: isStateRequired = true,
             value: countryId
         } = country;

         this.getAvailableRegions(countryId, currentZipcode);
         this.setState({
             availableRegions,
             isStateRequired: isStateRequired || false,
             countryId,
             currentRegionId: '',
             currentRegion: ''
         }, () => this.onRegionIdChangeAutoComplete(countryId));
     }

     onZipcodeChange(event, field) {
         const { value: zipCode = '' } = field || {};
         const { countryId } = this.state;
         this.setState({ currentZipcode: zipCode });
         debounce(this.getAvailableRegions(countryId, zipCode), UPDATE_ZIPCODE_FREQUENCY);
     }

     async handleSetCityAndRegionDependingOnZipcode(countryId, zipCode) {
         const { availableRegions = [] } = this.state;
         const cityAndRegion = await getCityAndRegionFromZipcode(countryId, zipCode);

         if (!cityAndRegion) {
             return;
         }

         const { city, region } = cityAndRegion;

         if (availableRegions && availableRegions.length) {
             this.setState({
                 currentCity: city,
                 currentRegionId: getRegionIdFromAvailableRegions(availableRegions, cityAndRegion),
                 currentRegion: ''
             });
         } else {
             this.setState({
                 currentCity: city,
                 currentRegion: region,
                 currentRegionId: 1
             });
         }
     }
     // #endregion

     handleAutoComplete(address) {
         const { countryId, city = '', postcode } = address;
         this.setState({
             googleAddress: address,
             currentCity: city,
             currentZipcode: postcode,
             StreetAddress: null
         });

         this.onCountryChange(countryId);
     }

     onAddressSearchTypeChange() {
         const { isAddressToggled } = this.state;
         this.setState({
             isAddressToggled: !isAddressToggled
         });
     }

     onConsentChecked() {
         const { isDisabled } = this.state;
         this.setState({
             isDisabled: !isDisabled
         });
     }

     onStreetValueChange(e) {
         this.setState({
             StreetAddress: e.target.value
         });
     }

     render() {
         return (
             <MyAccountAddressForm
               { ...this.containerFunctions }
               { ...this.containerProps() }
             />
         );
     }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountAddressFormContainer);
