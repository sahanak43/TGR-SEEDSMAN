import { connect } from 'react-redux';

import { CUSTOMER_ORDER } from 'Component/Header/Header.config';
import { ACCOUNT_ORDER_HISTORY } from 'Route/MyAccount/MyAccount.config';
import {
    MyAccountOrderContainer as SourceMyAccountOrderContainer
} from 'SourceComponent/MyAccountOrder/MyAccountOrder.container';
import { changeNavigationState, goToPreviousNavigationState } from 'Store/Navigation/Navigation.action';
import { BOTTOM_NAVIGATION_TYPE, TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { showNotification } from 'Store/Notification/Notification.action';
import { isSignedIn } from 'Util/Auth';
import history from 'Util/History';
import { appendWithStoreCode } from 'Util/Url';

import MyAccountOrder from './MyAccountOrder.component';

export const OrderDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Order/Order.dispatcher'
);

/** @namespace Seedsman/Component/MyAccountOrder/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    display_tax_in_shipping_amount: state.ConfigReducer.cartDisplayConfig.display_tax_in_shipping_amount,
    is_allowed_reorder: state.ConfigReducer.is_allowed_reorder,
    rss_order_subscribe_allow: state.ConfigReducer.rss_order_subscribe_allow,
    isMobile: state.ConfigReducer.device.isMobile
});

/** @namespace Seedsman/Component/MyAccountOrder/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    showNotification: (type, message) => dispatch(showNotification(type, message)),
    getOrderById: (orderId) => OrderDispatcher.then(
        ({ default: dispatcher }) => dispatcher.getOrderById(dispatch, orderId)
    ),
    reorder: (incrementId) => OrderDispatcher.then(
        ({ default: dispatcher }) => dispatcher.reorder(dispatch, incrementId)
    ),
    changeHeaderState: (state) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state)),
    goToPreviousNavigationState: () => dispatch(goToPreviousNavigationState(BOTTOM_NAVIGATION_TYPE))
});

/** @namespace Seedsman/Component/MyAccountOrder/Container */
export class MyAccountOrderContainer extends SourceMyAccountOrderContainer {
    handleChangeHeaderState() {
        const { changeHeaderState } = this.props;

        changeHeaderState({
            name: CUSTOMER_ORDER,
            title: 'Order Details',
            onBackClick: () => history.goBack()
        });
    }

    async requestOrderDetails() {
        const {
            match: {
                params: {
                    orderId
                }
            },
            getOrderById,
            changeTabName,
            setTabSubheading
        } = this.props;

        if (!isSignedIn()) {
            return;
        }

        const order = await getOrderById(orderId);

        if (!order) {
            history.replace(appendWithStoreCode(`${ ACCOUNT_ORDER_HISTORY }`));

            return;
        }

        const { items: [{ increment_id, id: uid }], items } = order;
        // decode uid of order before setting into state
        items[0].id = atob(uid);
        changeTabName(('Order Details'));
        setTabSubheading(('Order Id: # %s', increment_id));
        this.handleChangeHeaderState();
        this.setState({ order: items[0], isLoading: false });
    }

    render() {
        return (
            <MyAccountOrder
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountOrderContainer);
