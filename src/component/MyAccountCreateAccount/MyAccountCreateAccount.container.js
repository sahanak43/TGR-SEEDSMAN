/* eslint-disable max-len */
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { STATE_CONFIRM_EMAIL } from 'Component/MyAccountOverlay/MyAccountOverlay.config';
import { mapDispatchToProps, mapStateToProps as sourceMapStateToProps, MyAccountCreateAccountContainer as SourceMyAccountCreateAccountContainer } from 'SourceComponent/MyAccountCreateAccount/MyAccountCreateAccount.container';
import { SignInStateType } from 'Type/Account.type';
import transformToNameValuePair from 'Util/Form/Transform';

import { CONFIRMATION_REQUIRED } from './MyAccountCreateAccount.config';

export const MyAccountDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/MyAccount/MyAccount.dispatcher'
);

/** @namespace Seedsman/Component/MyAccountCreateAccount/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    ...sourceMapStateToProps(state),
    siteKey: state.ConfigReducer.recaptcha_frontend_type_recaptcha_public_key
});

/** @namespace Seedsman/Component/MyAccountCreateAccount/Container */
export class MyAccountCreateAccountContainer extends SourceMyAccountCreateAccountContainer {
    static propTypes = {
        createAccount: PropTypes.func.isRequired,
        onSignIn: PropTypes.func,
        setSignInState: PropTypes.func.isRequired,
        setLoadingState: PropTypes.func.isRequired,
        showNotification: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        showTaxVatNumber: PropTypes.bool.isRequired,
        isLandingPage: PropTypes.bool,
        isMobile: PropTypes.bool.isRequired,
        handleSignIn: PropTypes.func.isRequired,
        state: SignInStateType.isRequired,
        newsletterActive: PropTypes.bool.isRequired,
        minimunPasswordLength: PropTypes.number.isRequired,
        minimunPasswordCharacter: PropTypes.string.isRequired
    };

    containerProps() {
        const {
            state,
            handleSignIn,
            showTaxVatNumber,
            newsletterActive,
            minimunPasswordLength,
            minimunPasswordCharacter,
            isLoading,
            siteKey
        } = this.props;

        const range = { min: minimunPasswordLength, max: 64 };

        return {
            state,
            handleSignIn,
            showTaxVatNumber,
            newsletterActive,
            vatNumberRequired: this.getVatNumberRequired(),
            range,
            minimunPasswordCharacter,
            isLoading,
            siteKey
        };
    }

    async onSuccess(form, fields) {
        const {
            createAccount,
            onSignIn,
            setSignInState,
            setLoadingState,
            isLoading,
            isLandingPage,
            showNotification,
            isMobile
        } = this.props;

        const {
            password,
            email,
            firstname,
            lastname,
            date_of_birth,
            is_subscribed,
            allow_remote_shopping_assistance,
            taxvat,
            'g-recaptcha-response': recaptcha_key
        } = transformToNameValuePair(fields);

        const customerData = {
            customer: {
                firstname,
                lastname,
                email,
                date_of_birth,
                is_subscribed,
                allow_remote_shopping_assistance,
                taxvat
            },
            recaptcha_key,
            password
        };

        if (isLoading) {
            return;
        }

        try {
            const code = await createAccount(customerData).catch(
                /** @namespace Seedsman/Component/MyAccountCreateAccount/Container/MyAccountCreateAccountContainer/onSuccess/code/createAccount/catch */
                () => process.exit(1)
            );

            // if user needs confirmation
            if (code === CONFIRMATION_REQUIRED) {
                setSignInState(STATE_CONFIRM_EMAIL);

                if (isLandingPage || isMobile) {
                    showNotification(
                        'success',
                        // eslint-disable-next-line max-len
                        'The email confirmation link has been sent to your email. Please confirm your account to proceed.'
                    );
                    history.push('/default/customer/account/login');
                }
            } else if (code !== false) {
                onSignIn();
            }
        } finally {
            setLoadingState(false);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountCreateAccountContainer);
