/**
 * Amasty Extra Fee compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import CartAdditionalFees from '../component/CartAdditionalFees';
import Fees from '../component/Fees';

const renderItemsWithExtraFeesOptions = (args, callback) => (
    <>
        { callback(...args) }
        <Fees />
    </>
);

const renderSubTotalWithAppliedFees = (args, callback) => (
    <>
        { callback(...args) }
        <CartAdditionalFees />
    </>
);

export default {
    'Component/CheckoutOrderSummary/Component': {
        'member-function': {
            renderItems: renderItemsWithExtraFeesOptions,
            renderSubTotal: renderSubTotalWithAppliedFees
        }
    }
};
