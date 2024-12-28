/* eslint-disable react/jsx-no-bind */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Popup from 'Component/Popup';

import { LOGOUT_POPUP } from './LogoutPopup.config';

import './LogoutPopup.style';

/** @namespace Seedsman/Component/LogoutPopup/Component */
export class LogoutPopupComponent extends PureComponent {
    static propTypes = {
        // TODO: implement prop-types
    };

    renderContent() {
        const { hidePopUp, handleLogout } = this.props;
        return (
            <>
                <p block="heading">Are you sure you want logout</p>
                <div block="remove-popup" elem="Buttons">
          <button onClick={ hidePopUp }>Cancel</button>
          <button onClick={ handleLogout }>Log out</button>
                </div>
            </>
        );
    }

    render() {
        const { onLogoutClose } = this.props;
        return (
            <div block="Logout-popup">
                <Popup
                  id={ LOGOUT_POPUP }
                  mix={ { block: 'LogoutPopup' } }
                  onClose={ onLogoutClose }
                >
                    <div block="LogoutPopup" elem="section">{ this.renderContent() }</div>
                </Popup>
            </div>
        );
    }
}

export default LogoutPopupComponent;
