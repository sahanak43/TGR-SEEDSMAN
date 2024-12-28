import { connect } from 'react-redux';

import Loader from 'Component/Loader';
import {
    MyAccountNewsletterSubscriptionContainer as SourceMyAccountNewsletterSubscriptionContainer
} from 'SourceComponent/MyAccountNewsletterSubscription/MyAccountNewsletterSubscription.container';
import { showNotification } from 'Store/Notification/Notification.action';
import { DeviceType } from 'Type/Device.type';
import { isSignedIn } from 'Util/Auth';

import MyAccountNewsletterSubscription from './MyAccountNewsletterSubscription.component';

export const NewsletterSubscriptionDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/NewsletterSubscription/NewsletterSubscription.dispatcher'
);

/** @namespace Seedsman/Component/MyAccountNewsletterSubscription/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    customer: state.MyAccountReducer.customer,
    device: state.ConfigReducer.device,
    newsletterConfirmStatus: state.ConfigReducer.newsletter_subscription_confirm,
    isSignedIn: state.MyAccountReducer.isSignedIn
});

/** @namespace Seedsman/Component/MyAccountNewsletterSubscription/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    // updateCustomer: (customer) => dispatch(updateCustomerDetails(customer)),
    subscribeToNewsletter: (email, value) => NewsletterSubscriptionDispatcher.then(
        ({ default: dispatcher }) => dispatcher.subscribeToNewsletter(dispatch, email, value)
    ),
    showSuccessNotification: (message) => dispatch(showNotification('success', message))
});

/** @namespace Seedsman/Component/MyAccountNewsletterSubscription/Container */
export class MyAccountNewsletterSubscriptionContainer extends SourceMyAccountNewsletterSubscriptionContainer {
     static propTypes = {
         device: DeviceType.isRequired

     };

     __construct(props) {
         const { customer: { is_subscribed } = {} } = props;

         super.__construct(props);
         this.state = {
             isLoading: false,
             isSubscriptionSelected: is_subscribed || false
         };
     }

     setSubscriptionStatus() {
         this.setState((state) => ({ isSubscriptionSelected: !state.isSubscriptionSelected }));
     }

     onError() {
         const { showErrorNotification } = this.props;

         this.setState({ isLoading: false }, () => {
             showErrorNotification('We are experiencing issues, please try again later');
         });
     }

     onCustomerSave(form, fields) {
         const {
             customer: {
                 email
             },
             subscribeToNewsletter
         } = this.props;

         const {
             isSubscribed: {
                 value = false
             }
         } = fields;

         if (!isSignedIn()) {
             return;
         }
         this.setState({ isLoading: true });
         subscribeToNewsletter(email, value)
             .then(this.onFormSubmitDone())
             .catch(this.onFormSubmitDone());
     }

     onFormSubmitDone() {
         this.setState({ isLoading: false });
     }

     containerProps() {
         const { customer, device } = this.props;
         const { isSubscriptionSelected, isLoading } = this.state;

         return {
             customer, isSubscriptionSelected, device, isLoading
         };
     }

     render() {
         const { isLoading } = this.state;

         return (
             <>
                <Loader isLoading={ isLoading } />
                <MyAccountNewsletterSubscription
                  { ...this.containerProps() }
                  { ...this.containerFunctions }
                />
             </>
         );
     }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountNewsletterSubscriptionContainer);
