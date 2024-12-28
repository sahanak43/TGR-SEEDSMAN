/* eslint-disable max-len */
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { MyAccountDashboardContainer as SourceMyAccountDashboardContainer } from 'SourceComponent/MyAccountDashboard/MyAccountDashboard.container';
import { CustomerType } from 'Type/Account.type';

import MyAccountDashboard from './MyAccountDashboard.component';

export const OrderDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Order/Order.dispatcher'
);

/** @namespace Seedsman/Component/MyAccountDashboard/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    customer: state.MyAccountReducer.customer,
    is_allowed_reorder: state.ConfigReducer.is_allowed_reorder,
    device: state.ConfigReducer.device,
    orderList: state.OrderReducer.orderList
});

/** @namespace Seedsman/Component/MyAccountDashboard/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    reorder: (incrementId) => OrderDispatcher.then(
        ({ default: dispatcher }) => dispatcher.reorder(dispatch, incrementId)
    ),
    getOrderList: (page) => OrderDispatcher.then(
        ({ default: dispatcher }) => dispatcher.requestOrders(dispatch, page)
    )
});

/** @namespace Seedsman/Component/MyAccountDashboard/Container */
export class MyAccountDashboardContainer extends SourceMyAccountDashboardContainer {
    static propTypes = {
        customer: CustomerType.isRequired,
        reorder: PropTypes.func.isRequired,
        is_allowed_reorder: PropTypes.bool
    };

    containerFunctions = {
        getDefaultAddress: this.getDefaultAddress.bind(this),
        handleReorder: this.handleReorder.bind(this)
    };

    static defaultProps = {
        is_allowed_reorder: false
    };

    containerProps() {
        const {
            customer, is_allowed_reorder, device: { isMobile }, getOrderList, orderList
        } = this.props;

        return {
            customer, is_allowed_reorder, isMobile, getOrderList, orderList
        };
    }

    handleReorder(increment_id) {
        const { reorder } = this.props;
        reorder(increment_id);
    }

    getDefaultAddress(isBilling) {
        const { customer: { addresses = [] } } = this.props;
        const key = isBilling ? 'default_billing' : 'default_shipping';

        return addresses.find(({ [key]: defaultAddress }) => defaultAddress);
    }

    render() {
        return (
            <MyAccountDashboard
              { ...this.containerProps() }
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountDashboardContainer);
