import FIELD_TYPE from 'Component/Field/Field.config';
import { VALIDATION_INPUT_TYPE } from 'Util/Validator/Config';

/**
  * Returns fields for newsletter
  * @returns {[{validateOn: [string], validationRule: {isRequired: boolean, inputType: string}, type: string, attr: {name: string, placeholder: *, 'aria-label': *}}]}
  * @namespace Seedsman/Component/NewsletterSubscription/NewsletterForm/Form/newsletterSubscriptionForm */
export const newsletterSubscriptionForm = () => [
    {
        type: FIELD_TYPE.email,
        label: 'Enter Email Address',
        attr: {
            name: 'newsletterEmail',
            placeholder: 'Enter your email address',
            'aria-label': 'Email address'
        },
        validateOn: ['onChange'],
        validationRule: {
            inputType: VALIDATION_INPUT_TYPE.email,
            isRequired: true
        }
    }
];

export default newsletterSubscriptionForm;
