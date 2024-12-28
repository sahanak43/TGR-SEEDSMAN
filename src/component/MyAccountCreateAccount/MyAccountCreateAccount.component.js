/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable max-len */
import ReCAPTCHA from 'react-google-recaptcha';

import Field from 'Component/Field';
import FIELD_TYPE from 'Component/Field/Field.config';
import Form from 'Component/Form';
import Loader from 'Component/Loader';
import { MyAccountCreateAccount as ParentMyAccountCreateAccount } from 'SourceComponent/MyAccountCreateAccount/MyAccountCreateAccount.component';
import history from 'Util/History';
import { validatePassword } from 'Util/Validator';
import { VALIDATION_INPUT_TYPE } from 'Util/Validator/Config';

import './MyAccountCreateAccount.override.style.scss';

/** @namespace Seedsman/Component/MyAccountCreateAccount/Component */
export class MyAccountCreateAccountComponent extends ParentMyAccountCreateAccount {
    renderSubscribeToNewsletter() {
        return (
            <Field
              type={ FIELD_TYPE.checkbox }
              label="Sign Up For Newsletter"
              attr={ {
                  id: 'is_subscribed',
                  name: 'is_subscribed',
                  placeholder: 'Your Tax/VAT Number'
              } }
              mix={ { block: 'MyAccountOverlay', elem: 'Checkbox' } }
            />
        );
    }

    renderRemoteShoppingAssistance() {
        return (
            <Field
              type={ FIELD_TYPE.checkbox }
              label="Remote Shopping Assistance"
              attr={ {
                  id: 'allow_remote_shopping_assistance',
                  name: 'allow_remote_shopping_assistance',
                  placeholder: ''
              } }
              mix={ { block: 'MyAccountOverlay', elem: 'Checkbox' } }
            />
        );
    }

    renderCreateAccountPersonalInfoFields() {
        const { location: { state: { firstName = '', lastName = '' } = {} } } = history;

        return (
            <fieldset block="MyAccountOverlay" elem="Legend">
                <Field
                  type={ FIELD_TYPE.text }
                  label="First Name"
                  attr={ {
                      id: 'firstname',
                      name: 'firstname',
                      defaultValue: firstName,
                      placeholder: 'First name',
                      autocomplete: 'given-name'
                  } }
                  validateOn={ ['onChange'] }
                  validationRule={ {
                      inputType: VALIDATION_INPUT_TYPE.alphaSpace,
                      isRequired: true
                  } }
                  addRequiredTag
                />
                <Field
                  type={ FIELD_TYPE.text }
                  label="Last Name"
                  attr={ {
                      id: 'lastname',
                      name: 'lastname',
                      defaultValue: lastName,
                      placeholder: 'Last name',
                      autocomplete: 'family-name'
                  } }
                  validateOn={ ['onChange'] }
                  validationRule={ {
                      inputType: VALIDATION_INPUT_TYPE.alphaSpace,
                      isRequired: true
                  } }
                  addRequiredTag
                />
                { this.renderVatNumberField() }
            </fieldset>
        );
    }

    renderCreateAccountSignUpInfoFields() {
        const { location: { state: { email = '', date_of_birth = '' } = {} } } = history;
        const {
            range, minimunPasswordCharacter, newsletterActive, siteKey
        } = this.props;

        return (
            <fieldset block="MyAccountOverlay" elem="Legend">
                <Field
                  type={ FIELD_TYPE.email }
                  label="Email Address"
                  attr={ {
                      id: 'email',
                      name: 'email',
                      defaultValue: email,
                      placeholder: 'Email Address',
                      autocomplete: 'email'
                  } }
                  validateOn={ ['onChange'] }
                  validationRule={ {
                      isRequired: true,
                      inputType: VALIDATION_INPUT_TYPE.email
                  } }
                  addRequiredTag
                />
                <Field
                  type={ FIELD_TYPE.date }
                  label="Date of Birth"
                  attr={ {
                      id: 'date_of_birth',
                      name: 'date_of_birth',
                      defaultValue: date_of_birth,
                      max: '9999-12-31'
                  } }
                  validateOn={ ['onChange'] }
                  validationRule={ {
                      isRequired: true,
                      inputType: VALIDATION_INPUT_TYPE.date
                  } }
                  addRequiredTag
                />
                <div block="MyAccountOverlay" elem="PasswordBlock">
                    <Field
                      type={ FIELD_TYPE.password }
                      label="Set Password"
                      attr={ {
                          id: 'password',
                          name: 'password',
                          placeholder: 'Set Password',
                          autocomplete: 'new-password'
                      } }
                      validateOn={ ['onChange'] }
                      validationRule={ {
                          isRequired: true,
                          inputType: VALIDATION_INPUT_TYPE.password,
                          match: (value) => {
                              const email = document.getElementById('email');
                              if (value && email.value === value) {
                                  return 'Passwords can\'t be the same as email!';
                              }

                              return validatePassword(value, range, minimunPasswordCharacter);
                          }
                      } }
                      addRequiredTag
                    />
                    <Field
                      type={ FIELD_TYPE.password }
                      label="Confirm password"
                      attr={ {
                          id: 'confirm_password',
                          name: 'confirm_password',
                          placeholder: 'Confirm password',
                          autocomplete: 'new-password'
                      } }
                      validateOn={ ['onChange'] }
                      validationRule={ {
                          isRequired: true,
                          inputType: VALIDATION_INPUT_TYPE.password,
                          match: (value) => {
                              const password = document.getElementById('password');
                              return value && password.value === value;
                          },
                          customErrorMessages: {
                              onMatchFail: 'Passwords do not match!'
                          }
                      } }
                      addRequiredTag
                    />
                { siteKey ? (
                <div block="MyAccountOverlay" elem="Captcha">
                    <ReCAPTCHA
                      sitekey={ siteKey }
                    />
                </div>
                )
                    : null }
                </div>
                <div block="MyAccountOverlay" elem="checkboxBlock">
                    { newsletterActive ? this.renderSubscribeToNewsletter() : null }
                    { this.renderRemoteShoppingAssistance() }
                </div>
            </fieldset>
        );
    }

    renderSubmitButton() {
        return (
            <div block="MyAccountOverlay" elem="Buttons">
                <button
                  block="Button"
                  type="submit"
                  mix={ { block: 'MyAccountOverlay', elem: 'SignUpButton' } }
                >
                    Create an Account
                </button>
            </div>
        );
    }

    renderCreateAccountForm() {
        const { onError, onSuccess, isLoading } = this.props;

        return (
            <Form
              key="create-account"
              onSubmit={ onSuccess }
              onError={ onError }
            >
                { this.renderCreateAccountPersonalInfoFields() }
                { this.renderCreateAccountSignUpInfoFields() }
                { this.renderSubmitButton() }
                <Loader isLoading={ isLoading } />
            </Form>
        );
    }

    render() {
        return (
            <>
                { this.renderCreateAccountForm() }
            </>
        );
    }
}

export default MyAccountCreateAccountComponent;
