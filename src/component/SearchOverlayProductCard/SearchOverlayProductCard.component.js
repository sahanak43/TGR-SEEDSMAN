/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable no-unused-vars */
/* eslint-disable max-lines */
/* eslint-disable max-len */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
import PropTypes from 'prop-types';
import { createRef } from 'react';
import { connect } from 'react-redux';

import Image from 'Component/Image';
import Link from 'Component/Link';
import { Product } from 'Component/Product/Product.component';
import { ProductCardComponent } from 'Component/ProductCard/ProductCard.component';
import TextPlaceholder from 'Component/TextPlaceholder';
import { PRODUCT_TYPE } from 'SourceComponent/Product/Product.config';
import { htmlParse } from 'Util/HtmlParser';
import { formatPrice } from 'Util/Price';

import './SearchOverlayProductCard.style';

/** @namespace Seedsman/Component/SearchOverlayProductCard/Component/mapStateToProps */
export const mapStateToProps = (state) => ({
    currencyCode: state.ConfigReducer.currencyData.current_currency_code,
    categoryUrlSuffix: state.ConfigReducer.category_url_suffix
});

/** @namespace Seedsman/Component/SearchOverlayProductCard/Component/mapDispatchToProps */
export const mapDispatchToProps = () => ({
});

/** @namespace Seedsman/Component/SearchOverlayProductCard/Component */
export class SearchOverlayProductCardComponent extends ProductCardComponent {
    static propTypes = {
        ...Product.propTypes,
        categoryUrlSuffix: PropTypes.string.isRequired
    };

    static defaultProps = {
        ...Product.defaultProps
    };

    contentObject = {
        renderCardLinkWrapper: this.renderCardLinkWrapper.bind(this),
        pictureBlock: {
            picture: this.renderPicture.bind(this)
        }
    };

    imageRef = createRef();

    registerSharedElement = this.registerSharedElement.bind(this);

    registerSharedElement() {
        const { registerSharedElement } = this.props;
        document.documentElement.scrollIntoView();
        registerSharedElement(this.imageRef);
    }

    renderPicture(mix = {}) {
        const {
            product: {
                sku, name, thumbnail: { url } = {}
            }
        } = this.props;

        this.sharedComponent = (
            <Image
              imageRef={ this.imageRef }
              src={ url }
              alt={ name }
              ratio="custom"
              mix={ { block: 'SearchOverlayProduct', elem: 'Picture', mix } }
              isPlaceholder={ !sku }
            />
        );

        return (
            <>
                { this.sharedComponent }
                <img alt={ name } src={ url } />
            </>
        );
    }

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
                const {
                    props: {
                        href, title, target
                    } = {}
                } = htmlParse(value);

                return (
                    <div block="SearchOverlayProduct" elem="OwnerName">
                        <Link block="Product" elem="BrandName" to={ href } target={ target } title={ title }>{ title }</Link>
                    </div>
                );
            }
            const title = value.replace(/'/g, '');

            return (
                <div block="SearchOverlayProduct" elem="OwnerName">
                    <h4 block="Product" elem="BrandName">{ title }</h4>
                </div>
            );
        }

        return null;
    }

    renderTitle() {
        const { product: { name }, isLoading } = this.props;
        if (isLoading) {
            return <TextPlaceholder />;
        }

        return (
            <div
              block="SearchOverlayProduct"
              elem="Heading"
            >
                <div
                  block="SearchOverlayProduct"
                  elem="Name"
                >
                    { name }
                </div>
            { this.renderBrandName() }
            </div>
        );
    }

    renderOffers() {
        const {
            isLoading, product: {
                price_range: {
                    maximum_price: {
                        discount: { percent_off } = {}
                    } = {}
                } = {}
            }
        } = this.props;

        if (!percent_off) {
            return null;
        }

        if (isLoading) {
            return <TextPlaceholder />;
        }

        return (
            <div block="SearchOverlayProduct" elem="Offers">
                { __(`( ${Math.floor(percent_off)}% Off )`) }
            </div>
        );
    }

    renderProductPrice() {
        const { product, currencyCode, isLoading } = this.props;
        const {
            price_range: {
                minimum_price: {
                    final_price: { value = '' } = {}
                } = {}
            } = {}
        } = product;

        if (isLoading) {
            return <TextPlaceholder />;
        }

        if (!value) {
            return null;
        }

        return (
            <div
              block="SearchOverlayProduct"
              elem="PriceWrapper"
            >
                <span block="SearchOverlayProduct" elem="Price">
                    { formatPrice(value, currencyCode) }
                </span>
                { this.renderOffers() }
            { /* { this.renderStockStatus() } */ }
            </div>
        );
    }

    renderStockStatus() {
        const {
            product: {
                sku, type_id, stock_status, stock_item: { in_stock } = {}
            } = {}
        } = this.props;

        if (!sku) {
            return null;
        }

        if (type_id === PRODUCT_TYPE.configurable) {
            return (
                <span block="SearchOverlayProduct" elem={ `StockStatus ${ in_stock ? 'IN_STOCK' : 'OUT_OF_STOCK' }` }>
                    { (in_stock)
                        ? <TextPlaceholder content="In Stock" length="medium" />
                        : <TextPlaceholder content="Out of Stock" length="medium" /> }
                </span>
            );
        }

        const custom_stock_status = stock_status === 'IN_STOCK' || stock_status === 'IN STOCK' ? 'IN_STOCK' : 'OUT_OF_STOCK';

        return (
            <span block="SearchOverlayProduct" elem={ `StockStatus ${custom_stock_status}` }>
                { (stock_status === 'IN_STOCK' || stock_status === 'IN STOCK')
                    ? <TextPlaceholder content="In Stock" length="medium" />
                    : <TextPlaceholder content="Out of Stock" length="medium" /> }
            </span>
        );
    }

    renderCardLinkWrapper(children, mix = {}) {
        const {
            product: { url },
            categoryUrlSuffix
        } = this.props;

        return (
            <Link
              block="ProductCard"
              elem="Link"
              to={ categoryUrlSuffix ? `${url}${categoryUrlSuffix}` : url }
              onClick={ this.registerSharedElement }
              mix={ mix }
            >
                { children }
            </Link>
        );
    }

    renderCardContent() {
        const { renderContent } = this.props;

        if (renderContent) {
            return renderContent(this.contentObject);
        }

        return this.renderCardLinkWrapper(
            <div block="SearchOverlayProduct" elem="Wrapper">
                <div block="SearchOverlayProduct" elem="ProductInfo">
                    <div block="SearchOverlayProduct" elem="Image">
                        { this.renderPicture() }
                    </div>
                    <div block="SearchOverlayProduct" elem="Product">
                        { this.renderTitle() }
                        { this.renderProductPrice() }
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const {
            children, mix, layout
        } = this.props;

        return (
            <li block="SearchOverlayProduct" mods={ { layout } } mix={ mix }>
                { this.renderCardContent() }
                <div block="SearchOverlayProduct" elem="AdditionalContent">
                    { children }
                </div>
            </li>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchOverlayProductCardComponent);
