/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable max-lines */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import Coupon from 'src/util/images/coupon.png';

import Field from 'Component/Field';
import FIELD_TYPE from 'Component/Field/Field.config';
import Form from 'Component/Form';
import Loader from 'Component/Loader';
import { DeviceType } from 'Type/Device.type';
import { formatDate } from 'Util/DateTime';
import { formatPrice } from 'Util/Price';

import './StoreCreditAndRefunds.style';

/** @namespace Seedsman/Component/StoreCreditAndRefunds/Component */
export class StoreCreditAndRefundsComponent extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        store_credit: PropTypes.string.isRequired,
        device: DeviceType.isRequired
    };

    renderProgram() {
        const {
            isLoading,
            store_credit: { current_balance }
        } = this.props;

        if (isLoading) {
            return null;
        }

        return (
            <div block="StoreCreditAndRefunds">
                <div
                  block="StoreCreditAndRefunds"
                  elem="pointBalanceInformation"
                >
                    Balance
                </div>
                <div block="StoreCreditAndRefunds" elem="rewardPoint">
                    <div
                      block="StoreCreditAndRefunds"
                      elem="rewardPointContent"
                    >
                        { /* { current_balance?.points } */ }

                        { formatPrice(
                            current_balance?.value,
                            current_balance?.currency
                        ) }
                    </div>
                </div>
            </div>
        );
    }

    getItemsSortedByPosition = (items) => items?.sort((a, b) => a.position - b.position);

    renderMobileBalanceHistory() {
        const {
            isLoading,
            store_credit: { balance_history }
        } = this.props;

        if (isLoading) {
            return null;
        }

        if (!balance_history?.items.length) {
            return this.renderNoHistory();
        }

        return (
            <div block="StoreCreditAndRefunds" elem="balanceHistoryDetails">
                <table block="StoreCreditAndRefunds" elem="balanceHistoryTable">
                    <thead>
                    { this.getItemsSortedByPosition(
                        balance_history?.items
                    )?.map((value) => {
                        const Date = formatDate(value.date_time_changed);
                        const dateFormat = Date.replace(/\//g, '-');
                        return (
                            <>
                    <div
                      block="StoreCreditAndRefunds"
                      elem="HeadingDate"
                    >
                           <div
                             block="StoreCreditAndRefunds"
                             elem="DateTitle"
                           >
                            Date
                           </div>
                            <div className="RewardBorder" />

                        <div
                          block="StoreCreditAndRefunds"
                          elem="Date"
                        >

                           { dateFormat }

                        </div>

                    </div>
                        <tr>
                            <th
                              block="StoreCreditAndRefunds"
                              elem="HeadingBalance"
                            >
                                Action
                            </th>
                                <td>{ value.action }</td>
                        </tr>
                        <tr>
                            <th
                              block="StoreCreditAndRefunds"
                              elem="HeadingAmount"
                            >
                                Balance Change
                            </th>

                                <td>{ value?.actual_balance?.value }</td>

                        </tr>
                        <tr>
                            <th
                              block="StoreCreditAndRefunds"
                              elem="HeadingPoints"
                            >
                                Balance
                            </th>

                                <td>{ value?.balance_change?.value }</td>

                        </tr>
                        <div className="StoreCreditAndRefunds-Border" />
                            </>
                        );
                    }) }

                    </thead>
                </table>
            </div>
        );
    }

    renderNoHistory() {
        return (
            <div block="StoreCreditAndRefunds" elem="noHistoryFound">
                <div block="StoreCreditAndRefunds" elem="noHistoryFoundTitle">
                    No History Found
                </div>
            </div>
        );
    }

    renderBalanceHistoryDetails() {
        const {
            isLoading,
            store_credit: { balance_history },
            device: { isMobile }
        } = this.props;

        if (isLoading) {
            return null;
        }
        if (isMobile) {
            return this.renderMobileBalanceHistory();
        }

        if (!balance_history?.items.length) {
            return this.renderNoHistory();
        }

        return (
            <div block="StoreCreditAndRefunds" elem="balanceHistoryDetails">
                <table block="StoreCreditAndRefunds" elem="balanceHistoryTable">
                    <thead>
                        <tr>
                            <th
                              block="StoreCreditAndRefunds"
                              elem="HeadingBalance"
                            >
                                Action
                            </th>
                            <th
                              block="StoreCreditAndRefunds"
                              elem="HeadingAmount"
                            >
                                Balance Change
                            </th>
                            <th
                              block="StoreCreditAndRefunds"
                              elem="HeadingPoints"
                            >
                                Balance
                            </th>
                            <th
                              block="StoreCreditAndRefunds"
                              elem="HeadingReason"
                            >
                                Date
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.getItemsSortedByPosition(
                            balance_history?.items
                        )?.map((value) => (
                            <tr
                              block="StoreCreditAndRefunds"
                              elem="EnteredLabel"
                            >
                                <td>{ value.action }</td>
                                <td>{ value?.actual_balance?.value }</td>
                                <td>{ value?.balance_change?.value }</td>

                                <td>{ value.date_time_changed }</td>
                            </tr>
                        )) }
                    </tbody>
                </table>
            </div>
        );
    }

    renderApplyDiscount() {
        const {
            isLoading
        } = this.props;
        const isFieldWithError = 'Wrong FIeld';
        return (
            <div block="StoreCoupon">
                <Form onSubmit={ this.handleFormSubmit } returnAsObject>
                    <Loader isLoading={ isLoading } />
                    <div block="StoreCoupon" elem="Input">
                        <span block="StoreCoupon" elem="CouponImg">
                            <img src={ Coupon } alt="" />
                        </span>
                        <Field
                          type={ FIELD_TYPE.text }
                          attr={ {
                              id: 'couponCode',
                              name: 'couponCode',
                              defaultValue: '',
                              placeholder: 'Have a Coupon Code?',
                              'aria-label': 'Your discount code'
                          } }
                          events={ {
                              onChange: this.handleCouponCodeChange
                          } }
                          validationRule={ {
                              isRequired: true
                          } }
                          validateOn={ ['onChange'] }
                          mix={ {
                              mods: { hasError: isFieldWithError },
                              block: 'Field'
                          } }
                        />
                    </div>
                    <button
                      block="StoreCoupon"
                      elem="Button"
                      type={ FIELD_TYPE.button }
                      mods={ { isHollow: true } }
                      onClick={ this.handleApplyCoupon }
                    >
                        Apply
                    </button>
                </Form>
            </div>
        );
    }

    renderBalanceHistory() {
        return (
            <div block="StoreCreditAndRefunds" elem="balanceHistory">
                Balance History

            </div>
        );
    }

    renderRedeemCoupon() {
        return (
            <div block="StoreCreditAndRefunds" elem="RedeemCoupon">
                <div
                  block="StoreCreditAndRefunds"
                  elem="pointBalanceInformation"
                >
                   Redeem Coupon
                </div>
            </div>
        );
    }

    render() {
        return (
            <>
                { this.renderProgram() }
                <div className="StoreCreditAndRefunds-Heading-Border" />
                { this.renderBalanceHistory() }
                <div className="StoreCreditAndRefunds-Heading-Border" />
                { this.renderBalanceHistoryDetails() }
            </>
        );
    }
}

export default StoreCreditAndRefundsComponent;
