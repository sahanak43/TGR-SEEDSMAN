/* eslint-disable max-len */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Popup from 'Component/Popup';

import { CART_POPUP } from './CartPagePopup.config';

import './CartPagePopup.style';

/** @namespace Seedsman/Component/CartPagePopup/Component */
export class CartPagePopupComponent extends PureComponent {
  static propTypes = {
      hidePopUp: PropTypes.func.isRequired,
      handleRemoveItem: PropTypes.func.isRequired
  };

  renderContent() {
      const { hidePopUp, handleRemoveItem } = this.props;
      return (
      <div block="remove-popup" elem="Inner_content">
        <span className="title">Remove This Item From Cart</span>
        <div block="remove-popup" elem="Buttons">
          <button onClick={ hidePopUp }>Cancel</button>
          <button onClick={ handleRemoveItem }>Remove</button>
        </div>
      </div>
      );
  }

  renderCloseButton() {
      const { hidePopUp } = this.props;
      return (
          <button
            block="Popup"
            elem="CloseBtn"
            aria-label="Close"
            onClick={ hidePopUp }
          >
            <svg
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
              fillRule="evenodd"
              clipRule="evenodd"
            >
              <path
                d="M12 11.293l10.293-10.293.707.707-10.293 10.293 10.293 10.293-.707.707-10.293-10.293-10.293 10.293-.707-.707 10.293-10.293-10.293-10.293.707-.707 10.293 10.293z"
                fill="#fff"
              />
            </svg>
          </button>
      );
  }

  render() {
      return (
      <div block="remove-popup">
        <Popup id={ CART_POPUP } mix={ { block: 'CartPagePopup' } }>
          <div block="remove-popup" elem="Close_button">
            { this.renderCloseButton() }
          </div>
          <div>{ this.renderContent() }</div>
        </Popup>
      </div>
      );
  }
}

export default CartPagePopupComponent;
