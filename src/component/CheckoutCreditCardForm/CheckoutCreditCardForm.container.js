/* eslint-disable no-unused-expressions */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { setCreditCardDetails } from 'Store/Checkout/Checkout.action';
import {
    formatCreditCardNumber,
    formatCVC,
    formatExpirationDate,
    getValidation
} from 'Util/CreditCardValidation';

import CheckoutCreditCardForm from './CheckoutCreditCardForm.component';
import {
    CREDIT_CARD_NUMBER,
    CVC,
    EXPIRE_DATE,
    RECAPTCHA
} from './CheckoutCreditCardForm.config';

import './CheckoutCreditCardForm.style';

/** @namespace Seedsman/Component/CheckoutCreditCardForm/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    site_key: state.ConfigReducer?.recaptcha_frontend_type_recaptcha_public_key,
    recaptchaKey_disable: state.ConfigReducer?.recaptcha_frontend_type_for_place_order

});

/** @namespace Seedsman/Component/CheckoutCreditCardForm/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    setCreditCardDetails: (key, value) => dispatch(setCreditCardDetails(key, value))
});

/** @namespace Seedsman/Component/CheckoutCreditCardForm/Container */
export class CheckoutCreditCardFormContainer extends PureComponent {
    static propTypes = {
        handleInputChange: PropTypes.func.isRequired,
        setCreditCardDetails: PropTypes.func.isRequired,
        isValidCardDetails: PropTypes.bool.isRequired,
        code: PropTypes.string.isRequired,
        site_key: PropTypes.string,
        recaptchaKey_disable: PropTypes.string
    };

    static defaultProps = {
        site_key: ''
    };

    static defaultProps = {
        recaptchaKey_disable: ''
    };

    state = {
        creditCardNumber: null,
        cardTypeImg: null,
        expireDate: null,
        cvc: null,
        isValid: null,
        isCardAvailable: null,
        cvvMaxLength: 3,
        recaptchaKey: ''
    };

    containerFunctions = {
        handleInputChange: this.handleInputChange.bind(this),
        handleRecaptcha: this.handleRecaptcha.bind(this)
    };

    handleInputChange(e) {
        const { setCreditCardDetails, code } = this.props;
        const { name, value } = e.target;

        switch (name) {
        case CREDIT_CARD_NUMBER:
            this.setState({
                creditCardNumber: value,
                cardTypeImg: formatCreditCardNumber(value, code)?.cardType,
                isCardAvailable: formatCreditCardNumber(value, code)?.isCardAvailable,
                cvvMaxLength: formatCreditCardNumber(value, code)?.maxLength
            });
            formatCreditCardNumber(value, code)?.isCardAvailable
                ? setCreditCardDetails(name, formatCreditCardNumber(value)?.number)
                : null;
            break;

        case EXPIRE_DATE:
            this.setState({
                expireDate: formatExpirationDate(value),
                isValid: getValidation(value)
            });
            setCreditCardDetails(name, formatExpirationDate(value));
            break;

        case CVC:
            this.setState({
                cvc: formatCVC(value)
            });
            setCreditCardDetails(name, formatCVC(value));
            break;

        case RECAPTCHA:
            this.setState({
                recaptchaKey: e
            });
            setCreditCardDetails(name, e);
            break;

        default:
            break;
        }
    }

    handleRecaptcha(e) {
        const { setCreditCardDetails } = this.props;
        this.setState({
            recaptchaKey: e
        });
        setCreditCardDetails('recaptcha', e);
    }

    containerProps() {
        const {
            isValidCardDetails, code, site_key, recaptchaKey_disable
        } = this.props;
        const {
            creditCardNumber,
            expireDate,
            cvc,
            isValid,
            cardTypeImg,
            isCardAvailable,
            cvvMaxLength,
            recaptchaKey

        } = this.state;

        return {
            creditCardNumber,
            expireDate,
            cvc,
            isValid,
            isValidCardDetails,
            cardTypeImg,
            isCardAvailable,
            code,
            cvvMaxLength,
            site_key,
            recaptchaKey,
            recaptchaKey_disable
        };
    }

    render() {
        return (
            <CheckoutCreditCardForm
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutCreditCardFormContainer);
