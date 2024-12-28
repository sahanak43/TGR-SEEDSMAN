/* eslint-disable max-len */
/* eslint-disable react/boolean-prop-naming */
/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    SHOW_VAT_NUMBER_OPTIONAL,
    SHOW_VAT_NUMBER_REQUIRED
} from 'Component/MyAccountCreateAccount/MyAccountCreateAccount.config';
import { MyAccountCustomerFormContainer as SourceMyAccountCustomerForm } from 'SourceComponent/MyAccountCustomerForm/MyAccountCustomerForm.container';
import { CustomerType } from 'Type/Account.type';

import MyAccountCustomerForm from './MyAccountCustomerForm.component';

/** @namespace Seedsman/Component/MyAccountCustomerForm/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    showTaxVatNumber: state.ConfigReducer.show_tax_vat_number,
    minimunPasswordLength: state.ConfigReducer.minimun_password_length,
    minimunPasswordCharacter: state.ConfigReducer.required_character_classes_number
});

/** @namespace Seedsman/Component/MyAccountCustomerForm/Container/mapDispatchToProps */
export const mapDispatchToProps = () => ({});

/** @namespace Seedsman/Component/MyAccountCustomerForm/Container */
export class MyAccountCustomerFormContainer extends SourceMyAccountCustomerForm {
    static propTypes = {
        customer: CustomerType.isRequired,
        onSave: PropTypes.func.isRequired,
        showTaxVatNumber: PropTypes.string.isRequired,
        showEmailChangeField: PropTypes.bool.isRequired,
        showPasswordChangeField: PropTypes.bool.isRequired,
        handleChangeEmailCheckbox: PropTypes.func.isRequired,
        handleChangePasswordCheckbox: PropTypes.func.isRequired,
        minimunPasswordLength: PropTypes.number.isRequired,
        minimunPasswordCharacter: PropTypes.string.isRequired
    };

    containerFunctions = {
        handleEmailInput: this.handleEmailInput.bind(this),
        handlePasswordInput: this.handlePasswordInput.bind(this),
        handleShowPassword: this.handleShowPassword.bind(this)
    };

    state = {
        email: null,
        currentPassword: '',
        isEmailEdit: false,
        showPassword: false
    };

    containerProps() {
        const {
            customer: { email: currentCustomerEmail },
            customer,
            onSave,
            showEmailChangeField,
            showPasswordChangeField,
            handleChangeEmailCheckbox,
            handleChangePasswordCheckbox,
            minimunPasswordLength,
            minimunPasswordCharacter
        } = this.props;
        const {
            email, currentPassword, isEmailEdit, showPassword
        } = this.state;

        const range = { min: minimunPasswordLength, max: 64 };

        return {
            customer,
            onSave,
            showTaxVatNumber: this.getIsShowVatNumber(),
            vatNumberRequired: this.getVatNumberRequired(),
            showEmailChangeField,
            showPasswordChangeField,
            handleChangeEmailCheckbox,
            handleChangePasswordCheckbox,
            currentPassword,
            range,
            minimunPasswordCharacter,
            showPassword,
            email: !isEmailEdit ? currentCustomerEmail : email
        };
    }

    handleShowPassword() {
        this.setState({
            showPassword: !this.state.showPassword
        });
    }

    getIsShowVatNumber() {
        const { showTaxVatNumber } = this.props;

        return showTaxVatNumber === SHOW_VAT_NUMBER_REQUIRED
            || showTaxVatNumber === SHOW_VAT_NUMBER_OPTIONAL;
    }

    getVatNumberRequired() {
        const { showTaxVatNumber } = this.props;

        return showTaxVatNumber === SHOW_VAT_NUMBER_REQUIRED;
    }

    handleEmailInput(emailInput) {
        this.setState({ email: emailInput.target.value, isEmailEdit: true });
    }

    handlePasswordInput(currentPasswordInput) {
        this.setState({ currentPassword: currentPasswordInput.target.value });
    }

    render() {
        return (
            <MyAccountCustomerForm
              { ...this.containerProps() }
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountCustomerFormContainer);
