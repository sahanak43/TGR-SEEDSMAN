import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import {
    MyAccountMyOrdersContainer as SourceMyAccountMyOrdersContainer
} from 'SourceComponent/MyAccountMyOrders/MyAccountMyOrders.container';
import { showNotification } from 'Store/Notification/Notification.action';
import { DeviceType } from 'Type/Device.type';
import { OrdersListType } from 'Type/Order.type';
import { scrollToTop } from 'Util/Browser';
import { fetchQuery, getErrorMessage } from 'Util/Request';
import { getQueryParam, setQueryParams } from 'Util/Url';

import OrderQuery from '../../query/Order.query';
import MyAccountMyOrders from './MyAccountMyOrders.component';

export const OrderDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Order/Order.dispatcher'
);

/** @namespace Seedsman/Component/MyAccountMyOrders/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    orderList: state.OrderReducer.orderList,
    isLoading: state.OrderReducer.isLoading,
    device: state.ConfigReducer.device
});

/** @namespace Seedsman/Component/MyAccountMyOrders/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    getOrderList: (page, sortValue) => OrderDispatcher.then(
        ({ default: dispatcher }) => dispatcher.requestOrders(dispatch, page, sortValue)
    ),
    showErrorNotification: (message) => dispatch(showNotification('error', message))

});

/** @namespace Seedsman/Component/MyAccountMyOrders/Container */
export class MyAccountMyOrdersContainer extends SourceMyAccountMyOrdersContainer {
        static propTypes = {
            orderList: OrdersListType.isRequired,
            isLoading: PropTypes.bool.isRequired,
            device: DeviceType.isRequired
        };

       state = {
           isLoading: false,
           sortVal: null,
           orderSortList: []
       };

       componentDidMount() {
           const { getOrderList } = this.props;
           const { sortVal } = this.state;

           getOrderList(this._getPageFromUrl(), sortVal);
           this.getOrderSortList();
       }

       componentDidUpdate(prevProps) {
           const { getOrderList } = this.props;
           const { sortVal } = this.state;
           const { location: prevLocation } = prevProps;
           const prevPage = this._getPageFromUrl(prevLocation);
           const currentPage = this._getPageFromUrl();

           if (currentPage !== prevPage) {
               if (sortVal === '') {
                   getOrderList(this._getPageFromUrl());
               } else {
                   getOrderList(this._getPageFromUrl(), sortVal);
               }

               scrollToTop();
           }
       }

       async getOrderSortList() {
           const { showErrorNotification } = this.props;

           this.setState({ isLoading: true });
           try {
               const {
                   getOrderSortList
               } = await fetchQuery(OrderQuery._getOrderSortList());

               this.setState({ getOrderSortList, isLoading: false });
           } catch (e) {
               showErrorNotification(getErrorMessage(e));
               this.setState({ isLoading: false });
           }
       }

       handleSortingSelect(sortValue) {
           const { getOrderList, location, history } = this.props;

           setQueryParams({ page: '' }, location, history);
           if (sortValue === '') {
               getOrderList(1);
           } else {
               getOrderList(1, sortValue);
           }
           this.setState({ sortVal: sortValue });
       }

       containerProps() {
           const {
               orderList, isLoading, device
           } = this.props;
           const { sortVal } = this.state;

           return {
               orderList,
               isLoading,
               device,
               orderSortList: this._getOrderSorttList(),
               sortVal
           };
       }

       _getOrderSorttList() {
           return this.state?.getOrderSortList;
       }

       _getPageFromUrl(url) {
           const { location: currentLocation } = this.props;
           const location = url || currentLocation;

           return +(getQueryParam('page', location) || 1);
       }

        containerFunctions = {
            handleSortingSelect: this.handleSortingSelect.bind(this)
        };

        render() {
            return (
            <MyAccountMyOrders
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
            );
        }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MyAccountMyOrdersContainer));
