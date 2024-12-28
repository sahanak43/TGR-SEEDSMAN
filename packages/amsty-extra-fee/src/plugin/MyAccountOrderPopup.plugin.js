/**
 * Amasty Extra Fee compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import { formatPrice } from 'Util/Price';

import AdditionalFeesPopup from '../component/AdditionalFeesPopup';

export const mapStateToProps = (state) => ({
    currencyCode: state.CartReducer?.cartTotals?.quote_currency_code,
    totals: state.CartReducer?.cartTotals,
    order: state.OrderReducer?.orderList
});

function overrideTotals(args, callback, instance) {
    const { order: { base_order_info } } = instance.props;
    const {
        grand_total,
        sub_total,
        extraFees,
        currency_code
    } = base_order_info || {};

    return (
            <div block="MyAccountOrderPopup" elem="OrderWrapper">
                <h4>Order Total</h4>
                <dl>
                    <dt>{ 'Subtotal: ' }</dt>
                    <dd>
                        { formatPrice(sub_total, currency_code) }
                    </dd>
                    <AdditionalFeesPopup extraFees={ extraFees } currencyCode={ currency_code } />
                    <dt>{ 'Grand total: ' }</dt>
                    <dd>
                        { formatPrice(grand_total, currency_code) }
                    </dd>
                </dl>
            </div>
    );
}

export default {
    'Component/MyAccountOrderPopup/Component': {
        'member-function': {
            renderTotals: overrideTotals
        }
    }
};
