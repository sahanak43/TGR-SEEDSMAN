/* eslint-disable no-nested-ternary */
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

import NewsletterSubscriptionQuery from 'Query/NewsletterSubscription.query';
import { showNotification } from 'Store/Notification/Notification.action';
import { fetchMutation, getErrorMessage } from 'Util/Request';

export const NOT_ACTIVE = 'NOT_ACTIVE';

/**
 * Product Cart Dispatcher
 * @class NewsletterSubscriptionDispatcher
 * @namespace Seedsman/Store/NewsletterSubscription/Dispatcher */
export class NewsletterSubscriptionDispatcher {
    subscribeToNewsletter(dispatch, email, value) {
        return fetchMutation(NewsletterSubscriptionQuery.getSubscribeToNewsletterMutation(email, value)).then(
            /** @namespace Seedsman/Store/NewsletterSubscription/Dispatcher/NewsletterSubscriptionDispatcher/subscribeToNewsletter/fetchMutation/then */
            ({ subscribeEmailToNewsletter: { status } }) => {
                // `NOT_ACTIVE` response status corresponds to `newsletter_subscription_confirm` magento setting
                const message = status === NOT_ACTIVE
                    ? 'Confirmation request has been sent.'
                    : (value ? 'Thank you for your subscription.' : ' Newsletter unsubscribed');

                return dispatch(showNotification('success', message));
            },
            /** @namespace Seedsman/Store/NewsletterSubscription/Dispatcher/NewsletterSubscriptionDispatcher/subscribeToNewsletter/fetchMutation/then/dispatch/catch */
            (error) => dispatch(showNotification('error', getErrorMessage(error)))
        );
    }
}

export default new NewsletterSubscriptionDispatcher();
