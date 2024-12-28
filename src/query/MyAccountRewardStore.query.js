/* eslint-disable no-magic-numbers */
// import CartQuery from 'Query/Cart.query';
import {
    MyAccountQuery as SourceMyAccountQuery
} from 'SourceQuery/MyAccount.query';
import { Field } from 'Util/Query';

/** @namespace Seedsman/Query/MyAccountRewardStore/Query */
export class MyAccountRewardStoreQuery extends SourceMyAccountQuery {
    getRewardSubscribeMutation(Options) {
        return new Field('saveNotificationOptions')
            .addArgument('input', 'SaveNotificationOptionsInput', Options)
            .addField('response');
    }

    _getCustomerFields() {
        return [
            this._getStoreCreditsField()
        ];
    }

    _getRewardMoneyField() {
        return new Field('money')
            .addFieldList(this._getRewardsMoneyFields());
    }

    _getRewardsMoneyFields() {
        return [
            'value',
            'currency'
        ];
    }

    _getStoreCreditsField() {
        return new Field('store_credit')
            .addFieldList(this._getStoreCreditsBalance());
    }

    _getStoreCreditsBalance() {
        return [
            new Field('current_balance').addFieldList([
                'value',
                'currency'

            ]),
            new Field('balance_history')
                .addArgument('pageSize', 'Int!', '20')
                .addArgument('currentPage', 'Int!', '1')
                .addFieldList([
                    new Field('items').addFieldList([
                        'action',
                        'date_time_changed',
                        this._getActualBalanceField(),
                        this._getCurrentBalanceField()

                    ])
                ])
        ];
    }

    _getActualBalanceField() {
        return new Field('actual_balance')
            .addFieldList(this._getRewardsMoneyFields());
    }

    _getCurrentBalanceField() {
        return new Field('balance_change')
            .addFieldList(this._getRewardsMoneyFields());
    }

    _getRewardPointsHistoryDetails(currentPage) {
        return new Field('rewards')
            .addFieldList([
                'balance',
                this._getRewardPointsHistory(currentPage)
            ]);
    }

    _getRewardPointsHistory(currentPage) {
        return new Field('history')
            .addFieldList([
                this._getRewardPointsHistoryItems(currentPage),
                'total_count'
            ]);
    }

    _getRewardPointsHistoryItems(currentPage, pageSize = 10) {
        return new Field('items')
            .addArgument('pageSize', 'Int', pageSize)
            .addArgument('currentPage', 'Int', currentPage)
            .addFieldList([
                'action',
                'comment',
                'action_date',
                'points_left',
                'amount'
            ]);
    }

    getCustomerNotificationOptions() {
        return new Field('getCustomerNotificationOptions')
            .addFieldList([
                'amrewards_earning_notification',
                'amrewards_expire_notification'
            ]);
    }

    applyRewardPoints(input) {
        return new Field('useRewardPoints')
            .addArgument('input', 'UseRewardPointsInput', input)
            .addFieldList([
                'response',
                this._getCartField()
            ]);
    }

    getAmountField() {
        return new Field('amount')
            .addFieldList([
                'value',
                'currency'
            ]);
    }

    _getAppliedTaxesField() {
        return new Field('applied_taxes')
            .addFieldList([
                this.getAmountField(),
                'label'
            ]);
    }

    _getDiscountsField() {
        return new Field('discounts')
            .addFieldList([
                this.getAmountField(),
                'label'
            ]);
    }

    _getOrderGrandTotalField() {
        return new Field('grand_total')
            .addFieldList(
                ['value', 'currency']
            );
    }

    getPriceFields() {
        return new Field('prices')
            .addFieldList([
                this._getOrderGrandTotalField(),
                this._getSubtotalExcludingTaxPrice(),
                this._getSubtotalIncludingTaxPrice(),
                this._getSubtotalWithDiscount(),
                this._getAppliedTaxesField(),
                this._getDiscountsField()
            ]);
    }

    _getSubtotalExcludingTaxPrice() {
        return new Field('subtotal_excluding_tax').addFieldList([
            'value',
            'currency'
        ]);
    }

    _getSubtotalIncludingTaxPrice() {
        return new Field('subtotal_including_tax').addFieldList([
            'value',
            'currency'
        ]);
    }

    _getSubtotalWithDiscount() {
        return new Field('subtotal_with_discount_excluding_tax').addFieldList([
            'value',
            'currency'
        ]);
    }

    getUsedPoints() {
        return new Field('amasty_rewards_used_points')
            .addField('used_points');
    }

    _getCartField() {
        return new Field('cart')
            .addFieldList([
                this.getPriceFields(),
                this.getUsedPoints()
            ]);
    }

    getSMSCommunicationsMutation(options) {
        const { sms_notify, receive_marketing_sms, receive_tracking_sms } = options;
        return new Field('receiveSmsNotifcation')
            .addArgument('sms_notify', 'Boolean', sms_notify)
            .addArgument('receive_marketing_sms', 'Boolean', receive_marketing_sms)
            .addArgument('receive_tracking_sms', 'Boolean', receive_tracking_sms);
    }
}

export default new MyAccountRewardStoreQuery();
