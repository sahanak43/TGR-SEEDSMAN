/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-undef */
/* eslint-disable max-len */
/* eslint-disable max-lines */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
/* eslint-disable react/boolean-prop-naming */
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

import CartCoupon from 'Component/CartCoupon';
import CloseIcon from 'Component/CloseIcon';
import CmsBlock from 'Component/CmsBlock';
import ExpandableContent from 'Component/ExpandableContent';
import { CART_OVERLAY } from 'Component/Header/Header.config';
import Link from 'Component/Link';
import LockIcon from 'Component/LockIcon';
import { OVERLAY_PLACEHOLDER } from 'Component/PopupSuspense/PopupSuspense.config';
import { CartOverlay as SourceCartOverlay } from 'SourceComponent/CartOverlay/CartOverlay.component';
import { CartDisplayType, TotalsType } from 'Type/MiniCart.type';
import { formatPrice } from 'Util/Price';

import { firePromotionCodeFromCartPage } from '../../@scandiweb/gtm/event/cart';
import MiniCartItem from '../MiniCartItem';

import './CartOverlay.style';

/** @namespace Seedsman/Component/CartOverlay/Component */
export class CartOverlayComponent extends SourceCartOverlay {
    static propTypes = {
        totals: TotalsType.isRequired,
        changeHeaderState: PropTypes.func.isRequired,
        handleCheckoutClick: PropTypes.func.isRequired,
        currencyCode: PropTypes.string,
        showOverlay: PropTypes.func.isRequired,
        activeOverlay: PropTypes.string.isRequired,
        hasOutOfStockProductsInCart: PropTypes.bool,
        cartTotalSubPrice: PropTypes.number,
        cartDisplaySettings: CartDisplayType.isRequired,
        isMobile: PropTypes.bool.isRequired,
        onCartItemLoading: PropTypes.func
    };

    static defaultProps = {
        hasOutOfStockProductsInCart: false,
        onCartItemLoading: null,
        currencyCode: null,
        cartTotalSubPrice: null
    };

    componentDidMount() {
        const { showOverlay, activeOverlay } = this.props;

        if (activeOverlay === OVERLAY_PLACEHOLDER) {
            showOverlay(CART_OVERLAY);
        }
    }

    renderPriceLine(price) {
        const { totals: { quote_currency_code } } = this.props;

        return formatPrice(price, quote_currency_code);
    }

    renderCartItems() {
        const {
            totals: {
                items = [],
                quote_currency_code
            },
            onCartItemLoading,
            onMinicartOutsideClick
        } = this.props;

        if (items.length < 1) {
            return this.renderNoCartItems();
        }

        return (
            <div block="CartOverlay" elem="Items" aria-label="List of items in cart">
                { items.map((item) => (
                    <MiniCartItem
                      key={ item.item_id }
                      item={ item }
                      currency_code={ quote_currency_code }
                      onCartItemLoading={ onCartItemLoading }
                      onMinicartOutsideClick={ onMinicartOutsideClick }
                      showLoader
                      isCartOverlay
                    />
                )) }
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
{ ' ' }
{ ' ' }
Please check and try again.
                </p>
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

    renderNoCartItems() {
        return (
            <p block="CartOverlay" elem="Empty">
                You have no items in your shopping cart.
            </p>
        );
    }

    renderSubTotal() {
        const { totals: { subtotal }, cartSubtotal } = this.props;

        if (!subtotal || !cartSubtotal) {
            return null;
        }

        return (
            <dl
              block="CartOverlay"
              elem="SubTotal PriceDetails"
            >
                <dt block="label">Subtotal</dt>
                <dd block="price">
                    { this.renderPriceLine(cartSubtotal) }
                    { /* { this.renderOrderTotalExlTax() } */ }
                </dd>
            </dl>
        );
    }

    renderOrderTotalExlTax() {
        const { cartTotalSubPrice } = this.props;

        if (!cartTotalSubPrice) {
            return null;
        }

        return (
            <span>
                Excl. tax:
                { ' ' }
                { cartTotalSubPrice }
                ,
                { ' ' }
                { this.renderPriceLine(cartTotalSubPrice) }
            </span>
        );
    }

    renderTotals() {
        const { totals: { grand_total = 0 } } = this.props;

        return (
            <dl
              block="CartOverlay"
              elem="Total"
            >
                <dt block="label">Order Total</dt>
                <dd block="price">
                    { this.renderPriceLine(grand_total) }
                    { /* { this.renderOrderTotalExlTax() } */ }
                </dd>
            </dl>
        );
    }

    renderDeliveryInsurance() {
        return (
          <div
            block="CartOverlay"
            elem="DeliveryInsurance"
          >
            { this.renderDeliveryInsurancePrice() }
          </div>
        );
    }

    renderDeliveryInsurancePrice() {
        return null;
    }

    renderSubtotalInclTax() {
        const { totals: { subtotal_with_discount = 0 } } = this.props;

        if (!subtotal_with_discount) {
            return null;
        }

        return (
            <dl
              block="CartOverlay"
              elem="TotalInclu PriceDetails"
            >
                <dt block="label">Order Total Incl. Tax</dt>
                <dd block="price">
                    { this.renderPriceLine(subtotal_with_discount) }
                </dd>
            </dl>
        );
    }

    renderTax() {
        const {
            totals: {
                applied_taxes = []
            } = {},
            cartDisplaySettings: {
                display_zero_tax_subtotal
            } = {},
            displayTax
        } = this.props;

        if (!applied_taxes?.length || !display_zero_tax_subtotal || !displayTax) {
            return null;
        }

        const [{ amount }] = applied_taxes;

        return (
            <dl
              block="CartOverlay"
              elem="Tax"
            >
                <dt block="label">Tax total</dt>
                <dd block="price">{ this.renderPriceLine(amount) }</dd>
            </dl>
        );
    }

    renderApplyDiscount() {
        const {
            totals: { coupon_code }
        } = this.props;

        const h = 'Coupon Discount';

        return (
            <div className="Discount container">
                <div className="DiscountField">
                <ExpandableContent
                  isContentExpanded={ !!coupon_code }
                  heading={ h }
                  mix={ { block: 'ProductIi', elem: `${coupon_code ? 'DiscountApplied' : 'Content'}` } }
                >
                     <CartCoupon couponCode={ coupon_code } />
                     { this.renderDiscountMsg() }
                </ExpandableContent>
                </div>
            </div>

        );
    }

    renderCouponCode(code) {
        if (!code) {
            return null;
        }

        return <div block="CartOverlay" elem="DiscountApplied"><strong block="CartOverlay" elem="DiscountCoupon">{ `${code.toUpperCase()}` }</strong></div>;
    }

    renderDiscount() {
        const {
            totals: {
                applied_rule_ids,
                discount_amount,
                coupon_code
            }
        } = this.props;

        if (!applied_rule_ids || !discount_amount) {
            return null;
        }

        const label = coupon_code ? 'Coupon code discount ' : 'Discount: ';

        return (
            <dl
              block="CartOverlay"
              elem="Discount"
            >
                <dt block="label">
                    { label }
                    { this.renderCouponCode(coupon_code) }
                </dt>
                <dd block="price">{ `-${this.renderPriceLine(Math.abs(discount_amount))}` }</dd>
            </dl>
        );
    }

    renderSecureCheckoutButton() {
        const { handleCheckoutClick, hasOutOfStockProductsInCart } = this.props;

        return (
            <button
              block="CartOverlay"
              elem="CheckoutButton"
              mix={ { block: 'Button' } }
              onClick={ handleCheckoutClick }
              disabled={ hasOutOfStockProductsInCart }
            >
                <LockIcon />
                Secure checkout
            </button>
        );
    }

    renderActions() {
        const { onMinicartOutsideClick } = this.props;
        return (
            <div block="CartOverlay" elem="Actions">
                <Link
                  block="CartOverlay"
                  elem="CartButton"
                  mix={ { block: 'Button' } }
                  to="/cart"
                  onClick={ onMinicartOutsideClick }
                >
                    Proceed to cart
                </Link>
            </div>
        );
    }

    renderCartHeader() {
        const { onMinicartOutsideClick } = this.props;

        return (
            <div className="CartOverlay-top">
                <div className="Cart-Header">
                    <h2 className="Cart-Heading">Your Cart Items</h2>
                    <button onClick={ onMinicartOutsideClick }><CloseIcon /></button>
                </div>
            </div>
        );
    }

    renderCartAdditional() {
        const { totals: { items = [] } } = this.props;

        if (items.length < 1) {
            return null;
        }

        return (
            <div block="CartOverlay" elem="Additional">
                { this.renderSubTotal() }
                { this.renderDiscount() }
                { this.renderTax() }
                { this.renderApplyDiscount() }
                { this.renderTotals() }
                { this.renderOutOfStockProductsWarning() }
                { this.renderActions() }
            </div>
        );
    }

    renderPromo() {
        const { minicart_content: { minicart_cms } = {} } = window.contentConfiguration;

        if (minicart_cms) {
            return <CmsBlock key={ minicart_cms } identifier={ minicart_cms } />;
        }

        return (
            <p
              block="CartOverlay"
              elem="Promo"
            >
                Free shipping on order 49$ and more.
            </p>
        );
    }

    renderOutOfStockProductsWarning() {
        const { hasOutOfStockProductsInCart } = this.props;

        if (!hasOutOfStockProductsInCart) {
            return null;
        }

        return (
            <div block="CartOverlay" elem="OutOfStockProductsWarning">
                Some of the product in your basket are out of stock.\nPlease remove them to continue to place order
            </div>
        );
    }

    render() {
        const { onMinicartOutsideClick, isMobile } = this.props;

        return (
            <div>
{ !isMobile
    ? (
<div
  id={ CART_OVERLAY }
  mix={ { block: 'CartOverlay' } }
>
                <div block="CartOverlay" elem="CartOverlayContentBackground" onMouseDown={ onMinicartOutsideClick } />
                <div block="CartOverlay" elem="CartOverlayContentWrapper">
                        { this.renderCartHeader() }
                        <div block="CartOverlay" elem="ContentWrapper">
                            { this.renderCartItems() }
                            { this.renderCartAdditional() }
                        </div>
                </div>
</div>
    ) : null }
            </div>
        );
    }
}

export default CartOverlayComponent;
