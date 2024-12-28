/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
/* eslint-disable react/boolean-prop-naming */
/* eslint-disable no-magic-numbers */
/* eslint-disable no-useless-escape */
/* eslint-disable max-len */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import './CheckoutCreditCardForm.style';

/** @namespace Seedsman/Component/CheckoutCreditCardForm/Component */
export class CheckoutCreditCardFormComponent extends PureComponent {
    static propTypes = {
        handleInputChange: PropTypes.func.isRequired,
        handleRecaptcha: PropTypes.func.isRequired,
        creditCardNumber: PropTypes.string.isRequired,
        expireDate: PropTypes.func.isRequired,
        cvc: PropTypes.string.isRequired,
        isValid: PropTypes.bool.isRequired,
        isValidCardDetails: PropTypes.bool.isRequired,
        cardTypeImg: PropTypes.string.isRequired,
        isCardAvailable: PropTypes.bool.isRequired,
        cvvMaxLength: PropTypes.bool.isRequired,
        site_key: PropTypes.string,
        recaptchaKey_disable: PropTypes.string
    };

    static defaultProps = {
        site_key: ''
    };

    static defaultProps = {
        recaptchaKey_disable: ''
    };

    renderErrorMesaage() {
        const { isValid, expireDate } = this.props;

        if (!isValid && expireDate) {
            return (
                <p block="CheckoutCreditCardForm" elem="errorMsg">
                    Invalid Month/Year.
                </p>
            );
        }

        return null;
    }

    renderRequiredFieldMsg(value, isCardAvailable = true, field) {
        const { isValidCardDetails } = this.props;

        if (!isValidCardDetails && !value) {
            return (
                <p block="CheckoutCreditCardForm" elem="errorMsg">
                    *This field is required!.
                </p>
            );
        }

        if (!isCardAvailable && value) {
            return (
                <p block="CheckoutCreditCardForm" elem="errorMsg">
                    *Incorrect card number!.
                </p>
            );
        }

        if (field === 'cvc' && value) {
            if (!(value.length >= 3)) {
                return (
                    <p block="CheckoutCreditCardForm" elem="errorMsg">
                        *Incorrect cvc number!.
                    </p>
                );
            }
        }

        return null;
    }

    renderFieldLabel(fieldType, label) {
        return (
            <label htmlFor={ fieldType } block="Field" elem="Label">
                { label }
                { fieldType === 'cvc'
                    && (
                    <svg width="16" height="16" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.4759 14.1667C10.712 14.1667 10.9101 14.0867 11.0701 13.9267C11.2295 13.7672 11.3092 13.5695 11.3092 13.3334V9.97919C11.3092 9.74308 11.2295 9.54863 11.0701 9.39585C10.9101 9.24308 10.712 9.16669 10.4759 9.16669C10.2398 9.16669 10.042 9.24641 9.88258 9.40585C9.72258 9.56585 9.64258 9.76391 9.64258 10V13.3542C9.64258 13.5903 9.72258 13.7847 9.88258 13.9375C10.042 14.0903 10.2398 14.1667 10.4759 14.1667ZM10.4759 7.50002C10.712 7.50002 10.9101 7.42002 11.0701 7.26002C11.2295 7.10058 11.3092 6.9028 11.3092 6.66669C11.3092 6.43058 11.2295 6.23252 11.0701 6.07252C10.9101 5.91308 10.712 5.83335 10.4759 5.83335C10.2398 5.83335 10.042 5.91308 9.88258 6.07252C9.72258 6.23252 9.64258 6.43058 9.64258 6.66669C9.64258 6.9028 9.72258 7.10058 9.88258 7.26002C10.042 7.42002 10.2398 7.50002 10.4759 7.50002ZM10.4759 18.3334C9.32313 18.3334 8.2398 18.1145 7.22591 17.6767C6.21202 17.2395 5.33008 16.6459 4.58008 15.8959C3.83008 15.1459 3.23647 14.2639 2.79924 13.25C2.36147 12.2361 2.14258 11.1528 2.14258 10C2.14258 8.84724 2.36147 7.76391 2.79924 6.75002C3.23647 5.73613 3.83008 4.85419 4.58008 4.10419C5.33008 3.35419 6.21202 2.7603 7.22591 2.32252C8.2398 1.8853 9.32313 1.66669 10.4759 1.66669C11.6287 1.66669 12.712 1.8853 13.7259 2.32252C14.7398 2.7603 15.6217 3.35419 16.3717 4.10419C17.1217 4.85419 17.7154 5.73613 18.1526 6.75002C18.5904 7.76391 18.8092 8.84724 18.8092 10C18.8092 11.1528 18.5904 12.2361 18.1526 13.25C17.7154 14.2639 17.1217 15.1459 16.3717 15.8959C15.6217 16.6459 14.7398 17.2395 13.7259 17.6767C12.712 18.1145 11.6287 18.3334 10.4759 18.3334ZM10.4759 16.6667C12.3231 16.6667 13.8962 16.0175 15.1951 14.7192C16.4934 13.4203 17.1426 11.8472 17.1426 10C17.1426 8.1528 16.4934 6.57974 15.1951 5.28085C13.8962 3.98252 12.3231 3.33335 10.4759 3.33335C8.62869 3.33335 7.05591 3.98252 5.75758 5.28085C4.45869 6.57974 3.80924 8.1528 3.80924 10C3.80924 11.8472 4.45869 13.4203 5.75758 14.7192C7.05591 16.0175 8.62869 16.6667 10.4759 16.6667Z" fill="black" />
                    </svg>
                    ) }
            </label>
        );
    }

    renderReCAPTCHA(siteKey, recaptchaKeydisable) {
        const { handleRecaptcha } = this.props;
        if (recaptchaKeydisable === 'recaptcha') {
            return (
                <div block="CheckoutCreditCardForm" elem="Captcha">
                    <ReCAPTCHA
                      sitekey={ siteKey }
                      onChange={ handleRecaptcha }
                      name="recaptcha"
                    />
                </div>
            );
        }

        return null;
    }

    render() {
        const {
            handleInputChange,
            creditCardNumber,
            expireDate,
            cvc,
            isValidCardDetails,
            cardTypeImg,
            isValid,
            isCardAvailable,
            cvvMaxLength,
            site_key: siteKey,
            recaptchaKey_disable: recaptchaKeydisable
        } = this.props;

        return (
            <div block="CheckoutCreditCardForm">
                <div
                  block="CheckoutCreditCardForm"
                  elem={ !isValidCardDetails && !creditCardNumber
                      ? 'cardNumberField Field_error'
                      : 'cardNumberField' }
                >
                        <input
                          type="text"
                          name="creditCardNumber"
                          value={ creditCardNumber }
                          className="form-control"
                          required
                          placeholder="xxxx xxxx xxxx xxx"
                          onChange={ handleInputChange }
                        />
                        { this.renderFieldLabel(
                            'creditCardNumber',
                            'Card Number'
                        ) }
                    <span>{ cardTypeImg }</span>
                </div>
                { this.renderRequiredFieldMsg(creditCardNumber, isCardAvailable) }

                <div block="CheckoutCreditCardForm" elem="dateAndCvc">
                    <div className="col-6">
                        <div
                          block="CheckoutCreditCardForm"
                          elem={ (!isValidCardDetails && !expireDate)
                                || (!isValid && expireDate)
                              ? 'dateField Field_error'
                              : 'dateField' }
                        >
                            <input
                              type="text"
                              name="expireDate"
                              value={ expireDate }
                              className="form-control"
                              pattern="\d\d/\d\d"
                              maxLength="5"
                              required
                              placeholder="MM/YY"
                              onChange={ handleInputChange }
                            />
                            { this.renderFieldLabel('expireDate', 'Expiration date') }
                        </div>
                        { this.renderErrorMesaage() }
                        { this.renderRequiredFieldMsg(expireDate) }
                    </div>
                    <div className="col-6">
                        <div
                          block="CheckoutCreditCardForm"
                          elem={ !isValidCardDetails && !cvc
                              ? 'cvcField Field_error'
                              : 'cvcField' }
                        >
                            <input
                              type="text"
                              name="cvc"
                              value={ cvc }
                              className="form-control"
                              pattern="\d{3,4}"
                              required
                              placeholder={ cvvMaxLength === 4 ? '4321' : '321' }
                              maxLength={ cvvMaxLength }
                              onChange={ handleInputChange }
                            />
                            { this.renderFieldLabel('cvc', 'CVC') }
                        </div>
                        { this.renderRequiredFieldMsg(cvc, true, 'cvc') }
                    </div>
                </div>
                <div>
                { this.renderReCAPTCHA(siteKey, recaptchaKeydisable) }
                </div>
            </div>
        );
    }
}

export default CheckoutCreditCardFormComponent;
