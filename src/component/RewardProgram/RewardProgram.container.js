/* eslint-disable react/prop-types */
/* eslint-disable fp/no-let */
/* eslint-disable array-callback-return */
/* eslint-disable react/no-did-update-set-state */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import MyAccountRewardStoreQuery from 'Query/MyAccountRewardStore.query';
import { updateCustomerDetails } from 'Store/MyAccount/MyAccount.action';
import { showNotification } from 'Store/Notification/Notification.action';
import { CustomerType } from 'Type/Account.type';
import { DeviceType } from 'Type/Device.type';
import transformToNameValuePair from 'Util/Form/Transform';
import { fetchMutation, fetchQuery, getErrorMessage } from 'Util/Request';
import { getQueryParam } from 'Util/Url';

import RewardProgram from './RewardProgram.component';

/** @namespace Seedsman/Component/RewardProgram/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    customer: state.MyAccountReducer.customer,
    device: state.ConfigReducer.device,
    newsletterConfirmStatus: state.ConfigReducer.newsletter_subscription_confirm,
    points_rate: state.ConfigReducer.amrewards_points_rate,
    currency_code: state.ConfigReducer.default_display_currency_code
});
/** @namespace Seedsman/Component/RewardProgram/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    updateCustomer: (customer) => dispatch(updateCustomerDetails(customer)),
    showErrorNotification: (error) => dispatch(showNotification('error', getErrorMessage(error))),
    showSuccessNotification: (message) => dispatch(showNotification('success', message))
});
/** @namespace Seedsman/Component/RewardProgram/Container */
export class RewardProgramContainer extends PureComponent {
         static propTypes = {
             customer: CustomerType.isRequired,
             updateCustomer: PropTypes.func.isRequired,
             showErrorNotification: PropTypes.func.isRequired,
             showSuccessNotification: PropTypes.func.isRequired,
             reward_points: PropTypes.string.isRequired,
             device: DeviceType.isRequired,
             // eslint-disable-next-line react/boolean-prop-naming
             is_balanceSubscribe: PropTypes.bool.isRequired,
             points_rate: PropTypes.number.isRequired,
             currency_code: PropTypes.string.isRequired
         };

      state = {
          isLoading: false,
          is_balanceSubscribe: false,
          is_expirationSubscribe: false,
          rewards_history: null,
          currentPage: 1
      };

     containerFunctions = {
         onCustomerSave: this.onCustomerSave.bind(this)
     };

     componentDidMount() {
         const currentPage = 1;

         this.setState({ currentPage });
         this.getRewardPointsHistoryDetails(currentPage);
         this.getEmailNotificationsFieldOptions();
         this.updateMetaTagRewardProgramPage();
     }

     componentDidUpdate(prevProps, prevState) {
         const {
             currentPage: prevCurrentPage
         } = prevState;
         const { is_BalanceSubscribed, is_ExpirationSubscribed } = this.state;
         const {
             is_BalanceSubscribed: prev_is_BalanceSubscribed,
             is_ExpirationSubscribed: prev_is_ExpirationSubscribed
         } = prevState;

         const currentPage = this._getPageFromUrl();

         if (prevCurrentPage !== currentPage) {
             this.setState({ currentPage });
             this.getRewardPointsHistoryDetails(currentPage);
         }

         if (is_BalanceSubscribed !== prev_is_BalanceSubscribed
            || is_ExpirationSubscribed !== prev_is_ExpirationSubscribed) {
             this.getEmailNotificationsFieldOptions();
         }
         if (prevProps !== this.props) {
             this.updateMetaTagRewardProgramPage();
         }
     }

     updateMetaTagRewardProgramPage() {
         const metaTag = document.querySelector('meta[name="robots"]');

         if (metaTag) {
             metaTag.setAttribute('content', 'NOINDEX,FOLLOW');
         }
     }

     async getRewardPointsHistoryDetails(currentPage) {
         this.setState({ isLoading: true });
         const {
             rewards: rewards_history
         } = await fetchQuery(MyAccountRewardStoreQuery._getRewardPointsHistoryDetails(currentPage));

         this.setState({ rewards_history, isLoading: false });
     }

     async getEmailNotificationsFieldOptions() {
         this.setState({ isLoading: true });
         const {
             getCustomerNotificationOptions: {
                 amrewards_earning_notification,
                 amrewards_expire_notification
             }
         } = await fetchQuery(MyAccountRewardStoreQuery.getCustomerNotificationOptions());

         this.setState({
             is_balanceSubscribe: amrewards_earning_notification,
             is_expirationSubscribe: amrewards_expire_notification,
             isLoading: false
         });
     }

     _getPageFromUrl(url) {
         const { location: currentLocation } = this.props;
         const location = url || currentLocation;

         return +(getQueryParam('page', location) || 1);
     }

     async onCustomerSave(form, fields) {
         const {
             is_BalanceSubscribed,
             is_ExpirationSubscribed
         } = transformToNameValuePair(fields);

         const Options = {
             earn_option: is_BalanceSubscribed,
             expire_option: is_ExpirationSubscribed
         };

         const mutation = await MyAccountRewardStoreQuery.getRewardSubscribeMutation(Options);
         this.setState({ isLoading: true });

         fetchMutation(mutation).then(
             /** @namespace Seedsman/Component/RewardProgram/Container/RewardProgramContainer/onCustomerSave/fetchMutation/then */
             (data) => {
                 if (!data.error) {
                     this.setState({
                         is_balanceSubscribe: is_BalanceSubscribed,
                         is_expirationSubscribe: is_ExpirationSubscribed,
                         isLoading: false
                     });
                 }
             },
             /** @namespace Seedsman/Component/RewardProgram/Container/RewardProgramContainer/onCustomerSave/fetchMutation/then/catch */
             (error) => {
                 this.setState({ isLoading: false });
                 this.onError(error);
             }
         );
     }

     containerProps() {
         const {
             isLoading, is_balanceSubscribe, is_expirationSubscribe,
             rewards_history
         } = this.state;

         const {
             device, points_rate, currency_code
         } = this.props;

         return {
             isLoading,
             is_balanceSubscribe,
             is_expirationSubscribe,
             device,
             rewards_history,
             points_rate,
             currency_code
         };
     }

     render() {
         return (
            <RewardProgram
              { ...this.containerProps() }
              { ...this.containerFunctions }
            />
         );
     }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RewardProgramContainer));
