import { connect } from 'react-redux';

import { BILLING_STEP } from 'Route/Checkout/Checkout.config';
import {
    CheckoutPaymentsContainer as SourceCheckoutPaymentsContainer,
    mapDispatchToProps as sourcemapDispatchToProps, mapStateToProps as sourcemapStateToProps
} from 'SourceComponent/CheckoutPayments/CheckoutPayments.container';
import { setPaymentMethod } from 'Store/Checkout/Checkout.action';

/** @namespace Seedsman/Component/CheckoutPayments/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    ...sourcemapDispatchToProps(dispatch),
    setPaymentMethod: (state) => dispatch(setPaymentMethod(state))
});

/** @namespace Seedsman/Component/CheckoutPayments/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    ...sourcemapStateToProps(state),
    step: state.CheckoutReducer.editingStep,
    cartId: state.CartReducer.cartTotals?.id,
    shippingMethodCode: state.CheckoutReducer.shipping_method_code?.method_code
});

/** @namespace Seedsman/Component/CheckoutPayments/Container */
export class CheckoutPaymentsContainer extends SourceCheckoutPaymentsContainer {
    containerFunctions = {
        selectPaymentMethod: this.selectPaymentMethod.bind(this),
        onClickCheckedBox: this.onClickCheckedBox.bind(this)
    };

    state = {
        hasError: false,
        isCheckedTerms: false
    };

    componentDidMount() {
        const { paymentMethods = [] } = this.props;

        if (window.formPortalCollector) {
            window.formPortalCollector.subscribe(BILLING_STEP, this.collectAdditionalData, 'CheckoutPaymentsContainer');
        }

        if (paymentMethods.length) {
            const [{ code }] = paymentMethods;
            this.setState({
                selectedPaymentCode: code
            });
        }
    }

    onClickCheckedBox() {
        const { isCheckedTerms } = this.state;

        this.setState({
            isCheckedTerms: !isCheckedTerms
        });
    }

    containerProps() {
        const {
            billingAddress,
            paymentMethods,
            setOrderButtonEnableStatus,
            showError,
            isValidCardDetails,
            totals,
            isOrderButtonVisible,
            isOrderButtonEnabled,
            isTermsAndConditionsAccepted,
            termsAreEnabled,
            onBillingSuccess,
            step,
            isSameAsShipping,
            onSameAsShippingChange,
            is_virtual,
            selectedShippingMethod,
            onAddressSelect,
            saveAddressInformation,
            useStoreCredit,
            handleApplyStoreCredit,
            saveBillingAddress,
            selectedPaymentMethodCode
        } = this.props;

        const { selectedPaymentCode, isCheckedTerms } = this.state;

        return {
            billingAddress,
            paymentMethods,
            selectedPaymentCode,
            setOrderButtonEnableStatus,
            showError,
            isValidCardDetails,
            totals,
            isOrderButtonVisible,
            isOrderButtonEnabled,
            isTermsAndConditionsAccepted,
            termsAreEnabled,
            onBillingSuccess,
            step,
            isSameAsShipping,
            onSameAsShippingChange,
            is_virtual,
            selectedShippingMethod,
            onAddressSelect,
            saveAddressInformation,
            isCheckedTerms,
            useStoreCredit,
            handleApplyStoreCredit,
            saveBillingAddress,
            selectedPaymentMethodCode
        };
    }

    async selectPaymentMethod({ code }) {
        const {
            onPaymentMethodSelect,
            setOrderButtonEnableStatus,
            setPaymentMethod
        } = this.props;

        this.setState({
            selectedPaymentCode: code,
            isCheckedTerms: true
        });

        await setPaymentMethod(code);
        onPaymentMethodSelect(code);
        setOrderButtonEnableStatus(true);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutPaymentsContainer);
