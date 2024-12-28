import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { DeviceType } from 'Type/Device.type';
import { fetchQuery } from 'Util/Request';

import MyAccountRewardStoreQuery from '../../query/MyAccountRewardStore.query';
import StoreCreditAndRefunds from './StoreCreditAndRefunds.component';

export const NewsletterSubscriptionDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/NewsletterSubscription/NewsletterSubscription.dispatcher'
);
/** @namespace Seedsman/Component/StoreCreditAndRefunds/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    device: state.ConfigReducer.device
});

/** @namespace Seedsman/Component/StoreCreditAndRefunds/Container/mapDispatchToProps */
export const mapDispatchToProps = () => ({
});
/** @namespace Seedsman/Component/StoreCreditAndRefunds/Container */
export class StoreCreditAndRefundsContainer extends PureComponent {
     static propTypes = {

         device: DeviceType.isRequired
     };

      state = {
          isLoading: false,
          store_credit: {}
      };

    containerFunctions = {};

    componentDidMount() {
        this.getCustomerQueryDetails();
    }

    async getCustomerQueryDetails() {
        this.setState({ isLoading: true });

        const
            { customer: { store_credit } } = await fetchQuery(MyAccountRewardStoreQuery.getCustomerQuery());

        // eslint-disable-next-line no-unused-expressions
        this.setState({ store_credit, isLoading: false });
    }

    containerProps() {
        const { isLoading, store_credit } = this.state;
        const { device } = this.props;
        return { isLoading, store_credit, device };
    }

    render() {
        return (
            <StoreCreditAndRefunds
              { ...this.containerProps() }
              { ...this.containerFunctions }
            />
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(StoreCreditAndRefundsContainer);
