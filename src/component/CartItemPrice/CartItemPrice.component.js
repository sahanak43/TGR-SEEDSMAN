/* eslint-disable max-len */
import {
    CartItemPrice as SourceCartItemPrice
} from 'SourceComponent/CartItemPrice/CartItemPrice.component';
import { formatPrice, roundPrice } from 'Util/Price';

/** @namespace Seedsman/Component/CartItemPrice/Component */
export class CartItemPriceComponent extends SourceCartItemPrice {
    renderDiscountedPrice(regularPrice, discountedPrice) {
        const { currency_code, mix } = this.props;
        return (
            <p block="ProductPrice" aria-label="Product Price" mix={ mix }>
                <span aria-label="Current product price" className="DiscountedPrice">
                    <data value={ discountedPrice }>{ `${formatPrice(discountedPrice, currency_code)}` }</data>
                </span>
                <span aria-label="Original product price" className="RegularPrice">
                    <del value={ regularPrice }>{ `${formatPrice(regularPrice, currency_code)}` }</del>
                </span>
            </p>
        );
    }

    renderPromoPrice() {
        const { currency_code, price } = this.props;

        const value = roundPrice(price);

        return (
            <span aria-label="Current product price" className="PromoPrice">
                <del>{ formatPrice(value, currency_code) }</del>
                { formatPrice(0.00, currency_code) }
            </span>
        );
    }

    renderPrice() {
        const {
            price, qty, currency_code, isWishlistItem, price_range: {
                maximum_price: { final_price: { value: amount } = {} } = {}
            } = {}
        } = this.props;

        const value = isWishlistItem ? roundPrice(amount * qty) : roundPrice(price);

        return (
            <span aria-label="Current product price">
                <data value={ value } data-prouctCurrency={ currency_code } data-productPrice={ value }>{ formatPrice(value, currency_code) }</data>
            </span>
        );
    }

    render() {
        const {
            mix, qty, price, is_promo_item, price_range: {
                maximum_price: { regular_price: { value } = {} } = {}
            } = {},
            variantPriceRange: {
                maximum_price: { regular_price: { value: variantPrice } = {} } = {}
            } = {}, isWishlistItem
        } = this.props;

        const row_total = isWishlistItem ? roundPrice(value * qty) : roundPrice(price);
        const productPrice = roundPrice((variantPrice || value) * qty);

        if (is_promo_item) {
            return (
                <p block="ProductPrice" aria-label="Product Price" mix={ mix }>
                    { this.renderPromoPrice() }
                </p>
            );
        }

        if (parseFloat(row_total) < parseFloat(productPrice)) {
            return (
                <>
                    { this.renderDiscountedPrice(productPrice, row_total) }
                </>
            );
        }

        return (
            <p block="ProductPrice" aria-label="Product Price" mix={ mix }>
                { this.renderPrice() }
                { this.renderSubPrice() }
            </p>
        );
    }
}

export default CartItemPriceComponent;
