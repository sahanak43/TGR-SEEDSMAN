/**
 * Amasty Extra Fee compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import { Field } from 'Util/Query';

/** @namespace Seedsman/@Scandiweb/AmastyExtraFee/Query/ExtraFeeMutation/Query */
export class ExtraFeeMutationQuery {
    applyExtraFees(cartId, feeId, optionsIds) {
        return new Field('applyExtraFees')
            .addArgument('cart_id', 'String!', cartId)
            .addArgument('fee_id', 'Int!', +feeId)
            .addArgument('options_ids', 'String!', optionsIds);
    }
}

export default new ExtraFeeMutationQuery();
