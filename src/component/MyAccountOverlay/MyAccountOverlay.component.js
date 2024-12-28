/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable max-len */
import { withRouter } from 'react-router-dom';

import Loader from 'Component/Loader';
import Popup from 'Component/Popup';
import { MyAccountOverlay as ParentMyAccountOverlay } from 'SourceComponent/MyAccountOverlay/MyAccountOverlay.component';
import { noopFn } from 'Util/Common';

import {
    CUSTOMER_ACCOUNT_OVERLAY_KEY,
    STATE_CONFIRM_EMAIL,
    STATE_CREATE_ACCOUNT,
    STATE_FORGOT_PASSWORD,
    STATE_FORGOT_PASSWORD_SUCCESS,
    STATE_LOGGED_IN,
    STATE_SIGN_IN
} from './MyAccountOverlay.config';

import './MyAccountOverlay.override.style';

/** @namespace Seedsman/Component/MyAccountOverlay/Component */
export class MyAccountOverlayComponent extends ParentMyAccountOverlay {
    renderMap = {
        [STATE_SIGN_IN]: {
            render: () => this.renderSignIn(),
            title: 'Login'
        },
        [STATE_FORGOT_PASSWORD]: {
            render: () => this.renderForgotPassword(),
            title: 'Get password link'
        },
        [STATE_FORGOT_PASSWORD_SUCCESS]: {
            render: () => this.renderForgotPasswordSuccess()
        },
        [STATE_CREATE_ACCOUNT]: {
            render: () => this.renderCreateAccount(),
            title: 'Create an account'
        },
        [STATE_LOGGED_IN]: {
            render: noopFn
        },
        [STATE_CONFIRM_EMAIL]: {
            render: () => this.renderConfirmEmail(),
            title: 'Confirm the email'
        }
    };

    renderMyAccountButtons() {
        const { state, handleSignIn, handleCreateAccount } = this.props;
        return (
            <div block="MyAccountOverlay" elem="ButtonsLogin">
                { state === STATE_SIGN_IN || state === STATE_CREATE_ACCOUNT ? (
                    <>
                        <div
                          className={ `Button-Login ${ state === STATE_SIGN_IN ? 'Active' : 'NotActive' }` }
                          onClick={ (e) => handleSignIn(e) }
                        >
                            <p>LOGIN</p>
                        </div>
                        <div
                          onClick={ (e) => handleCreateAccount(e) }
                          className={ `Button-Create ${ state === STATE_CREATE_ACCOUNT ? 'Active' : 'NotActive' }` }
                        >
                            <p>CREATE AN ACCOUNT</p>
                        </div>
                    </>

                )
                    : (state === STATE_FORGOT_PASSWORD)
                        ? (
                        <div
                          block="Button-Forgot"
                          className="Active"
                        >
                          <p>FORGOT PASSWORD? NO PROBLEM</p>
                        </div>
                        )
                        : null }
            </div>
        );
    }

    renderMyAccount() {
        const { state } = this.props;
        const { render } = this.renderMap[state];

        return (
            <div block="MyAccountOverlay" elem="Action" mods={ { state } }>
                { render() }
            </div>
        );
    }

    render() {
        const { isLoading } = this.props;

        return (
            <Popup
              id={ CUSTOMER_ACCOUNT_OVERLAY_KEY }
              mix={ { block: 'MyAccountPopup' } }
            >

            { this.renderMyAccountButtons() }
            { this.renderMyAccount() }
            <Loader isLoading={ isLoading } />
            </Popup>
        );
    }
}

export default withRouter(
    MyAccountOverlayComponent
);
