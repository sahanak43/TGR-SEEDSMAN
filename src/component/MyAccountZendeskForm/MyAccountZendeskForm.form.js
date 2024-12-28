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

/**
 * Form for contacts
 * @namespace Seedsman/Component/MyAccountZendeskForm/Form/myTicketsForm */
export const myTicketsForm = () => [
    {
        type: FIELD_TYPE.text,
        label: 'Subject',
        attr: {
            name: 'subject'
        },
        addRequiredTag: true,
        validateOn: ['onChange'],
        validationRule: {
            isRequired: true
        }
    },
    {
        type: FIELD_TYPE.text,
        label: 'Order',
        attr: {
            name: 'order_increment'
        },
        addRequiredTag: true,
        validateOn: ['onChange']
    },
    {
        type: FIELD_TYPE.textarea,
        label: 'Comment',
        attr: {
            name: 'comment'
        },
        addRequiredTag: true,
        validateOn: ['onChange'],
        validationRule: {
            isRequired: true
        }
    }
];

export default myTicketsForm;
