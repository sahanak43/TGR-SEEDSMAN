/* eslint-disable max-len */
import { connect } from 'react-redux';

import { CartOverlayContainer as SourceCartOverlayContainer, mapStateToProps as sourceMapStateToProps } from 'SourceComponent/CartOverlay/CartOverlay.container';
import { changeNavigationState } from 'Store/Navigation/Navigation.action';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { showNotification } from 'Store/Notification/Notification.action';
import { hideActiveOverlay, toggleOverlayByKey } from 'Store/Overlay/Overlay.action';
import { scrollToTop } from 'Util/Browser';
import { getCartSubtotal } from 'Util/Cart';

export const CartDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Cart/Cart.dispatcher'
);

/** @namespace Seedsman/Component/CartOverlay/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    ...sourceMapStateToProps(state),
    isCouponCodeValid: state.CartReducer.isCouponCodeValid,
    cartSubtotal: getCartSubtotal(state),
    displayTax: state.ConfigReducer.display_tax_in_checkout
});

/** @namespace Seedsman/Component/CartOverlay/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    setNavigationState: (stateName) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, stateName)),
    changeHeaderState: (state) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state)),
    updateTotals: (options) => CartDispatcher.then(
        ({ default: dispatcher }) => dispatcher.updateTotals(dispatch, options)
    ),
    showOverlay: (overlayKey) => dispatch(toggleOverlayByKey(overlayKey)),
    showNotification: (type, message) => dispatch(showNotification(type, message)),
    hideActiveOverlay: () => dispatch(hideActiveOverlay())
});

/** @namespace Seedsman/Component/CartOverlay/Container */
export class CartOverlayContainer extends SourceCartOverlayContainer {
    static propTypes = {
        ...super.propTypes
    };

    containerFunctions = {
        changeHeaderState: this.changeHeaderState.bind(this),
        handleCheckoutClick: this.handleCheckoutClick.bind(this),
        onCartItemLoading: this.onCartItemLoading.bind(this),
        onCartOverlayButtonClick: this.onCartOverlayButtonClick.bind(this)
    };

    onCartOverlayButtonClick() {
        const { hideActiveOverlay } = this.props;
        scrollToTop();
        hideActiveOverlay();
    }

    containerProps() {
        const {
            totals,
            totals: {
                items = []
            } = {},
            showOverlay,
            currencyCode,
            activeOverlay,
            cartTotalSubPrice,
            cartDisplaySettings,
            isMobile,
            cartShippingPrice,
            cartShippingSubPrice,
            hideActiveOverlay,
            onMinicartOutsideClick, isCouponCodeValid,
            cartSubtotal,
            displayTax
        } = this.props;
        const { isEditing, isCartItemLoading } = this.state;

        return {
            totals,
            showOverlay,
            currencyCode,
            activeOverlay,
            cartTotalSubPrice,
            cartDisplaySettings,
            isEditing,
            isMobile,
            cartShippingPrice,
            cartShippingSubPrice,
            isCartItemLoading,
            hideActiveOverlay,
            onMinicartOutsideClick,
            hasOutOfStockProductsInCart: this.hasOutOfStockProductsInCartItems(items),
            isCouponCodeValid,
            cartSubtotal,
            displayTax
        };
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartOverlayContainer);
