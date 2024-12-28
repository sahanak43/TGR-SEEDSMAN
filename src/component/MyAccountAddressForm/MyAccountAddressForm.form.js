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
  * @param props
  * @returns {[{addRequiredTag: boolean, validateOn: string[], validationRule: {isRequired: boolean}, label: *, type: string, attr: {defaultValue: (*|string, name: string, placeholder: *}}]|*[]}
  * @namespace Seedsman/Component/MyAccountAddressForm/Form/getStreetFields */
export const getStreetFields = (props) => {
    const {
        addressLinesQty = 1,
        address: { street = [] }
    } = props;

    if (addressLinesQty === 1) {
        return [{
            type: FIELD_TYPE.text,
            label: 'Street address',
            attr: {
                name: 'street',
                defaultValue: street[0] || '',
                placeholder: 'Your street address'
            },
            addRequiredTag: true,
            validateOn: ['onChange'],
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
            label: 'Address( Area/Street)',
            attr: {
                name: `street_${i}`,
                defaultValue: street[i] || '',
                placeholder: ('Your street address line', i + 1)
            },
            addRequiredTag: i === 0,
            validateOn: i === 0 ? ['onChange'] : [],
            validationRule: {
                isRequired: i === 0
            }
        });
    }

    return streets;
};

/** @namespace Seedsman/Component/MyAccountAddressForm/Form/getAddressTypeFields */
export const getAddressTypeFields = (props, events = {}) => {
    const { addressTypeOptions } = props;
    const { onAddressTypeChange } = events;

    const addressTypes = addressTypeOptions.map((type) => ({
        type: FIELD_TYPE.radio,
        label: type.label,
        attr: {
            name: 'c_address_type',
            defaultValue: type.value
        },
        events: {
            onChange: onAddressTypeChange
        }
    }));

    return addressTypes;
};

/**
  * Returns region fields
  * @param props
  * @param events
  * @returns {[{addRequiredTag: boolean, validateOn: (string[]|*[], validationRule: {isRequired}, options, label: *, type: string, attr: {defaultValue: number, name: string, selectPlaceholder: *}}]|*[]|[{validateOn: (string[]|*[], validationRule: {isRequired}, label: *, type: string, attr: {defaultValue, name: string, id: string, placeholder: *}}]}
  * @namespace Seedsman/Component/MyAccountAddressForm/Form/getRegionFields  */
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
                    placeholder: 'Your state / province'
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
  * @namespace Seedsman/Component/MyAccountAddressForm/Form/getVatFields */
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

/**
  * Returns address form fields
  * @param props
  * @param events
  * @returns {[{label: *, type: string, attr: {defaultChecked, name: string}}, {label: *, type: string, attr: {defaultChecked, name: string}}, {addRequiredTag: boolean, validateOn: string[], validationRule: {isRequired: boolean}, label: *, type: string, attr: {defaultValue: string, name: string, placeholder: *}}, {addRequiredTag: boolean, validateOn: string[], validationRule: {isRequired: boolean}, label: *, type: string, attr: {defaultValue: string, name: string, placeholder: *}}, {mods: {street: boolean, multipleFields: boolean, oddAddresses: boolean}, name: string, fields: ({addRequiredTag: boolean, validateOn: string[], validationRule: {isRequired: boolean}, label: *, type: string, attr: {defaultValue: (*|string, name: string, placeholder: *}}[]|*[])}, null, ...*[]|{label: *, type: string, attr: {defaultValue: string, name: string}}[], null]}
  * @namespace Seedsman/Component/MyAccountAddressForm/Form/myAccountAddressForm */
export const myAccountAddressForm = (props, events = {}) => {
    const {
        defaultAddress: { defaultBilling, defaultShipping },
        countryId,
        firstname = '',
        lastname = '',
        city = '',
        countries = [],
        postcode: zipcode = '',
        telephone = '',
        addressLinesQty = 1,
        address,
        defaultCountry = ''
    } = props;

    const {
        onCountryChange,
        onZipcodeChange,
        onCityChange,
        onAlternateNumberChange,
        handleAddressCheckbox
    } = events || {};

    const customAttributes = getCustomAttributes(address);
    const obj = {};
    customAttributes?.forEach((res) => {
        obj[res.attribute_code] = res.attribute_code;
        obj.alternate_phone_number = res.attribute_code == 'alternate_phone_number' ? res.value : '';
    });
    const { alternate_phone_number } = obj;

    return [
        {
            type: FIELD_TYPE.checkbox,
            label: 'This is default Billing Address',
            attr: {
                name: 'default_billing',
                defaultChecked: defaultBilling
            }
        },
        {
            type: FIELD_TYPE.checkbox,
            label: 'This is default Shipping Address',
            attr: {
                name: 'default_shipping',
                defaultChecked: defaultShipping
            }
        },
        {
            type: FIELD_TYPE.text,
            label: 'First name',
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
            label: 'Last name',
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
            type: FIELD_TYPE.text,
            label: 'Phone number',
            attr: {
                name: 'telephone',
                defaultValue: telephone,
                placeholder: 'Your phone number'
            },
            addRequiredTag: true,
            validateOn: ['onChange'],
            validationRule: {
                inputType: VALIDATION_INPUT_TYPE.phone,
                isRequired: true
            }
        },
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
        },
        {
            name: 'streetGroup',
            mods: {
                street: true,
                multipleFields: addressLinesQty > 0,
                oddAddresses: addressLinesQty % 2 === 1
            },
            fields: getStreetFields(props)
        },
        {
            name: 'addressGroup',
            mods: { address: true },
            fields: [
                {
                    type: FIELD_TYPE.select,
                    label: 'Country',
                    attr: {
                        id: 'address-country-id',
                        name: 'country_id',
                        defaultValue: countryId,
                        selectPlaceholder: 'Select country...'
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
                ...getRegionFields(props, events),
                {
                    type: FIELD_TYPE.text,
                    label: 'Zipcode/Postcode',
                    attr: {
                        name: 'postcode',
                        defaultValue: zipcode,
                        placeholder: 'Zipcode/Postcode'
                    },
                    events: {
                        onChange: onZipcodeChange
                    },
                    value: zipcode,
                    addRequiredTag: true,
                    validateOn: ['onChange', 'onBlur'],
                    validationRule: {
                        ...(defaultCountry === 'US' && { inputType: VALIDATION_INPUT_TYPE.zipcode }),
                        isRequired: true
                    }
                },
                {
                    type: FIELD_TYPE.text,
                    label: 'City/District/Town',
                    attr: {
                        name: 'city',
                        defaultValue: city,
                        placeholder: 'Your city'
                    },
                    events: {
                        onChange: onCityChange
                    },
                    addRequiredTag: true,
                    validateOn: ['onChange'],
                    validationRule: {
                        isRequired: true
                    }
                }
            ]
        },
        {
            type: FIELD_TYPE.checkbox,
            label: 'Use this as my Billing Address',
            attr: {
                name: 'default_billing',
                id: 'defaultBilling',
                defaultChecked: defaultBilling
            },
            events: {
                onChange: handleAddressCheckbox
            }
        },
        {
            type: FIELD_TYPE.checkbox,
            label: 'Use this as my Shipping Address',
            attr: {
                name: 'default_shipping',
                id: 'defaultShipping',
                defaultChecked: defaultShipping
            },
            events: {
                onChange: handleAddressCheckbox
            }
        },
        ...getVatFields(props)
    ];
};

export default myAccountAddressForm;
