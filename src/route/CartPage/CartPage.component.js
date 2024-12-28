/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable fp/no-let */
/* eslint-disable no-magic-numbers */
/* eslint-disable consistent-return */
/* eslint-disable max-lines */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable max-len */
import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import CartCoupon from 'Component/CartCoupon';
import CartItem from 'Component/CartItem';
import CartPagePopup from 'Component/CartPagePopup';
import CheckoutOrderSummary from 'Component/CheckoutOrderSummary/CheckoutOrderSummary.container';
import CmsBlock from 'Component/CmsBlock';
import ContentWrapper from 'Component/ContentWrapper';
import ExpandableContent from 'Component/ExpandableContent';
import Field from 'Component/Field';
import FIELD_TYPE from 'Component/Field/Field.config';
import Image from 'Component/Image';
import Link from 'Component/Link';
import Loader from 'Component/Loader';
import { DEFAULT_CHECKOUT_CMS_BLOCK } from 'Route/Checkout/Checkout.config';
import { CartPage as SourceCartPage } from 'SourceRoute/CartPage/CartPage.component';
import { htmlParse } from 'Util/HtmlParser';
import EmptyCartIcon from 'Util/images/emptyCart.svg';
import { fireInsiderPageEvent } from 'Util/Insider';
import { formatPrice } from 'Util/Price';
import { getPathnameFromURL } from 'Util/Url';

import { firePromotionCodeFromCartPage } from '../../@scandiweb/gtm/event/cart';

import './CartPage.style';

/** @namespace Seedsman/Route/CartPage/Component */
export class CartPageComponent extends SourceCartPage {
    renderCartItems() {
        const {
            totals: { items, quote_currency_code },
            isLoading,
            onCartItemLoading,
            isInitialLoad,
            renderShoppingAction
        } = this.props;

        if (items.length < 1 && !isLoading) {
            const url = getPathnameFromURL();

            if (url === 'CART') {
                fireInsiderPageEvent({});
            }

            return (
                <>
                    <div block="CartPage" elem="EmptyInner">
                        <div className="EmptyImage">
                            <img src={ EmptyCartIcon } alt="EmptyCartIcon" />
                        </div>
                        <div className="EmptyContent">
                            <h3 className="EmptyHeading">
                                Your Cart Is Empty
                            </h3>
                            <p className="Content">
                                Your cart is empty, Add Items to your cart
                            </p>
                        </div>
                        <div className="ShoppingButton">
                            <button onClick={ renderShoppingAction }>CONTINUE SHOPPING</button>
                        </div>
                    </div>
                    <div block="CartPage" elem="EmptyCms">
                        <CmsBlock key="empty_cart" identifier="empty_cart" />
                    </div>
                </>
            );
        }

        return (
            <div
              block="CartPage"
              elem="Items"
              aria-label="List of items in cart"
            >
                { items.map((item) => (
                    <CartItem
                      key={ item.item_id }
                      item={ item }
                      currency_code={ quote_currency_code }
                      onCartItemLoading={ onCartItemLoading }
                      showLoader
                      isEditing
                      updateCrossSellsOnRemove
                    />
                )) }
                { isLoading && isInitialLoad && (
                    <div block="CartPage" elem="ItemsLoaderContainer">
                        <Loader isLoading />
                    </div>
                ) }
            </div>
        );
    }

    renderFreeShippingMsg() {
        const { isFreeShippingActive, freeShippingAmount, totals: { quote_currency_code, grand_total } } = this.props;

        if (!isFreeShippingActive || !freeShippingAmount) {
            return null;
        }

        const amount = freeShippingAmount - grand_total;

        if (freeShippingAmount < grand_total) {
            return (
                <span block="CartPage" elem="free">You are eligible for free shipping</span>
            );
        }

        return (
            <span block="CartPage" elem="free">{ `Spend ${formatPrice(amount, quote_currency_code)} more to get free shipping` }</span>
        );
    }

    renderHeading() {
        const { totals: { items, items_qty } } = this.props;
        if (items.length < 1) {
            return null;
        }

        return (
            <div block="CartPage" elem="Inner">
                <div block="CartPage" elem="Head_Content">
                    <span block="CartPage" elem="item">{ items_qty }</span>
                    <h1 block="CartPage" elem="Heading">
                        Items in your basket
                    </h1>
                </div>
            </div>
        );
    }

    renderTotalsSection() {
        const {
            totals: { items = [] }
        } = this.props;

        if (items.length < 1) {
            return null;
        }

        return (
            <div block="CartPage" elem="Floating">
                <div block="CartPage" elem="SummaryWrapper">
                    { this.renderTotals() }
                    { this.renderDiscountCode() }
                </div>
            </div>
        );
    }

    renderCartItemss(product = {}) {
        const { seeds_number } = product;
        const label = (seeds_number?.[0] || {}).label || '';

        return (
            <div block="CartPage" elem="Itemss">
                <span>Pack Size:</span>
                <span>{ label }</span>
            </div>
        );
    }

    renderAddButton(product) {
        const { qty, sku } = product;
        const options = {
            quantity: qty,
            sku
        };
        const { addToCart } = this.props;
        return (
            <div block="CartPage" elem="AddButton">
                <div>Free</div>
                <button onClick={ () => addToCart(options) }>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 19C11.7167 19 11.4793 18.904 11.288 18.712C11.096 18.5207 11 18.2833 11 18V13H6C5.71667 13 5.479 12.904 5.287 12.712C5.09567 12.5207 5 12.2833 5 12C5 11.7167 5.09567 11.479 5.287 11.287C5.479 11.0957 5.71667 11 6 11H11V6C11 5.71667 11.096 5.479 11.288 5.287C11.4793 5.09567 11.7167 5 12 5C12.2833 5 12.521 5.09567 12.713 5.287C12.9043 5.479 13 5.71667 13 6V11H18C18.2833 11 18.5207 11.0957 18.712 11.287C18.904 11.479 19 11.7167 19 12C19 12.2833 18.904 12.5207 18.712 12.712C18.5207 12.904 18.2833 13 18 13H13V18C13 18.2833 12.9043 18.5207 12.713 18.712C12.521 18.904 12.2833 19 12 19Z" fill="black" />
                    </svg>
                </button>
            </div>
        );
    }

    renderDiscountMsg() {
        const {
            isCouponCodeValid,
            totals: { coupon_code, items }
        } = this.props;

        if (!items || items.length < 1) {
            return null;
        }

        if (isCouponCodeValid === false) {
            return (
            <div block="DiscountMsg" elem="WrapperNotFound">
                <p block="DiscountMsg" elem="MessageNotFound">
                    Promo code not recognized.
                </p>
                <p block="DiscountMsg" elem="MessageNotFound">Please check and try again.</p>
            </div>
            );
        }

        if (coupon_code) {
            firePromotionCodeFromCartPage(coupon_code);
            return (
                <div block="DiscountMsg" elem="Wrapper">
                    <p block="DiscountMsg" elem="Message">
                        Discount code applied
                    </p>
                </div>
            );
        }
    }

    renderDiscountCode() {
        const {
            totals: { coupon_code, items }
        } = this.props;

        if (!items || items.length < 1) {
            return null;
        }

        return (
            <ExpandableContent
              isContentExpanded={ !!coupon_code }
              heading="Use a promo code"
              mix={ { block: 'CartPage-Coupon' } }
            >
                <CartCoupon couponCode={ coupon_code } />
                { this.renderDiscountMsg() }
            </ExpandableContent>
        );
    }

    renderFreebiesHeading() {
        const { totals: { amastyPromoItems } = {}, isFreebieRequired, handleFreebies } = this.props;
        if (!amastyPromoItems?.length) {
            return null;
        }

        return (
            <div block="CartPage" elem="Freebies">
                <div block="CartPage" elem="Headingss">
                    <div className="Title">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 17.0001C12.2833 17.0001 12.521 16.9041 12.713 16.7121C12.9043 16.5208 13 16.2834 13 16.0001V11.9751C13 11.6918 12.9043 11.4584 12.713 11.2751C12.521 11.0918 12.2833 11.0001 12 11.0001C11.7167 11.0001 11.4793 11.0958 11.288 11.2871C11.096 11.4791 11 11.7168 11 12.0001V16.0251C11 16.3084 11.096 16.5418 11.288 16.7251C11.4793 16.9084 11.7167 17.0001 12 17.0001ZM12 9.0001C12.2833 9.0001 12.521 8.9041 12.713 8.7121C12.9043 8.52077 13 8.28343 13 8.0001C13 7.71677 12.9043 7.4791 12.713 7.2871C12.521 7.09577 12.2833 7.0001 12 7.0001C11.7167 7.0001 11.4793 7.09577 11.288 7.2871C11.096 7.4791 11 7.71677 11 8.0001C11 8.28343 11.096 8.52077 11.288 8.7121C11.4793 8.9041 11.7167 9.0001 12 9.0001ZM12 22.0001C10.6167 22.0001 9.31667 21.7374 8.1 21.2121C6.88333 20.6874 5.825 19.9751 4.925 19.0751C4.025 18.1751 3.31267 17.1168 2.788 15.9001C2.26267 14.6834 2 13.3834 2 12.0001C2 10.6168 2.26267 9.31677 2.788 8.1001C3.31267 6.88343 4.025 5.8251 4.925 4.9251C5.825 4.0251 6.88333 3.31243 8.1 2.7871C9.31667 2.26243 10.6167 2.0001 12 2.0001C13.3833 2.0001 14.6833 2.26243 15.9 2.7871C17.1167 3.31243 18.175 4.0251 19.075 4.9251C19.975 5.8251 20.6873 6.88343 21.212 8.1001C21.7373 9.31677 22 10.6168 22 12.0001C22 13.3834 21.7373 14.6834 21.212 15.9001C20.6873 17.1168 19.975 18.1751 19.075 19.0751C18.175 19.9751 17.1167 20.6874 15.9 21.2121C14.6833 21.7374 13.3833 22.0001 12 22.0001ZM12 20.0001C14.2167 20.0001 16.1043 19.2211 17.663 17.6631C19.221 16.1044 20 14.2168 20 12.0001C20 9.78343 19.221 7.89577 17.663 6.3371C16.1043 4.7791 14.2167 4.0001 12 4.0001C9.78333 4.0001 7.896 4.7791 6.338 6.3371C4.77933 7.89577 4 9.78343 4 12.0001C4 14.2168 4.77933 16.1044 6.338 17.6631C7.896 19.2211 9.78333 20.0001 12 20.0001Z" fill="white" />
                        </svg>
                        <span>You’re entitled to freebie(s)! Choose them here:</span>
                    </div>
                    { !isFreebieRequired ? (
                        <button
                          className="FreebieEdit"
                          onClick={ handleFreebies }
                        >
                            Edit
                        </button>
                    ) : null }
                </div>
            </div>
        );
    }

    renderQuantityChangeField(qty) {
        return (
            <div
              block="CartItem"
              elem="QuantityWrapper"
              role="button"
              tabIndex="-1"
            >
                <Field
                  id="item_qty"
                  type={ FIELD_TYPE.number }
                  attr={ {
                      defaultValue: qty
                  } }
                  value={ qty }
                  mix={ { block: 'CartItem', elem: 'Qty' } }
                />
            </div>
        );
    }

    renderBrandName(brands) {
        const aTag = new RegExp(/<a[^>]*>([^<]+)<\/a>/g);
        const test = aTag.test(brands);

        if (brands) {
            if (test === true) {
                const {
                    props: {
                        href, title, target
                    } = {}
                } = htmlParse(brands);

                return (
                    <Link block="Product" elem="BrandName" to={ href } target={ target } title={ title }>{ title }</Link>
                );
            }
            const title = brands.replace(/'/g, '');

            return (
                <h4 block="Product" elem="BrandName">{ title }</h4>
            );
        }
    }

    renderPicture(item) {
        const { name, image } = item;
        const { isLoading } = this.props;

        this.sharedComponent = (
            <Image
              imageRef={ this.imageRef }
              src={ image }
              alt={ name }
              ratio="custom"
              mix={ { block: 'FreebiesCard', elem: 'Picture' } }
              isPlaceholder={ !!isLoading }
            />
        );

        return (
            <>
                { this.sharedComponent }
                <img
                  style={ { display: 'none' } }
                  alt={ name }
                  src={ image }
                />
            </>
        );
    }

    renderFreebies() {
        const { totals: { items, amastyPromoItems } = {}, isFreebieRequired } = this.props;
        if (items.length < 1) {
            return;
        }

        if (!amastyPromoItems?.length) {
            return;
        }

        const product = amastyPromoItems.map((item) => (
            <SwiperSlide>
                <div block="FreebiesCard" elem="Wrapper" key={ item.sku }>
                    <div block="FreebiesCard" elem="Image">
                        <div block="FreebiesCard" elem="ImgBlock">
                            { this.renderPicture(item) }
                        </div>
                    </div>
                    <div block="FreebiesCard" elem="Details">
                        <span block="FreebiesCard" elem="Headings">
                            { item.name }
                        </span>
                        <div block="FreebiesCard" elem="Content">
                            { this.renderBrandName(item.brand) }
                            { this.renderCartItemss(item) }
                            { this.renderAddButton(item) }
                        </div>
                    </div>
                </div>
            </SwiperSlide>

        ));

        return (
            <div block="CartPage" elem="FreebiesWrapper">
                { this.renderFreebiesHeading() }
                { isFreebieRequired
                    ? (
                        <div block="CartPage" elem="FreebiesListWrapper">
                            <Swiper
                              slidesPerView="auto"
                              spaceBetween={ 16 }
                              loop={ false }
                              pagination={ {
                                  clickable: true
                              } }
                              navigation
                              breakpoints={ {
                                  320: {
                                      slidesPerView: 'auto'
                                  },
                                  640: {
                                      slidesPerView: 'auto'
                                  },
                                  1200: {
                                      slidesPerView: 'auto'
                                  }
                              } }
                              modules={ [Pagination, Navigation] }
                              className="freebieSwiper"
                            >
                                { product }
                            </Swiper>
                        </div>
                    ) : null }
                { this.renderFreebieChoice() }
            </div>
        );
    }

    renderFreebieChoice() {
        const { handleFreebieChoice, isFreebieRequired } = this.props;

        if (!isFreebieRequired) {
            return null;
        }

        return (
            <div block="FreebieChoice" elem="Wrapper">
                <div block="FreebieChoice" elem="Content">
                    <p className="Prompt">
                        Don’t want your freebie(s)?
                    </p>
                    <span className="label">
                        No problem, click no thanks to continue without.
                    </span>
                </div>
                <div block="FreebieChoice" elem="Button">
                    <button
                      block="Button"
                      mix={ {
                          block: 'FreebieChoice',
                          elem: 'Button'
                      } }
                      onClick={ handleFreebieChoice }
                      type={ FIELD_TYPE.button }
                      mods={ { isHollow: true } }
                    >
                        No Thanks
                    </button>
                </div>
            </div>
        );
    }

    renderTotalErrorMsg() {
        const { totals: { base_subtotal }, minimum_order_amount = [] } = this.props;

        if ((base_subtotal < minimum_order_amount[0]?.minimum_amount) && (minimum_order_amount[0]?.enable) && (base_subtotal > 0)) {
            return (
                <div block="CartPage" elem="OrderTotal">
                    <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 18 18" width="18">
                        <rect id="Canvas" fill="#ff13dc" opacity="0" width="18" height="18" />
                        <path className="a" d="M8.5635,1.2895.2,16.256A.5.5,0,0,0,.636,17H17.364a.5.5,0,0,0,.436-.744L9.4365,1.2895a.5.5,0,0,0-.873,0ZM10,14.75a.25.25,0,0,1-.25.25H8.25A.25.25,0,0,1,8,14.75v-1.5A.25.25,0,0,1,8.25,13h1.5a.25.25,0,0,1,.25.25Zm0-3a.25.25,0,0,1-.25.25H8.25A.25.25,0,0,1,8,11.75v-6a.25.25,0,0,1,.25-.25h1.5a.25.25,0,0,1,.25.25Z" />
                    </svg>
                    <div block="CartPage" elem="OrderMessage">{ minimum_order_amount[0].description_message }</div>
                </div>
            );
        }

        return true;
    }

    renderWishlistItems([id, product]) {
        const { totals: { quote_currency_code }, onCartItemLoading } = this.props;

        const item = {
            product
        };

        return (
            <CartItem
              key={ id }
              item={ item }
              currency_code={ quote_currency_code }
              onCartItemLoading={ onCartItemLoading }
              showLoader
              isEditing
              isWishlistItem
            />
        );
    }

    renderSavedItems() {
        const { isInitialLoad, isLoading, productsInWishlist } = this.props;

        return (
            <>
                <h3>
                    Saved Items
                </h3>
                <div
                  block="CartPage"
                  elem="Items"
                  aria-label="List of items in wishlist"
                >
                    { Object.entries(productsInWishlist).map(this.renderWishlistItems.bind(this)) }
                    { isLoading && isInitialLoad && (
                        <div block="CartPage" elem="ItemsLoaderContainer">
                            <Loader isLoading />
                        </div>
                    ) }
                </div>
            </>
        );
    }

    renderDesktop() {
        return (
            <>
                <div block="CartPage" elem="Static">
                    { this.renderTotalErrorMsg() }
                    { this.renderHeading() }
                    { this.renderFreebies() }
                    { this.renderCartItems() }
                    { /* { this.renderSavedItems() } */ }
                </div>
                { this.renderTotalsSection() }
            </>
        );
    }

    renderPromoPrice() {
        return (
            <div block="CartPage" elem="PromoPrice">
                <div>Free</div>
            </div>
        );
    }

    renderMobileTotalsSection() {
        const {
            totals: { items = [] }
        } = this.props;

        if (items.length < 1) {
            return;
        }

        return (
            <div block="CartPage" elem="Floating">
                { this.renderTotals() }
                { this.renderDiscountCode() }
            </div>
        );
    }

    renderMobile() {
        return (
            <div block="CartPage" elem="Static">
                { this.renderTotalErrorMsg() }
                { this.renderHeading() }
                { this.renderFreebies() }
                { this.renderCartItems() }
                { /* { this.renderSavedItems() } */ }
                { this.renderTotalsSection() }
            </div>
        );
    }

    renderCmsBlock() {
        return <CmsBlock identifier={ DEFAULT_CHECKOUT_CMS_BLOCK } />;
    }

    renderPopup() {
        const { handleRemoveItem } = this.props;
        return (
            <CartPagePopup
              handleRemoveItem={ handleRemoveItem }
            />
        );
    }

    // eslint-disable-next-line @scandipwa/scandipwa-guidelines/only-render-in-component
    isPlaceOrderDisabled() {
        const { totals: { items, amastyPromoItems, base_subtotal } = {}, minimum_order_amount = [], isFreebieRequired } = this.props;

        // Check if order amount is lower than the minimum amount and minimum order amount is enabled
        const isBelowMinimumAmount = (base_subtotal < (minimum_order_amount[0]?.minimum_amount) && (minimum_order_amount[0]?.enable));

        // Check if Amasty promo items are present and no eligible item is added to cart
        const isAmastyPromoItemsPresent = amastyPromoItems.length > 0;
        const cartHasPromoItem = items.some((item) => item.is_promo_item);

        // Return true only if any of the above conditions are met
        return isBelowMinimumAmount || (isAmastyPromoItemsPresent && isFreebieRequired && !cartHasPromoItem);
    }

    renderFreebieWarningMsg() {
        const { totals: { items, amastyPromoItems } = {}, isFreebieRequired } = this.props;

        const isAmastyPromoItemsPresent = amastyPromoItems.length > 0;

        const hasPromoItem = items.some((item) => item.is_promo_item);

        if (hasPromoItem || !isFreebieRequired) {
            return null;
        }

        if (!isAmastyPromoItemsPresent) {
            return null;
        }

        return (
            <div block="CartPage" elem="FreebieWarning">
                <div className="Message">Select your freebie(s) or opt out to continue to checkout</div>
            </div>
        );
    }

    renderSecureCheckoutButton() {
        const {
            onCheckoutButtonClick,
            hasOutOfStockProductsInCart
        } = this.props;

        if (hasOutOfStockProductsInCart) {
            return (
                <div block="CartPage" elem="OutOfStockProductsWarning">
                    Some of the product in your basket are out of stock. Please remove them to continue to place order
                </div>
            );
        }

        return (
            <div block="CartPage" elem="CheckoutButtonWrapper">
                <button
                  block="CartPage"
                  elem="CheckoutButton"
                  mix={ { block: 'Button' } }
                  onClick={ onCheckoutButtonClick }
                    // eslint-disable-next-line no-undef, @scandipwa/scandipwa-guidelines/jsx-no-props-destruction
                  disabled={ this.isPlaceOrderDisabled() }
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 6V18C22 18.55 21.8043 19.021 21.413 19.413C21.021 19.8043 20.55 20 20 20H4C3.45 20 2.97933 19.8043 2.588 19.413C2.196 19.021 2 18.55 2 18V6C2 5.45 2.196 4.97933 2.588 4.588C2.97933 4.196 3.45 4 4 4H20C20.55 4 21.021 4.196 21.413 4.588C21.8043 4.97933 22 5.45 22 6ZM4 8H20V6H4V8ZM4 12V18H20V12H4Z" fill="white" />
                    </svg>
                    Go to checkout
                </button>
            </div>
        );
    }

    renderSummary() {
        const {
            totals,
            onCouponCodeUpdate,
            isFreebieRequired
        } = this.props;

        return (
            <CheckoutOrderSummary
              totals={ totals }
              isFreebieRequired={ isFreebieRequired }
                // eslint-disable-next-line react/jsx-no-bind
              renderCmsBlock={ () => this.renderPromo(true) }
              onCouponCodeUpdate={ onCouponCodeUpdate }
              showItems={ false }
            >
                { this.renderFreebieWarningMsg() }
                { this.renderSecureCheckoutButton() }
            </CheckoutOrderSummary>
        );
    }

    render() {
        const { totals: { items } } = this.props;

        return (
            <main block="CartPage" aria-label="Cart Page">
                { this.renderInitialPlaceholder() }
                <ContentWrapper
                  wrapperMix={ { block: 'CartPage', elem: `Wrapper ${items.length === 0 ? 'isEmpty' : ''}` } }
                  label="Cart page details"
                >
                    { this.renderMainContent() }
                </ContentWrapper>
                { this.renderCrossSellProducts() }
                { /* { this.renderCmsBlock() } */ }
                { this.renderPopup() }
            </main>
        );
    }
}

export default CartPageComponent;
