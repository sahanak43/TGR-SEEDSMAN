import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { goToPreviousNavigationState } from 'Store/Navigation/Navigation.action';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { hideActiveOverlay } from 'Store/Overlay/Overlay.action';

import CartPagePopup from './CartPagePopup.component';

/** @namespace Seedsman/Component/CartPagePopup/Container/mapStateToProps */
export const mapStateToProps = () => ({
});

/** @namespace Seedsman/Component/CartPagePopup/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    hideActiveOverlay: () => dispatch(hideActiveOverlay()),
    goToPreviousNavigationState: (state) => dispatch(goToPreviousNavigationState(TOP_NAVIGATION_TYPE, state))
});

/** @namespace Seedsman/Component/CartPagePopup/Container */
export class CartPagePopupContainer extends PureComponent {
    static propTypes = {
        handleRemoveItem: PropTypes.func.isRequired,
        hideActiveOverlay: PropTypes.func.isRequired,
        goToPreviousNavigationState: PropTypes.func.isRequired
    };

    containerFunctions = {
        hidePopUp: this.hidePopUp.bind(this)
    };

    containerProps() {
        const { handleRemoveItem } = this.props;

        return { handleRemoveItem };
    }

    hidePopUp() {
        const { hideActiveOverlay, goToPreviousNavigationState } = this.props;
        hideActiveOverlay();
        goToPreviousNavigationState();
    }

    render() {
        return (
            <CartPagePopup
              { ...this.containerProps() }
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartPagePopupContainer);
