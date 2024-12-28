/* eslint-disable fp/no-let */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
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

import { FIELD_TYPE } from 'Component/Field/Field.config';
import FieldForm from 'Component/FieldForm';
import { CustomerType } from 'Type/Account.type';
import { DeviceType } from 'Type/Device.type';

import './MyAccountNewsletterSubscription.style.scss';

/** @namespace Seedsman/Component/MyAccountNewsletterSubscription/Component */
export class MyAccountNewsletterSubscriptionComponent extends FieldForm {
    static propTypes = {
        customer: CustomerType.isRequired,
        onCustomerSave: PropTypes.func.isRequired,
        onError: PropTypes.func.isRequired,
        isSubscriptionSelected: PropTypes.bool.isRequired,
        device: DeviceType.isRequired
    };

    get fieldMap() {
        const { setSubscriptionStatus, isSubscriptionSelected } = this.props;
        const labelVal = 'General subscription';
        return [
            {
                type: FIELD_TYPE.checkbox,
                attr: {
                    name: 'isSubscribed',
                    defaultChecked: isSubscriptionSelected
                },
                events: {
                    onChange: setSubscriptionStatus
                },
                label: labelVal
            }
        ];
    }

    renderFormBody() {
        return (
            <div
              block="FieldForm"
              elem="Fields"
              mix={ { block: 'MyAccountNewsletterSubscription' } }
            >
                <div
                  block="FieldForm"

                  // eslint-disable-next-line react/jsx-props-no-multi-spaces
                  mix={ { block: 'MyAccountNewsletterSubscription', elem: 'Title' } }
                >
                   Subscription Option

                </div>

                { super.renderFormBody() }
            </div>
        );
    }

    getFormProps() {
        const { onCustomerSave, onError } = this.props;

        return {
            onSubmit: onCustomerSave,
            onError,
            returnAsObject: true
        };
    }

    renderActions() {
        return (
            <>
            <div className="MyAccountNewsletterSubscription-Heading-Border" />
            <button
              type={ FIELD_TYPE.submit }
              block="Button"
              mix={ { block: 'MyAccountNewsletterSubscription', elem: 'Button' } }
              aria-label="Submit"
            >
                Save
            </button>
                <div className="MyAccountNewsletterSubscription-Heading-Border" />
            </>
        );
    }
}

export default MyAccountNewsletterSubscriptionComponent;
