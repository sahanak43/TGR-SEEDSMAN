/* eslint-disable max-len */
import { connect } from 'react-redux';

import { STATE_FORGOT_PASSWORD_SUCCESS } from 'Component/MyAccountOverlay/MyAccountOverlay.config';
import { mapDispatchToProps as sourcemapDispatchToProps, MyAccountForgotPasswordContainer as SourceMyAccountForgotPasswordContainer } from 'SourceComponent/MyAccountForgotPassword/MyAccountForgotPassword.container';
import transformToNameValuePair from 'Util/Form/Transform';

export const MyAccountDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/MyAccount/MyAccount.dispatcher'
);

/** @namespace Seedsman/Component/MyAccountForgotPassword/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    isLoading: state.MyAccountReducer.isLoading,
    siteKey: state.ConfigReducer.recaptcha_frontend_type_recaptcha_public_key
});

/** @namespace Seedsman/Component/MyAccountForgotPassword/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    ...sourcemapDispatchToProps(dispatch)
});

/** @namespace Seedsman/Component/MyAccountForgotPassword/Container */
export class MyAccountForgotPasswordContainer extends SourceMyAccountForgotPasswordContainer {
    containerProps() {
        const {
            state,
            onFormError,
            handleSignIn,
            handleCreateAccount,
            isCheckout,
            siteKey,
            isLoading
        } = this.props;

        return {
            state,
            onFormError,
            handleSignIn,
            handleCreateAccount,
            isCheckout,
            siteKey,
            isLoading
        };
    }

    // eslint-disable-next-line consistent-return
    async onForgotPasswordSuccess(form, fields) {
        const {
            forgotPassword, setSignInState, setLoadingState, forgotPasswordEmail, isOverlayVisible
        } = this.props;
        const submittedEmail = form[0].value;
        setLoadingState(true);

        const fieldPairs = transformToNameValuePair(fields);

        const {
            email,
            'g-recaptcha-response': recaptcha_key
        } = fieldPairs;

        const options = {
            email,
            recaptcha_key
        };

        try {
            const response = await forgotPassword(options);
            if (response.msgType) {
                setLoadingState(false);
                return null;
            }
            setSignInState(STATE_FORGOT_PASSWORD_SUCCESS);
            forgotPasswordEmail(submittedEmail);

            // if on route /forgotpassword
            if (!isOverlayVisible) {
                this.showSuccesNotification(submittedEmail);
            }
            setLoadingState(false);
        } catch {
            setLoadingState(false);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountForgotPasswordContainer);
