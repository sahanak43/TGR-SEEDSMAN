/* eslint-disable no-nested-ternary */
/* eslint-disable max-lines */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
/* eslint-disable max-len */
import Field from 'Component/Field';
import FieldGroup from 'Component/FieldGroup';
import Link from 'Component/Link';
import { ACCOUNT_URL } from 'Route/MyAccount/MyAccount.config';
import { MyAccountCustomerForm as ParentMyAccountCustomerForm } from 'SourceComponent/MyAccountCustomerForm/MyAccountCustomerForm.component';

import { customerEmailAndPasswordFields, customerInformationFields, remoteShoppingAssistanceField } from './MyAccountCustomerForm.form';

/** @namespace Seedsman/Component/MyAccountCustomerForm/Component */
export class MyAccountCustomerFormComponent extends ParentMyAccountCustomerForm {
    renderEmailAndPasswordFields() {
        const { showEmailChangeField, showPasswordChangeField } = this.props;

        if (!showEmailChangeField && !showPasswordChangeField) {
            return null;
        }

        return <>{ this.emailAndPasswordFieldMap.map(this.renderSection) }</>;
    }

    get customerInformationFieldMap() {
        const {
            showTaxVatNumber,
            handleChangeEmailCheckbox,
            handleChangePasswordCheckbox,
            showEmailChangeField,
            showPasswordChangeField,
            vatNumberRequired,
            customer: {
                firstname = '',
                lastname = '',
                date_of_birth = '',
                email = ''
            }
        } = this.props;

        return customerInformationFields({
            showTaxVatNumber,
            firstname,
            lastname,
            date_of_birth,
            email,
            handleChangePasswordCheckbox,
            handleChangeEmailCheckbox,
            showEmailChangeField,
            showPasswordChangeField,
            vatNumberRequired
        });
    }

    get emailAndPasswordFieldMap() {
        const {
            minimunPasswordCharacter,
            showEmailChangeField,
            showPasswordChangeField,
            handlePasswordInput,
            handleEmailInput,
            currentPassword,
            email,
            range,
            showPassword,
            handleShowPassword
        } = this.props;

        return customerEmailAndPasswordFields({
            minimunPasswordCharacter,
            showEmailChangeField,
            showPasswordChangeField,
            handlePasswordInput,
            handleEmailInput,
            currentPassword,
            email,
            range,
            showPassword,
            handleShowPassword
        });
    }

    get remoteShoppingAssistanceFIeldMap() {
        const { handleChangeRemoteCheckbox } = this.props;
        return remoteShoppingAssistanceField({
            handleChangeRemoteCheckbox
        });
    }

    renderSection(section) {
        const {
            fields,
            attr: {
                name = ''
            } = {},
            name: sectionName
        } = section;
        // const { handlevalidation } = this.state;

        // If contains attr fields then outputs data as fields
        if (Array.isArray(fields)) {
            return (
               // eslint-disable-next-line @scandipwa/scandipwa-guidelines/jsx-no-props-destruction
               <FieldGroup { ...section } key={ name || sectionName }>
                   { fields.map(this.renderSection.bind(this)) }
               </FieldGroup>
            );
        }

        // eslint-disable-next-line @scandipwa/scandipwa-guidelines/jsx-no-props-destruction
        return <Field { ...section } key={ name } />;
    }

    renderActions() {
        const { showEmailChangeField, showPasswordChangeField } = this.props;

        return (
            <div block="MyAccountInformation" elem="Actions">
                <Link
                  to={ ACCOUNT_URL }
                  className="Cancel"
                >
                    Cancel
                </Link>
                <button
                  type="submit"
                  block="Button"
                  mix={ { block: 'MyAccountInformation', elem: 'Submit' } }
                >
                { !showEmailChangeField && showPasswordChangeField
                    ? 'Save Password'
                    : showEmailChangeField && !showPasswordChangeField
                        ? 'Save Email'
                        : 'Save' }
                </button>
            </div>
        );
    }

    getShowandHideButton() {
        const { handleShowPassword, showPassword } = this.props;
        return (
            <button
              aria-label="Show"
              type="button"
              block="ShowHide"
              onClick={ handleShowPassword }
            >
            { showPassword ? 'Hide' : 'Show' }
            </button>
        );
    }

    renderFormBody() {
        return (
            <div block="FieldForm" elem="Body">
                <div block="FieldForm" elem="Fields">
                    <div block="FieldForm" elem="Section Form_Grid">
                        { this.customerInformationFieldMap.map(
                            this.renderSection
                        ) }
                    </div>
                    <div
                      block="FieldForm"
                      elem="Section"
                      mix={ {
                          block: 'FieldForm',
                          elem: 'SectionWithSpace Form_Grid'
                      } }
                    >
                        { this.renderEmailAndPasswordFields() }
                    </div>
                    <div block="FieldForm" elem="Remote">
                        { this.remoteShoppingAssistanceFIeldMap.map(this.renderSection) }
                    </div>
                </div>
                { this.renderActions() }
            </div>
        );
    }
}

export default MyAccountCustomerFormComponent;
