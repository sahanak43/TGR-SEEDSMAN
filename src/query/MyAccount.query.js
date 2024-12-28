/* eslint-disable max-len */
/* eslint-disable spaced-comment */
import { MyAccountQuery as SourceMyAccountQuery } from 'SourceQuery/MyAccount.query';
import { Field } from 'Util/Query';

/** @namespace Seedsman/Query/MyAccount/Query */
export class MyAccountQuery extends SourceMyAccountQuery {
    /**
     * Get SignIn mutation
     * @param {{email: String, password: String, recaptcha_key: String}} options A object containing different aspects of query, each item can be omitted
     * @return {Field}
     * @memberof MyAccount
     */
    getSignInMutation(options) {
        const { email, password, recaptcha_key } = options;

        return new Field('generateCustomerToken')
            .addArgument('email', 'String!', email)
            .addArgument('password', 'String!', password)
            .addArgument('recaptcha_key', 'String', recaptcha_key)
            .addField('token');
    }

    /**
     * Get ForgotPassword mutation
     * @param {{email: String, recaptcha_key: String}} options
     * @returns {Field}
     * @memberof MyAccount
     */
    getForgotPasswordMutation(options) {
        const { email, recaptcha_key } = options;

        return new Field('forgotPassword')
            .addArgument('email', 'String!', email)
            .addArgument('recaptcha_key', 'String', recaptcha_key)
            .addField('status');
    }

    getCreateAccountMutation(options) {
        const { customer, recaptcha_key, password } = options;

        return new Field('createCustomerV2')
            .addArgument('input', 'CustomerCreateInput!', {
                ...customer,
                password
            })
            .addArgument('recaptcha_key', 'String', recaptcha_key)
            .addField(this._getCustomerField());
    }

    _getCustomerFields() {
        const fields = super._getCustomerFields();
        fields.push(
            'allow_remote_shopping_assistance',
            'date_of_birth',
            'telephone',
            this._getStoreCreditField(),
            this._getExtraAttributes()
        );

        return fields;
    }

    _getExtraAttributes() {
        return new Field('extra_attributes')
            .addFieldList([
                'mobile_phone_number',
                'sms_notify',
                'receive_marketing_sms',
                'receive_tracking_sms'
            ]);
    }

    _getOrdersField() {
        return new Field('orders').addField(this._getOrdersFields());
    }

    _getOrdersFields() {
        return new Field('items').addFieldList(this._getItemsFields());
    }

    _getItemsFields() {
        return [
            'id',
            'increment_id',
            'can_reorder',
            'status',
            'grand_total',
            'created_at',
            this._getShippingAddressField(),
            this._getOrderItemTotalField()
        ];
    }

    _getOrderItemTotalField() {
        return new Field('total').addFieldList([this._getOrderGrandTotalField()]);
    }

    _getOrderGrandTotalField() {
        return new Field('grand_total')
            .addFieldList(
                ['value', 'currency']
            );
    }

    _getShippingAddressField() {
        return new Field('shipping_address').addFieldList(
            this._getShippingAddressFields()
        );
    }

    _getShippingAddressFields() {
        return ['firstname', 'lastname'];
    }

    _getStoreCreditField() {
        return new Field('store_credit')
            .addField(this._getStoreCreditFields())
            .addField(this._getStoreCreditItemFields());
    }

    _getStoreCreditFields() {
        return new Field('current_balance')
            .addFieldList(this._getBalanceFields());
    }

    _getStoreCreditItemFields() {
        return new Field('balance_history')
            .addField(this._getCurrentBalanceHistoryFields());
    }

    _getCurrentBalanceHistoryFields() {
        return new Field('items')
            .addFieldList(this._getItemsHistoryFields());
    }

    _getItemsHistoryFields() {
        return ['action', 'date_time_changed', 'information', this._getActualBalanceField(), this._getBalanceChangeField()];
    }

    _getActualBalanceField() {
        return new Field('actual_balance')
            .addFieldList(this._getBalanceFields());
    }

    _getBalanceChangeField() {
        return new Field(' balance_change')
            .addFieldList(this._getBalanceFields());
    }

    _getBalanceFields() {
        return [
            'currency',
            'value'
        ];
    }

    _getAddressFields() {
        const fields = super._getAddressFields();
        fields.push(
            'is_billing_address',
            'is_shipping_address',
            this._getCustomAttributes()
        );

        return fields;
    }

    _getCustomAttributes() {
        return new Field('custom_attributes')
            .addFieldList([
                'attribute_code',
                'value'
            ]);
    }
}

export default new MyAccountQuery();
