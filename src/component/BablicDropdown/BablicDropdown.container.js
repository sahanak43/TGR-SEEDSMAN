/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import RedirectStoreQuery from 'Query/RedirectStore.query';
import { showNotification } from 'Store/Notification/Notification.action';
import { fetchMutation, getErrorMessage } from 'Util/Request';
import { importScript } from 'Util/Script';
import { getCountryAndLanguageCode, getPathnameFromURL, replaceStorePrefix } from 'Util/Url';

import BablicDropdownComponent from './BablicDropdown.component';
import { FLAG_SIZE, TIMEOUT } from './BablicDropdown.config';
/** @namespace Seedsman/Component/BablicDropdown/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    bablic_status: state.ConfigReducer.bablic_status,
    bablic_script_url: state.ConfigReducer.bablic_script_url
});

/** @namespace Seedsman/Component/BablicDropdown/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    showErrorNotification: (error) => dispatch(showNotification('error', getErrorMessage(error)))
});

/** @namespace Seedsman/Component/BablicDropdown/Container */
export class BablicDropdownContainer extends PureComponent {
    static propTypes = {
        bablic_script_url: PropTypes.string.isRequired
    };

    state = {
        DropDownlist: [],
        selectedOption: 'en_us',
        isScriptAdded: false,
        isBablicLoaded: false,
        selectedFlag: null,
        countryCode: 'uk',
        languageCode: 'en',
        singleDropdown: {}
    };

    containerFunctions = {
        switchLanguage: this.switchLanguage.bind(this)
    };

    componentDidMount() {
        this.renderUrl();
    }

    componentDidUpdate(__, prevState) {
        const { isScriptAdded } = this.state;
        if (prevState.isScriptAdded !== isScriptAdded) {
            this.renderUrl();
        }
    }

    renderScript() {
        const {
            bablic_status, bablic_script_url
        } = this.props;

        const isBablicLoad = document.getElementById('bablicScript');

        if (bablic_status && isBablicLoad === null) {
            importScript(bablic_script_url, 'bablicScript');
            this.setState({
                isScriptAdded: true
            });
        }
    }

    renderUrl() {
        const { isBablicLoaded } = this.state;
        const scriptLoading = setInterval(() => {
            if (!isBablicLoaded && typeof window.bablic === 'undefined') {
                this.renderScript();
                this.setState({
                    isBablicLoaded: true
                });
            } else {
                this.renderDropDownData();
                clearInterval(scriptLoading);
            }
        }, TIMEOUT);
    }

    switchLanguage(lang) {
        const { showErrorNotification } = this.props;
        const { countryCode } = getCountryAndLanguageCode();
        const url = getPathnameFromURL();

        if (!url.length) {
            const url = replaceStorePrefix(countryCode, lang);
            window.location = url;
        }

        const input = {
            store: `${countryCode}-${lang}`,
            url_key: decodeURI(url)
        };

        return fetchMutation(RedirectStoreQuery.getLanguageSwitchUrl(input)).then(
            /** @namespace Seedsman/Component/BablicDropdown/Container/BablicDropdownContainer/switchLanguage/fetchMutation/then */
            ({ getLanguageSwitchUrl: { url } }) => {
                window.location = `/${countryCode}-${lang}/${url}`;
            },
            /** @namespace Seedsman/Component/BablicDropdown/Container/BablicDropdownContainer/switchLanguage/fetchMutation/then/catch */
            (error) => {
                showErrorNotification(error);
            }
        );
    }

    renderDropDownData() {
        const { countryCode, languageCode } = getCountryAndLanguageCode();
        // eslint-disable-next-line fp/no-let
        // const arr = window.bablic.languages.get();
        const arr = [
            {
                key: 'en',
                name: 'English'
            },
            {
                key: 'fr',
                name: 'Francais'
            },
            {
                key: 'de',
                name: 'Deutsch'
            },
            {
                key: 'it',
                name: 'Italiano'
            },
            {
                key: 'es',
                name: 'Espanol'
            },
            {
                key: 'nl',
                name: 'Nederlands'
            }
        ];

        document.querySelectorAll("link[rel='alternate'").forEach((link) => {
            if (link.className !== 'bablic_links') {
                document.head.removeChild(link);
            }
        });
        const { locale = 'en' } = window.bablic;
        const singleDropdown = arr.find((language) => language.key === locale);
        const flagUrl = window.bablic.languages.flag(languageCode, FLAG_SIZE);
        this.setState({
            DropDownlist: arr,
            selectedOption: languageCode,
            selectedFlag: flagUrl,
            countryCode,
            languageCode,
            singleDropdown
        });
    }

    containerProps() {
        const {
            DropDownlist, selectedOption, isScriptAdded, isBablicLoaded, selectedFlag, countryCode,
            languageCode, singleDropdown
        } = this.state;

        const { bablic_status } = this.props;

        return {
            DropDownlist,
            selectedOption,
            isScriptAdded,
            isBablicLoaded,
            selectedFlag,
            countryCode,
            languageCode,
            singleDropdown,
            bablic_status,
            code: this.getCountryCode()
        };
    }

    getCountryCode() {
        const { countryCode } = getCountryAndLanguageCode();

        switch (countryCode) {
        case 'uk':
            return 'gb';
        case 'eu':
            return 'eu';
        case 'us':
            return 'us';
        case 'za':
            return 'za';
        default:
            return 'gb';
        }
    }

    render() {
        return (
            <BablicDropdownComponent
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(BablicDropdownContainer);
