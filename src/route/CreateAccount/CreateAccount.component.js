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

import { withRouter } from 'react-router-dom';

import ContentWrapper from 'Component/ContentWrapper';
import Loader from 'Component/Loader';
import {
    MyAccountOverlayComponent
} from 'Component/MyAccountOverlay/MyAccountOverlay.component';

import './CreateAccount.override.style';

/** @namespace Seedsman/Route/CreateAccount/Component */
export class CreateAccountComponent extends MyAccountOverlayComponent {
    renderSignInWrapper() {
        const { onLoginClick } = this.props;

        return (
            <div block="CreateAccount" elem="SignInWrapper">
                <h3>Registered Customers</h3>
                <p>If you have an account, sign in with your email address.</p>
                <button block="Button" onClick={ onLoginClick }>Sign In</button>
            </div>
        );
    }

    renderCreateAccountWrapper() {
        return (
            <div block="CreateAccount" elem="CreateAccountWrapper">
                <h3>New Customers</h3>
                <p>
                    Creating an account has many benefits:
                     check out faster, keep more than one address, track orders and more.
                </p>
                { this.renderCreateAccount(true) }
            </div>
        );
    }

    renderForgotPasswordWrapper() {
        return (
            <div block="CreateAccount" elem="ForgetPasswordWrapper">
                <h3>Forgot Your Password?</h3>
                <p>
                    Please enter your email address below to receive a password reset link.
                </p>
                { this.renderForgotPassword() }
            </div>
        );
    }

    renderContent() {
        return (
            <>
                { this.renderCreateAccountWrapper() }
                { this.renderSignInWrapper() }
            </>
        );
    }

    render() {
        const {
            isLoading
        } = this.props;

        return (
            <ContentWrapper
              label="Create account page"
              mix={ {
                  block: 'CreateAccount'
              } }
            >
                <div block="CreateAccount" elem="InnerWrapper">
                    <Loader isLoading={ isLoading } />
                    { this.renderContent() }
                </div>
            </ContentWrapper>
        );
    }
}
export default withRouter(
    CreateAccountComponent
);
