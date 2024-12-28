import { CheckoutQuery as SourceCheckoutQuery } from 'SourceQuery/Checkout.query';
import { isSignedIn } from 'Util/Auth';
import { Field } from 'Util/Query';

/** @namespace Seedsman/Query/Checkout/Query */
export class CheckoutQuery extends SourceCheckoutQuery {
    _getOrderField() {
        return new Field('order')
            .addFieldList(['order_id', 'order_int']);
    }

    getSaveShippingMethodsOnCart(input) {
        return new Field('setShippingMethodsOnCart')
            .addArgument('input', 'SetShippingMethodsOnCartInput', input)
            .addFieldList([this._getCartField(), this._getTotalsField()]);
    }

    getSaveShippingAddressesOnCart(input) {
        return new Field('setShippingAddressesOnCart')
            .addArgument('input', 'SetShippingAddressesOnCartInput', input)
            .addFieldList([this._getCartField(), this._getTotalsField(), this._getShippingMethods()]);
    }

    getSetPaymentMethodOnCartMutation(input) {
        return new Field('s_setPaymentMethodOnCart')
            .addArgument('input', 'S_SetPaymentMethodOnCartInput!', input)
            .addFieldList([this._getCartField(), this._getTotalsField(), this._getOrderPaymentFoomanField()])
            .setAlias('paymentMethod');
    }

    _getTotalsFields() {
        const fields = super._getTotalsFields();
        fields.push(this.getAppliedTaxes());

        return fields;
    }

    getAppliedTaxes() {
        return new Field('applied_taxes')
            .addFieldList([
                'amount',
                'percent',
                this.getRates()
            ]);
    }

    getRates() {
        return new Field('rates')
            .addFieldList([
                'percent',
                'title'
            ]);
    }

    _getShippingMethods() {
        return new Field('shipping_method')
            .addFieldList([
                'amount',
                'available',
                'base_amount',
                'carrier_code',
                'carrier_title',
                'error_message',
                'method_code',
                'method_title',
                'price_excl_tax',
                'price_incl_tax'
            ]);
    }

    _getCartFieldList() {
        const fields = super._getCartFieldList();
        fields.push(
            this.getAppliedPaymentMethods(),
            this._getOrderFoomanPrices()
        );

        return fields;
    }

    _getOrderFoomanPrices() {
        return new Field('prices')
            .addFieldList([this._getOrderFoomanField()]);
    }

    _getOrderFoomanField() {
        return new Field('fooman_applied_surcharges')
            .addFieldList(this._getOrderFoomanChargeFields());
    }

    _getOrderPaymentFoomanField() {
        return new Field('fooman_applied_surge_charges')
            .addFieldList(this._getOrderFoomanChargeFields());
    }

    _getOrderFoomanChargeFields() {
        return [
            'label',
            this._getOrderAmountField()
        ];
    }

    _getOrderAmountField() {
        return new Field('amount')
            .addFieldList(this._getOrderPriceFields());
    }

    _getOrderPriceFields() {
        return [
            'value',
            'currency'
        ];
    }

    getAppliedPaymentMethods() {
        return new Field('available_payment_methods')
            .addFieldList(this._getPaymentMethodFields());
    }

    _getPaymentMethodFields() {
        return ['code', 'title', 'payment_instructions'];
    }

    getPlaceOrderMutation(guestCartId, recaptcha_key) {
        const mutation = new Field('s_placeOrder')
            .setAlias('placeOrder')
            .addField(this._getOrderField())
            .addArgument('recaptcha_key', 'String', recaptcha_key);

        if (!isSignedIn()) {
            mutation.addArgument('guestCartId', 'String', guestCartId);
        }

        return mutation;
    }
}

export default new CheckoutQuery();
