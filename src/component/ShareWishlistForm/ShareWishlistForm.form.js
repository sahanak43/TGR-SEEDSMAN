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
import { VALIDATION_INPUT_TYPE } from 'Util/Validator/Config';

/**
 * Returns fields for share wishlist form
 * @returns {Object}
 * @namespace Seedsman/Component/ShareWishlistForm/Form/shareWishlistForm */
export const shareWishlistForm = () => [
    {
        type: FIELD_TYPE.email,
        label: 'Email addresses, separated by commas',
        attr: {
            name: 'emails',
            placeholder: 'Email addresses, separated by commas',
            'aria-label': 'Email address'
        },
        validateOn: ['onChange'],
        validationRule: {
            inputType: VALIDATION_INPUT_TYPE.emailList,
            isRequired: true
        },
        addRequiredTag: true
    },
    {
        label: 'Message',
        type: FIELD_TYPE.textarea,
        attr: {
            name: 'message',
            placeholder: 'Message',
            'aria-label': 'Message'
        },
        validateOn: ['onChange']
    }
];

export default shareWishlistForm;
