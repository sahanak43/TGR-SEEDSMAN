/* eslint-disable no-magic-numbers */
import { Field } from 'SourceUtil/Query';

/**
 * Ordered Summary Query
 * @class OrderedSummaryQuery
 * @namespace Seedsman/Query/NotifyStockStatus/Query */
export class NotifyStockStatusQuery {
    getNotifyStockStatus(options) {
        const {
            id, parentId, website_id, email
        } = options;

        return new Field('subscribeStockNotice')
            .addArgument('product_id', 'Int!', id)
            .addArgument('parent_id', 'Int!', parentId)
            .addArgument('website_id', 'Int!', website_id)
            .addArgument('email', 'String', email)
            .addField('message')
            .addField('params');
    }

    getListByCustomer() {
        return new Field('getListByCustomer')
            .addField(this.getItemsFields());
    }

    getItemsFields() {
        return new Field('items')
            .addFieldList(this.getFields());
    }

    getFields() {
        return [
            'add_date',
            'alert_stock_id',
            'customer_email',
            'customer_id',
            'customer_name',
            'parent_id',
            'parent_product_sku',
            'product_id',
            'product_image',
            'product_name',
            'product_price',
            'product_sku',
            'product_url',
            'send_count',
            'send_date',
            'status',
            'stock_status',
            'store_id',
            'website_id',
            this.getSelectedValues()
        ];
    }

    getSelectedValues() {
        return new Field('selected_values')
            .addFieldList(this.getselectedFieldList());
    }

    getselectedFieldList() {
        return [
            'value',
            'label'
        ];
    }

    getUnsubscribeAllMutation() {
        return new Field('unsubscribeAllStockNotice')
            .addArgument('website_id', 'Int!', 1)
            .addFieldList([
                'message',
                'params'
            ]);
    }

    onUnsubscribeProductWise(prod_id, parent_id, website_id) {
        return new Field('unsubscribeStockNotice')
            .addArgument('website_id', 'Int!', website_id)
            .addArgument('product_id', 'Int!', prod_id)
            .addArgument('parent_id', 'Int!', parent_id)
            .addFieldList([
                'message',
                'params'
            ]);
    }
}

export default new NotifyStockStatusQuery();
