import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import MyAccountRewardStoreQuery from 'Query/MyAccountRewardStore.query';
import { DELIVERY_METHOD, PAYMENT_METHOD } from 'Route/Checkout/Checkout.config';
import { updateEditingStep } from 'Store/Checkout/Checkout.action';
import { showNotification } from 'Store/Notification/Notification.action';
import { trimShippingAddress } from 'Util/Address';
import { getGuestQuoteId } from 'Util/Cart';
import transformToNameValuePair from 'Util/Form/Transform';
import { fetchMutation, /* fetchQuery */ getErrorMessage } from 'Util/Request';

import ApplyRewards from './ApplyRewards.component';

export const CartDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Cart/Cart.dispatcher'
);

/** @namespace Seedsman/Component/ApplyRewards/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    used_points: state.CartReducer.cartTotals.amasty_rewards_used_points?.used_points,
    points_rate: state.ConfigReducer.amrewards_points_rate,
    currency_code: state.ConfigReducer.default_display_currency_code,
    rewards_points: state.MyAccountReducer.reward_points,
    shippingFields: state.CheckoutReducer.shippingFields,
    currentStep: state.CheckoutReducer.editingStep
});

/** @namespace Seedsman/Component/ApplyRewards/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    updateInitialCartData: () => CartDispatcher.then(
        ({ default: dispatcher }) => dispatcher.updateInitialCartData(dispatch, true)
    ),
    showErrorNotification: (error) => dispatch(showNotification(
        'error',
        typeof error === 'string' ? error : getErrorMessage(error)
    )),
    showSuccessNotification: (message) => dispatch(showNotification('success', message)),
    updateEditingStep: (step) => dispatch(updateEditingStep(step))
});

/** @namespace Seedsman/Component/ApplyRewards/Container */
export class ApplyRewardsContainer extends PureComponent {
    static propTypes = {
        showSuccessNotification: PropTypes.func.isRequired,
        updateInitialCartData: PropTypes.func.isRequired,
        showErrorNotification: PropTypes.func.isRequired,
        points_rate: PropTypes.number.isRequired,
        currency_code: PropTypes.string.isRequired,
        rewards_points: PropTypes.objectOf.isRequired,
        checkoutStep: PropTypes.string.isRequired,
        used_points: PropTypes.string.isRequired,
        updateUsedLoyalityPoints: PropTypes.func.isRequired,
        shippingFields: PropTypes.objectOf.isRequired,
        saveAddressInformation: PropTypes.func.isRequired,
        updateEditingStep: PropTypes.func.isRequired,
        currentStep: PropTypes.string.isRequired
    };

    containerFunctions = ({
        handleFormSubmit: this.handleFormSubmit.bind(this)
    });

    __construct(props) {
        super.__construct(props);

        const { used_points } = props;

        this.state = {
            isApplied: !!used_points,
            isLoading: false,
            usedPoints: used_points || null,
            rewards_history: {},
            isNoError: true,
            appliedPoints: null
        };
    }

    containerProps() {
        const {
            isLoading, rewards_history, isApplied, usedPoints,
            isNoError, appliedPoints
        } = this.state;
        const {
            points_rate, currency_code, rewards_points, checkoutStep,
            used_points
        } = this.props;

        return {
            isLoading,
            rewards_history,
            isApplied,
            usedPoints,
            points_rate,
            currency_code,
            rewards_points,
            checkoutStep,
            isNoError,
            appliedPoints,
            used_points
        };
    }

    async handleFormSubmit(form, fields) {
        const { points } = transformToNameValuePair(fields);
        const { isApplied } = this.state;
        const {
            showErrorNotification,
            updateInitialCartData,
            rewards_points: { rewards: { balance } },
            // updateUsedLoyalityPoints,
            saveAddressInformation,
            shippingFields,
            updateEditingStep,
            currentStep
        } = this.props;

        const isValid = /^\d+(?:\.\d{0,3})?$/.test(points);

        if (!isValid) {
            showErrorNotification('Invalid amount, Please try again');
            return;
        }

        if (Number(points) > balance) {
            this.setState({
                isNoError: false
            });
        } else {
            this.setState({
                isNoError: true
            });
        }

        this.setState({ isLoading: true });
        // eslint-disable-next-line fp/no-let
        let input = {
            cart_id: getGuestQuoteId(),
            points
        };

        if (isApplied) {
            input = {
                cart_id: getGuestQuoteId(),
                points: 0
            };
        }

        await fetchMutation(MyAccountRewardStoreQuery.applyRewardPoints(input)).then(
            /** @namespace Seedsman/Component/ApplyRewards/Container/ApplyRewardsContainer/handleFormSubmit/then/finally/fetchMutation/then */
            ({ useRewardPoints: { cart: { amasty_rewards_used_points: { used_points } } } }) => {
                this.setState({
                    isLoading: false,
                    isApplied: !isApplied,
                    usedPoints: used_points || null,
                    appliedPoints: points
                });

                // updateUsedLoyalityPoints(used_points);
            }
        ).finally(
        /** @namespace Seedsman/Component/ApplyRewards/Container/ApplyRewardsContainer/handleFormSubmit/then/finally */
            async () => {
                updateInitialCartData();
                const data = {
                    shipping_address: trimShippingAddress(shippingFields)
                };

                if (currentStep === DELIVERY_METHOD || currentStep === PAYMENT_METHOD) {
                    await saveAddressInformation(data);
                    updateEditingStep(DELIVERY_METHOD);
                }
                this.setState({ isLoading: false });
            }
        );
    }

    render() {
        return (
            <ApplyRewards
              { ...this.containerProps() }
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ApplyRewardsContainer);
