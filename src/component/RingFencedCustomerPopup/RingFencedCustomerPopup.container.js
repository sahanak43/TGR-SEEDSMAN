import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { goToPreviousNavigationState } from 'SourceStore/Navigation/Navigation.action';
import { showNotification } from 'SourceStore/Notification/Notification.action';
import { hideActiveOverlay } from 'SourceStore/Overlay/Overlay.action';
import { showPopup } from 'SourceStore/Popup/Popup.action';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { Cookies } from 'Util/Cookies';

import { RING_FENCED_CUSTOMER } from './RingFencedCustomer.config';
import RingFencedCustomerPopup from './RingFencedCustomerPopup.component';

/** @namespace Seedsman/Component/RingFencedCustomerPopup/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    headerLogoSrc: state.ConfigReducer.header_logo_src,
    logoAlt: state.ConfigReducer.logo_alt,
    logoHeight: state.ConfigReducer.logo_height,
    logoWidth: state.ConfigReducer.logo_width
});

/** @namespace Seedsman/Component/RingFencedCustomerPopup/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    showPopup: () => dispatch(showPopup(RING_FENCED_CUSTOMER)),
    showNotification: (type, message) => dispatch(showNotification(type, message)),
    hideActiveOverlay: () => dispatch(hideActiveOverlay()),
    goToPreviousHeaderState: () => dispatch(goToPreviousNavigationState(TOP_NAVIGATION_TYPE))
});

/** @namespace Seedsman/Component/RingFencedCustomerPopup/Container */
export class RingFencedCustomerPopupContainer extends PureComponent {
    static propTypes = {
        showPopup: PropTypes.func.isRequired,
        code: PropTypes.string.isRequired,
        headerLogoSrc: PropTypes.string.isRequired,
        logoAlt: PropTypes.string.isRequired,
        showNotification: PropTypes.func.isRequired,
        hideActiveOverlay: PropTypes.func.isRequired,
        goToPreviousHeaderState: PropTypes.func.isRequired
    };

    containerFunctions = {
        handleContinueBtn: this.handleContinueBtn.bind(this),
        handleLogin: this.handleLogin.bind(this)
    };

    componentDidMount() {
        const { showPopup } = this.props;
        const firstTimeVisit = Cookies.get('isFirstTimeCustomer');
        const alreadyVisited = Cookies.get('alreadyVisitedCustomer');

        if (firstTimeVisit && alreadyVisited && firstTimeVisit?.value === 'true' && alreadyVisited?.value === 'false') {
            showPopup();
        }
    }

    handleLogin() {
        const { hideActiveOverlay, goToPreviousHeaderState } = this.props;

        Cookies.set('isFirstTimeCustomer', false);
        Cookies.set('alreadyVisitedCustomer', true);

        hideActiveOverlay();
        goToPreviousHeaderState(TOP_NAVIGATION_TYPE);
        window.location.reload();
    }

    handleContinueBtn() {
        const { hideActiveOverlay, goToPreviousHeaderState } = this.props;

        Cookies.set('alreadyVisitedCustomer', true);

        hideActiveOverlay();
        goToPreviousHeaderState(TOP_NAVIGATION_TYPE);
    }

    containerProps() {
        const { headerLogoSrc, logoAlt } = this.props;

        return {
            headerLogoSrc,
            logoAlt
        };
    }

    render() {
        return (
            <RingFencedCustomerPopup
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RingFencedCustomerPopupContainer);
