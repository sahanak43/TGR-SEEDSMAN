/* eslint-disable max-len */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
import { NewsletterSubscription as SourceNewsletterSubscription } from 'SourceComponent/NewsletterSubscription/NewsletterSubscription.component';

import newsletterSubscriptionForm from './NewsletterForm.form';

import './NewsletterSubscription.override.style';
/**
 * Newsletter Subscription form
 * @class NewsletterSubscription
 * @namespace Seedsman/Component/NewsletterSubscription/Component */
export class NewsletterSubscriptionComponent extends SourceNewsletterSubscription {
    get fieldMap() {
        return newsletterSubscriptionForm();
    }
}

export default NewsletterSubscriptionComponent;
