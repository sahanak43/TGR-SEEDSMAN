/* eslint-disable max-lines */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
/* eslint-disable jsx-a11y/label-has-associated-control */
import Field from 'Component/Field';
import FIELD_TYPE from 'Component/Field/Field.config';
import Link from 'Component/Link';
import Loader from 'Component/Loader';
import MyAccountOrderTableRow from 'Component/MyAccountOrderTableRow';
import Pagination from 'Component/Pagination';
import TextPlaceholder from 'Component/TextPlaceholder';
import {
    MyAccountMyOrders as SourceMyAccountMyOrders
} from 'SourceComponent/MyAccountMyOrders/MyAccountMyOrders.component';
import noOrders from 'Util/images/noOrders.svg';

import './MyAccountMyOrders.override.style';
/** @namespace Seedsman/Component/MyAccountMyOrders/Component */
export class MyAccountMyOrdersComponent extends SourceMyAccountMyOrders {
    renderTable() {
        const { orderSortedItem } = this.props;

        return (
            <table block="MyAccountMyOrders" elem="Table">
                <tbody>
                    <div block="MyAccountMyOrders" elem="Sort">
                        <label>Filter: </label>
                        { this.renderOrderSorting() }
                    </div>
                    { this.renderOrderRows(orderSortedItem?.items) }
                </tbody>
            </table>
        );
    }

    renderOrderSorting() {
        const {
            orderSortList, isLoading, handleSortingSelect, sortVal
        } = this.props;

        if (isLoading) {
            return <TextPlaceholder length="short" />;
        }

        return (
                <div block="OrderSorting">
                    <Field
                      type={ FIELD_TYPE.select }
                      attr={ {
                          id: 'OrderSortingList',
                          name: 'OrderSortingList',
                          defaultValue: sortVal,
                          selectPlaceholder: 'Default'
                      } }
                      events={ {
                          onChange: handleSortingSelect
                      } }
                      options={ orderSortList }
                    />
                </div>
        );
    }

    renderNoOrders() {
        return (
            <div block="MyAccountMyOrders" elem="NoOrders">
                  <div block="MyAccountMyOrders" elem="NoOrdersContent">
                    <div block="MyAccountMyOrders" elem="NoOrdersIcon">
                        <img block="MyAccountMyOrders" elem="Icon" src={ noOrders } alt="noOrders" />
                    </div>
                    <h2 block="MyAccountMyOrders" elem="NoOrdersHeading">
                        No Active orders
                    </h2>
                     <div block="MyAccountMyOrders" elem="NoOrdersContentDetails">
                        There are no recent orders
                     </div>
                    <div block="MyAccountMyOrders" elem="NoOrdersButton">
                        <Link to="/" block="Button MyAccountMyOrders" elem="NoOrder">Continue Shopping</Link>
                    </div>
                  </div>
            </div>
        );
    }

    renderPagination() {
        const {
            isLoading,
            orderList: {
                items = [],
                pageInfo: {
                    total_pages = 0
                } = {}
            }
        } = this.props;

        if (!items.length || total_pages === 0) {
            return null;
        }

        return (
            <Pagination
              isLoading={ isLoading }
              totalPages={ total_pages }
              mix={ { block: 'MyAccountMyOrders', elem: 'Pagination' } }
            />
        );
    }

    shouldComponentUpdate(nextProps) {
        const {
            device, orderList, isLoading, orderSortList
        } = this.props;
        const {
            device: nextDevice,
            orderList: nextOrderList,
            isLoading: nextIsLoading,
            orderSortList: nextorderSortList
        } = nextProps;

        return device !== nextDevice || orderList !== nextOrderList
            || isLoading !== nextIsLoading || orderSortList !== nextorderSortList;
    }

    renderOrderRow(order) {
        const { id, base_order_info: { id: defaultId } = {} } = order;

        return (
            <MyAccountOrderTableRow
              key={ id || defaultId }
              order={ order }
            />
        );
    }

    renderOrderRows() {
        const { orderList: { items = [] }, isLoading } = this.props;

        if (!isLoading && !items.length) {
            return this.renderNoOrders();
        }

        const orders = items.length
            ? items
            : Array.from({ length: 10 }, (_, id) => ({ base_order_info: { id } }));

        return orders.reduceRight(
            (acc, e) => [...acc, this.renderOrderRow(e)],
            []
        );
    }

    render() {
        const { isLoading } = this.props;

        return (
            <div block="MyAccountMyOrders">
                <Loader isLoading={ isLoading } />
                { this.renderTable() }
                { this.renderPagination() }
            </div>
        );
    }
}
export default MyAccountMyOrdersComponent;
