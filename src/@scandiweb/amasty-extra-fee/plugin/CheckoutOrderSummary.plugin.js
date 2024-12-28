/**
 * Amasty Extra Fee compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import CartAdditionalFees from '../component/CartAdditionalFees';
import Fees from '../component/Fees';

const renderSubTotalWithAppliedFees = (args, callback) => (
    <>
        { callback(...args) }
        <CartAdditionalFees />
    </>
);

const renderItemsWithExtraFeesOptions = (args, callback) => (
    <>
        { callback(...args) }
        <Fees />
    </>
);

export default {
    'Component/CheckoutOrderSummary/Component': {
        'member-function': {
            renderSubTotal: renderSubTotalWithAppliedFees,
            deliveryInsurancePrice: renderItemsWithExtraFeesOptions
        }
    },
    'Component/CartOverlay/Component': {
        'member-function': {
            renderSubTotal: renderSubTotalWithAppliedFees
        }
    }
};
