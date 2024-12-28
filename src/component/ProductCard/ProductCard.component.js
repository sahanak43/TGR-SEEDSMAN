/* eslint-disable no-tabs */
/* eslint-disable max-len */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable no-undef */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
/* eslint-disable max-lines */
/* eslint-disable spaced-comment */
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

import PropTypes from 'prop-types';
import { createRef } from 'react';

import { RATINGS_WIDGET_URL } from 'Component/AddScriptLinks/AddScriptLinks.config';
// import BuyNow from 'Component/BuyNow';
import Image from 'Component/Image';
import Link from 'Component/Link';
import Loader from 'Component/Loader';
import { Product } from 'Component/Product/Product.component';
import PRODUCT_TYPE from 'Component/Product/Product.config';
import ProductPrice from 'Component/ProductPrice';
import SocialShare from 'Component/SocialShare';
import TextPlaceholder from 'Component/TextPlaceholder';
import {
    GRID_LAYOUT,
    LIST_LAYOUT
} from 'Route/CategoryPage/CategoryPage.config';
import { ProductCard as ParentProductCard } from 'SourceComponent/ProductCard/ProductCard.component';
import { MixType } from 'Type/Common.type';
import { DeviceType } from 'Type/Device.type';
import { LayoutType } from 'Type/Layout.type';
import { LinkType } from 'Type/Router.type';
import { filterConfigurableOptions, getAttributesWithValues } from 'Util/Product';
import {
    getPrice
} from 'Util/Product/Extract';
import { importScript } from 'Util/Script';
import { ratingsWidget } from 'Util/Widget';

import './ProductCard.style';

/**
  * Product card
  * @class ProductCard
  * @namespace Seedsman/Component/ProductCard/Component */
export class ProductCardComponent extends ParentProductCard {
    static propTypes = {
        ...Product.propTypes,
        linkTo: LinkType,
        device: DeviceType.isRequired,
        thumbnail: PropTypes.string,
        isLoading: PropTypes.bool,
        children: PropTypes.element,
        layout: LayoutType,
        mix: MixType,
        renderContent: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
        hideWishlistButton: PropTypes.bool,
        isWishlistEnabled: PropTypes.bool.isRequired,
        hideCompareButton: PropTypes.bool,
        parameters: PropTypes.objectOf(PropTypes.string).isRequired,
        showSelectOptionsNotification: PropTypes.func.isRequired,
        registerSharedElement: PropTypes.func.isRequired
    };

    static defaultProps = {
        ...Product.defaultProps,
        thumbnail: '',
        linkTo: {},
        children: null,
        isLoading: false,
        mix: {},
        renderContent: false,
        hideWishlistButton: false,
        hideCompareButton: false,
        layout: GRID_LAYOUT
    };

    state = {
        isScriptLoaded: false
    };

    contentObject = {
        renderCardLinkWrapper: this.renderCardLinkWrapper.bind(this),
        pictureBlock: {
            picture: this.renderPicture.bind(this)
        },
        content: {
            review: this.renderReviews.bind(this),
            productPrice: this.renderCardPrice.bind(this),
            mainDetails: this.renderMainDetails.bind(this),
            additionalProductDetails: this.renderBrand.bind(this)
        }
    };

    imageRef = createRef();

    className = 'ProductCard';

    registerSharedElement = this.registerSharedElement.bind(this);

    registerSharedElement() {
        const { registerSharedElement } = this.props;
        document.documentElement.scrollIntoView();
        registerSharedElement(this.imageRef);
    }

    componentDidMount() {
        this.renderRatingsWidget();
        this.renderScript();
    }

    renderScript() {
        const { enableRatings, ratingWidgetUrl = RATINGS_WIDGET_URL } = this.props;

        const ratingScript = document.getElementById('ratingsScript');

        if (ratingScript === null && enableRatings) {
            importScript(ratingWidgetUrl, 'ratingsScript');
            this.setState({
                isScriptLoaded: true
            });
        }
    }

    renderRatingsWidget() {
        const { isScriptLoaded } = this.state;
        const { product: { sku } = {} } = this.props;

        const scriptLoading = setInterval(() => {
            if (!isScriptLoaded && typeof ratingSnippet !== 'function') {
                this.renderRatingsWidget();
            } else {
                if (typeof ratingSnippet === 'function' && sku) {
                    const script = document.createElement('script');
                    script.textContent = ratingsWidget();
                    script.id = 'ratingsWidget';
                    script.async = true;
                    script.defer = true;
                    document.body.appendChild(script);
                }
                clearInterval(scriptLoading);
            }
            // eslint-disable-next-line no-magic-numbers
        }, 1000);
    }

    //#region PRICE
    renderEmptyProductPrice() {
        return (
            <div
              block="ProductCard"
              elem="PriceWrapper"
              mods={ { isEmpty: true } }
            />
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
    //#endregion

    renderPicture(mix = {}) {
        const {
            product: { id, alt_text },
            thumbnail
        } = this.props;

        this.sharedComponent = (
            <Image
              imageRef={ this.imageRef }
              src={ thumbnail }
              alt={ alt_text }
              ratio="custom"
              mix={ { block: 'ProductCard', elem: 'Picture', mix } }
              isPlaceholder={ !id }
            />
        );

        return (
            <>
                { this.sharedComponent }
                <img style={ { display: 'none' } } alt={ alt_text } src={ thumbnail } />
            </>
        );
    }

    renderReviews() {
        const { layout } = this.props;
        return (
            <div block="ProductCard" elem="Reviews" mods={ { layout } }>
                { this.renderRatingSummary() }
            </div>
        );
    }

    renderProductCompareButton() {
        const { hideCompareButton } = this.props;

        if (hideCompareButton) {
            return null;
        }

        return this.renderCompareButton();
    }

    renderProductCardWishlistButton() {
        const { hideWishlistButton, isWishlistEnabled } = this.props;

        if (hideWishlistButton || !isWishlistEnabled) {
            return null;
        }

        return this.renderWishlistButton();
    }

    renderProductActions() {
        return (
            <div block="ProductCard" elem="ProductActions">
                { this.renderProductCardWishlistButton() }
                { this.renderProductCompareButton() }
            </div>
        );
    }

    renderMainDetails() {
        const {
            product: { name }
        } = this.props;

        return (
            <p block="ProductCard" bablic-exclude="true" elem="Name" mods={ { isLoaded: !!name } }>
                <TextPlaceholder content={ name } length="medium" />
            </p>
        );
    }

    renderSocialShare() {
        const {
            product: {
                url, sku, id, small_image: { url: productImage } = {}
            } = {}
        } = this.props;

        if (!sku) {
            return null;
        }

        const Domain = window.location.origin;

        return (
             <div block="ProductCard" elem="social-share">
                <SocialShare
                  description={ `${Domain}${url}` }
                  productId={ id }
                  contentType={ productImage }
                  native
                  isMobile
                />
             </div>
        );
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

    getConfigurableAttributes() {
        const {
            product: { configurable_options: configurableOptions = {}, variants = {} }
        } = this.props;

        return filterConfigurableOptions(configurableOptions, variants);
    }

    renderProductFeatures() {
        const { product: { attributes = {}, name } = {} } = this.props;

        if (!name) {
            return null;
        }

        const filteredArray = [];
        const FeaturesList = [
            'seeds_feminised',
            'seeds_flowering_type'
        ];

        if (attributes) {
            const { usp: { attribute_value } = {} } = attributes;

            if (attribute_value) {
                const attributeArray = attribute_value.split(',');
                attributeArray.map((attribute) => filteredArray.push(attributes[attribute]));
            } else {
                FeaturesList.map((attribute) => filteredArray.push(attributes[attribute]));
            }
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
            <ul block="ProductCard" elem="table-striped">
                { value }
            </ul>
        );
    }

    renderVisibleOnHover() {
        const { device } = this.props;

        if (device.isMobile) {
            return null;
        }

        return (
            <>
                { /* {this.renderConfigurableOptions()} */ }
                <div block="ProductCard" elem="footer">
                    { /* {this.renderAddToCart()} */ }
                    { /* { this.renderProductActions() } */ }
                    { /* { this.renderProductFeatures() } */ }
                     { !device.isMobile ? this.renderConfigurableOptions() : null }
                </div>
            </>
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

    renderViewButton() {
        const {
            layout,
            product: { sku }
        } = this.props;

        if (!sku) {
            return <TextPlaceholder length="short" />;
        }

        return (
            <button block="ProductCard-AddToCart Button" mods={ { layout, isHollow: true } }>
                <span className="bablic-ex">View Product</span>
            </button>
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

    renderCardContent() {
        const {
            renderContent,
            product: {
                type_id
            }
        } = this.props;

        if (renderContent) {
            return renderContent(this.contentObject);
        }

        return (
            <div block="ProductCard" elem="Link">
            <div block="ProductCard" elem="LinkInnerWrapper">
               { this.renderCardLinkWrapper(<div block="ProductCard" elem="FigureReview">
                    <figure block="ProductCard" elem="Figure">
                        { this.renderPicture() }
                    </figure>
                    { /* { this.renderProductCardWishlistButton() }
                    { this.renderSocialShare() } */ }
                    { /* { this.renderSeedsLogo() } */ }
                    { /* { this.renderRatings() } */ }
                                            </div>) }
                { /* <div block="ProductCard" elem="Content">
                    { /* { this.renderBrand() } */ }
                    { /* <div block="ProductCard" elem="VisibleOnhover">
                        { this.renderVisibleOnHover() }
                    </div>
                </div> */ }
                <div block="ProductCard" elem="fixeContent">
                    { /* { this.renderCardLinkWrapper(this.renderName(false)) }
                    { this.renderCardPrice() } */ }
                    { /* { !isMobile ? this.renderConfigurableOptions() : null } */ }
                    { /* { this.renderAddToCart() } */ }
                    { this.renderRatings() }
                    <div block="ProductCard" elem="productName">
                        <div>
                            { this.renderCardLinkWrapper(this.renderProductName(false)) }
                            { this.renderSpecificAttribute() }
                        </div>
                        { this.renderSeedsLogo() }
                    </div>
                    { this.renderProductFeatures() }
                    <div block="ProductCard" elem="productPriceAddToCart">
                        { this.renderCardPrice() }
                        { (type_id === PRODUCT_TYPE.configurable)
                            ? this.renderPopupAddToCart()
                            : this.renderAddToCart() }
                    </div>
                </div>
            </div>
            </div>
        );
    }

    renderProductName(header = true, dynamic = false) {
        const {
            product: {
                tile_title, name, sku, id = {}
            }
        } = this.props;
        // eslint-disable-next-line no-nested-ternary
        const nameToRender = dynamic ? name : (!tile_title ? name : tile_title);

        if (!header) {
            return (
                <p data-productName={ nameToRender } data-productSku={ sku } data-productId={ id } data-groupItemId={ sku } block={ this.className } elem="Name" bablic-exclude="true">
                    <TextPlaceholder content={ nameToRender } length="medium" />
                </p>
            );
        }

        return (
            <h1 data-productName={ nameToRender } data-productSku={ sku } data-productId={ id } data-groupItemId={ sku } block={ this.className } elem="Title" bablic-exclude="true" itemProp="name">
                <TextPlaceholder content={ nameToRender } length="medium" />
            </h1>
        );
    }

    renderCardListContent() {
        const { children, layout, renderContent } = this.props;

        if (renderContent) {
            return renderContent(this.contentObject);
        }

        return this.renderCardLinkWrapper(
            <div block="ProductCard" elem="Link">
                <div block="ProductCard" elem="FigureReview">
                    <figure block="ProductCard" elem="Figure">
                        { this.renderPicture() }
                    </figure>
                    { this.renderProductCardWishlistButton() }
                    { this.renderReviews() }
                </div>
                <div block="ProductCard" elem="Content" mods={ { layout } }>
                    <div block="ProductCard" elem="MainInfo">
                        { this.renderReviews() }
                        { this.renderBrand() }
                        { this.renderMainDetails() }
                    </div>
                    <div block="ProductCard" elem="AttributeWrapper">
                        { this.renderCardPrice() }
                        { this.renderConfigurableOptions() }
                    </div>
                    <div block="ProductCard" elem="ActionWrapper">
                        { this.renderAddToCart() }
                        { this.renderProductActions() }
                    </div>
                    <div block="ProductCard" elem="AdditionalContent">
                        { children }
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const {
            children, mix, isLoading, layout, ProductcardTagStatus
        } = this.props;

        if (layout === LIST_LAYOUT) {
            return (
                <li block="ProductCard" mods={ { layout } } mix={ mix }>
                    <Loader isLoading={ isLoading } />
                    { this.renderCardListContent() }
                </li>
            );
        }

        if (ProductcardTagStatus) {
            return (
                <div block="ProductCard" mods={ { layout } } mix={ mix }>
                    <Loader isLoading={ isLoading } />
                    { this.renderCardContent() }
                    <div block="ProductCard" elem="AdditionalContent">
                        { children }
                    </div>
                </div>
            );
        }

        return (
            <li block="ProductCard" mods={ { layout } } mix={ mix }>
                <Loader isLoading={ isLoading } />
                { this.renderCardContent() }
                <div block="ProductCard" elem="AdditionalContent">
                    { children }
                </div>
            </li>
        );
    }
}

export default ProductCardComponent;
