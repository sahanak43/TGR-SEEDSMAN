/* eslint-disable fp/no-let */
/* eslint-disable @scandipwa/scandipwa-guidelines/create-config-files */
/* eslint-disable consistent-return */
/* eslint-disable react/no-unused-state */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-props-destruction */
/* eslint-disable no-magic-numbers */

import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { goToPreviousNavigationState } from 'SourceStore/Navigation/Navigation.action';
import { showNotification } from 'SourceStore/Notification/Notification.action';
import { hideActiveOverlay } from 'SourceStore/Overlay/Overlay.action';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { CountriesType } from 'Type/Config.type';
import BrowserDatabase from 'Util/BrowserDatabase';
import { Cookies } from 'Util/Cookies';
// import transformToNameValuePair from 'Util/Form/Transform';
import transformCountriesToOptions from 'Util/Store/Transform';
import { availableEUCountryCodes } from 'Util/StoreCountries';
import { getStoreCodes, replaceStorePrefix } from 'Util/Url';

import SelectCountryPopupComponent from './SelectCountryPopup.component';

export const STORE_CONFIG_KEY = 'config';
export const GUEST_QUOTE = 'guest_quote_id';

/** @namespace Seedsman/Component/SelectCountryPopup/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    headerLogoSrc: state.ConfigReducer.header_logo_src,
    logoAlt: state.ConfigReducer.logo_alt,
    logoHeight: state.ConfigReducer.logo_height,
    logoWidth: state.ConfigReducer.logo_width,
    countries: transformCountriesToOptions(state.ConfigReducer.allCountries || []),
    updatedCountries: state.ConfigReducer.updatedCountries
});

/** @namespace Seedsman/Component/SelectCountryPopup/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    showNotification: (type, message) => dispatch(showNotification(type, message)),
    hideActiveOverlay: () => dispatch(hideActiveOverlay()),
    goToPreviousHeaderState: () => dispatch(goToPreviousNavigationState(TOP_NAVIGATION_TYPE))
});

/** @namespace Seedsman/Component/SelectCountryPopup/Container */
export class SelectCountryPopupContainer extends PureComponent {
    static propTypes = {
        cookieText: PropTypes.string.isRequired,
        cookieLink: PropTypes.string.isRequired,
        code: PropTypes.string.isRequired,
        headerLogoSrc: PropTypes.string.isRequired,
        logoAlt: PropTypes.string.isRequired,
        showPopup: PropTypes.func.isRequired,
        showNotification: PropTypes.func.isRequired,
        hideActiveOverlay: PropTypes.func.isRequired,
        goToPreviousHeaderState: PropTypes.func.isRequired,
        // eslint-disable-next-line react/require-default-props
        checkoutSelection: PropTypes.string,
        countries: CountriesType.isRequired,
        updatedCountries: CountriesType.isRequired
    };

    state = {
        redirectUrl: '',
        storeCode: null,
        store_code: null,
        selectedCountryId: '',
        isPopupVisible: false,
        countryChecked: false,
        isCustomer18Plus: false,
        is_US_Country: false
    };

    containerFunctions = {
        showSelectCountryPopup: this.showSelectCountryPopup.bind(this),
        onClickCheckedBox: this.onClickCheckedBox.bind(this),
        onSuccess: this.onSuccess.bind(this),
        onClickAge18Btn: this.onClickAge18Btn.bind(this),
        handleCountryChange: this.handleCountryChange.bind(this)
    };

    componentDidMount() {
        const country = Cookies.get('selectedCountry') || {};
        const currentStore = getStoreCodes();

        if (country?.value === currentStore) {
            return null;
        }

        this.showSelectCountryPopup();
    }

    containerProps() {
        const {
            code, cookieLink, cookieText,
            headerLogoSrc, logoAlt,
            showPopup, checkoutSelection,
            countries, updatedCountries
        } = this.props;

        const {
            countryChecked,
            defaultCountry,
            storeCode, store_code, selectedCountryId, isPopupVisible,
            isCustomer18Plus, is_US_Country
        } = this.state;

        return {
            code,
            cookieLink,
            cookieText,
            headerLogoSrc,
            logoAlt,
            countryChecked,
            defaultCountry,
            storeCode,
            store_code,
            showPopup,
            selectedCountryId,
            isCustomer18Plus,
            countries,
            is_US_Country,
            isPopupVisible: checkoutSelection || isPopupVisible,
            updatedCountries
        };
    }

    showSelectCountryPopup() {
        this.setState({
            isPopupVisible: true
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

    handleChangeCountry(countryCode, lang, store) {
        const { checkoutSelection } = this.props;
        const { origin, search } = new URL(window.location);
        const homeUrl = `${origin}/${countryCode}-${lang}/`;
        let url = checkoutSelection ? homeUrl : replaceStorePrefix(countryCode, lang);
        url = search.length ? url + search : url;

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
            <SelectCountryPopupComponent
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectCountryPopupContainer);
