/* eslint-disable max-len */
import Link from 'Component/Link';
import {
    ORDER_ITEMS,
    ORDER_SHIPMENTS
} from 'Component/MyAccountOrder/MyAccountOrder.config';
import MyAccountOrderItemsTableRow from 'Component/MyAccountOrderItemsTableRow';
import MyAccountOrderTotals from 'Component/MyAccountOrderTotals';
import { MyAccountOrderItemsTable as SourceMyAccountOrderItemsTable } from 'SourceComponent/MyAccountOrderItemsTable/MyAccountOrderItemsTable.component';
import { getTimeInCurrentTimezone } from 'Util/Manipulations/Date';
import { getProductFromOrder } from 'Util/Orders';

import './MyAccountOrderItemsTable.style';

/** @namespace Seedsman/Component/MyAccountOrderItemsTable/Component */
export class MyAccountOrderItemsTableComponent extends SourceMyAccountOrderItemsTable {
    renderItems() {
        const {
            items: { items: products = [] }
        } = this.props;

        return products.map(this.renderItemRow.bind(this));
    }

    renderItemRow(product) {
        const {
            activeTab,
            allOrderItems,
            items: { comments = [], created_at = [] }
        } = this.props;

        const { product_sku, product_url_key } = product;
        const { entered_options = [], selected_options = [], small_image } = getProductFromOrder(allOrderItems, product_sku) || {};
        return (
            <MyAccountOrderItemsTableRow
              product={ product }
              small_image={ small_image }
              createdAt={ created_at }
              selectedOptions={ selected_options }
              enteredOptions={ entered_options }
              key={ product_url_key }
              activeTab={ activeTab }
              comments={ comments }
            />
        );
    }

    renderTrackingLink() {
        const { items: { tracking = [] } = {}, activeTab } = this.props;
        const trackingUrl = tracking.map((item) => item.tracking_popup_url);

        if (activeTab !== ORDER_SHIPMENTS || !trackingUrl.length) {
            return null;
        }

        return (
            <div
              block="MyAccountOrderItemsTableRow"
              elem="Tracking"
            >
                <span>
                    Track Your Order
                    <Link to={ trackingUrl[0] } target="_blank" rel="noreferrer">Here</Link>
                </span>
            </div>
        );
    }

    renderTotals() {
        const { total, activeTab } = this.props;

        if (activeTab === ORDER_SHIPMENTS) {
            return null;
        }

        return <MyAccountOrderTotals activeTab={ activeTab } total={ total } />;
    }

    renderComments() {
        const {
            items: { comments = [] },
            activeTab,
            isPrintPage
        } = this.props;

        if (activeTab === ORDER_ITEMS || !comments.length || isPrintPage) {
            return null;
        }

        const commentOrder = comments.sort(
            ({ timestamp: first }, { timestamp: second }) => new Date(second.replace(/-/g, '/'))
                - new Date(first.replace(/-/g, '/'))
        );

        return (
            <div block="MyAccountOrderItemsTable" elem="Comments">
                <div block="MyAccountOrderItemsTable" elem="CommentsTitle">
                About Your %s, activeTab
                </div>
                <div block="MyAccountOrderItemsTable" elem="CommentsList">
                    { commentOrder.map(({ timestamp, message }) => (
                        <dl block="MyAccountOrderItemsTable" elem="Comment">
                            <dt>{ getTimeInCurrentTimezone(timestamp) }</dt>
                            <dd>{ message }</dd>
                        </dl>
                    )) }
                </div>
            </div>
        );
    }

    render() {
        return (
            <div block="MyAccountOrderItemsTable" elem="ProductsWrapper">
                { this.renderItems() }
                { this.renderComments() }
                { this.renderTrackingLink() }
            </div>
        );
    }
}

export default MyAccountOrderItemsTableComponent;
