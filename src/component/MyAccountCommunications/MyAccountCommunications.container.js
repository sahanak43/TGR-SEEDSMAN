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
import { fetchMutation, getErrorMessage } from 'Util/Request';

import MyAccountCommunications from './MyAccountCommunications.component';

export const MyAccountDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/MyAccount/MyAccount.dispatcher'
);

/** @namespace Seedsman/Component/MyAccountCommunications/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    customer: state.MyAccountReducer.customer,
    device: state.ConfigReducer.device
});
/** @namespace Seedsman/Component/MyAccountCommunications/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    updateCustomer: (customer) => dispatch(updateCustomerDetails(customer)),
    showErrorNotification: (error) => dispatch(showNotification('error', getErrorMessage(error))),
    showNotification: (type, message) => dispatch(showNotification(type, message)),
    requestCustomerData: () => MyAccountDispatcher.then(
        ({ default: dispatcher }) => dispatcher.requestCustomerData(dispatch)
    )
});
/** @namespace Seedsman/Component/MyAccountCommunications/Container */
export class MyAccountCommunicationsContainer extends PureComponent {
    static propTypes = {
        customer: CustomerType.isRequired,
        updateCustomer: PropTypes.func.isRequired,
        showNotification: PropTypes.func.isRequired,
        showErrorNotification: PropTypes.func.isRequired,
        device: DeviceType.isRequired,
        requestCustomerData: PropTypes.func.isRequired
    };

    state = {
        isLoading: false
    };

    containerFunctions = {
        onSuccess: this.onSuccess.bind(this)
    };

    componentDidMount() {
        const { requestCustomerData } = this.props;

        requestCustomerData();
    }

    containerProps() {
        const {
            customer,
            customer: {
                extra_attributes: {
                    sms_notify,
                    receive_marketing_sms,
                    receive_tracking_sms
                } = {}
            } = {},
            updateCustomer,
            showNotification,
            device: { isMobile }
        } = this.props;

        const { isLoading } = this.state;

        return {
            customer,
            sms_notify,
            receive_tracking_sms,
            receive_marketing_sms,
            updateCustomer,
            showNotification,
            isMobile,
            isLoading
        };
    }

    async onSuccess(form, fields) {
        const { showErrorNotification, showNotification } = this.props;
        const {
            sms_notify,
            receive_marketing_sms,
            receive_tracking_sms
        } = transformToNameValuePair(fields);

        const options = {
            sms_notify,
            receive_marketing_sms,
            receive_tracking_sms
        };

        const mutation = await MyAccountRewardStoreQuery.getSMSCommunicationsMutation(options);
        this.setState({ isLoading: true });

        fetchMutation(mutation).then(
            /** @namespace Seedsman/Component/MyAccountCommunications/Container/MyAccountCommunicationsContainer/onSuccess/fetchMutation/then */
            (data) => {
                if (!data.error) {
                    this.setState({
                        isLoading: false
                    });
                    showNotification('success', 'SMS communication successful.');
                }
            },
            /** @namespace Seedsman/Component/MyAccountCommunications/Container/MyAccountCommunicationsContainer/onSuccess/fetchMutation/then/catch */
            (error) => {
                this.setState({ isLoading: false });
                showErrorNotification(error);
            }
        );
    }

    render() {
        return (
            <MyAccountCommunications
              { ...this.containerProps() }
              { ...this.containerFunctions }
            />
        );
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MyAccountCommunicationsContainer));
