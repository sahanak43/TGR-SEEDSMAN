/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable max-lines */
/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/forbid-elements */
/* eslint-disable no-else-return */
/* eslint-disable no-undef */
/* eslint-disable @scandipwa/scandipwa-guidelines/derived-class-names */
/* eslint-disable max-len */
import AddToCart from 'Component/AddToCart';
import BuyNow from 'Component/BuyNow';
// import CloseIcon from 'Component/CloseIcon';
import Link from 'Component/Link';
import ProductConfigPopup from 'Component/ProductConfigPopup';
import ProductCustomizableOptions from 'Component/ProductCustomizableOptions';
import ProductReviewRating from 'Component/ProductReviewRating';
import ProductWishlistButton from 'Component/ProductWishlistButton';
import TextPlaceholder from 'Component/TextPlaceholder';
import { GRID_LAYOUT } from 'Route/CategoryPage/CategoryPage.config';
import { Product as SourceProduct } from 'SourceComponent/Product/Product.component';
import { htmlParse } from 'Util/HtmlParser';
import media, { BRAND_LOGO_MEDIA } from 'Util/Media';

import { PRODUCT_TYPE } from './Product.config';
/**
 * Product
 * @class Product
 * @namespaceSeedsman/Component/Product/Component
 */
export class Product extends SourceProduct {
    renderBrandName() {
        const {
            product: {
                attributes: { brand: { attribute_value: brands, attribute_options = {} } = {} } = {}
            }
        } = this.props;

        const value = attribute_options[brands]?.label;

        const aTag = new RegExp(/<a[^>]*>([^<]+)<\/a>/g);
        const test = aTag.test(value);

        if (value) {
            if (test === true) {
                return (
                    <div block="Brand">
                        { htmlParse(value) }
                    </div>
                );
            } else {
                const title = value.replace(/'/g, '');

                return (
                    <div block="Brand">
                        <h4 block="Product" elem="BrandName" bablic-exclude>{ title }</h4>
                    </div>
                );
            }
        }
    }

    renderCustomizableOptions() {
        const {
            product: {
                options
            },

            updateSelectedValues
        } = this.props;

        if (options === null) {
            return null;
        }

        return (
            <ProductCustomizableOptions
              options={ options }
              updateSelectedValues={ updateSelectedValues }

            />
        );
    }

    renderBrandLogo() {
        const {
            product: {
                attributes: { brand: { attribute_value: brands, attribute_options = {} } = {} } = {},
                name
            }
        } = this.props;

        const value = attribute_options[brands]?.brand_label;

        if (value) {
            const brandLogoUrl = value.replace(/\s/g, '-');
            const logoUrl = brandLogoUrl.replace(/'/g, '');
            const url = media(`${logoUrl}.jpg`, BRAND_LOGO_MEDIA);
            return (
                <img
                  alt={ name }
                  src={ url }
                />
            );
        }
    }

    renderBuyNowButton(layout = GRID_LAYOUT) {
        const {
            addToCart, inStock, quantity, getActiveProduct,
            product: { sku }
        } = this.props;

        const {
            attributes: { zero_price_allowed: { attribute_value: zeroPriceAllowed } = {} } = {},
            price_range: { maximum_price: { final_price: { value } = {} } = {} } = {}
        } = getActiveProduct() || {};

        if (!sku || (!value && !parseInt(zeroPriceAllowed, 10))) {
            return null;
        }

        return (
            <BuyNow
              mix={ { block: this.className, elem: 'AddToCart' } }
              addToCart={ addToCart }
              isDisabled={ !inStock }
              isIconEnabled={ false }
              layout={ layout }
              quantity={ quantity }
              product={ getActiveProduct() }
            />
        );
    }

    renderRatingSummary() {
        const {
            product: { review_summary: { rating_summary, review_count } = {} }
        } = this.props;

        if (!review_count) {
            return null;
        }

        return (
            <ProductReviewRating
              summary={ rating_summary || 0 }
              count={ review_count }
            />
        );
    }

    renderCloseButton() {
        const { handlePopup } = this.props;

        return (
            <button
              block="Popup"
              elem="CloseBtn"
              aria-label="Close"
              onClick={ handlePopup }
            >
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.4646 13.4L7.56465 18.3C7.38131 18.4833 7.14798 18.575 6.86465 18.575C6.58132 18.575 6.34798 18.4833 6.16465 18.3C5.98131 18.1167 5.88965 17.8833 5.88965 17.6C5.88965 17.3167 5.98131 17.0833 6.16465 16.9L11.0646 12L6.16465 7.09999C5.98131 6.91665 5.88965 6.68332 5.88965 6.39999C5.88965 6.11665 5.98131 5.88332 6.16465 5.69999C6.34798 5.51665 6.58132 5.42499 6.86465 5.42499C7.14798 5.42499 7.38131 5.51665 7.56465 5.69999L12.4646 10.6L17.3646 5.69999C17.548 5.51665 17.7813 5.42499 18.0646 5.42499C18.348 5.42499 18.5813 5.51665 18.7646 5.69999C18.948 5.88332 19.0396 6.11665 19.0396 6.39999C19.0396 6.68332 18.948 6.91665 18.7646 7.09999L13.8646 12L18.7646 16.9C18.948 17.0833 19.0396 17.3167 19.0396 17.6C19.0396 17.8833 18.948 18.1167 18.7646 18.3C18.5813 18.4833 18.348 18.575 18.0646 18.575C17.7813 18.575 17.548 18.4833 17.3646 18.3L12.4646 13.4Z" fill="black" />
                </svg>
            </button>
        );
    }

    renderPopupAddToCart() {
        const { onClickShowPopup, isShowPopup, product: { url } } = this.props;

        return (
            <>
                <div
                  block="Button AddToCartPopup"
                  mix={ { block: this.className, elem: 'AddToCart' } }
                  onClick={ onClickShowPopup }
                >
                    Add to basket
                </div>
                { isShowPopup
                    ? (
                        <ProductConfigPopup fromProductCard={ isShowPopup }>
                        <div className="popup">
                            { this.renderCloseButton() }
                            <div block={ this.className } elem="Wrapper">
                                { this.renderName() }
                                <div block={ this.className } elem="Options">
                                    { this.renderConfigurableOptions() }
                                    <div block={ this.className } elem="totalPrice">
                                        <p>Total:</p>
                                        { this.renderPrice() }
                                    </div>
                                    { this.renderAddToCartButtonPopUp() }
                                    <Link block={ this.className } elem="moreInfo" to={ url }>More Info</Link>
                                </div>
                            </div>
                        </div>
                        </ProductConfigPopup>
                    ) : null }
            </>
        );
    }

    renderAddToCartButtonPopUp(layout = GRID_LAYOUT) {
        const {
            addToCart,
            inStock,
            quantity,
            getActiveProduct,
            handlePopup
        } = this.props;

        const { type_id } = getActiveProduct() || {};

        return (
            <AddToCart
              mix={ { block: this.className, elem: 'AddToCart' } }
              addToCart={ addToCart }
              isDisabled={ !inStock || type_id === PRODUCT_TYPE.configurable }
              isIconEnabled={ false }
              layout={ layout }
              handlePopup={ handlePopup }
              isPlpPopUp
              quantity={ quantity }
              product={ getActiveProduct() }
            />
        );
    }

    renderAddToCartButton(layout = GRID_LAYOUT, isPdp = false) {
        const {
            addToCart, inStock, quantity, getActiveProduct,
            product: { sku, type_id } = {}, parameters,
            handlePopup
        } = this.props;

        const {
            attributes: { zero_price_allowed: { attribute_value: zeroPriceAllowed } = {} } = {},
            price_range: { maximum_price: { final_price: { value } = {} } = {} } = {}
        } = getActiveProduct() || {};

        if (!sku || (!value && !parseInt(zeroPriceAllowed, 10))) {
            return null;
        }

        if (type_id === PRODUCT_TYPE.configurable && isPdp) {
            return (
                <AddToCart
                  mix={ { block: this.className, elem: 'AddToCart' } }
                  addToCart={ addToCart }
                  isDisabled={ !inStock || !Object.keys(parameters).length }
                  isIconEnabled={ false }
                  layout={ layout }
                  quantity={ quantity }
                  product={ getActiveProduct() }
                  isPdp={ isPdp }
                />
            );
        }

        return (
            <AddToCart
              mix={ { block: this.className, elem: 'AddToCart' } }
              addToCart={ addToCart }
              isDisabled={ !inStock }
              isIconEnabled={ false }
              layout={ layout }
              quantity={ quantity }
              isPdp={ isPdp }
              product={ getActiveProduct() }
              isConfigProduct={ type_id === PRODUCT_TYPE.configurable }
              handlePopup={ handlePopup }
            />
        );
    }

    renderName(header = true, dynamic = false) {
        const {
            getActiveProduct,
            product: {
                name,
                sku
            }, productName
        } = this.props;

        const { sku: ActiveProductSku, id: ActiveProductId } = getActiveProduct() || {};

        // eslint-disable-next-line no-nested-ternary
        const nameToRender = dynamic ? productName : name;

        if (!header) {
            return (
                <p
                  data-productName={ nameToRender }
                  data-productSku={ ActiveProductSku }
                  data-productId={ ActiveProductId }
                  data-groupItemId={ sku }
                  block={ this.className }
                  elem="Name"
                  bablic-exclude="true"
                >
                    <TextPlaceholder content={ nameToRender } length="medium" />
                </p>
            );
        }

        return (
            <h1
              data-productName={ nameToRender }
              data-productSku={ ActiveProductSku }
              data-productId={ ActiveProductId }
              data-groupItemId={ sku }
              block={ this.className }
              elem="Title"
              bablic-exclude="true"
              itemProp="name"
            >
                <TextPlaceholder content={ nameToRender } length="medium" />
            </h1>
        );
    }

    renderWishlistButton() {
        const {
            magentoProduct, isWishlistEnabled,
            getActiveProduct,
            product: { sku } = {}
        } = this.props;

        const {
            attributes: { zero_price_allowed: { attribute_value: zeroPriceAllowed } = {} } = {}
        } = getActiveProduct() || {};

        if (magentoProduct.length === 0 || !isWishlistEnabled || !sku || parseInt(zeroPriceAllowed, 10)) {
            return null;
        }

        return (
            <ProductWishlistButton
              magentoProduct={ magentoProduct }
              mix={ {
                  block: this.className,
                  elem: 'WishListButton'
              } }
            />
        );
    }
}

export default Product;
