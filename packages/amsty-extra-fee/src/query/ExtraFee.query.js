/**
 * Amasty Extra Fee compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import { Field } from 'Util/Query';

/** @namespace Scandiweb/AmastyExtraFee/Query/ExtraFee/Query */
export class ExtraFeeQuery {
    getFeeItemsForQuote({ cartId }) {
        return new Field('getFeeItemsForQuote')
            .addArgument('cart_id', 'String!', cartId)
            .addFieldList(this._getFeeItemsForQuote());
    }

    s_getFeeOptions({ feeId }) {
        return new Field('s_getFeeOptions')
            .addArgument('fee_id', 'Int!', feeId)
            .addFieldList(this._getFeeOptions());
    }

    getAppliedFeeOptions({ cartId }) {
        return new Field('getAppliedFeeOptions')
            .addArgument('cart_id', 'String!', cartId)
            .addFieldList(this._getAppliedFeeOptionsFields());
    }

    _getAppliedFeeOptionsFields() {
        return [
            this._getAppliedItemsField()
        ];
    }

    _getAppliedItemsField() {
        return new Field('items')
            .addFieldList(this._getAppliedItemsFields());
    }

    _getAppliedItemsFields() {
        return [
            'fee_id',
            'option_id'
        ];
    }

    _getFeeItemsForQuote() {
        return [
            'entity_id',
            'name',
            'frontend_type',
            'description',
            'is_required'
        ];
    }

    _getFeeOptions() {
        return [
            'total_records',
            'store_id',
            'items{label,entity_id,price,price_type,converted_fee_amount}'

        ];
    }
}

export default new ExtraFeeQuery();
