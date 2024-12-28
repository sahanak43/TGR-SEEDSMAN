import PropTypes from 'prop-types';

import { ORDER_ITEMS } from 'Component/MyAccountOrder/MyAccountOrder.config';
import MyAccountOrderTotals from 'SourceComponent/MyAccountOrderTotals/MyAccountOrderTotals.component';
import { OrderTotalType } from 'Type/Order.type';
import { formatPrice } from 'Util/Price';

import './MyAccountOrderTotals.override.style';

/** @namespace Seedsman/Component/MyAccountOrderTotals/Component */
export class MyAccountOrderTotalsComponent extends MyAccountOrderTotals {
    static propTypes = {
        total: OrderTotalType.isRequired,
        activeTab: PropTypes.string.isRequired,
        colSpanPriceCount: PropTypes.string.isRequired,
        colSpanLabelCount: PropTypes.string.isRequired
    };

    renderDiscounts() {
        const { total: { discounts = [] } } = this.props;

        if (!discounts.length) {
            return null;
        }

        return discounts.map(this.renderDiscount.bind(this));
    }

    renderDiscount({ label, amount: { value } }, index) {
        const discountLabel = label ? __('Discount (%s)', label) : 'Discount';

        return this.renderPriceLine(discountLabel, -value, null, {}, `discount-${index}`);
    }

    renderFoomanCharge({ label, amount: { value, currency } }) {
        return this.renderPriceLine(label, value, currency);
    }

    renderFoomanCharges() {
        const { total: { fooman_applied_surcharges = [] } } = this.props;

        if (!fooman_applied_surcharges || !fooman_applied_surcharges?.length) {
            return null;
        }

        return fooman_applied_surcharges.map(this.renderFoomanCharge.bind(this));
    }

    renderExtraFee() {
        const { total: { extra_fee = {} } } = this.props;

        if (!Object.keys(extra_fee).length) {
            return null;
        }

        const { label, amount } = extra_fee;

        if (!label || !amount) {
            return null;
        }

        return this.renderPriceLine(label, amount);
    }

    renderContent() {
        const {
            total: {
                subtotal: {
                    value: subtotalPrice
                },
                shipping_handling: {
                    total_amount: {
                        value: shippingHandlingPrice
                    }
                },
                grand_total: {
                    value: grandTotalPrice
                },
                total_tax: {
                    value: totalTaxPrice
                }
            },
            storeCredit
        } = this.props;

        const grandTotalMix = { block: 'MyAccountOrderTotals', elem: 'GrandTotal' };

        return (
            <>
                { this.renderPriceLine('Subtotal', subtotalPrice) }
                { this.renderPriceLine('Store Credits', storeCredit) }
                { this.renderDiscounts() }
                { this.renderPriceLine('Shipping & Handling', shippingHandlingPrice) }
                { this.renderFoomanCharges() }
                { this.renderExtraFee() }
                { this.renderPriceLine(
                    'Grand Total (Excl.Tax)',
                    grandTotalPrice ? grandTotalPrice - totalTaxPrice : 0,
                    null,
                    grandTotalMix
                ) }
                { this.renderPriceLine('Tax', totalTaxPrice) }
                { this.renderPriceLine('Grand Total (Incl.Tax)', grandTotalPrice, null, grandTotalMix) }
                { this.renderBaseGrandTotal() }
            </>
        );
    }

    renderBaseGrandTotal() {
        const {
            activeTab,
            total: {
                base_grand_total: {
                    value: baseGrandTotalPrice,
                    currency: baseGrandTotalCurrency
                }
            }
        } = this.props;

        if (activeTab !== ORDER_ITEMS) {
            return null;
        }

        return this.renderPriceLine('Grand Total to be Charged', baseGrandTotalPrice, baseGrandTotalCurrency);
    }

    renderPriceLine(title, price, currency, mix = {}, key) {
        const {
            total: { grand_total: { currency: defaultCurrency } },
            colSpanLabelCount,
            colSpanPriceCount
        } = this.props;

        return (
            <tr mix={ mix } key={ key }>
                <th colSpan={ colSpanLabelCount }>{ title }</th>
                <td colSpan={ colSpanPriceCount }>{ formatPrice(price, currency || defaultCurrency) }</td>
            </tr>
        );
    }

    render() {
        const { total } = this.props;

        if (!total) {
            return null;
        }

        return (
            <table
              block="MyAccountOrderTotals"
              elem="Wrapper"
            >
                { this.renderContent() }
            </table>
        );
    }
}
export default MyAccountOrderTotalsComponent;
