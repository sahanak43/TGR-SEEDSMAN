/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import { Redirect } from 'react-router';
import { withRouter } from 'react-router-dom';

import ContentWrapper from 'Component/ContentWrapper';
import Loader from 'Component/Loader';
import {
    MyAccountOverlayComponent
} from 'Component/MyAccountOverlay/MyAccountOverlay.component';
import { ACCOUNT_URL } from 'Route/MyAccount/MyAccount.config';
import { isSignedIn } from 'Util/Auth';

import './ForgotPassword.style';

/** @namespace Seedsman/Route/ForgotPassword/Component */
export class ForgotPasswordComponent extends MyAccountOverlayComponent {
    renderSignInWrapper() {
        const { onLoginClick } = this.props;

        return (
            <div block="ForgotPassword" elem="SignInWrapper">
                <h3>Registered Customers</h3>
                <p>If you have an account, sign in with your email address.</p>
                <button
                  block="Button"
                  mix={ { block: 'ForgotPassword', elem: 'SignInButton' } }
                  onClick={ onLoginClick }
                >
                Sign In
                </button>
            </div>
        );
    }

    renderCreateAccountWrapper() {
        const { onCreateAccountClick } = this.props;

        return (
            <div block="ForgotPassword" elem="CreateAccountWrapper">
                <h3>New Customers</h3>
                <p>
                    Creating an account has many benefits:
                     check out faster, keep more than one address, track orders and more.
                </p>
                <button
                  block="Button"
                  mix={ { block: 'ForgotPassword', elem: 'CreateAccountButton' } }
                  onClick={ onCreateAccountClick }
                >
                Create an Account
                </button>
            </div>
        );
    }

    renderForgotPasswordWrapper() {
        const { device } = this.props;

        if (device.isMobile) {
            return this.renderForgotPassword();
        }

        return (
            <div block="ForgotPassword" elem="ContainerWrapper">
                <h3>Forgot Your Password?</h3>
                <p>
                    Please enter your email address below to receive a password reset link.
                </p>
                { this.renderForgotPassword() }
            </div>
        );
    }

    renderAdditionalContent() {
        const { device } = this.props;

        if (device.isMobile) {
            return null;
        }

        return (
            <div block="ForgotPassword" elem="AdditionalContent">
                { this.renderCreateAccountWrapper() }
                { this.renderSignInWrapper() }
            </div>
        );
    }

    render() {
        const {
            isLoading
        } = this.props;

        if (isSignedIn()) {
            return <Redirect to={ ACCOUNT_URL } />;
        }

        return (
            <ContentWrapper
              mix={ {
                  block: 'ForgotPassword'
              } }
              label="Forgot password page"
            >
                <div block="ForgotPassword" elem="InnerWrapper">
                    <Loader isLoading={ isLoading } />
                    { this.renderForgotPasswordWrapper() }
                    { this.renderAdditionalContent() }
                </div>
            </ContentWrapper>
        );
    }
}
export default withRouter(
    ForgotPasswordComponent
);
