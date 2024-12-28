/* eslint-disable max-len */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Logo from 'SourceComponent/Logo';
import Popup from 'SourceComponent/Popup';
import media from 'SourceUtil/Media';
import { LOGO_MEDIA } from 'SourceUtil/Media/Media';
import { Cookies } from 'Util/Cookies';

import { RING_FENCED_CUSTOMER } from './RingFencedCustomer.config';

import './RingFencedCustomerPopup.style';

/** @namespace Seedsman/Component/RingFencedCustomerPopup/Component */
export class RingFencedCustomerPopupComponent extends PureComponent {
    static propTypes = {
        headerLogoSrc: PropTypes.string.isRequired,
        logoAlt: PropTypes.string.isRequired,
        handleContinueBtn: PropTypes.func.isRequired,
        handleLogin: PropTypes.func.isRequired
    };

    renderLogin() {
        const { handleLogin } = this.props;
        return (
            <div block="RingFencedPopup" elem="Login">
                <p>
                    Login to shop all seeds from Seedsman
                </p>
                <button
                  onClick={ handleLogin }
                  block="LoginButton"
                  elem="Button"
                  mix={ {
                      block: 'Button'
                  } }
                >
                    Shop All Seeds
                </button>
            </div>
        );
    }

    renderOrText() {
        return (
            <div block="RingFencedPopup" elem="orText">OR</div>
        );
    }

    renderContinueBtn() {
        const { handleContinueBtn } = this.props;
        const category = Cookies.get('ringFencedCustomer');

        return (
            <div block="RingFencedPopup" elem="Continue">
                <p>
                    { `Continue shopping with ${category?.value} only ` }
                </p>
                <button
                  onClick={ handleContinueBtn }
                  block="ContinueButton"
                  elem="Button"
                  mix={ {
                      block: 'Button',
                      mods: { isHollow: true }
                  } }
                >
                    Continue
                </button>
            </div>
        );
    }

    renderActions() {
        return (
            <div block="RingFencedPopup" elem="Actions">
                { this.renderLogin() }
                { this.renderOrText() }
                { this.renderContinueBtn() }
            </div>
        );
    }

    renderContent() {
        const { headerLogoSrc, logoAlt } = this.props;

        const logoSrc = headerLogoSrc ? media(headerLogoSrc, LOGO_MEDIA) : null;

        return (
            <div block="RingFencedPopup" elem="HeaderContent">
                <Logo
                  src={ logoSrc }
                  alt={ logoAlt }
                  title={ logoAlt }
                />
                <h3 block="RingFencedPopup" elem="Heading">Welcome to Seedsman</h3>
                <p block="RingFencedPopup" elem="Message">
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut.
                </p>
                { this.renderActions() }
            </div>
        );
    }

    render() {
        return (
            <Popup
              id={ RING_FENCED_CUSTOMER }
              mix={ { block: 'RingFencedPopup' } }
              isClickOutside
            >
                <div block="RainFenced" elem="Wrapper">
                    { this.renderContent() }
                </div>
            </Popup>
        );
    }
}

export default RingFencedCustomerPopupComponent;
