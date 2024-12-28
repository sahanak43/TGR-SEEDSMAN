/* eslint-disable no-magic-numbers */
/* eslint-disable fp/no-let */
import {
    OrderQuery as SourceOrderQuery
} from 'SourceQuery/Order.query';
import { Field } from 'Util/Query';
/** @namespace Seedsman/Query/Order/Query */
export class OrderQuery extends SourceOrderQuery {
    getOrderListQuery(options) {
        return new Field('customer')
            .addField('email')
            .addFieldList(this._getOrderListFields(options));
    }

    _getOrderSubtotalInclusiveTaxField() {
        return new Field('subtotal_incl_tax')
            .addFieldList(this._getOrderPriceFields());
    }

    _getOrdersField(options) {
        const { orderId, page = 1, sortValue } = options || {};
        const ordersField = new Field('orders');

        if (orderId) {
            return ordersField
                .addArgument('filter', 'CustomerOrdersFilterInput', { entity_id: { eq: orderId } })
                .addFieldList(this._getOrdersFields(true));
        }

        return ordersField
            .addArgument('currentPage', 'Int', page)
            .addArgument('pageSize', 'Int', 10)
            .addArgument('sort', 'SortOrders', sortValue)
            .addFieldList(this._getOrdersFields());
    }

    _getRowSubtotal() {
        return new Field('row_subtotal').addFieldList(['value', 'currency']);
    }

    _getOrderItemsFields(isSingleOrder) {
        const basicFields = super._getOrderItemsFields();
        basicFields.push(
            'state',
            'shipping_method',
            this._getOrderPaymentMethodsField(),
            this._getOrderShippingAddressField(),
            this._getOrderItemTotalField(isSingleOrder),
            this._getOrderItemProductField(),
            'store_credit_used',
            'cj_action_id',
            'cj_customer_status',
            'cj_enterprise_id',
            'cj_extension_version',
            'customer_id',
            'customer_email',
            'coupon_code',

        );

        if (isSingleOrder) {
            return [...basicFields, ...this._getSingleOrderFields()];
        }

        return basicFields;
    }

    _getOrderItemTotalField(isSingleOrder) {
        return new Field('total')
            .addFieldList(this._getOrderItemTotalFields(isSingleOrder));
    }

    _getOrderItemProductsFields() {
        const fields = super._getOrderItemProductsFields();
        fields.push(
            'product_url',
            'small_image',
            'quantity_invoiced',
            'url'
        );

        return fields;
    }

    _getOrderItemProductField() {
        return new Field('items')
            .addFieldList(this._getOrderItemProductFields());
    }

    _getOrderItemProductFields() {
        const productFields = [
            'id',
            'product_name',
            'product_id',
            'product_price',
            'quantity_ordered',
            'small_image',
            'product_url',
            'product_parent_sku',
            'url',
            this._getOrderProductSalePriceField(),
            this._getRowSubtotal(),
            this._getOrderDiscountsField()
        ];

        return productFields;
    }

    _getOrderAddressFields() {
        return [
            'city',
            'country_id',
            'country_code',
            'firstname',
            'lastname',
            'postcode',
            'region',
            'region_id',
            'telephone',
            'vat_id',
            this._getOrderAddressStreetField()
        ];
    }

    _getOrderSortList() {
        return new Field('getOrderSortList')
            .addFieldList(this.getOrderSortListFields());
    }

    getOrderSortListFields() {
        return [
            'value',
            'label'
        ];
    }

    _getProductOrderList(sort) {
        return new Field('getOrderList')
            .addArgument('sort', 'String!', sort)
            .addFieldList(this.getProductOrderListFields());
    }

    getProductOrderListFields() {
        return [
            new Field('items').addFieldList([
                new Field('base_order_info').addFieldList([
                    'id',
                    'status',
                    'created_at',
                    'grand_total'
                ])
            ])
        ];
    }

    _getOrderShipmentTrackingFields() {
        const fields = super._getOrderShipmentTrackingFields();
        fields.push('tracking_popup_url');

        return fields;
    }

    _getOrderFoomanField() {
        return new Field('fooman_applied_surcharges')
            .addFieldList(this._getOrderFoomanChargeFields());
    }

    _getOrderFoomanChargeFields() {
        return [
            'label',
            this._getOrderAmountField()
        ];
    }

    _getOrderExtraFeeField() {
        return new Field('extra_fee')
            .addFieldList([
                'label',
                'amount'
            ]);
    }

    _getOrderItemTotalFields(isSingleOrder) {
        if (isSingleOrder) {
            return [
                this._getOrderGrandTotalField(),
                this._getOrderDiscountsField(),
                this._getOrderBaseGrantTotalField(),
                this._getOrderSubtotalField(),
                this._getOrderSubtotalInclusiveTaxField(),
                this._getOrderTotalShippingField(),
                this._getOrderTotalTaxField(),
                this._getOrderShippingHandlingField(),
                this._getOrderTaxesField(),
                this._getOrderFoomanField(),
                this._getOrderExtraFeeField()
            ];
        }

        return [
            this._getOrderGrandTotalField(),
            this._getOrderDiscountsField(),
            this._getOrderBaseGrantTotalField(),
            this._getOrderSubtotalField(),
            this._getOrderTotalShippingField(),
            this._getOrderTotalTaxField(),
            this._getOrderShippingHandlingField(),
            this._getOrderTaxesField(),
            this._getOrderFoomanField(),
            this._getOrderExtraFeeField()
        ];
    }

    _getInvoiceItemsProductsField() {
        return new Field('items')
            .addFieldList([
                this._getRefundsItemInformationField(),
                this._getInvoiceItemProductsFields()
            ]);
    }

    _getShipmentsItemsProductsField() {
        return new Field('items')
            .addFieldList([
                this._getRefundsItemInformationField(),
                this._getShipmentsItemsProductsFields()]);
    }

    _getRefundsItemInformationField() {
        return new Field('order_item')
            .addFieldList(this._getOrderItemProductsFields());
    }
}
export default new OrderQuery();
