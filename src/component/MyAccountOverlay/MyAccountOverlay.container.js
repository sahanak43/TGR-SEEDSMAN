/* eslint-disable max-len */
/* eslint-disable react/no-unused-state */
/* eslint-disable max-lines */
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

import { connect } from 'react-redux';

import { CUSTOMER_ACCOUNT, CUSTOMER_SUB_ACCOUNT } from 'Component/Header/Header.config';
import { ACCOUNT_URL } from 'Route/MyAccount/MyAccount.config';
import { MyAccountOverlayContainer as ParentMyAccountOverlayContainer } from 'SourceComponent/MyAccountOverlay/MyAccountOverlay.container';
import { updateIsLoading } from 'Store/MyAccount/MyAccount.action';
import { changeNavigationState, goToPreviousNavigationState } from 'Store/Navigation/Navigation.action';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { hideActiveOverlay, toggleOverlayByKey } from 'Store/Overlay/Overlay.action';
import { isSignedIn } from 'Util/Auth';
import history from 'Util/History';
import { appendWithStoreCode } from 'Util/Url';

import {
    CUSTOMER_ACCOUNT_OVERLAY_KEY,
    STATE_CREATE_ACCOUNT,
    STATE_FORGOT_PASSWORD,
    STATE_LOGGED_IN,
    STATE_SIGN_IN
} from './MyAccountOverlay.config';

/** @namespace Seedsman/Component/MyAccountOverlay/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    isSignedIn: state.MyAccountReducer.isSignedIn,
    customer: state.MyAccountReducer.customer,
    isMobile: state.ConfigReducer.device.isMobile,
    isPasswordForgotSend: state.MyAccountReducer.isPasswordForgotSend,
    isOverlayVisible: state.OverlayReducer.activeOverlay === CUSTOMER_ACCOUNT,
    redirectToDashboard: state.ConfigReducer.redirect_dashboard,
    isLoading: state.MyAccountReducer.isLoading,
    device: state.ConfigReducer.device
});

/** @namespace Seedsman/Component/MyAccountOverlay/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    hideActiveOverlay: () => dispatch(hideActiveOverlay()),
    showOverlay: (overlayKey) => dispatch(toggleOverlayByKey(overlayKey)),
    setHeaderState: (headerState) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, headerState)),
    goToPreviousHeaderState: () => dispatch(goToPreviousNavigationState(TOP_NAVIGATION_TYPE)),
    updateCustomerLoadingStatus: (status) => dispatch(updateIsLoading(status))
});

/** @namespace Seedsman/Component/MyAccountOverlay/Container */
export class MyAccountOverlayContainer extends ParentMyAccountOverlayContainer {
    redirectOrGetState(props) {
        const {
            showOverlay,
            setHeaderState,
            isPasswordForgotSend,
            isMobile
        } = props;

        const { location: { pathname, state: { isForgotPassword } = {} } } = history;

        const state = {
            state: isSignedIn() ? STATE_LOGGED_IN : STATE_SIGN_IN,
            // eslint-disable-next-line react/no-unused-state
            isPasswordForgotSend,
            isLoading: false,
            type: 'login'
        };

        if (pathname !== '/forgot-password' && !isForgotPassword) {
            return state;
        }

        // if customer got here from forgot-password
        state.state = STATE_FORGOT_PASSWORD;

        setHeaderState({
            name: CUSTOMER_SUB_ACCOUNT,
            title: 'Forgot password',
            onBackClick: (e) => {
                history.push({ pathname: appendWithStoreCode(ACCOUNT_URL) });
                this.handleSignIn(e);
            }
        });

        if (isMobile) {
            history.push({ pathname: appendWithStoreCode(ACCOUNT_URL), state: { isForgotPassword: true } });

            return state;
        }

        showOverlay(CUSTOMER_ACCOUNT_OVERLAY_KEY);

        return state;
    }

    handleCreateAccount(e) {
        const { setHeaderState } = this.props;
        e.preventDefault();
        e.nativeEvent.stopImmediatePropagation();
        this.setState({ state: STATE_CREATE_ACCOUNT });

        setHeaderState({
            name: CUSTOMER_ACCOUNT,
            title: 'Create account',
            onBackClick: () => this.handleSignIn(e)
        });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountOverlayContainer);
