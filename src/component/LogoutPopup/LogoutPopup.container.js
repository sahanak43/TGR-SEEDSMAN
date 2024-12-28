// import PropTypes from 'prop-types';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { goToPreviousNavigationState } from 'Store/Navigation/Navigation.action';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { hideActiveOverlay } from 'Store/Overlay/Overlay.action';
import history from 'Util/History';
import { appendWithStoreCode } from 'Util/Url';

import LogoutPopup from './LogoutPopup.component';
/** @namespace Seedsman/Component/LogoutPopup/Container/mapStateToProps */
export const mapStateToProps = () => ({
});

export const MyAccountDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/MyAccount/MyAccount.dispatcher'
);

/** @namespace Seedsman/Component/LogoutPopup/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    hideActiveOverlay: () => dispatch(hideActiveOverlay()),
    goToPreviousNavigationState: (state) => dispatch(goToPreviousNavigationState(TOP_NAVIGATION_TYPE, state)),
    logout: () => MyAccountDispatcher.then(
        ({ default: dispatcher }) => dispatcher.logout(false, true, dispatch)
    )
});

/** @namespace Seedsman/Component/LogoutPopup/Container */
export class LogoutPopupContainer extends PureComponent {
    static propTypes = {
        logout: PropTypes.func.isRequired,
        hideActiveOverlay: PropTypes.func.isRequired,
        goToPreviousNavigationState: PropTypes.func.isRequired
    };

    containerFunctions = {
        hidePopUp: this.hidePopUp.bind(this),
        handleLogout: this.handleLogout.bind(this)
    };

    containerProps() {
        // isDisabled: this._getIsDisabled()
    }

    hidePopUp() {
        const { hideActiveOverlay, goToPreviousNavigationState } = this.props;
        hideActiveOverlay();
        goToPreviousNavigationState();
    }

    handleLogout() {
        const { logout } = this.props;

        logout();
        history.push(appendWithStoreCode('/'));
        this.hidePopUp();
    }

    render() {
        return (
            <LogoutPopup
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LogoutPopupContainer);
