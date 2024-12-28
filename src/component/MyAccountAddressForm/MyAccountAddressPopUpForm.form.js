/* eslint-disable no-unused-expressions */
/* eslint-disable no-sequences */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
/* eslint-disable no-magic-numbers */
/* eslint-disable no-undef */
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
import { getCustomAttributes } from 'Util/Address';
import { VALIDATION_INPUT_TYPE } from 'Util/Validator/Config';
/**
   * Returns fields for street
   * @param events
   * @param props
   * @returns {[{addRequiredTag: boolean, validateOn: string[], validationRule: {isRequired: boolean}, label: *, type: string, attr: {defaultValue: (*|string, name: string, placeholder: *}}]|*[]}
   * @namespace Seedsman/Component/MyAccountAddressForm/MyAccountAddressPopUpForm/Form/getStreetFields */
export const getStreetFields = (props, events) => {
    const {
        addressLinesQty = 1,
        address: { street = [] },
        StreetAddress
    } = props;

    const {
        onStreetValueChange
    } = events;

    if (addressLinesQty === 1) {
        return [{
            type: FIELD_TYPE.text,
            label: 'Street address',
            attr: {
                name: 'street',
                defaultValue: StreetAddress == null ? street[0] || '' : StreetAddress,
                value: StreetAddress == null ? street[0] || '' : StreetAddress,
                placeholder: 'Your street address'
            },
            addRequiredTag: true,
            validateOn: ['onChange'],
            events: {
                onChange: onStreetValueChange
            },
            validationRule: {
                isRequired: true
            }
        }];
    }

    const streets = [];

    // eslint-disable-next-line fp/no-loops, fp/no-let
    for (let i = 0; i < addressLinesQty; i++) {
        streets.push({
            type: FIELD_TYPE.text,
            label: `Street address line, ${i + 1}`,
            attr: {
                name: `street_${i}`,
                // eslint-disable-next-line no-nested-ternary
                defaultValue: i === 0 ? (StreetAddress == null ? street[0] || '' : StreetAddress) : '',
                // eslint-disable-next-line no-nested-ternary
                value: i === 0 ? (StreetAddress == null ? street[0] || '' : StreetAddress) : '',
                placeholder: ('Your street address line', i + 1)
            },
            addRequiredTag: i === 0,
            validateOn: i === 0 ? ['onChange'] : [],
            events: {
                onChange: onStreetValueChange
            },
            validationRule: {
                isRequired: i === 0
            }
        });
    }

    return streets;
};

/**
   * Returns region fields
   * @param props
   * @param events
   * @returns {[{addRequiredTag: boolean, validateOn: (string[]|*[], validationRule: {isRequired}, options, label: *, type: string, attr: {defaultValue: number, name: string, selectPlaceholder: *}}]|*[]|[{validateOn: (string[]|*[], validationRule: {isRequired}, label: *, type: string, attr: {defaultValue, name: string, id: string, placeholder: *}}]}
   * @namespace Seedsman/Component/MyAccountAddressForm/MyAccountAddressPopUpForm/Form/getRegionFields  */
export const getRegionFields = (props, events) => {
    const {
        currentRegion,
        currentRegionId,
        regionDisplayAll,
        availableRegions,
        isStateRequired
    } = props;

    const { onRegionChange, onRegionIdChange } = events;

    if (!regionDisplayAll && !isStateRequired) {
        return [];
    }

    if (!availableRegions || !availableRegions.length) {
        return [
            {
                type: FIELD_TYPE.text,
                label: 'State / Province',
                attr: {
                    id: 'address-region-id',
                    name: 'region_string',
                    value: currentRegion,
                    placeholder: 'State*'
                },
                events: {
                    onChange: onRegionChange
                },
                addRequiredTag: isStateRequired,
                validateOn: isStateRequired ? ['onChange'] : [],
                validationRule: {
                    isRequired: isStateRequired
                }
            }
        ];
    }

    return [
        {
            type: FIELD_TYPE.select,
            label: 'State / Province',
            attr: {
                name: 'region_id',
                value: currentRegionId,
                selectPlaceholder: 'Select region...'
            },
            events: {
                onChange: onRegionIdChange
            },
            options: availableRegions.map(({ id, name }) => ({ id, label: name, value: id })),
            addRequiredTag: isStateRequired,
            validateOn: isStateRequired ? ['onChange'] : [],
            validationRule: {
                isRequired: isStateRequired
            }
        }
    ];
};

/**
   * Returns VAT fields
   * @param props
   * @returns {*[]|[{label: *, type: string, attr: {defaultValue: string, name: string}}]}
   * @namespace Seedsman/Component/MyAccountAddressForm/MyAccountAddressPopUpForm/Form/getVatFields */
export const getVatFields = (props) => {
    const { showVatNumber, vat_id: vatID = '' } = props;

    if (!showVatNumber) {
        return [];
    }

    return [
        {
            type: FIELD_TYPE.text,
            label: 'VAT Number',
            attr: {
                placeholder: 'Your VAT number',
                name: 'vat_id',
                defaultValue: vatID
            },
            addRequiredTag: false,
            validateOn: ['onChange'],
            validationRule: {
                isRequired: false
            }
        }
    ];
};

/** @namespace Seedsman/Component/MyAccountAddressForm/MyAccountAddressPopUpForm/Form/getAddressTypeFields */
export const getAddressTypeFields = (props, events = {}) => {
    const { addressTypeOptions, address } = props;

    const customAttributes = getCustomAttributes(address);
    const value = customAttributes?.find((res) => {
        if (res.attribute_code === 'c_address_type') {
            return res.value;
        }
    });

    const { onAddressTypeChange } = events;

    const addressTypes = addressTypeOptions.map((type) => ({
        type: FIELD_TYPE.radio,
        label: type.label,
        attr: {
            id: `address-${type.label}`,
            name: 'c_address_type',
            defaultValue: type.value,
            defaultChecked: value?.value == type.value
        },
        events: {
            onChange: onAddressTypeChange
        }
    }));

    return addressTypes;
};

/**
   * Returns address form fields
   * @param props
   * @param events
   * @returns {[{label: *, type: string, attr: {defaultChecked, name: string}}, {label: *, type: string, attr: {defaultChecked, name: string}}, {addRequiredTag: boolean, validateOn: string[], validationRule: {isRequired: boolean}, label: *, type: string, attr: {defaultValue: string, name: string, placeholder: *}}, {addRequiredTag: boolean, validateOn: string[], validationRule: {isRequired: boolean}, label: *, type: string, attr: {defaultValue: string, name: string, placeholder: *}}, {mods: {street: boolean, multipleFields: boolean, oddAddresses: boolean}, name: string, fields: ({addRequiredTag: boolean, validateOn: string[], validationRule: {isRequired: boolean}, label: *, type: string, attr: {defaultValue: (*|string, name: string, placeholder: *}}[]|*[])}, null, ...*[]|{label: *, type: string, attr: {defaultValue: string, name: string}}[], null]}
   * @namespace Seedsman/Component/MyAccountAddressForm/MyAccountAddressPopUpForm/Form/myAccountAddressPopUpForm */
export const myAccountAddressPopUpForm = (props, events = {}) => {
    const {
        default_billing: defaultBilling,
        default_shipping: defaultShipping,
        // is_shipping_address,
        // is_billing_address,
        countryId,
        countries = [],
        addressLinesQty = 1,
        address: {
            firstname = '',
            lastname = '',
            telephone = ''
        },
        address,
        currentCity = '',
        currentZipcode = '',
        defaultCountry = ''
    } = props;

    const {
        onCountryChange,
        onZipcodeChange,
        onCityChange,
        onAlternateNumberChange,
        onConsentChecked
        // handleAddressType
    } = events || {};

    const customAttributes = getCustomAttributes(address);
    const obj = {};
    customAttributes?.forEach((res) => {
        obj[res.attribute_code] = res.attribute_code;
        obj.alternate_phone_number = res.attribute_code == 'alternate_phone_number' ? res.value : '';
    });
    const { alternate_phone_number } = obj;

    const fieldArray = [
        {
            name: 'AddadddressFieldSection',
            mods: { address: true },
            fields: [
                {
                    name: 'NameGroup',
                    mods: { nameGroup: true },
                    fields: [
                        {
                            type: FIELD_TYPE.text,
                            label: 'First name',
                            attr: {
                                name: 'firstname',
                                defaultValue: firstname,
                                placeholder: 'Full name*'
                            },
                            addRequiredTag: true,
                            validateOn: ['onChange'],
                            validationRule: {
                                isRequired: true,
                                inputType: VALIDATION_INPUT_TYPE.alphaSpace
                            }
                        },
                        {
                            type: FIELD_TYPE.text,
                            label: 'Last name',
                            attr: {
                                name: 'lastname',
                                defaultValue: lastname,
                                placeholder: 'Your last name'
                            },
                            addRequiredTag: true,
                            validateOn: ['onChange'],
                            validationRule: {
                                isRequired: true,
                                inputType: VALIDATION_INPUT_TYPE.alphaSpace
                            }
                        },
                        {
                            type: FIELD_TYPE.text,
                            label: 'Phone Number',
                            attr: {
                                name: 'telephone',
                                defaultValue: telephone,
                                placeholder: 'Phone Number*'
                            },
                            addRequiredTag: true,
                            validateOn: ['onChange'],
                            validationRule: {
                                inputType: VALIDATION_INPUT_TYPE.phone,
                                isRequired: true
                            }
                        }

                    ]
                },
                {
                    name: 'addressGroup',
                    mods: { address: true },
                    fields: [
                        {
                            type: FIELD_TYPE.text,
                            label: 'Zipcode/Postcode',
                            attr: {
                                name: 'postcode',
                                defaultValue: currentZipcode || '',
                                value: currentZipcode || '',
                                placeholder: 'Zipcode/Postcode'
                            },
                            events: {
                                onChange: onZipcodeChange
                            },
                            addRequiredTag: true,
                            validateOn: ['onChange', 'onBlur'],
                            validationRule: {
                                ...(defaultCountry === 'US' && { inputType: VALIDATION_INPUT_TYPE.zipcode }),
                                isRequired: true
                            }
                        },
                        {
                            type: FIELD_TYPE.select,
                            label: 'Country',
                            attr: {
                                id: 'address-country-id',
                                name: 'country_id',
                                defaultValue: countryId,
                                value: countryId,
                                selectPlaceholder: 'Select Country...'
                            },
                            events: {
                                onChange: onCountryChange
                            },
                            options: countries,
                            addRequiredTag: true,
                            validateOn: ['onChange'],
                            validationRule: {
                                isRequired: true
                            }
                        },
                        {
                            name: 'streetGroup',
                            mods: {
                                street: true,
                                multipleFields: addressLinesQty > 0,
                                oddAddresses: addressLinesQty % 2 === 1
                            },
                            fields: getStreetFields(props, events)
                        }

                    ]
                },
                {
                    name: 'addressGroup',
                    mods: { address: true },
                    fields: [
                        ...getVatFields(props),
                        {
                            type: FIELD_TYPE.text,
                            label: 'City',
                            attr: {
                                name: 'city',
                                defaultValue: currentCity,
                                value: currentCity,
                                placeholder: 'City/District/Town*'
                            },
                            events: {
                                onChange: onCityChange
                            },
                            addRequiredTag: true,
                            validateOn: ['onChange'],
                            validationRule: {
                                isRequired: true,
                                inputType: VALIDATION_INPUT_TYPE.alphaSpace
                            }
                        },

                        ...getRegionFields(props, events),
                        {
                            type: FIELD_TYPE.text,
                            label: 'Alternate Phone (Optional)',
                            attr: {
                                name: 'alternate_phone_number',
                                defaultValue: alternate_phone_number,
                                placeholder: 'Alternative Phone(Optional)'
                            },
                            events: {
                                onChange: onAlternateNumberChange
                            },
                            validateOn: ['onChange'],
                            validationRule: {
                                inputType: VALIDATION_INPUT_TYPE.phone
                            }
                        }
                    ]
                },
                {
                    name: 'addressGroup_type',
                    mods: { addresstype: true },
                    fields: getAddressTypeFields(props, events)
                },
                {
                    name: 'addressGroup',
                    mods: { address: true },
                    fields: [
                        {
                            type: FIELD_TYPE.checkbox,
                            label: 'Use this as my Billing Address',
                            attr: {
                                name: 'default_billing',
                                defaultChecked: defaultBilling
                            }
                        },
                        {
                            type: FIELD_TYPE.checkbox,
                            label: 'Use this as my Shipping Address',
                            attr: {
                                name: 'default_shipping',
                                defaultChecked: defaultShipping
                            }
                        }
                    ]

                },
                {
                    type: FIELD_TYPE.checkbox,
                    label: 'I confirm this is my correct delivery address',
                    attr: {
                        name: 'default_address_concent'
                    },
                    addRequiredTag: true,
                    validateOn: ['onChange'],
                    events: {
                        onChange: onConsentChecked
                    },
                    mix: { block: 'MyAccountAddressPopup', elem: 'Checkbox' }
                }
            ]
        }

    ];

    return fieldArray;
};

export default myAccountAddressPopUpForm;
