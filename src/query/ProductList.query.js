/* eslint-disable max-lines */
import {
    ProductListQuery as SourceProductListQuery
} from 'SourceQuery/ProductList.query';
import { Field } from 'Util/Query';

/** @namespace Seedsman/Query/ProductList/Query */
export class ProductListQuery extends SourceProductListQuery {
    _getCartProductInterfaceFields() {
        const fields = super._getCartProductInterfaceFields();
        fields.push(this._getPriceRangeField());

        return fields;
    }

    _getCartProductField() {
        return new Field('product')
            .addFieldList([
                'id',
                'sku',
                'stock_status',
                'salable_qty',
                this._getStockItemField(),
                this._getPriceRangeField(),
                this._getProductThumbnailField(),
                this._getAttributesField(true, true)
            ]);
    }

    _getReviewsField() {
        const { sort, currentPage = 1 } = this.options;
        return new Field('reviews')
            // eslint-disable-next-line no-magic-numbers
            .addArgument('pageSize', 'Int', 4)
            .addArgument('currentPage', 'Int', currentPage)
            .addArgument('sort', 'ReviewSortEnum', sort)
            .addFieldList(this._getReviewsFields())
            .addFieldList(this._getReviewPageInfoField());
    }

    _getItemsField() {
        const { isSingleProduct } = this.options;

        const items = new Field('items')
            .addFieldList(this._getProductInterfaceFields());
            // .addFieldList(this._getRatingBreakdownFields());

        if (isSingleProduct) {
            // items.addField(this._getGroupedProductItems());
            items.addField(this._getDownloadableProductFields());
        } else {
            items.addField(this._getDownloadableProductLinksRequired());
        }

        return items;
    }

    _getRatingBreakdownFields() {
        return [new Field('rating_breakDown')
            .addFieldList(this.getRatingBreakdownDetails())];
    }

    getRatingBreakdownDetails() {
        return [
            'value',
            'count'
        ];
    }

    _getReviewPageInfoField() {
        return [new Field('page_info')
            .addFieldList(this.getPageInfoDetails())];
    }

    getPageInfoDetails() {
        return [
            'current_page',
            'page_size',
            'total_pages'
        ];
    }

    getQuery(options) {
        if (!options) {
            throw new Error('Missing argument `options`');
        }

        this.options = options;

        return this._getProductsField();
    }

    getCategoryPathField() {
        return new Field('category_path').addFieldList([
            'category_id',
            'category_path'
        ]);
    }

    _getProductInterfaceFields(isVariant, isForLinkedProducts = false,
        isForWishlist = false, seedsfinder_attributes = false) {
        const {
            isPlp = false,
            isSingleProduct,
            noAttributes = false,
            noVariants = false,
            noVariantAttributes = false
        } = this.options;

        // set option to always request images for product variants if they're requested for wishlist
        if (isForWishlist) {
            this.options.isForWishlist = true;
        }

        // Basic fields returned always
        const fields = [
            'uid',
            'id',
            'sku',
            'name',
            'tile_title',
            'type_id',
            'qty',
            'quantity',
            'stock_status',
            'salable_qty',
            'alt_text',
            'meta_keyword',
            'meta_description',
            'meta_title',
            'exclude_in_characteristics',
            this._getStockItemField(),
            this._getPriceRangeField(),
            this.getCategoryPathField()
        ];

        // Additional fields, which we want to return always, except when it's variants on PLP (due to hugh number of items)
        if (!(isPlp && isVariant) || isForWishlist) {
            fields.push(
                this._getProductImageField(),
                this._getProductThumbnailField(),
                this._getProductSmallField(),
                this._getShortDescriptionField(),
                'special_from_date',
                'special_to_date',
                this._getTierPricesField(),
                this.getSeedsFinderAttributes(seedsfinder_attributes)
            );
        }

        // if it is normal product and we need attributes
        // or if, it is variant, but we need variant attributes or variants them-self
        if ((!isVariant && !noAttributes) || (isVariant && !noVariantAttributes && !noVariants)) {
            fields.push(this._getAttributesField(isVariant));
        }

        // to all products (non-variants)
        if (!isVariant) {
            fields.push(
                'url',
                this._getUrlRewritesFields(),
                this._getReviewCountField(),
                this._getRatingSummaryField(),
                this._getCustomizableProductFragment()
            );

            // if variants are not needed
            if (!noVariants) {
                fields.push(
                    this._getConfigurableProductFragment(),
                    this._getBundleProductFragment(),
                    this._getGroupedProductItems()
                );
            }
        }

        // prevent linked products from looping
        if (isForLinkedProducts) {
            fields.push(this._getProductLinksField());
        }

        // additional information to PDP loads
        if (isSingleProduct) {
            fields.push(
                'stock_status',
                this._getDescriptionField(),
                this._getMediaGalleryField(),
                this._getSimpleProductFragment()
            );

            // for variants of PDP requested product
            if (!isVariant) {
                fields.push(
                    'canonical_url',
                    'meta_title',
                    // 'meta_keyword',
                    'meta_description',
                    this._getCategoriesField(),
                    // this._getReviewsField(),
                    this._getVirtualProductFragment(),
                    this._getCustomizableProductFragment(),
                    this._getProductLinksField(),
                    this._getOGdata()
                );
            }
        }

        return fields;
    }

    getSeedsFinderAttributes(seedsfinder_attributes) {
        if (!seedsfinder_attributes) {
            return null;
        }

        return new Field('seedsfinder_attribute_status')
            .addFieldList([
                'attribute_label',
                'attribute_status'
            ]);
    }

    _getProductFields() {
        const { requireInfo, isSingleProduct, notRequireInfo } = this.options;

        // do not request total count for PDP
        if (isSingleProduct || notRequireInfo) {
            return [
                this._getItemsField()
            ];
        }

        // for filters only request
        if (requireInfo) {
            return [
                this._getSortField(),
                this._getAggregationsField(),
                'min_price',
                'max_price'
            ];
        }

        return [
            'total_count',
            this._getItemsField(),
            this._getPageInfoField(),
            'min_price',
            'max_price'
        ];
    }

    _getOGdata() {
        return new Field('open_graph_tags')
            .addFieldList([
                'og_title',
                'og_description',
                'og_url',
                'og_site_name'
            ]);
    }

    _getAttributeOptionField(noSwatches) {
        return [
            'label',
            'value',
            'brand_label',
            !noSwatches && this._getSwatchDataField()
        ];
    }
}

export default new ProductListQuery();
