/* eslint-disable no-debugger */
/* eslint-disable max-len */
import { connect } from 'react-redux';

import { BILLING_URL, SHIPPING_URL } from 'Route/Checkout/Checkout.config';
import { MyAccountSignInContainer as ParentMyAccountSignInContainer } from 'SourceComponent/MyAccountSignIn/MyAccountSignIn.container';
import { showNotification } from 'Store/Notification/Notification.action';
import transformToNameValuePair from 'Util/Form/Transform';
import { getErrorMessage } from 'Util/Request';
import { appendWithStoreCode } from 'Util/Url';

export const MyAccountDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/MyAccount/MyAccount.dispatcher'
);

/** @namespace Seedsman/Component/MyAccountSignIn/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    isEmailAvailable: state.CheckoutReducer.isEmailAvailable,
    isLocked: state.MyAccountReducer.isLocked,
    totals: state.CartReducer.cartTotals,
    siteKey: state.ConfigReducer.recaptcha_frontend_type_recaptcha_public_key,
    availableSocials: state.ConfigReducer.availableSocials
});

/** @namespace Seedsman/Component/MyAccountSignIn/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    signIn: (options) => MyAccountDispatcher.then(
        ({ default: dispatcher }) => dispatcher.signIn(options, dispatch)
    ),
    showNotification: (type, message) => dispatch(showNotification(type, message))
});

/** @namespace Seedsman/Component/MyAccountSignIn/Container */
export class MyAccountSignInContainer extends ParentMyAccountSignInContainer {
    state = {
        isSignIn: false,
        showPassword: false
    };

    containerFunctions = {
        onSignInSuccess: this.onSignInSuccess.bind(this),
        handleShowPassword: this.handleShowPassword.bind(this)
    };

    containerProps() {
        const {
            state,
            onFormError,
            handleForgotPassword,
            handleCreateAccount,
            isCheckout,
            setLoadingState,
            emailValue,
            handleEmailInput,
            isLoading,
            siteKey,
            availableSocials
        } = this.props;

        const { showPassword } = this.state;

        return {
            state,
            onFormError,
            handleForgotPassword,
            handleCreateAccount,
            isCheckout,
            setLoadingState,
            emailValue,
            handleEmailInput,
            isLoading,
            showPassword,
            siteKey,
            availableSocials
        };
    }

    async onSignInSuccess(form, fields) {
        const {
            signIn,
            showNotification,
            onSignIn,
            setLoadingState,
            totals: { is_virtual },
            isCheckout
        } = this.props;

        const {
            isSignIn
        } = this.state;

        setLoadingState(true);
        const fieldPairs = transformToNameValuePair(fields);

        const {
            email,
            password,
            'g-recaptcha-response': recaptcha_key
        } = fieldPairs;

        const options = {
            email,
            password,
            recaptcha_key
        };

        if (!isSignIn) {
            this.setState({ isSignIn: true });

            try {
                await signIn(options);
                onSignIn();
            } catch (error) {
                showNotification('error', getErrorMessage(error));
                this.setState({ isSignIn: false });
            } finally {
                setLoadingState(false);
            }
        }

        setLoadingState(false);

        if (is_virtual && isCheckout) {
            history.push({ pathname: appendWithStoreCode(BILLING_URL) });
        } else if (!is_virtual && isCheckout) {
            history.push({ pathname: appendWithStoreCode(SHIPPING_URL) });
        }
    }

    handleShowPassword() {
        const { showPassword } = this.state;
        this.setState({
            showPassword: !showPassword
        });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountSignInContainer);
