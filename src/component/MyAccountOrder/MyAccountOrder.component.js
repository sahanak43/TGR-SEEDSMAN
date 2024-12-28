/* eslint-disable @scandipwa/scandipwa-guidelines/create-config-files */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable max-len */
/* eslint-disable max-lines */
/* eslint-disable react/boolean-prop-naming */

import Loader from 'Component/Loader';
import MyAccountOrderInformation from 'Component/MyAccountOrderInformation';
import MyAccountOrderItemsTable from 'Component/MyAccountOrderItemsTable';
import MyAccountOrderTabs from 'Component/MyAccountOrderTabs';
import MyAccountOrderTotals from 'Component/MyAccountOrderTotals';
import {
    MyAccountOrder as SourceMyAccountOrder
} from 'SourceComponent/MyAccountOrder/MyAccountOrder.component';
import { formatDateTime } from 'Util/DateTime';

import {
    CANCELLED, COMPLETED,
    NEW,
    ORDER_INVOICES,
    ORDER_ITEMS,
    ORDER_REFUNDS,
    ORDER_SHIPMENTS, PROCESSING
} from './MyAccountOrder.config';

import './MyAccountOrder.style';

/** @namespace Seedsman/Component/MyAccountOrder/Component */
export class MyAccountOrderComponent extends SourceMyAccountOrder {
    tabMap = {
        [ORDER_ITEMS]: {
            tabName: ORDER_ITEMS,
            title: 'Items Ordered',
            shouldTabRender: () => {
                const { order } = this.props;
                return order;
            },
            render: () => {
                const {
                    order: { items = [], increment_id, order_date }
                } = this.props;
                const renderArray = [
                    { items, number: increment_id, created_at: order_date }
                ];
                const { renderOrderItemsTable } = this.renderMap;
                return renderArray.map(renderOrderItemsTable);
            }
        },
        [ORDER_INVOICES]: {
            tabName: ORDER_INVOICES,
            title: 'Invoices',
            shouldTabRender: () => {
                const {
                    order: { invoices = [] }
                } = this.props;

                return invoices.length;
            },
            render: () => {
                const {
                    order: { invoices = [] }
                } = this.props;

                const { renderOrderItemsTable } = this.renderMap;

                return invoices.map(renderOrderItemsTable);
            }
        },
        [ORDER_SHIPMENTS]: {
            tabName: ORDER_SHIPMENTS,
            title: 'Order Shipments',
            shouldTabRender: () => {
                const {
                    order: { shipments = [] }
                } = this.props;

                return shipments.length;
            },
            render: () => {
                const {
                    order: { shipments = [] }
                } = this.props;

                const { renderOrderItemsTable } = this.renderMap;

                return shipments.map(renderOrderItemsTable);
            }
        },
        [ORDER_REFUNDS]: {
            tabName: ORDER_REFUNDS,
            title: 'Refunds',
            shouldTabRender: () => {
                const {
                    order: { credit_memos = [] }
                } = this.props;

                return credit_memos.length;
            },
            render: () => {
                const {
                    order: { credit_memos = [] }
                } = this.props;
                const { renderOrderItemsTable } = this.renderMap;

                return credit_memos.map(renderOrderItemsTable);
            }
        }
    };

    renderOrderInformation() {
        const { order } = this.props;

        return <MyAccountOrderInformation order={ order } />;
    }

    renderOrderItemsTable(items, index) {
        const { activeTab, order: { total: orderTotal, items: allOrderItems, id } } = this.props;
        const { total: itemsTotal, id: itemId, tracking = [] } = items;

        return (
            <MyAccountOrderItemsTable
              key={ `${activeTab}-${id}-${index}` }
              activeTab={ activeTab }
              items={ items }
              tracking={ tracking }
              allOrderItems={ allOrderItems }
              total={ itemsTotal || orderTotal }
              id={ activeTab === ORDER_ITEMS ? id : atob(itemId) }
            />
        );
    }

    renderOrderComments() {
        const {
            activeTab,
            order: { comments = [] }
        } = this.props;

        if (activeTab !== ORDER_ITEMS || !comments || !comments.length) {
            return null;
        }

        return (
            <div block="MyAccountOrder" elem="Comments">
                <div block="MyAccountOrder" elem="CommentsTitle">
                    About Your Order
                </div>
                <div block="MyAccountOrder" elem="CommentsList">
                    { comments.map(({ timestamp, message }) => (
                        <div
                          block="MyAccountOrder"
                          elem="Comment"
                          key={ `${activeTab}-comment-${timestamp}` }
                        >
                            <div className="CommentMessage">{ message }</div>
                            <div>{ formatDateTime(timestamp) }</div>
                        </div>
                    )) }
                </div>
            </div>
        );
    }

    renderStatus() {
        const { order: { status } } = this.props;

        return (
            <div block="MyAccountOrder" elem="Status">
                <span block="label">
                    Order Status:
                </span>
                <span block="value">
                    { status }
                </span>
            </div>
        );
    }

    renderActions() {
        const {
            handleChangeActiveTab,
            activeTab,
            order: {
                order_date, state
            }
        } = this.props;

        return (
            <div block="MyAccountOrder" elem="Actions">
                { this.renderOrderComments() }
                <div block="MyAccountOrder" elem="Status">
                    { this.renderStatus() }
                    { state !== CANCELLED
                        ? (
                            <div block="row_tracking" elem="order_tracking">
                                <div block="status_tracking">
                                    <div block="justify-content-between">
                                        <div block={ state === PROCESSING || state === COMPLETED || state === NEW ? 'order-completed order' : 'order-tracking order' }>
                                            <span block={ state === PROCESSING || state === COMPLETED || state === NEW ? 'is-complete' : 'is-pending' } />
                                            <p block="ordered">Pending</p>
                                            <span block="delivered_date order_date">{ formatDateTime(order_date, false) }</span>
                                        </div>
                                        <div block={ state === COMPLETED ? 'order-completed shipped' : 'order-tracking shipped' }>
                                        <span block={ state === PROCESSING || state === COMPLETED ? 'is-complete' : 'is-pending' } />
                                            <p block="Shipped">Processing</p>
                                            <span block="delivered_date shipped_date">{ formatDateTime(order_date, false) }</span>
                                        </div>
                                        <div block={ state === COMPLETED ? 'order-completed delivery' : 'order-tracking delivery' }>
                                            <span block={ state === COMPLETED ? 'is-complete right-c' : 'is-pending right-c' } />
                                            <p block="Delivered">Complete</p>
                                            <span block="delivered_date delivery_date">{ formatDateTime(order_date, false) }</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null }
                </div>
                <MyAccountOrderTabs
                  tabs={ this.shouldTabsRender() }
                  handleChangeActiveTab={ handleChangeActiveTab }
                  activeTab={ activeTab }
                />
            </div>
        );
    }

    renderTotals() {
        const {
            order: {
                total,
                store_credit_used: storeCredit
            },
            activeTab
        } = this.props;

        if (activeTab === ORDER_SHIPMENTS) {
            return null;
        }

        return (
            <div block="MyAccountOrderTotals" elem="OrderDetails">
                <h4 block="MyAccountOrderTotals" elem="Title">
                    Order Summary
                </h4>
                <MyAccountOrderTotals activeTab={ activeTab } total={ total } storeCredit={ storeCredit } />
            </div>
        );
    }

    renderContent() {
        const {
            order: { items }
        } = this.props;

        if (!items) {
            return null;
        }

        return (
            <>
                { this.renderActions() }
                { this.renderActiveTab() }
                <div block="MyAccountOrder" elem="OrderInformation">
                    { this.renderOrderInformation() }
                    { this.renderTotals() }
                </div>
            </>
        );
    }

    render() {
        const { isLoading } = this.props;

        return (
            <>
                <Loader
                  mix={ { block: 'MyAccountOrder', elem: 'Loader ' } }
                  isLoading={ isLoading }
                />
                { this.renderContent() }
            </>
        );
    }
}

export default MyAccountOrderComponent;
