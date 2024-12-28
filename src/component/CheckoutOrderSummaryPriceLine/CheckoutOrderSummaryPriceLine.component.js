/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
import {
    CheckoutOrderSummaryPriceLine as SourceCheckoutOrderSummaryPriceLine
} from 'SourceComponent/CheckoutOrderSummaryPriceLine/CheckoutOrderSummaryPriceLine.component';
import { formatPrice } from 'Util/Price';

/** @namespace Seedsman/Component/CheckoutOrderSummaryPriceLine/Component */
export class CheckoutOrderSummaryPriceLineComponent extends SourceCheckoutOrderSummaryPriceLine {
    renderPrice() {
        const { price, currency } = this.props;

        return (
            <>
            { formatPrice(price, currency) }
            </>
        );
    }

    renderTitle() {
        const { title, mods: { withAppendedContent } = {}, children } = this.props;

        return (
        <p block="CheckoutOrderSummary" elem="Text">
            { title }
            <span>{ withAppendedContent ? children : null }</span>
        </p>
        );
    }

    render() {
        const {
            price,
            mods,
            mods: {
                withAppendedContent
            } = {},
            children,
            itemsQty
        } = this.props;

        if (!itemsQty && !price) {
            return null;
        }

        if (+price === 0 && !itemsQty) {
            return null;
        }

        return (
            <li block="CheckoutOrderSummary" elem="SummaryItem" mods={ mods }>
                { this.renderTitle() }
                <div block="CheckoutOrderSummary" elem="Price">
                    { this.renderPrice() }
                </div>
                { !withAppendedContent ? children : null }
            </li>
        );
    }
}

export default CheckoutOrderSummaryPriceLineComponent;
