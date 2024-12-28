/* eslint-disable max-lines */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable no-undef */
/* eslint-disable max-len */
/* eslint-disable new-cap */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */

import ApplyRewards from 'Component/ApplyRewards';
import CartCoupon from 'Component/CartCoupon';
import CheckoutOrderSummaryPriceLine from 'Component/CheckoutOrderSummaryPriceLine';
import ChevronIcon from 'Component/ChevronIcon';
import { BOTTOM, TOP } from 'Component/ChevronIcon/ChevronIcon.config';
import ExpandableContent from 'Component/ExpandableContent';
import ExpandableContentShowMore from 'Component/ExpandableContentShowMore';
import { CmsBlock } from 'Route/Checkout/Checkout.component';
import { BILLING_STEP, DETAILS_STEP, SHIPPING_STEP } from 'Route/Checkout/Checkout.config';
import { CheckoutOrderSummary as ParentCheckoutOrderSummary } from 'SourceComponent/CheckoutOrderSummary/CheckoutOrderSummary.component';
import { isSignedIn } from 'Util/Auth';
import BrowserDatabase from 'Util/BrowserDatabase';
import { DISPLAY_CART_TAX_IN_SUBTOTAL } from 'Util/Cart';
import { formatPrice } from 'Util/Price';

// eslint-disable-next-line import/no-cycle
import './CheckoutOrderSummary.override.style';

/**
 * Checkout Order Summary component
 * @namespace Seedsman/Component/CheckoutOrderSummary/Component */
export class CheckoutOrderSummaryComponent extends ParentCheckoutOrderSummary {
    state = {
        isLoading: false
    };

    deliveryInsurance() {
        const { checkoutStep } = this.props;
        if ([SHIPPING_STEP, BILLING_STEP].includes(checkoutStep)) {
            return null;
        }

        return (
            <div block="CheckoutOrderSummary" elem="DeliveryInsurance">
                { this.deliveryInsurancePrice() }
            </div>
        );
    }

    deliveryInsurancePrice() {
        return null;
    }

    renderHeading() {
        const {
            onClickExpandItems, isMobile, isContentExpanded, checkoutStep
        } = this.props;

        return (
            <div
              block="CheckoutOrderSummary"
              elem="Header"
              mix={ {
                  block: 'CheckoutPage',
                  elem: 'Heading',
                  mods: { hasDivider: true }
              } }
            >
                <h2>Order summary</h2>
                { !isMobile && checkoutStep !== DETAILS_STEP ? (
                    <div
                      block="CheckoutOrderSummary"
                      elem="viewBasketButton"
                      onClick={ onClickExpandItems }
                      onKeyDown={ onClickExpandItems }
                      role="button"
                      tabIndex={ 0 }
                    >
                        View Basket
                        <ChevronIcon direction={ isContentExpanded ? TOP : BOTTOM } />
                    </div>
                ) : null }
            </div>
        );
    }

    renderDiscount() {
        const {
            totals: {
                applied_rule_ids,
                discount_amount,
                coupon_code,
                discounts = [],
                quote_currency_code
            } = {},
            checkoutStep
        } = this.props;

        if (checkoutStep === DETAILS_STEP) {
            return discounts
                .map((discount) => {
                    const { amount: { value, currency } = {}, label } = discount;
                    const discountAmount = -Math.abs(value);

                    return (
                        <CheckoutOrderSummaryPriceLine
                          currency={ currency }
                          price={ discountAmount }
                          title={ label }
                        />
                    );
                });
        }

        if (!applied_rule_ids) {
            return null;
        }

        const label = coupon_code ? 'Discount Code' : 'Discount';
        const discount = -Math.abs(discount_amount);
        return (
            <CheckoutOrderSummaryPriceLine
              currency={ quote_currency_code }
              price={ discount }
              title={ label }
              coupon_code={ coupon_code }
            />
        );
    }

    renderDiscountCode() {
        const {
            totals: { coupon_code, items },
            checkoutStep
        } = this.props;

        if (!items || items.length < 1 || !checkoutStep) {
            return null;
        }

        return (
            <ExpandableContent
              isContentExpanded={ !!coupon_code }
              heading="Use a promo code"
              mix={ { block: 'CartPage-Coupon' } }
            >
                <CartCoupon couponCode={ coupon_code } />
            </ExpandableContent>
        );
    }

    renderItems() {
        const {
            showItems,
            totals: { items_qty, items = [] }
        } = this.props;

        if (!showItems) {
            return null;
        }

        return (
            <>
                <div block="CheckoutOrderSummary" elem="ItemsInCart">
                    <span block="Heading">Your Cart Items</span>
                    <span block="qty">{ `( ${items_qty} )` }</span>
                </div>
                <div block="CheckoutOrderSummary" elem="OrderItems">
                    <div block="CheckoutOrderSummary" elem="CartItemList">
                        <ExpandableContentShowMore showElemCount={ 2 } isCheckout>
                            { items.map(this.renderItem.bind(this)) }
                        </ExpandableContentShowMore>
                    </div>
                </div>
            </>
        );
    }

    renderItemCounts(ItemsCount) {
        const {
            totals: { quote_currency_code },
            cartSubtotal: value
        } = this.props;

        if (!ItemsCount) {
            return null;
        }

        const label = ItemsCount > 1 ? `${ItemsCount} items` : `${ItemsCount} item`;

        return (
            <div className="ItemsCount">
                <span className="label">{ label }</span>
                <span className="price">
                    { formatPrice(value, quote_currency_code) }
                </span>
            </div>
        );
    }

    renderFreebieCount(freebiesCount) {
        const {
            totals: { quote_currency_code }
        } = this.props;

        if (!freebiesCount) {
            return null;
        }

        const label = freebiesCount > 1
            ? `${freebiesCount} freebies`
            : `${freebiesCount} freebie`;

        return (
            <div className="FreebieCount">
                <span className="label">{ label }</span>
                <span className="price">
                    { formatPrice(0.0, quote_currency_code) }
                </span>
            </div>
        );
    }

    renderCount() {
        const {
            totals: { items = [] }, checkoutStep
        } = this.props;

        if (checkoutStep === DETAILS_STEP) {
            return null;
        }

        const counts = items.reduce(
            (accumulator, item) => {
                const countKey = item.is_promo_item === 1 ? 'freebiesCount' : 'itemsCount';
                return {
                    ...accumulator,
                    [countKey]: accumulator[countKey] + 1
                };
            },
            { itemsCount: 0, freebiesCount: 0 }
        );

        if (!counts.itemsCount && !counts.freebiesCount) {
            return null;
        }

        return (
            <div className="CountWrapper">
              <div className="Content">
                { !!counts.itemsCount && this.renderItemCounts(counts.itemsCount) }
                { !!counts.freebiesCount && this.renderFreebieCount(counts.freebiesCount) }
              </div>
            </div>
        );
    }

    renderContent() {
        const { isContentExpanded, checkoutStep, saveAddressInformation } = this.props;

        return (
            <>
                { this.renderHeading() }
                <ExpandableContent
                  isContentExpanded={ isContentExpanded }
                  heading="View Basket"
                  isArrow
                  mix={ { block: 'CheckoutOrderSummary', elem: isContentExpanded ? 'ItemList expanded' : 'ItemList' } }
                >
                    { this.renderItems() }
                </ExpandableContent>
                <ApplyRewards
                  checkoutStep={ checkoutStep }
                  saveAddressInformation={ saveAddressInformation }
                />
                { this.renderTotals() }
            </>
        );
    }

    orderTotalIncludeTax() {
        const {
            totals: { subtotal_with_discount, quote_currency_code }
        } = this.props;

        return (
            <div block="CheckoutOrderSummary" elem="OrderTotalincludeTax">
                <span block="label">Order Total Incl. Tax</span>
                <span block="price">
                    { formatPrice(subtotal_with_discount, quote_currency_code) }
                </span>
            </div>
        );
    }

    orderTotalExclusiveTax() {
        const {
            totals: { grand_total, quote_currency_code }
        } = this.props;

        return (
            <div block="CheckoutOrderSummary" elem="OrderTotalExclusiveTax">
                <span block="label">Order Total</span>
                <span block="price">
                    { formatPrice(grand_total, quote_currency_code) }
                </span>
            </div>
        );
    }

    renderSecureMsg() {
        return (
            <CmsBlock identifier="payment_methods" />
        );
    }

    renderExpandableContent() {
        const { checkoutStep } = this.props;

        return (
            <>
                <ExpandableContent
                  isContentExpanded
                  mix={ { block: 'CheckoutOrderSummary', elem: 'ItemList' } }
                >
                    { this.renderItems() }
                </ExpandableContent>
                { this.renderDiscountCode() }
                <ApplyRewards
                  checkoutStep={ checkoutStep }
                />
                { this.renderTotals() }
                { this.renderCmsBlock() }
            </>
        );
    }

    renderOrderTotal() {
        const {
            totals: {
                grand_total,
                quote_currency_code,
                applied_store_credit
            } = {},
            checkoutStep,
            cartTotalSubPrice
        } = this.props;
        const title = 'Order total';

        if (checkoutStep === DETAILS_STEP) {
            const { totals: { grand_total: { value, currency } = {} } } = this.props;

            return (
                <li
                  block="CheckoutOrderSummary"
                  elem="SummaryItem"
                  mods={ { isTotal: true } }
                >
                    <p block="CheckoutOrderSummary" elem="Text">
                        { title }
                    </p>
                    <div block="CheckoutOrderSummary" elem="Price">
                        { formatPrice(value, currency) }
                    </div>
                </li>
            );
        }

        if (isSignedIn() && applied_store_credit) {
            const {
                applied_balance: { value }
            } = applied_store_credit;

            if (value) {
                return (
                    <li
                      block="CheckoutOrderSummary"
                      elem="SummaryItem"
                      mods={ { isTotal: true } }
                    >
                        <p block="CheckoutOrderSummary" elem="Text">
                            { title }
                        </p>
                        <div block="CheckoutOrderSummary" elem="Price">
                            { formatPrice(grand_total, quote_currency_code) }
                        </div>
                    </li>
                );
            }
        }

        return (
            <CheckoutOrderSummaryPriceLine
              price={ grand_total }
              currency={ quote_currency_code }
              title={ title }
              subPrice={ cartTotalSubPrice }
              mods={ { isTotal: true } }
            />
        );
    }

    renderShipping() {
        const {
            cartDisplayConfig: {
                display_tax_in_subtotal
            } = {},
            totals: {
                quote_currency_code
            } = {},
            checkoutStep,
            cartShippingPrice,
            cartShippingSubPrice
        } = this.props;

        const title = this.getShippingLabel();
        const mods = { divider: true };

        if (!display_tax_in_subtotal) {
            BrowserDatabase.getItem('display_tax_in_subtotal');
            return display_tax_in_subtotal;
        }

        if (checkoutStep === DETAILS_STEP) {
            const {
                totals: {
                    shipping_handling: { amount_including_tax: { value: shippingPriceInc, currency } = {}, amount_excluding_tax: { value: shippingPrice } } = {}
                } = {}
            } = this.props;

            return (
                <CheckoutOrderSummaryPriceLine
                  price={ display_tax_in_subtotal === DISPLAY_CART_TAX_IN_SUBTOTAL.EXCL_TAX ? shippingPrice : shippingPriceInc }
                  currency={ currency }
                  title={ title }
                  mods={ mods }
                />
            );
        }

        return (
            <CheckoutOrderSummaryPriceLine
              price={ cartShippingPrice }
              currency={ quote_currency_code }
              title={ title }
              mods={ mods }
              subPrice={ cartShippingSubPrice }
            />
        );
    }

    renderSubTotal() {
        const {
            totals: { quote_currency_code } = {},
            cartSubtotal,
            cartSubtotalSubPrice,
            checkoutStep
        } = this.props;

        const title = 'Subtotal';

        if (checkoutStep === DETAILS_STEP) {
            const {
                cartDisplayConfig: {
                    display_tax_in_subtotal
                } = {},
                totals: {
                    subtotal: {
                        value, currency
                    } = {},
                    subtotal_incl_tax: {
                        value: SubIncValue
                    } = {}
                }
            } = this.props;

            return (
                <CheckoutOrderSummaryPriceLine
                  price={ display_tax_in_subtotal === DISPLAY_CART_TAX_IN_SUBTOTAL.EXCL_TAX ? value : SubIncValue }
                  currency={ currency }
                  title={ title }
                  subPrice={ cartSubtotalSubPrice }
                />
            );
        }

        if (cartSubtotal) {
            return (
                <CheckoutOrderSummaryPriceLine
                  price={ cartSubtotal }
                  currency={ quote_currency_code }
                  title={ title }
                  subPrice={ cartSubtotalSubPrice }
                />
            );
        }

        return this.renderPriceLine(cartSubtotal, title);
    }

    renderFoomanCharge({ label, amount: { value, currency } }) {
        return (
            <CheckoutOrderSummaryPriceLine
              price={ value }
              currency={ currency }
              title={ label }
            />
        );
    }

    renderStoreCredit() {
        if (!isSignedIn()) {
            return null;
        }
        const { useStoreCredit, totals: { applied_store_credit } = {}, checkoutStep } = this.props;

        if (checkoutStep === DETAILS_STEP) {
            const { store_credit, totals: { subtotal: { currency } } } = this.props;

            if (!store_credit || store_credit <= 0) {
                return null;
            }

            const storeCreditValue = -Math.abs(store_credit);

            return (
                <CheckoutOrderSummaryPriceLine
                  price={ storeCreditValue }
                  currency={ currency }
                  title="Store Credit Applied"
                />
            );
        }

        if (!applied_store_credit) {
            return null;
        }

        const {
            applied_balance: { value, currency }
        } = applied_store_credit;

        if (!value || value <= 0) {
            return null;
        }

        const storeCreditValue = -Math.abs(value);

        return (
            <CheckoutOrderSummaryPriceLine
              price={ storeCreditValue }
              currency={ currency }
              title="Store Credit Applied"
              mods={ { isStoreCredit: !useStoreCredit } }
            />
        );
    }

    renderFoomanCharges() {
        const { cartFoomanCharge } = this.props;

        if (!cartFoomanCharge || !cartFoomanCharge.length) {
            return null;
        }

        return cartFoomanCharge.map(this.renderFoomanCharge.bind(this));
    }

    renderTaxFullSummary() {
        const {
            totals: {
                applied_taxes = [],
                taxes = []
            },
            checkoutStep,
            cartDisplayConfig: {
                display_full_tax_summary
            } = {}
        } = this.props;

        if (checkoutStep === DETAILS_STEP) {
            if (!display_full_tax_summary || !taxes.length) {
                return null;
            }

            return taxes
                .map((rates) => `${rates.title}`);
        }

        if (!display_full_tax_summary || !applied_taxes.length) {
            return null;
        }

        return applied_taxes
            .map(({ rates }) => rates)
            .reduce((rates, rate) => rates.concat(rate), [])
            .map(({ title }) => `${title}`);
    }

    renderTax() {
        const {
            totals: {
                applied_taxes = [], taxes = [], quote_currency_code, items_qty
            },
            checkoutStep,
            cartDisplayConfig: {
                display_full_tax_summary
            } = {},
            storeConfig: display_tax_field
        } = this.props;

        if (!display_tax_field) {
            return null;
        }

        if (checkoutStep === DETAILS_STEP) {
            if (!taxes?.length) {
                return null;
            }

            const [{ amount }] = taxes;

            return (
                <CheckoutOrderSummaryPriceLine
                  price={ amount.value.toFixed(2) } // since we display tax even if value is 0
                  currency={ amount.currency }
                  itemsQty={ items_qty }
                  title="Tax"
                  mods={ { withAppendedContent: display_full_tax_summary } }
                >
                    { this.renderTaxFullSummary() }
                </CheckoutOrderSummaryPriceLine>
            );
        }

        if (!applied_taxes?.length) {
            return null;
        }

        const [{ amount }] = applied_taxes;

        return (
            <CheckoutOrderSummaryPriceLine
              price={ amount.toFixed(2) } // since we display tax even if value is 0
              currency={ quote_currency_code }
              itemsQty={ items_qty }
              title="Tax"
              mods={ { withAppendedContent: display_full_tax_summary } }
            >
                 { this.renderTaxFullSummary() }
            </CheckoutOrderSummaryPriceLine>
        );
    }

    getShippingLabel() {
        const { checkoutStep } = this.props;

        if (checkoutStep === BILLING_STEP || checkoutStep === DETAILS_STEP) {
            return 'Shipping';
        }

        return 'Estimated Shipping';
    }

    renderExtraFee() {
        const { totals: { extra_fee: { amount, label } = {}, subtotal: { currency } = {} } = {}, checkoutStep } = this.props;

        if (checkoutStep !== DETAILS_STEP) {
            return null;
        }

        return (
            <CheckoutOrderSummaryPriceLine
              price={ amount }
              currency={ currency }
              title={ label }
            />
        );
    }

    renderTotals() {
        const {
            children,
            totals: { items = [], amastyPromoItems = [] },
            isFreebieRequired
        } = this.props;

        const cartHasPromoItem = items.some((item) => item.is_promo_item);
        const isAmastyPromoItemsPresent = amastyPromoItems.length > 0;

        return (
            <div block="CheckoutOrderSummary" elem="OrderTotals">
                <ul>
                    { this.deliveryInsurance() }
                    { this.renderCount() }
                    { this.renderSubTotal() }
                    { this.renderShipping() }
                    { this.renderExtraFee() }
                    { this.renderTax() }
                    { this.renderFoomanCharges() }
                    { this.orderTotalExclusiveTax() }
                    { this.renderStoreCredit() }
                    { this.renderDiscount() }
                </ul>
                <div
                  block="CheckoutOrderSummary"
                  elem={ (isAmastyPromoItemsPresent && isFreebieRequired && !cartHasPromoItem)
                      ? 'ButtonWrapper' : 'ButtonWrapper Sticky' }
                  mods={ { isEmpty: items.length < 1 } }
                >
                    { this.renderOrderTotal() }
                    { children }
                </div>
                { this.renderSecureMsg() }
            </div>
        );
    }
}

export default CheckoutOrderSummaryComponent;
