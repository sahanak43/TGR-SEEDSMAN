/* eslint-disable max-lines */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import Link from 'Component/Link';
import Loader from 'Component/Loader';
import PRODUCT_TYPE from 'Component/Product/Product.config';
import ProductPrice from 'Component/ProductPrice';
import SocialShare from 'Component/SocialShare';
import TextPlaceholder from 'Component/TextPlaceholder';
import { WishlistItem as SourceWishlistItem } from 'SourceComponent/WishlistItem/WishlistItem.component';
import media, { BRAND_LOGO_MEDIA } from 'Util/Media';
import { getAttributesWithValues } from 'Util/Product';
import {
    getPrice
} from 'Util/Product/Extract';

import './WishlistItem.style';

/** @namespace Seedsman/Component/WishlistItem/Component */
export class WishlistItemComponent extends SourceWishlistItem {
    renderViewButton() {
        const {
            product: { sku },
            isMobile,
            isEditingActive, product: { url }
        } = this.props;
        const mods = isMobile ? { isEditingActive } : {};

        if (!sku) {
            return <TextPlaceholder length="short" />;
        }

        return (
            <Link
              to={ url }
              block="ProductCard-AddToCart Button"
              mods={ { isHollow: isMobile } }
              mix={ { block: 'WishlistItem', elem: 'AddToCart', mods } }
            >
                <span>View Product</span>
            </Link>
        );
    }

    renderAddToCartButton(renderCardLinkWrapper) {
        const {
            addToCart,
            isEditingActive,
            isMobile,
            inStock,
            product: { type_id, wishlist: { options = [] } = {} }
        } = this.props;

        if (!inStock) {
            return null;
        }
        if (
            inStock
            && type_id === PRODUCT_TYPE.configurable
            && !options.length
        ) {
            return renderCardLinkWrapper(this.renderViewButton());
        }

        const mods = isMobile ? { isEditingActive } : {};

        return (
            <button
              block="Button"
              mods={ { isHollow: isMobile } }
              mix={ { block: 'WishlistItem', elem: 'AddToCart', mods } }
              onClick={ addToCart }
            >
                ADD TO BASKET
            </button>
        );
    }

    renderCardPrice() {
        const { product, product: { type_id: baseType } = {} } = this.props;

        const { price_range: priceRange, type_id: typeId, price_tiers: priceTiers } = product;

        if (!priceRange) {
            return this.renderTextPlaceholder();
        }

        const productPrice = getPrice(priceRange, false, {}, baseType);

        // If product is not a variant.
        const notConfigured = baseType !== PRODUCT_TYPE.configurable || typeId === baseType;
        return (
            <div
              block={ this.className }
              elem="PriceWrapper"
            >
                <ProductPrice
                  meta
                  price={ productPrice }
                  priceType={ typeId }
                  tierPrices={ priceTiers }
                  isPreview={ notConfigured }
                  mix={ { block: this.className, elem: 'Price' } }
                />
            </div>
        );
    }

    renderPrice(productPrice) {
        const { inStock } = this.props;

        if (!inStock) {
            return null;
        }

        return (
            <div
              block="WishlistItem"
              elem="Price"
            >
                { productPrice() }
            </div>
        );
    }

    renderName() {
        const {
            product: { name }
        } = this.props;

        return <p bablic-exclude="true">{ name }</p>;
    }

    renderSocialShare() {
        const { product: { url } = {} } = this.props;

        const Domain = window.location.origin;

        return (
            <div block="ProductCard" elem="social-share">
                <SocialShare description={ `${Domain}${url}` } native />
            </div>
        );
    }

    renderOptions() {
        const {
            product: {
                type_id,
                wishlist: { options }
            }
        } = this.props;

        const renderMethod = this.optionRenderMap[type_id];

        if (!options.length) {
            return <div block="WishlistItemOptions" elem="List" />;
        }

        if (renderMethod) {
            return (
                <div block="WishlistItemOptions" elem="List">
                    { options.map(renderMethod) }
                </div>
            );
        }

        return (
            <div block="WishlistItemOptions" elem="List">
                { options.map(({ value }) => value).join(', ') }
            </div>
        );
    }

    renderRatings() {
        const { isLoading, product: { sku } = {} } = this.props;

        if (isLoading) {
            <Loader isLoading={ isLoading } />;
        }

        if (!sku) {
            return null;
        }

        return <div className="ruk_rating_snippet" data-sku={ sku } />;
    }

    renderCardLinkWrapper(children, mix = {}) {
        const {
            linkTo,
            product: { url }
        } = this.props;

        if (!url) {
            return (
                <div block="ProductCard" elem="Link">
                    { children }
                </div>
            );
        }

        return (
            <Link
              block="ProductCard"
              elem="Links"
              to={ linkTo }
              onClick={ this.registerSharedElement }
              mix={ mix }
            >
                { children }
            </Link>
        );
    }

    renderSpecificAttribute() {
        const { product } = this.props;

        const attributesWithValues = getAttributesWithValues(product);

        if (!attributesWithValues?.Sex) {
            return null;
        }

        const { attribute_options, attribute_value } = attributesWithValues?.Sex;

        return (
            <p block="ProductCard" elem="specificAttribute">{ attribute_options[attribute_value].label }</p>
        );
    }

    renderSeedsLogo() {
        const { product: { attributes, name } = {} } = this.props;

        if (attributes === null || !name) {
            return null;
        }

        return (
            <>
                <div block="ProductCard" elem="Seedslogo">
                    { this.renderBrandLogo() }
                </div>

                { /* <div block="ProductCard" elem="curve" /> */ }
            </>
        );
    }

    // eslint-disable-next-line consistent-return
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

    renderProductFeatures() {
        const { product: { attributes, name } = {} } = this.props;

        if (!name) {
            return null;
        }

        const filteredArray = [];

        const FeaturesList = [
            'Sex',
            'seeds_feminised',
            'seeds_flowering_type'
        ];

        if (attributes) {
            FeaturesList.map((attribute) => filteredArray.push(attributes[attribute]));
        }

        const value = filteredArray.map((attribute) => {
            if (attribute) {
                const { attribute_type } = attribute;

                if (
                    attribute_type === 'select'
                    || attribute_type === 'multiselect'
                ) {
                    const {
                        attribute_options,
                        attribute_value
                        // attribute_label
                    } = attribute;

                    return (
                        <li block="striped-row">
                            { /* <span block="striped-col1">{ attribute_label }</span> */ }
                            <span block="striped-col2">
                                { attribute_options[attribute_value].label }
                            </span>
                        </li>
                    );
                }
            }

            return null;
        });

        return (
            <ul block="WishlistItem" elem="table-striped">
                { value }
            </ul>
        );
    }

    renderAddToCart() {
        const {
            layout,
            // showSelectOptionsNotification,
            inStock,
            device: { isMobile } = {},
            product: {
                type_id
            }
        } = this.props;

        if (isMobile && inStock && type_id === PRODUCT_TYPE.configurable) {
            return this.renderCardLinkWrapper(this.renderViewButton());
        }

        if (!inStock) {
            return (
                <div block="ProductCard" elem="OutOfStock">
                    <p>Out of stock</p>
                </div>
            );
        }

        return this.renderAddToCartButton(layout);
    }

    renderContent(renderMethods) {
        const {
            content: { productPrice },
            pictureBlock: { picture: renderPicture },
            renderCardLinkWrapper
        } = renderMethods;
        const {
            renderContent,
            product: {
                type_id
            },
            device: { isMobile } = {}
        } = this.props;

        if (renderContent) {
            return renderContent(this.contentObject);
        }

        return (
            <>
                <div block="WishlistItem" elem="FigureWrapper">
                    { renderCardLinkWrapper(
                        <>
                            <figure
                              mix={ { block: 'ProductCard', elem: 'Figure' } }
                            >
                                { renderPicture({
                                    block: 'WishlistItem',
                                    elem: 'Picture'
                                }) }
                            </figure>
                            { this.renderOptions() }
                        </>
                    ) }
                    { this.renderRemove() }
                    { this.renderSocialShare() }
                </div>
                <div block="ProductCard" elem="fixeContent">
                            { this.renderRatings() }
                    <div block="ProductCard" elem="productName">
                        <div>
                            { this.renderCardLinkWrapper(this.renderName(false)) }
                            { this.renderSpecificAttribute() }
                        </div>
                        { this.renderSeedsLogo() }
                    </div>
                    { isMobile ? this.renderPrice() : null }
                    { this.renderProductFeatures() }
                    <div block="ProductCard" elem="productPriceAddToCart">
                        { this.renderPrice(productPrice) }
                         { (type_id === PRODUCT_TYPE.configurable)
                             ? this.renderViewButton()
                             : this.renderAddToCart() }
                    </div>
                </div>
            </>
        );
    }
}

export default WishlistItemComponent;
