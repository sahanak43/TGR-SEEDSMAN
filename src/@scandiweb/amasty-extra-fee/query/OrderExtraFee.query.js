/**
 * Amasty Extra Fee compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import { Field } from 'Util/Query';

/** @namespace Seedsman/@Scandiweb/AmastyExtraFee/Query/OrderExtraFee/Query */
export class OrderExtraFeeQuery {
    getOrderExtraFeeField() {
        return new Field('extraFees')
            .addFieldList(this.getOrderExtraFeeFields());
    }

    getOrderExtraFeeFields() {
        return [
            'fee_label',
            'fee_option_label',
            'fee_amount'
        ];
    }
}

export default new OrderExtraFeeQuery();
