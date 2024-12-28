import CheckoutQuery from 'Query/Checkout.query';
import {
    CartQuery as SourceCartQuery
} from 'SourceQuery/Cart.query';
import { Field } from 'Util/Query';

/** @namespace Seedsman/Query/Cart/Query */
export class CartQuery extends SourceCartQuery {
    _getCartTotalsFields() {
        const fields = super._getCartTotalsFields();
        fields.push(
            'base_grand_total',
            'base_subtotal',
            'base_subtotal_with_discount',
            this._getAmastyPromoItems(),
            this.getUsedRewardPoints()
        );
        fields.push(this.getStoreCredits());

        return fields;
    }

    getUsedRewardPoints() {
        return new Field('amasty_rewards_used_points')
            .addField('used_points');
    }

    _getAppliedTaxesField() {
        return new Field('applied_taxes')
            .addFieldList([
                'amount',
                'percent',
                this._getAppliedTaxesRatesField()
            ]);
    }

    getStoreCredits() {
        return new Field('applied_store_credit')
            .addField(this.getCurrentBalance())
            .addField(this.getAppliedBalance());
    }

    getCurrentBalance() {
        return new Field('current_balance')
            .addFieldList(['value', 'currency']);
    }

    getAppliedBalance() {
        return new Field('applied_balance')
            .addFieldList(['value', 'currency']);
    }

    _getCartItemFields() {
        const fields = super._getCartItemFields();
        fields.push('is_promo_item');

        return fields;
    }

    _getAmastyPromoItems() {
        return new Field('amastyPromoItems')
            .addFieldList(this._getAmastyPromoItem());
    }

    _getAmastyPromoItem() {
        return [
            'brand',
            'discountItem',
            'image',
            'name',
            'qty',
            'sku',
            'minimalPrice',
            'product_price',
            this.getFreebieSeedsNumber()
        ];
    }

    getFreebieSeedsNumber() {
        return new Field('seeds_number')
            .addFieldList(['value', 'label']);
    }

    getAddPromoProductsToCartMutation(cartId, cartItems) {
        return new Field('addPromoProductsToCart')
            .addArgument('cartId', 'String!', cartId)
            .addArgument('cartItems', '[CartItemInput!]!', cartItems)
            .addField(this._getUserErrorsField());
    }

    applyStoreCreditToCart(cart_id) {
        const input = {
            cart_id
        };

        const mutation = new Field('applyStoreCreditToCart')
            .addArgument('input', 'ApplyStoreCreditToCartInput!', input)
            .addFieldList(this.getStoreCreditOutput());

        return mutation;
    }

    removeStoreCreditFromCart(cart_id) {
        const input = {
            cart_id
        };

        const mutation = new Field('removeStoreCreditFromCart')
            .addArgument('input', 'RemoveStoreCreditFromCartInput!', input)
            .addFieldList(this.getStoreCreditOutput());

        return mutation;
    }

    getStoreCreditOutput() {
        return [
            this.getStoreCreditCartUpdateField(),
            CheckoutQuery._getTotalsField()
        ];
    }

    getStoreCreditCartUpdateField() {
        return new Field('cart')
            .addFieldList([
                'id',
                this.getAppliedCreditBalance(),
                this.getAppliedPaymentMethods()
            ]);
    }

    getAppliedCreditBalance() {
        return new Field('applied_store_credit')
            .addFieldList([
                this.getAppliedStoreCredit(),
                this.getCurrentStoreCredit()
            ]);
    }

    getAppliedStoreCredit() {
        return new Field('applied_balance')
            .addFieldList([
                'value',
                'currency'
            ]);
    }

    getCurrentStoreCredit() {
        return new Field('current_balance')
            .addFieldList([
                'value',
                'currency'
            ]);
    }

    getAppliedPaymentMethods() {
        return new Field('available_payment_methods')
            .addFieldList(this._getPaymentMethodFields());
    }

    _getPaymentMethodFields() {
        return ['code', 'title'];
    }
}

export default new CartQuery();
