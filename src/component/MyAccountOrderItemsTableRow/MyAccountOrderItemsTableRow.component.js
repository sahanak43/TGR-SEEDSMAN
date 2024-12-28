/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable consistent-return */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable max-lines */
/* eslint-disable max-len */
import Html from 'Component/Html';
import Link from 'Component/Link';
import {
    ORDER_INVOICES,
    ORDER_ITEMS,
    ORDER_REFUNDS,
    ORDER_SHIPMENTS
} from 'Component/MyAccountOrder/MyAccountOrder.config';
import { MyAccountOrderItemsTableRow as SourceMyAccountOrderItemsTableRow } from 'SourceComponent/MyAccountOrderItemsTableRow/MyAccountOrderItemsTableRow.component';
import { formatDateTime } from 'Util/DateTime';
import { getOrderItemRowDiscount } from 'Util/Orders';
import { formatPrice } from 'Util/Price';

import './MyAccountOrderItemsTableRow.style';

/** @namespace Seedsman/Component/MyAccountOrderItemsTableRow/Component */
export class MyAccountOrderItemsTableRowComponent extends SourceMyAccountOrderItemsTableRow {
    renderItemPrice() {
        const { activeTab } = this.props;

        if (activeTab === ORDER_SHIPMENTS || activeTab === ORDER_INVOICES) {
            const {
                product: {
                    order_item: {
                        product_sale_price: { value, currency }
                    } = {}
                }
            } = this.props;

            return this.renderPrice(value, currency, 'Price');
        }

        const {
            product: {
                product_sale_price: { value, currency }
            }
        } = this.props;

        return this.renderPrice(value, currency, 'Price');
    }

    renderRowSubtotal() {
        const {
            activeTab,
            product: { row_subtotal: { value, currency } = {} }
        } = this.props;

        if (activeTab === ORDER_SHIPMENTS) {
            return null;
        }

        return this.renderPrice(value, currency, 'Subtotal');
    }

    renderPrice(value, currency) {
        return <div className="totalPrice">{ formatPrice(value, currency) }</div>;
    }

    renderOptionItem(item, isLastOptionItem) {
        const {
            product: {
                quantity_ordered = 1,
                product_sale_price: { currency }
            }
        } = this.props;
        const { qty, title, price } = item;

        return (
            <tr
              block="MyAccountOrderItemsTableRow"
              elem="EnteredRow"
              mods={ { isLastOptionItem } }
              key={ `${qty}-${title}` }
            >
                <td data-th="Product Name">{ `${qty} x ${title}` }</td>
                <td data-th="SKU">{ title }</td>
                { this.renderEnteredOptionPrice(formatPrice(price, currency)) }
                <td
                  block="MyAccountOrderItemsTableRow"
                  elem="EnteredQty"
                  data-th="Qty"
                >
                    { quantity_ordered * qty }
                </td>
                <td />
            </tr>
        );
    }

    renderEnteredOptionPrice(price) {
        const { activeTab } = this.props;

        if (activeTab === ORDER_SHIPMENTS) {
            return null;
        }

        return (
            <td
              block="MyAccountOrderItemsTableRow"
              elem="EnteredPrice"
              data-th="Price"
            >
                <strong>{ price }</strong>
            </td>
        );
    }

    renderEnteredOptionAsRow(option, index) {
        const { colSpanCount, enteredOptions } = this.props;
        const { label, items } = option;
        const { renderOptionItem } = this.renderMap;

        if (!items) {
            return null;
        }

        const isLastOptionItem = enteredOptions.length - 1 === index;

        return (
            <>
                <tr
                  block="MyAccountOrderItemsTableRow"
                  elem="EnteredLabel"
                  key={ `${label}-${index}` }
                >
                    <td colSpan={ colSpanCount }>
                        <strong>{ label }</strong>
                    </td>
                </tr>
                { items.map((item) => renderOptionItem(item, isLastOptionItem)) }
            </>
        );
    }

    renderEnteredOptionsAsRow() {
        const { enteredOptions } = this.props;
        const { renderEnteredOptionAsRow } = this.renderMap;

        if (!enteredOptions.length) {
            return null;
        }

        return enteredOptions.map(renderEnteredOptionAsRow);
    }

    renderOption(option) {
        const { label, items, value } = option || [];

        if (items) {
            return null;
        }

        return (
            <dl key={ `${label}-${value}` }>
                <dt block="MyAccountOrderItemsTableRow" elem="OptionLabel">
                    <strong>{ label }</strong>
                </dt>
                { this.renderOptionContent(option) }
            </dl>
        );
    }

    renderOptionContent(option) {
        const { value = '', linkItems = [] } = option;

        if (linkItems && linkItems.length) {
            return linkItems.map(this.renderLink.bind(this));
        }

        return (
            <dd block="MyAccountOrderItemsTableRow" elem="OptionValue">
                <Html content={ value } />
            </dd>
        );
    }

    renderLink(title, index) {
        return (
            <dd
              block="MyAccountOrderItemsTableRow"
              elem="DownloadableLink"
              key={ `${title}-${index}` }
            >
                { title }
            </dd>
        );
    }

    renderDiscountAndRowTotal() {
        const {
            activeTab,
            product: {
                row_subtotal: { value: row_subtotal, currency } = {},
                discounts = []
            },
            isMobile
        } = this.props;

        if (activeTab !== ORDER_REFUNDS) {
            return null;
        }

        const totalDiscount = discounts.length
            ? getOrderItemRowDiscount(discounts)
            : 0;

        if (isMobile) {
            return (
                <>
                    { this.renderPrice(
                        -totalDiscount,
                        currency,
                        'Discount Amount'
                    ) }
                    { this.renderPrice(
                        row_subtotal - totalDiscount,
                        currency,
                        'Row Total'
                    ) }
                </>
            );
        }

        return (
            <>
                <td>
                    <strong>{ formatPrice(-totalDiscount, currency) }</strong>
                </td>
                <td>
                    <strong>
                        { formatPrice(row_subtotal - totalDiscount, currency) }
                    </strong>
                </td>
            </>
        );
    }

    renderQuantity() {
        const {
            activeTab,
            product: { quantity_ordered, quantity_shipped, quantity_invoiced }
        } = this.props;

        if (activeTab === ORDER_ITEMS) {
            return quantity_ordered;
        }

        if (activeTab === ORDER_INVOICES) {
            return quantity_invoiced;
        }

        if (activeTab === ORDER_SHIPMENTS) {
            return quantity_shipped;
        }
    }

    renderInvoiceAndShipmentQuantity() {
        const {
            activeTab,
            product: {
                order_item: { quantity_shipped, quantity_invoiced }
            }
        } = this.props;

        if (activeTab === ORDER_INVOICES) {
            return quantity_invoiced;
        }

        if (activeTab === ORDER_SHIPMENTS) {
            return quantity_shipped;
        }
    }

    renderInvoiceAndShipmentsTable() {
        const {
            product: { order_item: { url, product_name, small_image } = {} },
            createdAt
        } = this.props;

        return (
            <div block="MyAccountOrderItemsTableRow" elem="Product">
                <Link
                  to={ url }
                  className="Image Image_ratio_square Image_imageStatus_1 Image_hasSrc "
                >
                    <img
                      alt=""
                      width="auto"
                      height="auto"
                      className="Image-Image"
                      ll-loaded="true"
                      src={ small_image }
                    />
                </Link>
                <div className="Content">
                    <div block="MyAccountOrderItemsTableRow" elem="OrderTitle">
                        <Link
                          to={ url }
                          block="MyAccountOrderItemsTableRow"
                          elem="Name"
                          bablic-exclude="true"
                        >
                            { product_name }
                        </Link>
                        <div
                          block="MyAccountOrderItemsTableRow"
                          elem="OrderDate"
                        >
                            <span>{ formatDateTime(createdAt, false) }</span>
                        </div>
                    </div>
                    <div
                      block="MyAccountOrderItemsTableRow"
                      elem="QuantityPrice"
                    >
                        <label htmlFor="quantity">Item:</label>
                        <span className="quantity">
                            { this.renderInvoiceAndShipmentQuantity() }
                        </span>
                        <div
                          block="MyAccountOrderItemsTableRow"
                          elem="TotalPrice"
                        >
                            { this.renderItemPrice() }
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderTableRow() {
        const {
            product: { product_name, url, small_image },
            small_image: smallImg,
            createdAt,
            activeTab
        } = this.props;

        if (activeTab === ORDER_INVOICES || activeTab === ORDER_SHIPMENTS) {
            return this.renderInvoiceAndShipmentsTable();
        }

        return (
            <>
                { this.renderEnteredOptionsAsRow() }
                <div block="MyAccountOrderItemsTableRow" elem="Product">
                    <Link
                      to={ url }
                      className="Image Image_ratio_square Image_imageStatus_1 Image_hasSrc "
                    >
                        <img
                          alt=""
                          width="auto"
                          height="auto"
                          className="Image-Image"
                          ll-loaded="true"
                          src={ small_image || smallImg }
                        />
                    </Link>
                    <div className="Content">
                        <div
                          block="MyAccountOrderItemsTableRow"
                          elem="OrderTitle"
                        >
                            <Link
                              to={ url }
                              block="MyAccountOrderItemsTableRow"
                              elem="Name"
                              bablic-exclude="true"
                            >
                                { product_name }
                            </Link>
                            <div
                              block="MyAccountOrderItemsTableRow"
                              elem="OrderDate"
                            >
                                <span>{ formatDateTime(createdAt, false) }</span>
                            </div>
                        </div>
                        <div
                          block="MyAccountOrderItemsTableRow"
                          elem="QuantityPrice"
                        >
                            <label htmlFor="quantity"> Item:</label>
                            <span className="quantity">
                                { this.renderQuantity() }
                            </span>
                            <div
                              block="MyAccountOrderItemsTableRow"
                              elem="TotalPrice"
                            >
                                { this.renderItemPrice() }
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    render() {
        return this.renderTableRow();
    }
}

export default MyAccountOrderItemsTableRowComponent;
