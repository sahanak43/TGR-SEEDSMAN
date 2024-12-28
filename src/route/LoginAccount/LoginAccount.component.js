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

import './LoginAccount.override.style';

/** @namespace Seedsman/Route/LoginAccount/Component */
export class LoginAccountComponent extends MyAccountOverlayComponent {
    renderSignInWrapper() {
        return (
            <div block="LoginAccount" elem="SignInWrapper">
                <h3>Registered Customers</h3>
                <p>If you have an account, sign in with your email address.</p>
                { this.renderSignIn() }
            </div>
        );
    }

    renderCreateAccountWrapper() {
        const { isMobile, onCreateAccountClick } = this.props;

        if (isMobile) {
            return (
                <div block="LoginAccount" elem="CreateAccount">
                    <h4>Don&apos;t have an account?</h4>
                    <button
                      block="Button"
                      mods={ { likeLink: true } }
                      onClick={ onCreateAccountClick }
                    >
                        Create an Account
                    </button>
                </div>
            );
        }

        return (
            <div block="LoginAccount" elem="CreateAccount">
                <h3>New Customers</h3>
                <p>
                    Creating an account has many benefits:
                     check out faster, keep more than one address, track orders and more.
                </p>
                <button
                  block="Button"
                  mix={ { block: 'LoginAccount', elem: 'CreateAccountButton' } }
                  onClick={ onCreateAccountClick }
                >
                Create an Account
                </button>
            </div>
        );
    }

    renderContent() {
        return (
            <>
                { this.renderSignInWrapper() }
                { this.renderCreateAccountWrapper() }
            </>
        );
    }

    render() {
        const {
            isLoading
        } = this.props;

        return (
            <ContentWrapper
              mix={ {
                  block: 'LoginAccount'
              } }
              label="Login page"
            >
                <div block="LoginAccount" elem="InnerWrapper">
                    <Loader isLoading={ isLoading } />
                    { this.renderContent() }
                </div>
            </ContentWrapper>
        );
    }
}
export default withRouter(
    LoginAccountComponent
);
