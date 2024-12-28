/* eslint-disable consistent-return */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Field from 'Component/Field';
import FIELD_TYPE from 'Component/Field/Field.config';
import Form from 'Component/Form';
import Loader from 'Component/Loader';
import Tooltip from 'Component/Tooltip';
import { TOP } from 'Component/Tooltip/Tooltip.config.js';
import { DETAILS_STEP } from 'Route/Checkout/Checkout.config';
import { isSignedIn } from 'Util/Auth';
import { VALIDATION_INPUT_TYPE } from 'Util/Validator/Config';

import './ApplyRewards.style';

/** @namespace Seedsman/Component/ApplyRewards/Component */
export class ApplyRewardsComponent extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        checkoutStep: PropTypes.string.isRequired,
        isApplied: PropTypes.bool.isRequired,
        usedPoints: PropTypes.string.isRequired,
        handleFormSubmit: PropTypes.func.isRequired,
        points_rate: PropTypes.number.isRequired,
        currency_code: PropTypes.string.isRequired,
        rewards_points: PropTypes.objectOf.isRequired,
        isNoError: PropTypes.bool.isRequired,
        appliedPoints: PropTypes.string.isRequired,
        used_points: PropTypes.string.isRequired
    };

    renderTitle() {
        const { rewards_points: { rewards: { balance } } } = this.props;

        return (
            <div
              block="ApplyRewards"
              elem="Title"
            >
                <h3>Loyalty points
                    <Tooltip
                      // eslint-disable-next-line react/jsx-no-bind
                      content={ this.renderPointsRate.bind(this) }
                      isCenter="CENTER"
                      direction={ TOP }
                    />
                </h3>
                <span className="label">You have </span>
                <span className="value">{ balance }</span>
                <span className="label"> points to spend</span>
            </div>
        );
    }

    renderPointsRate() {
        const { points_rate, currency_code } = this.props;

        return (
            <div
              block="ApplyRewards"
              elem="PointsRate"
            >
                <span className="label">{ points_rate } for every 1 { currency_code }</span>
            </div>
        );
    }

    renderApplyCoupon() {
        const { isApplied, usedPoints } = this.props;

        return (
            <div
              block="ApplyRewards"
              elem="FieldWrapper"
            >
                <Field
                  type={ FIELD_TYPE.text }
                  mix={ {
                      block: 'ApplyRewards',
                      elem: 'Input'
                  } }
                  // eslint-disable-next-line max-len
                  validationRule={ isApplied ? { isRequired: true } : { isRequired: true, inputType: VALIDATION_INPUT_TYPE.numeric } }
                  isDisabled={ !!isApplied }
                  validateOn={ ['onChange'] }
                  addRequiredTag
                  attr={ {
                      id: 'points',
                      name: 'points',
                      value: usedPoints,
                      placeholder: 'Enter points total you wish to use',
                      'aria-label': 'Enter points total you wish to use'
                  } }
                />
                <button
                  block="ApplyRewards"
                  elem="Button"
                  type={ FIELD_TYPE.submit }
                  mods={ { isHollow: true } }
                >
                    { !isApplied ? 'Apply' : 'Remove' }
                </button>
            </div>
        );
    }

    renderApplyCouponLabel() {
        const {
            isNoError, used_points, appliedPoints, isApplied
        } = this.props;

        if (isApplied) {
            if (isNoError) {
                return (
                    <div
                      block="ApplyRewards"
                      elem="successLabel"
                    >
                        <p>{ `${appliedPoints || used_points} loyalty points spent` }</p>
                    </div>
                );
            }

            return (
                <div
                  block="ApplyRewards"
                  elem="errorLabel"
                >
                    <p>Sorry, you do not have enough points</p>
                </div>
            );
        }
    }

    render() {
        const {
            rewards_points, isLoading, handleFormSubmit, checkoutStep
        } = this.props;

        if (!isSignedIn() || !rewards_points || checkoutStep === DETAILS_STEP) {
            return null;
        }

        return (
            <div
              block="ApplyRewards"
            >
                <Form
                  onSubmit={ handleFormSubmit }
                >
                    <Loader isLoading={ isLoading } />
                    { this.renderTitle() }
                    { this.renderApplyCoupon() }
                    { this.renderApplyCouponLabel() }
                </Form>
            </div>
        );
    }
}

export default ApplyRewardsComponent;
