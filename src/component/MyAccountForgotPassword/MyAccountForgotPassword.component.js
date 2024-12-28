/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable max-len */
import ReCAPTCHA from 'react-google-recaptcha';

import Field from 'Component/Field';
import FIELD_TYPE from 'Component/Field/Field.config';
import Form from 'Component/Form';
import Loader from 'Component/Loader';
import { MyAccountForgotPassword as ParentMyAccountForgotPassword } from 'SourceComponent/MyAccountForgotPassword/MyAccountForgotPassword.component';
import { VALIDATION_INPUT_TYPE } from 'Util/Validator/Config';

/** @namespace Seedsman/Component/MyAccountForgotPassword/Component */
export class MyAccountForgotPasswordComponent extends ParentMyAccountForgotPassword {
    renderForgotPasswordForm() {
        const { onForgotPasswordSuccess, onFormError, siteKey } = this.props;

        return (
            <Form
              key="forgot-password"
              onSubmit={ onForgotPasswordSuccess }
              onError={ onFormError }
            >
                <Field
                  type={ FIELD_TYPE.email }
                  label="Email"
                  attr={ {
                      id: 'email',
                      name: 'email',
                      class: 'ForgotPassword-Input_type_email',
                      placeholder: 'Your email address',
                      autocomplete: 'email'
                  } }
                  validateOn={ ['onChange'] }
                  validationRule={ {
                      isRequired: true,
                      inputType: VALIDATION_INPUT_TYPE.email
                  } }
                  addRequiredTag
                />
                { siteKey ? (
                    <div block="MyAccountOverlay" elem="Captcha">
                        <ReCAPTCHA
                          sitekey={ siteKey }
                        />
                    </div>
                ) : null }
                <div block="MyAccountOverlay" elem="Buttons">
                    <button
                      block="Button"
                      type="submit"
                      mix={ { block: 'MyAccountOverlay', elem: 'ResetPassword' } }
                    >
                        Reset Password
                    </button>
                </div>
            </Form>
        );
    }

    renderForgotPasswordTitle() {
        return (
            <div block="MyAccountOverlay" elem="Title">
                <p>{ 'Please type in your email address registered with Us \n and we’ll send you a link to reset your password.' }</p>
            </div>
        );
    }

    renderAdditionalField() {
        const { state, handleSignIn } = this.props;

        return (
            <article block="MyAccountOverlay" elem="Additional" mods={ { state } }>
                <section aria-labelledby="forgot-password-labe">
                    <button
                      block="Button"
                      mods={ { likeLink: true } }
                      mix={ { block: 'MyAccountOverlay', elem: 'SignInButton' } }
                      onClick={ handleSignIn }
                    >
                        Return To Login
                    </button>
                </section>
            </article>
        );
    }

    render() {
        const { isLoading } = this.props;

        return (
            <>
                { this.renderForgotPasswordTitle() }
                { this.renderForgotPasswordForm() }
                { this.renderAdditionalField() }
                <Loader isLoading={ isLoading } />
            </>
        );
    }
}

export default MyAccountForgotPasswordComponent;
