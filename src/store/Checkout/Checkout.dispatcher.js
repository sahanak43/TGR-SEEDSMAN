import { CheckoutDispatcher as SourceCheckoutDispatcher } from 'SourceStore/Checkout/Checkout.dispatcher';

import { addLastAddressUpdated } from './Checkout.action';

/**
 * Checkout Dispatcher
 * @class CheckoutDispatcher
 * @extends QueryDispatcher
 * @namespace Seedsman/Store/Checkout/Dispatcher */
export class CheckoutDispatcher extends SourceCheckoutDispatcher {
    handleUpdateAddress(data, dispatch) {
        dispatch(addLastAddressUpdated({
            address_id: data.address_id,
            isLastUpdated: data.isLastUpdated
        }));
    }
}

export default new CheckoutDispatcher();
