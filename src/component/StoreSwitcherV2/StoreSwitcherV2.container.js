/* eslint-disable fp/no-let */
/* eslint-disable @scandipwa/scandipwa-guidelines/create-config-files */
/* eslint-disable max-len */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { CountriesType } from 'Type/Config.type';
import BrowserDatabase from 'Util/BrowserDatabase';
import { Cookies } from 'Util/Cookies';
// import transformToNameValuePair from 'Util/Form/Transform';
import transformCountriesToOptions from 'Util/Store/Transform';
import { availableEUCountryCodes } from 'Util/StoreCountries';
import { getCountryAndLanguageCode, replaceStorePrefix } from 'Util/Url';

import StoreSwitcherV2 from './StoreSwitcherV2.component';

import './StoreSwitcherV2.style';

export const STORE_CONFIG_KEY = 'config';
export const GUEST_QUOTE = 'guest_quote_id';

/** @namespace Seedsman/Component/StoreSwitcherV2/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    headerLogoSrc: state.ConfigReducer.header_logo_src,
    logoAlt: state.ConfigReducer.logo_alt,
    logoHeight: state.ConfigReducer.logo_height,
    logoWidth: state.ConfigReducer.logo_width,
    countries: transformCountriesToOptions(state.ConfigReducer.allCountries || []),
    updatedCountries: state.ConfigReducer.updatedCountries
});

/** @namespace Seedsman/Component/StoreSwitcherV2/Container/mapDispatchToProps */
export const mapDispatchToProps = () => ({});

/** @namespace Seedsman/Component/StoreSwitcherV2/Container */
export class StoreSwitcherV2Container extends PureComponent {
    static propTypes = {
        headerLogoSrc: PropTypes.string.isRequired,
        logoAlt: PropTypes.string.isRequired,
        logoHeight: PropTypes.string.isRequired,
        logoWidth: PropTypes.string.isRequired,
        countries: CountriesType.isRequired,
        updatedCountries: CountriesType.isRequired,
        isCheckout: PropTypes.bool.isRequired
    };

    state = {
        showCountrySelection: false,
        countryChecked: false,
        isCustomer18Plus: false,
        is_US_Country: false,
        selectedCountryId: ''
    };

    containerFunctions = {
        showCountrySelectionPopup: this.showCountrySelectionPopup.bind(this),
        handlePopup: this.handlePopup.bind(this),
        handleChangeCountry: this.handleChangeCountry.bind(this),
        onClickCheckedBox: this.onClickCheckedBox.bind(this),
        onSuccess: this.onSuccess.bind(this),
        onClickAge18Btn: this.onClickAge18Btn.bind(this),
        handleCountryChange: this.handleCountryChange.bind(this)
    };

    containerProps() {
        const {
            showCountrySelection, isCustomer18Plus,
            is_US_Country, countryChecked, selectedCountryId
        } = this.state;
        const {
            headerLogoSrc, logoAlt, logoHeight, logoWidth,
            countries, updatedCountries, isCheckout
        } = this.props;

        return {
            showCountrySelection,
            headerLogoSrc,
            logoAlt,
            logoHeight,
            logoWidth,
            isCustomer18Plus,
            is_US_Country,
            countries,
            countryChecked,
            country: this.getCountryLabel(),
            updatedCountries,
            selectedCountryId,
            isCheckout
        };
    }

    showCountrySelectionPopup() {
        this.setState({
            showCountrySelection: true
        });
    }

    handlePopup() {
        this.setState({
            showCountrySelection: false
        });
    }

    onClickAge18Btn() {
        const { isCustomer18Plus } = this.state;

        this.setState({
            isCustomer18Plus: !isCustomer18Plus
        });
    }

    handleCountryChange(e) {
        if (e.value === 'US') {
            this.setState({
                is_US_Country: true,
                selectedCountryId: e.value
            });
        } else {
            this.setState({
                is_US_Country: false,
                selectedCountryId: e.value
            });
        }
    }

    renderLanguages(country) {
        switch (country) {
        case 'FR':
            this.handleChangeCountry('eu', 'fr', 'eu');
            break;

        case 'DE':
            this.handleChangeCountry('eu', 'de', 'eu');
            break;

        case 'ES':
            this.handleChangeCountry('eu', 'es', 'eu');
            break;

        case 'IT':
            this.handleChangeCountry('eu', 'it', 'eu');
            break;

        case 'NL':
            this.handleChangeCountry('eu', 'nl', 'eu');
            break;

        default:
            this.handleChangeCountry('eu', 'en', 'eu');
            break;
        }
    }

    getCountryLabel() {
        const COUNTRY_MAP = {
            uk: 'United Kingdom',
            eu: 'Europe',
            us: 'USA',
            za: 'South Africa'
        };

        const { countryCode } = getCountryAndLanguageCode();
        return COUNTRY_MAP[countryCode] || 'United Kingdom';
    }

    handleChangeCountry(countryCode, lang, store) {
        const { search } = new URL(window.location);
        const url = `${replaceStorePrefix(countryCode, lang)}${search}`;

        Cookies.set('selectedStore', store);
        Cookies.set('selectedCountry', countryCode);
        Cookies.set('selectedLang', lang);
        BrowserDatabase.deleteItem(STORE_CONFIG_KEY);
        BrowserDatabase.deleteItem(GUEST_QUOTE);
        window.location = url;
    }

    onSuccess() {
        const { selectedCountryId } = this.state;

        if (availableEUCountryCodes.includes(selectedCountryId)) {
            this.renderLanguages(selectedCountryId);
        } else {
            switch (selectedCountryId) {
            case 'US':
                this.handleChangeCountry('us', 'en', 'us');
                break;
            case 'ZA':
                this.handleChangeCountry('za', 'en', 'za');
                break;

            default:
                this.handleChangeCountry('uk', 'en', 'uk');
                break;
            }
        }
    }

    onClickCheckedBox() {
        const { countryChecked } = this.state;

        this.setState({
            countryChecked: !countryChecked
        });
    }

    render() {
        return (
            <StoreSwitcherV2
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreSwitcherV2Container);
