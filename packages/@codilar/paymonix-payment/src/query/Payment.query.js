import { isSignedIn } from 'Util/Auth';
import { Field } from 'Util/Query';

/** @namespace Codilar/PaymonixPayment/Query/Payment/Query */
export class PaymentQuery {
    _getOrderField() {
        return new Field('order')
            .addFieldList(['order_id']);
    }

    getPaymonixPlaceOrderMutation(guestCartId) {
        const mutation = new Field('getPaymonixPaymentGatewayUrl')
            .addFieldList(this.getResponseFields());

        if (!isSignedIn()) {
            mutation.addArgument('input', 'PlaceOrderInput ', {
                card_id: guestCartId
            });
        }

        return mutation;
    }

    getSnapScanPlaceOrderMutation(guestCartId) {
        const mutation = new Field('getSnapScanPaymentGatewayUrl')
            .addFieldList(this.getResponseFields());

        if (!isSignedIn()) {
            mutation.addArgument('input', 'PlaceOrderInput ', {
                card_id: guestCartId
            });
        }

        return mutation;
    }

    getZionPlaceOrderMutation(guestCartId) {
        const mutation = new Field('getZionPaymentRedirectUrl')
            .addFieldList(this.getResponseFields());

        if (!isSignedIn()) {
            mutation.addArgument('input', 'PlaceOrderInput ', {
                card_id: guestCartId
            });
        }

        return mutation;
    }

    getBtcPlaceOrderMutation(guestCartId) {
        const mutation = new Field('getBTCPaymentRedirectUrl')
            .addFieldList(this.getResponseFields());

        if (!isSignedIn()) {
            mutation.addArgument('input', 'PlaceOrderInput ', {
                card_id: guestCartId
            });
        }

        return mutation;
    }

    getFibnotrixPlaceOrderMutation(guestCartId) {
        const mutation = new Field('getFibonatixPaymentRedirectUrl')
            .addFieldList(this.getResponseFields());

        if (!isSignedIn()) {
            mutation.addArgument('input', 'PlaceOrderInput ', {
                card_id: guestCartId
            });
        }

        return mutation;
    }

    getResponseFields() {
        return [
            'error',
            'message',
            'order_id',
            'order_int',
            'redirect_url'
        ];
    }
}
export default new PaymentQuery();
