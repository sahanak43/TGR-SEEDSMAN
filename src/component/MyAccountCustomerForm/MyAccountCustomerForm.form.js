/* eslint-disable max-lines */
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

import FIELD_TYPE from 'Component/Field/Field.config';
import { validatePassword } from 'Util/Validator';
import { VALIDATION_INPUT_TYPE } from 'Util/Validator/Config';

/**
 * Returns customer forms fields
 * @param props
 * @returns {[{addRequiredTag: boolean, validateOn: string[], validationRule: {isRequired: boolean}, label: *, type: string, attr: {defaultValue, name: string, placeholder: *}}, {addRequiredTag: boolean, validateOn: string[], validationRule: {isRequired: boolean}, label: *, type: string, attr: {defaultValue, name: string, placeholder: *}}, ...[{addRequiredTag: boolean, validateOn: string[], validationRule: {isRequired: boolean}, label: *, type: string, attr: {defaultValue, name: string, placeholder: *}}]|*[]]}
 * @namespace Seedsman/Component/MyAccountCustomerForm/Form/customerInformationFields */
export const customerInformationFields = (props) => {
    const {
        firstname,
        lastname,
        date_of_birth,
        handleChangeEmailCheckbox,
        handleChangePasswordCheckbox,
        showEmailChangeField,
        showPasswordChangeField
    } = props;

    return [
        {
            type: FIELD_TYPE.text,
            label: 'First Name',
            attr: {
                name: 'firstname',
                defaultValue: firstname,
                placeholder: 'Your first name'
            },
            addRequiredTag: true,
            validateOn: ['onChange'],
            validationRule: {
                isRequired: true
            }
        },
        {
            type: FIELD_TYPE.text,
            label: 'Last Name',
            attr: {
                name: 'lastname',
                defaultValue: lastname,
                placeholder: 'Your last name'
            },
            addRequiredTag: true,
            validateOn: ['onChange'],
            validationRule: {
                isRequired: true
            }
        },
        {
            type: FIELD_TYPE.date,
            label: 'Date of Birth',
            attr: {
                id: 'date_of_birth',
                name: 'date_of_birth',
                defaultValue: date_of_birth,
                placeholder: 'Date of Birth'
            },
            addRequiredTag: false,
            validateOn: ['onChange'],
            validationRule: {
                isRequired: false,
                inputType: VALIDATION_INPUT_TYPE.date
            }
        },
        {
            type: FIELD_TYPE.radio,
            attr: {
                name: 'showChangeField',
                defaultChecked: showEmailChangeField
            },
            events: {
                onChange: handleChangeEmailCheckbox
            },
            label: 'Change Email'
        },
        {
            type: FIELD_TYPE.radio,
            attr: {
                name: 'showChangeField',
                defaultChecked: showPasswordChangeField
            },
            events: {
                onChange: handleChangePasswordCheckbox
            },
            label: 'Change Password'
        }
    ];
};

/**
 * Returns customer email and password forms fields
 * @param props
 * @returns {[{addRequiredTag: boolean, validateOn: string[], validationRule: {isRequired: boolean}, label: *, type: string, attr: {defaultValue, name: string, placeholder: *}}, {addRequiredTag: boolean, validateOn: string[], validationRule: {isRequired: boolean}, label: *, type: string, attr: {defaultValue, name: string, placeholder: *}}, ...[{addRequiredTag: boolean, validateOn: string[], validationRule: {isRequired: boolean}, label: *, type: string, attr: {defaultValue, name: string, placeholder: *}}]|*[]]}
 * @namespace Seedsman/Component/MyAccountCustomerForm/Form/customerEmailAndPasswordFields */
export const customerEmailAndPasswordFields = (props) => {
    const {
        minimunPasswordCharacter,
        showEmailChangeField,
        showPasswordChangeField,
        handleEmailInput,
        handlePasswordInput,
        currentPassword,
        email,
        range,
        showPassword,
        handleShowPassword
    } = props;

    const Type = showPassword ? FIELD_TYPE.text : FIELD_TYPE.password;

    return [
        ...(showEmailChangeField ? [
            {
                type: FIELD_TYPE.email,
                label: 'Email',
                attr: {
                    name: 'email',
                    value: email,
                    placeholder: 'Your new email',
                    'aria-label': 'Current password'
                },
                events: {
                    onChange: handleEmailInput
                },
                addRequiredTag: true,
                validateOn: ['onChange'],
                validationRule: {
                    inputType: VALIDATION_INPUT_TYPE.email,
                    isRequired: true
                }
            }
        ] : []),
        ...(showPasswordChangeField || showEmailChangeField ? [
            {
                label: 'Current password',
                type: FIELD_TYPE.password,
                attr: {
                    id: 'currentPassword',
                    name: 'password',
                    placeholder: 'Your current password',
                    'aria-label': 'Current password',
                    value: currentPassword
                },
                events: {
                    onChange: handlePasswordInput
                },
                addRequiredTag: true,
                validateOn: ['onChange'],
                validationRule: {
                    inputType: VALIDATION_INPUT_TYPE.password,
                    isRequired: true
                }
            }
        ] : []),
        ...(showPasswordChangeField ? [
            {
                label: 'New password',
                type: FIELD_TYPE.password,
                attr: {
                    id: 'newPassword',
                    name: 'newPassword',
                    placeholder: 'Your new password',
                    'aria-label': 'New password'
                },
                addRequiredTag: true,
                validateOn: ['onChange'],
                validationRule: {
                    inputType: VALIDATION_INPUT_TYPE.password,
                    isRequired: true,
                    match: (value) => {
                        const password = document.getElementById('currentPassword');

                        if (value && password.value === value) {
                            return ('New passwords can\'t be the same as old password!');
                        }

                        return validatePassword(value, range, minimunPasswordCharacter);
                    }
                }
            },
            {
                type: Type,
                label: 'Confirm New Password ',
                handleShowPassword,
                showPassword,
                attr: {
                    name: 'confirmNewPassword',
                    placeholder: 'Confirm New password',
                    'aria-label': 'Confirm New password'
                },
                addRequiredTag: true,
                validateOn: ['onChange'],
                validationRule: {
                    isRequired: true,
                    inputType: VALIDATION_INPUT_TYPE.password,
                    match: (value) => {
                        const password = document.getElementById('newPassword');
                        return password.value === value;
                    },
                    customErrorMessages: {
                        onMatchFail: 'Passwords do not match!'
                    }
                }
            }
        ] : [])
    ];
};

/** @namespace Seedsman/Component/MyAccountCustomerForm/Form/remoteShoppingAssistanceField */
export const remoteShoppingAssistanceField = (props) => {
    const { handleChangeRemoteCheckbox } = props;

    return [{

        type: FIELD_TYPE.checkbox,
        label: 'Allow Remote Shopping Assistance',
        attr: {
            id: 'is_remote',
            name: 'is_remote',
            placeholder: ''
        },
        events: {
            onChange: handleChangeRemoteCheckbox
        },
        mix: { block: 'MyAccountOverlay', elem: 'Checkbox' }
    }

    ];
};
