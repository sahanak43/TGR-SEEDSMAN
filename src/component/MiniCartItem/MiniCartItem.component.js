/* eslint-disable fp/no-let */
/* eslint-disable react/prop-types */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable no-undef */
/* eslint-disable max-len */
/* eslint-disable react/boolean-prop-naming */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
/* eslint-disable max-lines */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import CartItemPrice from 'Component/CartItemPrice';
import Field from 'Component/Field';
import FIELD_TYPE from 'Component/Field/Field.config';
import Image from 'Component/Image';
import Link from 'Component/Link';
import Loader from 'Component/Loader';
import PRODUCT_TYPE from 'Component/Product/Product.config';
import ProductWishlistButton from 'Component/ProductWishlistButton';
import { CartItemType } from 'Type/MiniCart.type';
import { LinkType } from 'Type/Router.type';
import { formatPrice } from 'Util/Price';
import { ADD_TO_WISHLIST } from 'Util/Product';
import { magentoProductTransform } from 'Util/Product/Transform';
import { VALIDATION_INPUT_TYPE } from 'Util/Validator/Config';

import './MiniCartItem.style';

/** @namespace Seedsman/Component/MiniCartItem/Component */
export class MiniCartItemComponent extends PureComponent {
    static propTypes = {
        isWishlistEnabled: PropTypes.bool.isRequired,
        // product: ProductType.isRequired,
        isLoading: PropTypes.bool.isRequired,
        item: CartItemType.isRequired,
        currency_code: PropTypes.string.isRequired,
        isEditing: PropTypes.bool.isRequired,
        isCartOverlay: PropTypes.bool,
        handleRemoveItem: PropTypes.func.isRequired,
        minSaleQuantity: PropTypes.number.isRequired,
        maxSaleQuantity: PropTypes.number.isRequired,
        handleChangeQuantity: PropTypes.func.isRequired,
        linkTo: LinkType.isRequired,
        thumbnail: PropTypes.string.isRequired,
        isProductInStock: PropTypes.bool.isRequired,
        isMobile: PropTypes.bool.isRequired,
        optionsLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
        isMobileLayout: PropTypes.bool,
        showLoader: PropTypes.bool
    };

    static defaultProps = {
        isCartOverlay: false,
        isMobileLayout: false,
        showLoader: true
    };

    renderProductOption = this._renderProductOption.bind(this);

    state={
        ActiveProductId: null
    };

    // eslint-disable-next-line @scandipwa/scandipwa-guidelines/only-render-in-component
    componentDidMount() {
        const { getCurrentProduct } = this.props;
        const { id: ActiveProductId } = getCurrentProduct() || {};

        if (ActiveProductId) {
            this.setState({ ActiveProductId });
        }
    }

    renderlinkTo() {
        const {
            parameters, linkTo = {}
        } = this.props;
        const { ActiveProductId } = this.state;
        const { seeds_number } = parameters || {};

        let searchQuery = '';

        if (seeds_number) {
            searchQuery += `seeds_number=${seeds_number}`;

            if (ActiveProductId) {
                searchQuery += `&product_id=${ActiveProductId}`;
            }
        } else if (ActiveProductId) {
            searchQuery += `product_id=${ActiveProductId}`;
        }

        const updatedLinkTo = {
            ...linkTo,
            search: searchQuery ? `?${searchQuery}` : '',
            state: {
                ...linkTo.state,
                ActiveProductId
            }
        };

        return updatedLinkTo;
    }

    renderProductConfigurations() {
        const { optionsLabels } = this.props;

        if (!optionsLabels.length) {
            return null;
        }

        return optionsLabels.map((data) => {
            if (data?.length) {
                return this.renderConfigurationData(data[0]);
            }

            return null;
        });
    }

    renderConfigurationData(data) {
        return (
            <div
              block="MiniCartItem"
              elem="Options"
            >
                <span>{ data?.attribute_label }</span>
                <span>:</span>
                <span>{ data?.attribute_value }</span>
            </div>
        );
    }

    renderWrapperContent() {
        const { isEditing, isMobileLayout } = this.props;

        if (isMobileLayout) {
            return this.renderMobileContent();
        }

        return isEditing ? this.renderDesktopContent() : this.renderDesktopSummary();
    }

    renderDesktopSummary() {
        return (
            <div block="MiniCartItem" elem="Wrapper" mods={ { isSummary: true } }>
                { this.renderImage() }
                <div block="MiniCartItem" elem="CartItemRows">
                    <div block="MiniCartItem" elem="ProductInfo">
                        { this.renderTitle() }
                        { this.renderProductPrice() }
                    </div>
                    <div block="CartItem" elem="ProductActions">
                    { this.renderQuantity() }
                    </div>
                </div>
            </div>
        );
    }

    renderGreenPoints() {
        const {
            item: {
                is_promo_item,
                product: {
                    price_range: {
                        minimum_price: {
                            final_price: { value } = {}
                        }
                    }
                }
            }
        } = this.props;

        if (is_promo_item) {
            return null;
        }

        return (
            <span block="Points">
            Earn
            { ' ' }
            { value }
            { ' ' }
            Points
            </span>
        );
    }

    renderTitle() {
        const {
            item: {
                customizable_options,
                bundle_options,
                downloadable_links
            } = {},
            isMobileLayout
        } = this.props;

        return (
            <div block="MiniCartItem" elem="Title" mods={ { isMobileLayout } }>
                { this.renderProductName() }
                { this.renderOutOfStockMessage() }
                { this.renderProductOptions(customizable_options) }
                { this.renderProductBundleOptions(bundle_options) }
                { this.renderProductLinks(downloadable_links) }
            </div>
        );
    }

    renderMobileContent() {
        const {
            isMobileLayout, onMinicartOutsideClick, isProductInStock,
            item: {
                is_promo_item,
                product: {
                    price_range: {
                        maximum_price: {
                            discount: { percent_off }
                        }
                    }
                },
                price
            }
        } = this.props;
        const updatedLinkTo = this.renderlinkTo();

        return (
            <div block="MiniCartItem" elem="Wrapper" mods={ { isMobileLayout, isProductOutOfStock: !isProductInStock } }>
                { price ? (
                        <Link to={ updatedLinkTo } onClick={ onMinicartOutsideClick } block="MiniCartItem" elem="Link">
                            { this.renderImage() }
                        </Link>
                ) : (
                    <>{ this.renderImage() }</>
                ) }
                <div block="MiniCartItem" elem="CartItemRows">
                    <div block="MiniCartItem" elem="ProductInfo" mods={ { isMobileLayout } }>
                    { price ? (
                            <Link to={ updatedLinkTo } onClick={ onMinicartOutsideClick } block="MiniCartItem" elem="Link">
                                { this.renderTitle() }
                            </Link>
                    ) : (
                        <>{ this.renderTitle() }</>
                    ) }
                    </div>
                    <div className="Quantity-Items">
                       { this.renderProductConfigurations() }
                       { /* { this.renderGreenPoints() } */ }
                    </div>
                    <div block="MiniCartItem" elem="ProductActions" mods={ { isMobileLayout } }>
                        { this.renderProductPrice() }
                        { !is_promo_item && percent_off ? (
                            <span className="off-price">
                                { Math.floor(percent_off) }
                                % Off
                            </span>
                        ) : null }
                    </div>
                    { is_promo_item ? (
                        <div block="CartItem" elem="FreeItem">
                            Enjoy Your Gift!
                        </div>
                    ) : null }
                </div>
                <div block="QuantityBlock" elem={ `${!isProductInStock ? 'isPlaceholder' : ''}` }>
                { !is_promo_item ? this.renderQuantityChangeField() : null }
                </div>
                <div className="MiniCartProductAction">
                    <div className="RemoveButton">
                    { this.renderDeleteButton() }
                    </div>
                    <div className="wishlistButton">
                        { is_promo_item ? null : this.renderWishlistButton() }
                    </div>
                </div>
            </div>
        );
    }

    renderDesktopContent() {
        return (
            <div block="MiniCartItem" elem="Wrapper" mods={ { isCart: true } }>
                <div block="MiniCartItem" elem="ProductInfo">
                    { this.renderImage() }
                    { this.renderTitle() }
                </div>
                <div
                  block="MiniCartItem"
                  elem="ProductActions"
                >
                    { this.renderQuantityChangeField() }
                    { this.renderDeleteButton() }
                </div>
                { this.renderProductPrice() }
            </div>
        );
    }

    renderContent() {
        const { linkTo = {}, isProductInStock, isMobile } = this.props;

        if (!isProductInStock || Object.keys(linkTo).length === 0 || isMobile) {
            // If product is out of stock, or link is not set
            return (
                <span
                  block="MiniCartItem"
                  elem={ `${!isProductInStock ? 'OutOfStockLink' : 'Link'}` }
                >
                    { this.renderWrapperContent() }
                </span>
            );
        }

        return (
            <>
            { this.renderWrapperContent() }
            </>
        );
    }

    renderProductOptionLabel(option) {
        const { label, values = [] } = option;

        if (Array.isArray(values) && values.length > 0) {
            return (
                <>
                    <strong>{ `${label}: ` }</strong>
                    <span>
                    { values.map(({ label, value }) => label || value).join(', ') }
                    </span>
                </>
            );
        }

        return label;
    }

    renderBundleProductOptionValue(value, index) {
        const {
            label, quantity, price, id
        } = value;
        const { currency_code: currencyCode } = this.props;
        const formattedPrice = formatPrice(price, currencyCode);

        return (
            <div key={ `${id}-${index}` }>
                { `${quantity} x ${label} ` }
                <strong>{ formattedPrice }</strong>
            </div>
        );
    }

    renderBundleProductOptionLabel(option) {
        const { label, values = [] } = option;

        if (values.length === 0) {
            return null;
        }

        return (
            <>
                <div block="MiniCartItem" elem="BundleGroupTitle">
                    <strong>{ `${label}:` }</strong>
                </div>
                <div block="MiniCartItem" elem="BundleGroupValues">
                    { values.map(this.renderBundleProductOptionValue.bind(this)) }
                </div>
            </>
        );
    }

    renderProductBundleOption(option) {
        const { id } = option;

        return (
            <div
              block="MiniCartItem"
              elem="Option"
              mods={ { isBundle: true } }
              key={ id }
            >
                { this.renderBundleProductOptionLabel(option) }
            </div>
        );
    }

    renderProductBundleOptions(itemOptions = []) {
        if (!itemOptions.length) {
            return null;
        }

        return (
            <div
              block="MiniCartItem"
              elem="Options"
            >
                { itemOptions.map(this.renderProductBundleOption.bind(this)) }
            </div>
        );
    }

    _renderProductOption(option) {
        const { id } = option;

        return (
            <div
              block="MiniCartItem"
              elem="Option"
              key={ id }
            >
                { this.renderProductOptionLabel(option) }
            </div>
        );
    }

    renderProductOptions(itemOptions = []) {
        if (!itemOptions.length) {
            return null;
        }

        return (
            <div
              block="MiniCartItem"
              elem="Options"
            >
                { itemOptions.map(this.renderProductOption) }
            </div>
        );
    }

    renderProductLinks(itemOptions = []) {
        if (!itemOptions.length) {
            return null;
        }

        return (
            <div
              block="MiniCartItem"
              elem="ItemLinksWrapper"
            >
                <span
                  block="MiniCartItem"
                  elem="ItemLinks"
                >
                    <strong>Links:</strong>
                </span>
                <div
                  block="MiniCartItem"
                  elem="ItemOptionsWrapper"
                >
                    { itemOptions.map(this.renderProductOption) }
                </div>
            </div>
        );
    }

    renderProductName() {
        const {
            getCurrentProduct,
            item: {
                product: {
                    name,
                    sku
                }
            }
        } = this.props;
        const { id: ActiveProductId, sku: ActiveProductSku } = getCurrentProduct() || {};

        return (
            <p
              block="MiniCartItem"
              elem="Heading"
              bablic-exclude="true"
              data-productName={ name }
              data-productSku={ ActiveProductSku }
              data-productId={ ActiveProductId }
              data-groupItemId={ sku }
            >
                { name }
            </p>
        );
    }

    getVariantProductPrice() {
        const {
            item: {
                sku,
                product: {
                    variants = []
                }
            }
        } = this.props;

        if (!variants.length) {
            return null;
        }

        const variantPrice = variants.find((variant) => variant.sku === sku);

        if (!variantPrice) {
            return null;
        }

        return variantPrice?.price_range;
    }

    renderProductPrice() {
        const {
            currency_code,
            item: {
                row_total,
                row_total_incl_tax,
                price,
                qty,
                is_promo_item,
                product: {
                    price_range
                }
            },
            isCartOverlay,
            isMobileLayout
        } = this.props;

        if (is_promo_item) {
            const { item: { qty } = {} } = this.props;
            return (
                <div
                  block="MiniCartItem"
                  elem="QuantityWrapperFree"
                >
                    <span
                      block="MiniCartItem"
                      elem="QuantityWrapperFreeText"
                    >
Free!

                    </span>
                    <span
                      block="MiniCartItem"
                      elem="QuantityWrapperFreeQuantity"
                    >
:
{ ' ' }
{ qty }
{ ' ' }
Pack(s)
                    </span>
                </div>
            );
        }

        return (
            <CartItemPrice
              qty={ qty }
              price_range={ price_range }
              productPrice={ price }
              is_promo_item={ is_promo_item }
              row_total={ row_total }
              row_total_incl_tax={ row_total_incl_tax }
              currency_code={ currency_code }
              variantPriceRange={ this.getVariantProductPrice() || {} }
              mix={ {
                  block: 'MiniCartItem',
                  elem: 'Price',
                  mods: { isCartOverlay, isMobileLayout }
              } }
            />
        );
    }

    renderOutOfStockMessage() {
        const { isProductInStock } = this.props;

        if (isProductInStock) {
            return null;
        }

        return (
            <p block="MiniCartItem" elem="OutOfStock">
                Out of stock
            </p>
        );
    }

    quantityClickHandler(e) {
        e.preventDefault();
    }

    renderQuantityChangeField() {
        const {
            item: {
                sku,
                qty,
                product: {
                    stock_item: {
                        qty_increments: qtyIncrement = 1
                    } = {}
                } = {}
            } = {},
            minSaleQuantity,
            maxSaleQuantity,
            handleChangeQuantity,
            isCartOverlay
        } = this.props;

        return (
            <div
              block="MiniCartItem"
              elem="QuantityWrapper"
              mods={ { isCartOverlay } }
              onClick={ this.quantityClickHandler }
              onKeyDown={ this.quantityClickHandler }
              role="button"
              tabIndex="-1"
            >
                <Field
                  id="item_qty"
                  type={ FIELD_TYPE.number }
                  attr={ {
                      id: `${sku}_item_qty`,
                      name: `${sku}_item_qty`,
                      defaultValue: qty,
                      min: minSaleQuantity,
                      max: maxSaleQuantity,
                      step: qtyIncrement
                  } }
                  value={ qty }
                  events={ {
                      onChange: handleChangeQuantity
                  } }
                  validationRule={ {
                      inputType: VALIDATION_INPUT_TYPE.numeric,
                      range: {
                          min: minSaleQuantity,
                          max: maxSaleQuantity
                      }
                  } }
                  validateOn={ ['onChange'] }
                  mix={ { block: 'MiniCartItem', elem: 'Qty' } }
                />
            </div>
        );
    }

    renderDeleteButton() {
        const {
            handleRemoveItem, isMobileLayout,
            item: { is_promo_item } = {}
        } = this.props;

        if (is_promo_item) {
            return null;
        }

        return (
            <button
              block="MiniCartItem"
              id="RemoveItem"
              name="RemoveItem"
              elem="Delete"
              mods={ { isMobileLayout } }
              aria-label="Remove item from cart"
              onClick={ handleRemoveItem }
            >
                <span block="MiniCartItem" elem="DeleteButtonText" mods={ { isMobileLayout } }>
                                    Remove
                </span>
            </button>
        );
    }

    renderWishlistButton() {
        const { isWishlistEnabled } = this.props;
        const {
            item: {
                product
            }
        } = this.props;

        if (!isWishlistEnabled) {
            return null;
        }

        return (
            <ProductWishlistButton
              magentoProduct={ magentoProductTransform(ADD_TO_WISHLIST, product) }
              mix={ { block: 'MiniCartItem', elem: 'WishListButto2n' } }
            />
        );
    }

    renderImageElement() {
        const {
            item: {
                product: {
                    name,
                    type_id,
                    thumbnail: {
                        url
                    } = {},
                    variants
                }
            },
            thumbnail,
            isProductInStock,
            isMobileLayout
        } = this.props;

        const isNotAvailable = !isProductInStock;

        if (type_id === PRODUCT_TYPE.configurable && variants.length) {
            const [{ thumbnail: { path, url: childurl } }] = variants;

            if (path === 'no_selection' || path === '') {
                return (
                    <Image
                      src={ url }
                      mix={ {
                          block: 'CartItem',
                          elem: 'Picture',
                          mods: {
                              isNotAvailable, isMobileLayout
                          }
                      } }
                      ratio="custom"
                      alt={ `Product ${name} thumbnail.` }
                    />
                );
            }

            return (
                    <Image
                      src={ childurl }
                      mix={ {
                          block: 'CartItem',
                          elem: 'Picture',
                          mods: {
                              isNotAvailable, isMobileLayout
                          }
                      } }
                      ratio="custom"
                      alt={ `Product ${name} thumbnail.` }
                    />
            );
        }

        return (
            <Image
              src={ thumbnail }
              mix={ {
                  block: 'CartItem',
                  elem: 'Picture',
                  mods: {
                      isNotAvailable, isMobileLayout
                  }
              } }
              ratio="custom"
              alt={ `Product ${name} thumbnail.` }
            />
        );
    }

    renderImage() {
        const { linkTo, isMobile, onMinicartOutsideClick } = this.props;

        if (isMobile) {
            return (
                <Link to={ linkTo } onClick={ onMinicartOutsideClick } block="MiniCartItem" elem="Link">
                    { this.renderImageElement() }
                </Link>
            );
        }

        return this.renderImageElement();
    }

    renderQuantity() {
        const { item: { qty } } = this.props;
        return (
            <p
              block="MiniCartItem"
              elem="Quantity"
            >
                Quantity: %s,
{ qty }
            </p>
        );
    }

    renderLoader() {
        const { showLoader, isLoading } = this.props;

        if (!showLoader) {
            return false;
        }

        return (
            <Loader isLoading={ isLoading } />
        );
    }

    render() {
        const { isEditing, isCartOverlay } = this.props;

        return (
            <div block="MiniCartItem" mods={ { isEditing, isCartOverlay } }>
                { this.renderLoader() }
                { this.renderContent() }
            </div>
        );
    }
}

export default MiniCartItemComponent;
