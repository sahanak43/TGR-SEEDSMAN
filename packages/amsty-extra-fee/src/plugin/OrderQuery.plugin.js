/**
 * Amasty Extra Fee compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import OrderExtraFeeQuery from '../query/OrderExtraFee.query';

const addOrderInfoDetails = (args, callback) => {
    const [isList] = args;

    return [
        ...callback(...args),
        ...(isList ? [] : [OrderExtraFeeQuery.getOrderExtraFeeField()])
    ];
};

export default {
    'Query/Order/Query': {
        'member-function': {
            _getBaseOrderInfoFields: addOrderInfoDetails
        }
    }
};
