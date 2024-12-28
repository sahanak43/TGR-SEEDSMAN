/* eslint-disable fp/no-let */
/* eslint-disable max-len */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/boolean-prop-naming */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
/* eslint-disable max-lines */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import Select from 'react-select';

import CloseIcon from 'Component/CloseIcon';
import CountryPopupComponent from 'Component/CountryPopup';
import Field from 'Component/Field';
import FIELD_TYPE from 'Component/Field/Field.config';
import Form from 'Component/Form';
import Link from 'Component/Link';
import { CountriesType } from 'Type/Config.type';
import { isCrawler } from 'Util/Browser';
import { searchDropDownArray } from 'Util/SearchDropDown';

import './SelectCountryPopup.style';

/** @namespace Seedsman/Component/SelectCountryPopup/Component */
export class SelectCountryPopupComponent extends PureComponent {
    static propTypes = {
        isPopupVisible: PropTypes.bool.isRequired,
        fromFooter: PropTypes.bool.isRequired,
        handlePopup: PropTypes.func.isRequired,
        countries: CountriesType.isRequired,
        onSuccess: PropTypes.func.isRequired,
        onClickCheckedBox: PropTypes.func.isRequired,
        countryChecked: PropTypes.bool.isRequired,
        onClickAge18Btn: PropTypes.func.isRequired,
        isCustomer18Plus: PropTypes.bool.isRequired,
        handleCountryChange: PropTypes.func.isRequired,
        is_US_Country: PropTypes.func.isRequired,
        updatedCountries: CountriesType.isRequired,
        selectedCountryId: PropTypes.string.isRequired
    };

    renderNotePoints() {
        return (
            <div
              block="SelectCountry"
              elem="notePoints"
            >
                <p>
                    By entering this site, you agree to our <Link to="/terms-and-conditions">Terms of use</Link> and
                    acknowledge that you have read and understood our <Link to="/cookies-policy">Cookie Policy</Link> and <Link to="/privacy-policy">Privacy Policy</Link>
                </p>
            </div>
        );
    }

    renderCheckBox() {
        const { onClickCheckedBox, countryChecked } = this.props;

        return (
            <div block="SelectCountry" elem="checkBoxLink">
                <Field
                  type={ FIELD_TYPE.checkbox }
                  label={ (<p>I accept</p>) }
                  attr={ {
                      id: 'confirm_country',
                      name: 'confirm_country',
                      checked: countryChecked
                  } }
                  events={ {
                      onClick: onClickCheckedBox
                  } }
                  addRequiredTag
                  mix={ { block: 'SelectCountry', elem: 'CountryCheckBox' } }
                />
                <div block="StoreSwitcherV2" elem="checkBoxLinks">
                    <Link to="/cookies-policy">cookie policy</Link> and <Link to="/privacy-policy">privacy policy</Link>
                </div>
            </div>
        );
    }

    renderAgreeButton() {
        const { countryChecked, isCustomer18Plus, selectedCountryId } = this.props;

        return (
            <button
              block="Button"
              disabled={ !countryChecked || isCustomer18Plus || !selectedCountryId }
            >
                Agree & Enter
            </button>
        );
    }

    renderUS_AgeSelection() {
        const { onClickAge18Btn, isCustomer18Plus } = this.props;

        return (
            <div block="SelectCountry" elem={ !isCustomer18Plus ? 'usAgeSelection' : 'usAgeSelection error' }>
                { !isCustomer18Plus
                    ? <h4>Yes - I am 21+ years old:</h4>
                    : <h4>Sorry, you're not old enough</h4> }
                <p>
                    You must be 21+ years old and over to purchase from our website. Please see <Link to="/terms-and-conditions">Terms & Conditions.</Link>
                </p>
                { !isCustomer18Plus
                    ? (
                        <div
                          className="not18Btn"
                          onClick={ onClickAge18Btn }
                        >
                            No, I'm not 21+
                        </div>
                    )
                    : (
                        <div
                          className="not18Btn"
                          onClick={ onClickAge18Btn }
                        >
                            Yes, I'm 21+
                        </div>
                    ) }
            </div>
        );
    }

    renderAgeSelection() {
        const { onClickAge18Btn, isCustomer18Plus } = this.props;

        return (
            <div block="SelectCountry" elem={ !isCustomer18Plus ? 'ageSelection' : 'ageSelection error' }>
                { !isCustomer18Plus
                    ? <h4>Yes - I am 18+ years old:</h4>
                    : <h4>Sorry, you're not old enough</h4> }
                <p>
                    You must be 18+ years old and over to purchase from our website. Please see <Link to="/terms-and-conditions">Terms & Conditions.</Link>
                </p>
                { !isCustomer18Plus
                    ? (
                        <div
                          className="not18Btn"
                          onClick={ onClickAge18Btn }
                        >
                            No, I'm not 18+
                        </div>
                    )
                    : (
                        <div
                          className="not18Btn"
                          onClick={ onClickAge18Btn }
                        >
                            Yes, I'm 18+
                        </div>
                    ) }
            </div>
        );
    }

    renderCountryListDropDown() {
        const {
            countries,
            updatedCountries,
            handleCountryChange
        } = this.props;

        const newArr = searchDropDownArray(updatedCountries?.length ? updatedCountries : countries);

        return (
            <div block="SelectCountry" elem="SearchDropDown">
                <Select
                  options={ newArr }
                  placeholder="Select country..."
                  onChange={ handleCountryChange }
                />
            </div>
        );
    }

    renderContent() {
        const { onSuccess, is_US_Country } = this.props;

        return (
            <>
                <div block="SelectCountry" elem="HeaderContent">
                    <h4>Select Your Location: </h4>
                    <p>
                        Please select your delivery country to shop the products and offers available to you.
                    </p>
                </div>
                <Form
                  key="select-country"
                  onSubmit={ onSuccess }
                >
                    { this.renderCountryListDropDown() }
                    { is_US_Country ? this.renderUS_AgeSelection() : this.renderAgeSelection() }
                    { this.renderCheckBox() }
                    { this.renderAgreeButton() }
                </Form>
                { this.renderNotePoints() }
            </>
        );
    }

    renderCloseButton() {
        const { fromFooter, handlePopup } = this.props;

        if (!fromFooter) {
            return null;
        }

        return (
            <button
              block="Popup"
              elem="CloseBtn"
              aria-label="Close"
              onClick={ handlePopup }
            >
                <CloseIcon />
            </button>
        );
    }

    render() {
        const { isPopupVisible } = this.props;

        if (isCrawler()) {
            return null;
        }

        return (
            <CountryPopupComponent isPopupVisible={ isPopupVisible }>
                <div className="popup">
                    { this.renderCloseButton() }
                    <div block="SelectCountry" elem="selectCountryLogo">
                        <svg width="142" height="42" viewBox="0 0 142 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_218_924)">
                            <path d="M84.4184 31.3625C81.5867 31.4912 79.3894 33.8902 79.5187 36.7105C79.6479 39.5308 82.0567 41.7192 84.8884 41.5904C87.6379 41.4617 89.7999 39.2031 89.7999 36.4648C89.7412 33.5743 87.3324 31.2923 84.4419 31.3508C84.4184 31.3625 84.4184 31.3625 84.4184 31.3625ZM69.7427 31.3625C66.9109 31.4912 64.7137 33.8902 64.8429 36.7105C64.9722 39.5308 67.3809 41.7192 70.2127 41.5904C72.9622 41.4617 75.1242 39.2031 75.1242 36.4648C75.0654 33.5743 72.6567 31.2923 69.7662 31.3508C69.7544 31.3625 69.7427 31.3625 69.7427 31.3625ZM60.3897 36.4063C60.5307 39.3553 58.2277 41.8596 55.2667 42C52.3057 42.1404 49.7912 39.8468 49.6502 36.8978C49.5092 33.9487 51.8122 31.4444 54.7732 31.304C54.8554 31.304 54.9377 31.304 55.0199 31.304C57.9222 31.2338 60.3192 33.5275 60.3897 36.4063Z" fill="white" />
                            <path d="M2.615 12.5683C3.743 14.6747 5.952 15.9737 8.349 15.9386C10.4993 15.9386 11.968 15.096 11.968 13.5162C11.968 12.1938 10.9458 11.7491 9.55925 11.4097L5.8815 10.5672C3.33175 9.98204 1.33425 8.57775 1.33425 5.53512C1.346 2.24674 4.0015 -0.000128284 7.832 -0.000128284C10.605 -0.0820452 13.2487 1.22863 14.8468 3.48719L12.626 5.81598C11.733 4.0138 9.853 2.87867 7.832 2.92548C6.01075 2.93718 4.73 3.80316 4.73 5.26596C4.73 6.56493 5.717 6.97452 7.06825 7.29048L10.4405 8.15646C13.5778 8.88201 15.399 10.3214 15.399 13.3874C15.399 16.8748 12.2852 18.911 8.38425 18.911C5.30575 19.0631 2.333 17.6705 0.5 15.2013L2.615 12.5683Z" fill="white" />
                            <path d="M32.5071 15.2131C31.5436 17.6355 29.3111 18.876 26.1268 18.876C22.0143 18.876 19.1121 16.243 19.1121 12.346C19.0181 8.63638 21.9556 5.54694 25.6686 5.45332C25.8213 5.45332 25.9741 5.45332 26.1151 5.45332C29.4521 5.20757 32.3661 7.71189 32.6011 11.0471C32.6128 11.2811 32.6246 11.5152 32.6128 11.7492V12.6854H22.5431C22.4726 14.6163 23.9766 16.2313 25.9153 16.3132C26.0328 16.3132 26.1503 16.3132 26.2678 16.3132C27.7601 16.4653 29.1701 15.611 29.7106 14.2184L32.5071 15.2131ZM29.2288 10.8832C29.2053 9.2332 27.8423 7.91083 26.1856 7.93424C26.1503 7.93424 26.1033 7.93424 26.0681 7.93424C24.3526 7.92253 22.8956 9.1981 22.7076 10.8832H29.2288Z" fill="white" />
                            <path d="M49.8382 15.2132C48.8747 17.6356 46.6422 18.876 43.4579 18.876C39.3454 18.876 36.4432 16.243 36.4432 12.3461C36.3374 8.6481 39.2749 5.55866 42.9997 5.46504C43.1524 5.46504 43.3052 5.46504 43.4462 5.46504C46.7832 5.21929 49.6972 7.72361 49.9322 11.0588C49.9439 11.2928 49.9557 11.5269 49.9439 11.7609V12.6971H39.8742C39.8037 14.628 41.3077 16.243 43.2464 16.3249C43.3639 16.3249 43.4814 16.3249 43.5989 16.3249C45.0912 16.477 46.5012 15.611 47.0417 14.2185L49.8382 15.2132ZM46.5599 10.8833C46.5364 9.23322 45.1734 7.91085 43.5167 7.93425C43.4814 7.93425 43.4344 7.93425 43.3992 7.93425C41.6602 7.87574 40.1797 9.16301 39.9917 10.8833H46.5599Z" fill="white" />
                            <path d="M63.8442 16.0206C63.1392 17.8345 61.3532 18.9813 59.4027 18.8877C55.6427 18.8877 53.4102 15.9153 53.4102 12.1939C53.4102 8.47256 55.6427 5.46503 59.4027 5.46503C61.3414 5.37141 63.1392 6.51825 63.8442 8.32043V0.351074H67.3457V18.5366H63.8442V16.0206ZM63.9264 11.9014C64.1144 9.98217 62.7162 8.27362 60.7892 8.07467C60.6834 8.06297 60.5777 8.06297 60.4837 8.06297C58.2512 8.06297 56.9822 9.75982 56.9822 12.1939C56.9822 14.628 58.2512 16.3015 60.4837 16.3015C62.4224 16.2781 63.9734 14.6982 63.9499 12.7673C63.9499 12.662 63.9382 12.5567 63.9382 12.4631L63.9264 11.9014Z" fill="white" />
                            <path d="M73.2091 14.3004C74.3606 15.7515 76.1348 16.5707 77.9913 16.4887C79.7538 16.4887 80.9171 16.0557 80.9171 15.1079C80.9171 14.16 80.2826 13.9493 79.1311 13.7855L76.0173 13.2355C73.4911 12.8142 71.7286 11.6556 71.7286 9.43217C71.7286 7.20871 74.0668 5.47675 77.4038 5.47675C79.7773 5.28951 82.1038 6.23741 83.6666 8.03958L81.5163 9.63111C80.5058 8.42577 78.9783 7.78213 77.4038 7.87575C76.0173 7.87575 74.9716 8.33215 74.9716 9.16302C74.9716 9.83006 75.4651 10.2045 76.4756 10.4269L80.2943 11.1524C82.4681 11.562 84.1836 12.6854 84.1836 14.7568C84.1836 17.3079 81.6573 18.8877 77.9796 18.8877C75.1596 18.8877 72.2456 17.8696 70.9648 16.0206L73.2091 14.3004Z" fill="white" />
                            <path d="M91.0574 18.5367H88.0142V5.82782H91.0574V8.39065C91.2572 6.78742 92.5967 5.54696 94.2299 5.47675C95.7692 5.51185 97.0029 6.74061 97.0382 8.27362C97.3554 6.7055 98.7067 5.55866 100.316 5.47675C102.173 5.47675 103.219 7.05657 103.219 9.25663V18.5718H100.175V10.4269C100.175 9.18641 99.9404 8.09809 98.8124 8.09809C97.6844 8.09809 97.1439 9.6194 97.1439 11.3397V18.5249H94.0889V10.3684C94.0889 9.1279 93.8539 8.03958 92.7377 8.03958C91.6214 8.03958 91.0809 9.56089 91.0809 11.2811V18.5367H91.0574Z" fill="white" />
                            <path d="M107.108 9.15129C108.036 6.98634 110.151 5.46503 113.453 5.46503C116.755 5.46503 118.646 6.69378 118.646 9.73641V15.2834C118.576 15.8568 118.975 16.3717 119.551 16.4419C119.622 16.4536 119.68 16.4536 119.751 16.4536C120.291 16.4302 120.82 16.2196 121.231 15.8685L121.466 18.0685C120.691 18.6068 119.774 18.8994 118.823 18.9111C117.178 19.0047 115.721 17.8579 115.439 16.243C114.534 17.9515 112.701 18.9579 110.762 18.8175C108.318 18.8175 106.614 17.4717 106.614 15.1897C106.614 12.9078 108.635 11.9716 111.291 11.3162L115.321 10.3332V9.63109C115.321 8.64809 114.675 8.01616 113.23 8.01616C111.831 7.88743 110.527 8.74171 110.092 10.0758L107.108 9.15129ZM115.38 12.0769L112.419 12.8141C110.997 13.1886 110.081 13.6918 110.081 14.8036C110.057 15.6812 110.762 16.4185 111.643 16.4302C111.714 16.4302 111.796 16.4302 111.867 16.4185C113.676 16.5004 115.239 15.1429 115.368 13.3291V12.0769H115.38Z" fill="white" />
                            <path d="M128.422 18.5366H124.921V5.82782H128.422V8.1566C129.245 6.43634 131.007 5.37142 132.911 5.41823C136.412 5.41823 137.787 7.74701 137.787 10.5556V18.4898H134.286V11.2928C134.286 9.32684 133.322 8.1917 131.56 8.1917C129.797 8.1917 128.399 9.72472 128.399 11.9482L128.422 18.5366Z" fill="white" />
                            <path d="M138.891 7.33742V5.94483H138.421V5.68738H139.585V5.89802H139.138V7.31402L138.891 7.33742Z" fill="white" />
                            <path d="M140.149 5.68738H140.372L140.842 6.72889L141.3 5.68738H141.512V7.31402H141.3V6.2842L140.936 7.07997H140.795L140.431 6.2842V7.31402H140.219L140.149 5.68738Z" fill="white" />
                            </g>
                            <defs>
                            <clipPath id="clip0_218_924">
                            <rect width="141" height="42" fill="white" transform="translate(0.5)" />
                            </clipPath>
                            </defs>
                        </svg>
                    </div>
                    <div block="SelectCountry" elem="Wrapper">
                        { this.renderContent() }
                    </div>
                </div>
            </CountryPopupComponent>
        );
    }
}

export default SelectCountryPopupComponent;
