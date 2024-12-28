import { Field } from 'SourceUtil/Query';

/** @namespace Seedsman/Query/Xsearch/Query */
export class XsearchQuery {
    getSearchProductQuery(search) {
        return new Field('xsearchProducts')
            .addArgument('search', 'String!', search)
            .addFieldList(this.getProductsList());
    }

    getRelatedTermsQuery(search) {
        return new Field('xsearchRelatedTerms')
            .addArgument('search', 'String!', search)
            .addField(this.getRelatedItemList());
    }

    getRecentSearchesQuery() {
        return new Field('xsearchRecentSearches')
            .addFieldList(this.getRecentSearchList());
    }

    getSearchCategoriesQuery(search) {
        return new Field('xsearchCategories')
            .addArgument('search', 'String!', search)
            .addFieldList(this.getSearchCategoryList());
    }

    getProductsList() {
        return [
            'code',
            this.getItems(),
            'total_count'
        ];
    }

    getItems() {
        return new Field('items')
            .addFieldList([
                'sku',
                'name',
                'qty',
                'stock_status',
                'url',
                'type_id',
                this.getImageUrl(),
                this.getPrice(),
                this.getAttributes(),
                this.getStockItemStatus(),
                this._getCartVariantsField()
            ]);
    }

    getStockItemStatus() {
        return new Field('stock_item')
            .addFieldList(['in_stock']);
    }

    _getCartVariantsField() {
        return new Field('variants')
            .setAlias('variants')
            .addFieldList(this._getCartVariantFields());
    }

    _getCartVariantFields() {
        return [
            this._getCartProductField()
        ];
    }

    _getCartProductField() {
        return new Field('product')
            .addFieldList([
                'id',
                'sku',
                'stock_status',
                'salable_qty',
                this.getStockItemStatus()
            ]);
    }

    getAttributes() {
        return new Field('attributes')
            .addFieldList([' attribute_code',
                'attribute_value',
                this.getAttributeoption()]);
    }

    getAttributeoption() {
        return new Field('attribute_options')
            .addFieldList([
                'label',
                'value'
            ]);
    }

    getPrice() {
        return new Field('price_range')
            .addField(this.getMinPrice())
            .addField(this.getMaxPrice());
    }

    getMaxPrice() {
        return new Field('maximum_price')
            .addField(this.getFinalPrice())
            .addField(this.getDiscountPrice());
    }

    getMinPrice() {
        return new Field('minimum_price')
            .addField(this.getFinalPrice())
            .addField(this.getDiscountPrice());
    }

    getFinalPrice() {
        return new Field('final_price')
            .addFieldList([
                'currency',
                'value'
            ]);
    }

    getDiscountPrice() {
        return new Field('discount')
            .addFieldList([
                'amount_off',
                'percent_off'
            ]);
    }

    getImageUrl() {
        return new Field('thumbnail')
            .addField('url');
    }

    getRelatedItemList() {
        return new Field('items')
            .addFieldList([
                'count',
                'name'
            ]);
    }

    getRecentSearchList() {
        return [
            'code',
            this.getRecentSearchItems(),
            'total_count'
        ];
    }

    getRecentSearchItems() {
        return new Field('items')
            .addFieldList([
                'name',
                'num_results',
                'url'
            ]);
    }

    getSearchCategoryList() {
        return [
            'code',
            this.getCategorySearchItems(),
            'total_count'
        ];
    }

    getCategorySearchItems() {
        return new Field('items')
            .addFieldList([
                'name',
                'url',
                'product_count'
            ]);
    }
}
export default new XsearchQuery();
