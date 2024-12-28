/* eslint-disable fp/no-let */
/* eslint-disable max-len */
/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-else-return */
/* eslint-disable react/forbid-elements */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable max-lines */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
import CartItemPrice from 'Component/CartItemPrice';
import Field from 'Component/Field';
import FIELD_TYPE from 'Component/Field/Field.config';
import Image from 'Component/Image';
import Link from 'Component/Link';
import PRODUCT_TYPE from 'Component/Product/Product.config';
import ProductWishlistButton from 'Component/ProductWishlistButton';
import { CartItem as sourceCartItem } from 'SourceComponent/CartItem/CartItem.component';
import { htmlParse } from 'Util/HtmlParser';
// import { formatPrice } from 'Util/Price';
import { ADD_TO_WISHLIST } from 'Util/Product';
import { magentoProductTransform } from 'Util/Product/Transform';
import { VALIDATION_INPUT_TYPE } from 'Util/Validator/Config';

import './CartItem.style';

/**
 * Cart and CartOverlay item
 * @class CartItem
 * @namespace Seedsman/Component/CartItem/Component */
export class CartItemComponent extends sourceCartItem {
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

    renderTitle() {
        const {
            isMobileLayout,
            item: { row_total },
            isProductInStock
        } = this.props;
        const updatedLinkTo = this.renderlinkTo();

        return (
            <div block="CartItem" elem="Title" mods={ { isMobileLayout } }>
                { this.renderOwnerName() }
                { isProductInStock && row_total > 0 ? (
                    <Link to={ updatedLinkTo } block="CartItem" elem="Link">
                        { this.renderProductName() }
                    </Link>
                ) : (
                    this.renderProductName()
                ) }
                { this.renderProductConfigurations() }
            </div>
        );
    }

    renderProductName() {
        const {
            getCurrentProduct,
            item: {
                product: {
                    name, sku
                } = {}
            } = {}
        } = this.props;

        const { id: ActiveProductId, sku: ActiveProductSku } = getCurrentProduct() || {};

        return (
            <p
              block="CartItem"
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
                } = {}
            } = {},
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

    renderOutOfStockMessage() {
        const { isProductInStock } = this.props;

        if (isProductInStock) {
            return null;
        }

        return (
            <p block="CartItem" elem="OutOfStock">
                Out of stock
            </p>
        );
    }

    renderQuantityChangeField() {
        const {
            item: {
                sku,
                qty,
                is_promo_item,
                product: {
                    stock_item: { qty_increments: qtyIncrement = 1 } = {}
                } = {}
            } = {},
            minSaleQuantity,
            maxSaleQuantity,
            handleChangeQuantity,
            isProductInStock,
            isCartOverlay
        } = this.props;

        if (is_promo_item) {
            const { item: { qty } = {} } = this.props;
            return (
                <div
                  block="CartItem"
                  elem="QuantityWrapperFree"
                >
                    <span
                      block="CartItem"
                      elem="QuantityWrapperFreeText"
                    >
Free!

                    </span>
                    <span
                      block="CartItem"
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
            <div
              block="CartItem"
              elem={ `QuantityWrapper ${
                  !isProductInStock ? 'isPlaceholder' : ''
              }` }
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
                  mix={ { block: 'CartItem', elem: 'Qty' } }
                />
            </div>
        );
    }

    // eslint-disable-next-line @scandipwa/scandipwa-guidelines/only-render-in-component
    getVariantProductPrice() {
        const {
            item: {
                sku,
                product: {
                    variants = []
                } = {}
            } = {}
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
                is_promo_item,
                qty,
                product: { price_range, quantity } = {}
            },
            isCartOverlay,
            isProductInStock,
            isMobileLayout,
            isWishlistItem
        } = this.props;

        if (!isProductInStock) {
            return null;
        }

        // if (is_promo_item) {
        //     return (
        //         <p mix={ {
        //             block: 'CartItem',
        //             elem: 'Price',
        //             mods: { isMobileLayout }
        //         } }
        //         >
        //             <span block="ProductPrice" elem="PriceValue">
        //             { formatPrice(price, currency_code) }
        //             </span>
        //         </p>
        //     );
        // }

        return (
            <CartItemPrice
              qty={ isWishlistItem ? quantity : qty }
              row_total={ row_total }
              price_range={ price_range }
              productPrice={ price }
              is_promo_item={ is_promo_item }
              row_total_incl_tax={ row_total_incl_tax }
              currency_code={ currency_code }
              isWishlistItem={ isWishlistItem }
              variantPriceRange={ this.getVariantProductPrice() || {} }
              mix={ {
                  block: 'CartItem',
                  elem: 'Price',
                  mods: { isCartOverlay, isMobileLayout }
              } }
            />
        );
    }

    renderProductConfigurations() {
        const { optionsArray } = this.props;

        if (!optionsArray.length) {
            return null;
        }

        return optionsArray.map((data) => {
            if (data?.length) {
                return this.renderConfigurationData(data[0]);
            }

            return null;
        });
    }

    renderConfigurationData(data) {
        if (!data.attribute_value) {
            return null;
        }

        return (
            <div
              block="CartItem"
              elem="Options"
            >
                <span
                  block="CartItem"
                  elem="ItemValue"
                >
{ data?.attribute_label }
                </span>
                <span
                  block="CartItem"
                  elem="Value"
                >
:
{ ' ' }
{ data?.attribute_value }

                </span>

            </div>
        );
    }

    renderBrandName() {
        const {
            item: {
                product: {
                    attributes: {
                        brand: {
                            attribute_value: brands,
                            attribute_options = {}
                        } = {}
                    } = {}
                } = {}
            } = {}
        } = this.props;

        const value = attribute_options[brands]?.label;

        const aTag = new RegExp(/<a[^>]*>([^<]+)<\/a>/g);
        const test = aTag.test(value);

        if (value) {
            if (test === true) {
                const { props: { href, title, target } = {} } = htmlParse(value);

                return (
                    <Link
                      block="Product"
                      elem="BrandName"
                      to={ href }
                      target={ target }
                      title={ title }
                    >
                        { title }
                    </Link>
                );
            } else {
                const title = value.replace(/'/g, '');

                return (
                    <h4 block="Product" elem="BrandName">
                        { title }
                    </h4>
                );
            }
        }
    }

    renderOwnerName() {
        return (
            <div block="CartItem" elem="OwnerName">
                <span>{ this.renderBrandName() }</span>
            </div>
        );
    }

    renderWrapperContent() {
        const { isEditing } = this.props;

        return isEditing
            ? this.renderDesktopContent()
            : this.renderDesktopSummary();
    }

    renderDesktopSummary() {
        return (
            <div block="CartItem" elem="Wrapper" mods={ { isSummary: true } }>
                { this.renderImage() }
                <div block="CartItem" elem="CartItemRows">
                    <div block="CartItem" elem="ProductInfo">
                        { this.renderTitle() }
                    </div>
                    <div block="CartItem" elem="ProductActions">
                        { this.renderQuantity() }
                        { this.renderProductPrice() }
                    </div>
                </div>
            </div>
        );
    }

    renderImage() {
        const { isMobile, item: { is_promo_item } } = this.props;
        const updatedLinkTo = this.renderlinkTo();

        if (isMobile && !is_promo_item) {
            return (
                <Link to={ updatedLinkTo } block="CartItem" elem="Linkssss">
                    { this.renderImageElement() }
                </Link>
            );
        }

        return this.renderImageElement();
    }

    renderDesktopContent() {
        const {
            item: { is_promo_item }, isProductInStock
        } = this.props;
        const updatedLinkTo = this.renderlinkTo();

        return (
            <div block="CartItem" elem={ is_promo_item ? 'Wrapper Freebie' : 'Wrapper' } mods={ { isCart: true } }>
                <div block="CartItem" elem="ProductInfo">
                    <div>
                        { !is_promo_item
                            ? (
                            <Link to={ updatedLinkTo } block="CartItem" elem="Link">
                                { this.renderImage() }
                            </Link>
                            ) : this.renderImage() }
                    </div>
                    <div block="CartItem" elem="ProductDetails">
                        { this.renderTitle() }
                    </div>
                </div>
                <div block="CartItem" elem="ProductActions">
                    <div block="CartItem" elem="Buttons">
                        { this.renderActionButtons() }
                    </div>
                    <div block="CartItem" elem="Details">
                        { this.renderQuantityChangeField() }
                        { this.renderProductPrice() }
                        { !isProductInStock ? <div block="CartItem" elem="OutOfStockAlert">Out of Stock</div> : null }
                    </div>
                </div>
            </div>
        );
    }

    renderMoveToWishlist() {
        const {
            item: { product, is_promo_item }, isWishlistItem
        } = this.props;

        if (is_promo_item) {
            return null;
        }

        return (
            <ProductWishlistButton
              magentoProduct={ magentoProductTransform(
                  ADD_TO_WISHLIST,
                  product
              ) }
              product={ product }
              mix={ {
                  block: 'CartItem',
                  elem: 'WishListButton'
              } }
              isFromCart={ isWishlistItem }
            />
        );
    }

    renderInclusiveAllTaxes() {
        const {
            isProductInStock,
            item: { is_promo_item }
        } = this.props;

        if (!isProductInStock) {
            return null;
        }

        if (is_promo_item) {
            return (
                <div block="CartItem" elem="FreeItem">
                    Enjoy Your Gift!
                </div>
            );
        }
    }

    renderOffers() {
        const {
            isProductInStock,
            item: {
                is_promo_item,
                product: {
                    price_range: {
                        maximum_price: {
                            discount: { percent_off } = {}
                        } = {}
                    } = {}
                } = {}
            } = {}
        } = this.props;

        if (!isProductInStock || is_promo_item || !percent_off) {
            return null;
        }

        return (
            <div block="CartItem" elem="Offers">
                (
                { Math.floor(percent_off) }
                % Off )
            </div>
        );
    }

    renderActionButtons() {
        const {
            handleRemovePopup,
            handleRemoveItem,
            isMobileLayout,
            item: { item_id }
        } = this.props;

        return (
            <>
                <div className="ProductRemoveButton">
                    <button
                      block="CartItem"
                      id="RemoveItem"
                      name="RemoveItem"
                      elem="Delete"
                      mods={ { isMobileLayout } }
                      aria-label="Remove item from cart"
                      onClick={ () => handleRemovePopup(item_id, handleRemoveItem) }
                    >
                        <span
                          block="CartItem"
                          elem="DeleteButtonText"
                          mods={ { isMobileLayout } }
                        >
                            Remove
                        </span>
                    </button>
                </div>
                { this.renderMoveToWishlist() }
            </>
        );
    }

    renderContent() {
        const { linkTo = {}, isProductInStock, isMobile } = this.props;

        if (!isProductInStock || Object.keys(linkTo).length === 0 || isMobile) {
            // If product is out of stock, or link is not set
            return (
                <span
                  block="CartItem"
                  elem={ `${!isProductInStock ? 'OutOfStockLink' : 'Link'}` }
                >
                    { this.renderWrapperContent() }
                </span>
            );
        }

        return <>{ this.renderWrapperContent() }</>;
    }

    render() {
        const { isEditing, isCartOverlay } = this.props;

        return (
            <div block="CartItem" mods={ { isEditing, isCartOverlay } }>
                { this.renderLoader() }
                { this.renderContent() }
            </div>
        );
    }
}

export default CartItemComponent;
