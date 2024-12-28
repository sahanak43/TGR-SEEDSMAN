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

import { Field } from 'Util/Query';

/**
 * NewsletterSubscription Mutations
 * @class NewsletterSubscriptionQuery
 * @namespace Seedsman/Query/NewsletterSubscription/Query */
export class NewsletterSubscriptionQuery {
    getSubscribeToNewsletterMutation(email, is_subscribed = true) {
        return new Field('subscribeEmailToNewsletter')
            .addArgument('email', 'String!', email)
            .addArgument('is_subscribed', 'Boolean!', is_subscribed)
            .addFieldList(this._getPageFields());
    }

    _getPageFields() {
        return [
            'status'
        ];
    }
}

export default new NewsletterSubscriptionQuery();
