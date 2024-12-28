import PRODUCT_TYPE from 'Component/Product/Product.config';
import {
    ProductPrice as SourceProductPrice
} from 'SourceComponent/ProductPrice/ProductPrice.component';

import './ProductPrice.override.style';

/** @namespace Seedsman/Component/ProductPrice/Component */
export class ProductPriceComponent extends SourceProductPrice {
    priceLabelTypeMap = {
        [PRODUCT_TYPE.simple]: 'Starting at',
        [PRODUCT_TYPE.virtual]: 'Starting at',
        [PRODUCT_TYPE.bundle]: 'Starting at',
        [PRODUCT_TYPE.grouped]: 'Starting at',
        [PRODUCT_TYPE.downloadable]: 'Starting at',
        [PRODUCT_TYPE.configurable]: 'From: '
    };

    renderDiscount() {
        const { discountPercentage } = this.props;

        if (!discountPercentage) {
            return null;
        }

        return (
            <span
              aria-label="Current product discount"
              block="ProductPrice"
              elem="Discount"
            >
                { (`${Math.floor(discountPercentage)}% off`) }
            </span>
        );
    }

    renderPrice(price, label) {
        const {
            discountPercentage
        } = this.props;

        const {
            value: priceValue,
            valueFormatted: priceFormatted = 0
        } = price;

        const { itemProp = null, content = null } = this.getCurrentPriceSchema();

        // Use <ins></ins> <del></del> to represent new price and the old (deleted) one
        const PriceSemanticElementName = discountPercentage > 0 ? 'ins' : 'span';

        // force unequal comparison - unsure of resulting type
        // eslint-disable-next-line
        if (priceValue == 0) {
            return null;
        }

        return (
            <PriceSemanticElementName block="ProductPrice" elem="Price">
                { this.renderPriceBadge(label) }
                <span
                  itemProp={ itemProp }
                  content={ content }
                  block="ProductPrice"
                  elem="PriceValue"
                  data-productPrice={ priceFormatted }
                >
                    { priceFormatted }
                </span>
            </PriceSemanticElementName>
        );
    }

    renderDefaultPrice(defaultLabel = null) {
        const {
            price: { finalPrice = {}, finalPriceExclTax = {} } = {},
            label
        } = this.props;

        return (
            <>
                { this.renderOldPrice() }
                { this.renderPriceWithOrWithoutTax(finalPrice, finalPriceExclTax, defaultLabel || label) }
                { this.renderSchema() }
                { this.renderDiscount() }
            </>
        );
    }
}

export default ProductPriceComponent;
