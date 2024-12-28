/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
import ReCAPTCHA from 'react-google-recaptcha';

import Field from 'Component/Field';
import FIELD_TYPE from 'Component/Field/Field.config';
import Form from 'Component/Form';
import Loader from 'Component/Loader';
import { MyAccountSignIn as ParentMyAccountSignIn } from 'SourceComponent/MyAccountSignIn/MyAccountSignIn.component';
import { VALIDATION_INPUT_TYPE } from 'Util/Validator/Config';

import './MyAccountSignIn.override.style.scss';

/** @namespace Seedsman/Component/MyAccountSignIn/Component */
export class MyAccountSignInComponent extends ParentMyAccountSignIn {
    renderSignInForm() {
        const {
            onSignInSuccess,
            onFormError,
            handleForgotPassword,
            emailValue,
            isCheckout,
            handleEmailInput,
            isLoading,
            showPassword,
            handleShowPassword,
            siteKey
        } = this.props;

        return (
            <Form
              key="sign-in"
              onSubmit={ onSignInSuccess }
              onError={ onFormError }
            >
                <Field
                  label="Email"
                  type={ FIELD_TYPE.email }
                  attr={ {
                      id: 'email',
                      name: 'email',
                      placeholder: 'Your email address',
                      defaultValue: emailValue,
                      autocomplete: isCheckout ? 'off' : 'email'
                  } }
                  validateOn={ ['onChange'] }
                  validationRule={ {
                      isRequired: true,
                      inputType: VALIDATION_INPUT_TYPE.email
                  } }
                  events={ { onChange: handleEmailInput } }
                  addRequiredTag
                />
                <div block="Password-Block">
                    <Field
                      label="Password"
                      type={ showPassword ? FIELD_TYPE.text : FIELD_TYPE.password }
                      attr={ {
                          id: 'password',
                          name: 'password',
                          placeholder: 'Enter your password',
                          autocomplete: 'current-password'
                      } }
                      validateOn={ ['onChange'] }
                      validationRule={ {
                          isRequired: true,
                          inputType: VALIDATION_INPUT_TYPE.password
                      } }
                      addRequiredTag
                    />
                    <button
                      aria-label="Show"
                      type="button"
                      onClick={ handleShowPassword }
                    >
                        { showPassword ? 'Hide' : 'Show' }
                    </button>
                </div>
                <div block="MyAccountOverlay" elem="ForgotPasswordBtn">
                    <button
                      type="button"
                      block="Button"
                      mods={ { likeLink: true } }
                      mix={ { block: 'MyAccountOverlay', elem: 'ForgotPassword' } }
                      onClick={ handleForgotPassword }
                    >
                        Forgot password?
                    </button>
                </div>
                { siteKey ? (
                    <div block="MyAccountOverlay" elem="Captcha">
                        <ReCAPTCHA
                          sitekey={ siteKey }
                        />
                    </div>
                )
                    : null }
                <div block="MyAccountOverlay" elem="SignInButton">
                    <button block="Button">Login</button>
                </div>
                <Loader isLoading={ isLoading } />
            </Form>
        );
    }

    renderOrText() {
        const { availableSocials = [] } = this.props;

        if (!availableSocials.length) {
            return null;
        }

        // eslint-disable-next-line consistent-return
        return (
            <div block="MyAccountOverlay" elem="orText">OR</div>
        );
    }

    render() {
        return (
            <>
                { this.renderSignInForm() }
                { this.renderOrText() }
            </>
        );
    }
}

export default MyAccountSignInComponent;
