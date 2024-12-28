import { Field } from 'SourceUtil/Query';

/** @namespace Seedsman/Query/PaymentMethod/Query */
export class PaymentMethodQuery {
    getPaymentMethodQuery() {
        return new Field('customerPaymentTokens')
            .addFieldList([this.getPaymentItems()]);
    }

    getPaymentItems() {
        return new Field('items')
            .addFieldList([
                'details',
                'public_hash',
                'payment_method_code',
                'type'
            ]);
    }

    deletePaymentMethod(options) {
        return new Field('deletePaymentToken')
            .addArgument('public_hash', 'String!', options)
            .addFieldList('result');
    }
}

export default new PaymentMethodQuery();
