/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Field from 'Component/Field';
import { FIELD_TYPE } from 'Component/Field/Field.config';
import Form from 'Component/Form';
import Link from 'Component/Link';
import Loader from 'Component/Loader';
import Pagination from 'Component/Pagination';
import { DeviceType } from 'Type/Device.type';
import { formatDate } from 'Util/DateTime';

import './RewardProgram.style';

/** @namespace Seedsman/Component/RewardProgram/Component */
export class RewardProgramComponent extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        is_balanceSubscribe: PropTypes.string.isRequired,
        is_expirationSubscribe: PropTypes.string.isRequired,
        // eslint-disable-next-line react/no-unused-prop-types
        device: DeviceType.isRequired,
        onCustomerSave: PropTypes.func.isRequired,
        onError: PropTypes.func.isRequired,
        rewards_history: PropTypes.objectOf.isRequired,
        points_rate: PropTypes.number.isRequired,
        currency_code: PropTypes.string.isRequired
    };

    renderExchangeRates() {
        const {
            points_rate, currency_code
        } = this.props;

        return (
            <div block="RewardProgram" elem="exchangeRates">
                <div block="RewardProgram" elem="pointBalanceInformation">
                    Current Exchange Rates
                </div>
                <div block="RewardProgram" elem="rewardPoint">
                    <span block="RewardProgram" elem="rewardPointContent">{ points_rate }</span>
                    points for every 1
                    <span block="RewardProgram" elem="rewardPointContent">
                        { currency_code }
                    </span>
                </div>
            </div>
        );
    }

    renderBalanceHistory() {
        return (
            <div block="RewardProgram" elem="balanceHistoryTitle">
                <div block="RewardProgram" elem="balanceHistory">
                    Balance History
                </div>
                <div block="RewardProgram" elem="earnPointTitle">
                    <Link to="/rewards">Earn More Points</Link>
                </div>
            </div>
        );
    }

    renderRewardProgramSubscribeForm() {
        const { is_balanceSubscribe } = this.props;
        return (
            <Field
              type={ FIELD_TYPE.checkbox }
              label="Receive emails when reward points are added to the balance"
              attr={ {
                  id: 'is_BalanceSubscribed',
                  name: 'is_BalanceSubscribed',
                  placeholder: '',
                  defaultChecked: is_balanceSubscribe
              } }
              mix={ { block: 'RewardProgramBalanceUpdates', elem: 'Checkbox' } }
            />
        );
    }

    renderRewardProgramExpirationForm() {
        const { is_expirationSubscribe } = this.props;
        return (
            <Field
              type={ FIELD_TYPE.checkbox }
              label="Receive emails when reward points are about to expire"
              attr={ {
                  id: 'is_ExpirationSubscribed',
                  name: 'is_ExpirationSubscribed',
                  placeholder: '',
                  defaultChecked: is_expirationSubscribe
              } }
              mix={ {
                  block: 'RewardProgramExpirationNotification',
                  elem: 'Checkbox'
              } }
            />
        );
    }

    renderSubmitButton() {
        return (
            <div block="RewardProgram" elem="Buttons">
                <button
                  block="Button"
                  type="submit"
                  mix={ { block: 'RewardProgram', elem: 'SaveButton' } }
                >
                    SAVE
                </button>
            </div>
        );
    }

    renderSubscribeForm() {
        const { onCustomerSave, onError } = this.props;

        return (
            <Form
              key="subscribe-update"
              onSubmit={ onCustomerSave }
              onError={ onError }
            >
                <div block="RewardProgram" elem="SubscribeForm">
                    { this.renderRewardProgramSubscribeForm() }
                    { this.renderRewardProgramExpirationForm() }
                </div>
                { this.renderSubmitButton() }
            </Form>
        );
    }

    renderEmailNotifications() {
        return (
            <div block="RewardProgram" elem="emailNotification">
                <div block="RewardProgram" elem="emailNotificationTitle">
                    Email Notification
                </div>
                <div className="RewardProgram-Heading-Border" />
                { this.renderSubscribeForm() }
            </div>
        );
    }

    renderMobileBalanceHistory() {
        const {
            isLoading,
            rewards_history
        } = this.props;

        if (isLoading || !rewards_history) {
            return null;
        }

        const {
            balance,
            history: {
                items = []
            } = {}
        } = rewards_history;

        if (!items?.length) {
            return this.renderNoHistory();
        }

        return (
            <div block="RewardProgram" elem="balanceHistoryDetails">
                <table block="RewardProgram" elem="balanceHistoryTable">
                    <thead>
                        { items?.map((value) => {
                            const Date = formatDate(value.action_date);
                            const dateFormat = Date.replace(/\//g, '-');
                            return (
                                <>
                                    <div
                                      block="RewardProgram"
                                      elem="HeadingDate"
                                    >
                                        <div
                                          block="RewardProgram"
                                          elem="DateTitle"
                                        >
                                            Date
                                        </div>
                                        <div className="RewardBorder" />
                                        <div block="RewardProgram" elem="Date">
                                            { dateFormat }
                                        </div>
                                    </div>

                                    <tr>
                                        <th
                                          block="RewardProgram"
                                          elem="HeadingBalance"
                                        >
                                            Balance
                                        </th>
                                        <td>{ balance }</td>
                                    </tr>
                                    <tr>
                                        <th
                                          block="RewardProgram"
                                          elem="HeadingPoints"
                                        >
                                            Points Spent
                                        </th>
                                        <td>{ Math.abs(value.amount) }</td>
                                    </tr>
                                    <tr>
                                        <th
                                          block="RewardProgram"
                                          elem="HeadingReason"
                                        >
                                            Reason
                                        </th>
                                        <td>{ value.comment }</td>
                                    </tr>
                                    <tr>
                                        <th
                                          block="RewardProgram"
                                          elem="HeadingReason"
                                        >
                                            Action
                                        </th>
                                        <td>{ value.action }</td>
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
            device: { isMobile },
            rewards_history
        } = this.props;

        if (isLoading || !rewards_history) {
            return null;
        }
        if (isMobile) {
            return this.renderMobileBalanceHistory();
        }

        const {
            history: {
                items = []
            } = {}
        } = rewards_history;

        if (!items?.length) {
            return this.renderNoHistory();
        }

        return (
            <div block="RewardProgram" elem="balanceHistoryDetails">
                <table block="RewardProgram" elem="balanceHistoryTable">
                    <thead>
                        <tr>
                            <th block="RewardProgram" elem="HeadingBalance">
                                Balance
                            </th>
                            <th block="RewardProgram" elem="HeadingPoints">
                                Points Spent
                            </th>
                            <th colSpan="2" block="RewardProgram" elem="HeadingReason">
                                Reason
                            </th>
                            <th block="RewardProgram" elem="HeadingReason">
                                Action
                            </th>
                            <th block="RewardProgram" elem="HeadingDate">
                                Date
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        { items?.map((value) => {
                            const Date = formatDate(value.action_date);
                            const dateFormat = Date.replace(/\//g, '-');
                            return (
                                <tr block="RewardProgram" elem="EnteredLabel">
                                    <td>{ value.points_left }</td>
                                    <td>{ Math.abs(value.amount) }</td>
                                    <td colSpan="2">{ value.comment }</td>
                                    <td>{ value.action }</td>
                                    <td>{ dateFormat }</td>
                                </tr>
                            );
                        }) }
                    </tbody>
                </table>
            </div>
        );
    }

    renderPagination() {
        const {
            rewards_history,
            isLoading
        } = this.props;

        if (!rewards_history) {
            return null;
        }

        const {
            history: {
                total_count = 0
            } = {}
        } = rewards_history;

        if (total_count === 0) {
            return null;
        }

        const totalPages = Math.ceil(total_count / 10);

        return (
            <Pagination
              isLoading={ isLoading }
              totalPages={ totalPages }
              mix={ { block: 'RewardProgram', elem: 'Pagination' } }
            />
        );
    }

    renderProgram() {
        const {
            rewards_history
        } = this.props;

        if (!rewards_history) {
            return null;
        }

        const {
            balance
        } = rewards_history;

        return (
            <div block="RewardProgram">
                <div block="RewardProgram" elem="pointBalanceInformation">
                    Reward Point Balance Information
                </div>
                <div block="RewardProgram" elem="rewardPoint">
                    <div block="RewardProgram" elem="rewardPointTitle">
                        Your Balance is
                    </div>
                    <div block="RewardProgram" elem="rewardPointContent">
                        { balance } Reward points
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const { isLoading } = this.props;

        return (
            <>
              <Loader isLoading={ isLoading } />
              <div>
                { this.renderProgram() }
                <div className="RewardProgram-Heading-Border" />
                { this.renderExchangeRates() }
                { /* <div className="RewardProgram-Heading-Border" /> */ }
                { this.renderBalanceHistory() }
                <div className="RewardProgram-Heading-Border" />
                { this.renderBalanceHistoryDetails() }
                { this.renderPagination() }
                { this.renderEmailNotifications() }
              </div>
            </>
        );
    }
}

export default RewardProgramComponent;
