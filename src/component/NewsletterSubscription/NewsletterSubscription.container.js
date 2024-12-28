/* eslint-disable max-len */
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

import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { mapDispatchToProps, mapStateToProps, NewsletterSubscriptionContainer as SourceNewsletterSubscriptionContainer } from 'SourceComponent/NewsletterSubscription/NewsletterSubscription.container';

/** @namespace Seedsman/Component/NewsletterSubscription/Container */
export class NewsletterSubscriptionContainer extends SourceNewsletterSubscriptionContainer {
    onFormSubmit(form, fields) {
        const {
            subscribeToNewsletter,
            allowGuestSubscribe,
            isSignedIn,
            showErrorNotification
        } = this.props;

        const {
            value: email
        } = fields.find(({ name }) => name === 'newsletterEmail') || {};

        if (!allowGuestSubscribe && !isSignedIn) {
            showErrorNotification(
                'Guests can not subscribe to the newsletter. You must create an account or login to subscribe.'
            );

            return;
        }

        this.setState({ isLoading: true });

        subscribeToNewsletter(email, true)
            .then(this.onFormSubmitDone)
            .catch(this.onFormSubmitDone);
    }
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(NewsletterSubscriptionContainer));
