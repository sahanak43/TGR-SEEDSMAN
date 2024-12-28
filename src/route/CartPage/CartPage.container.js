/* eslint-disable max-lines */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import { connect } from 'react-redux';

import { CHECKOUT_ACCOUNT, CUSTOMER_WISHLIST } from 'Component/Header/Header.config';
import { CUSTOMER_ACCOUNT_OVERLAY_KEY } from 'Component/MyAccountOverlay/MyAccountOverlay.config';
import { CHECKOUT_URL } from 'Route/Checkout/Checkout.config';
import { ACCOUNT_URL } from 'Route/MyAccount/MyAccount.config';
import { CartPageContainer as SourceCartPageContainer } from 'SourceRoute/CartPage/CartPage.container';
import { updateMeta } from 'Store/Meta/Meta.action';
import { changeNavigationState } from 'Store/Navigation/Navigation.action';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { showNotification } from 'Store/Notification/Notification.action';
import { toggleOverlayByKey } from 'Store/Overlay/Overlay.action';
import { isSignedIn } from 'Util/Auth';
import { scrollToTop } from 'Util/Browser';
import {
    getCartShippingPrice,
    getCartShippingSubPrice,
    getCartSubtotal,
    getCartSubtotalSubPrice,
    getCartTotalSubPrice
} from 'Util/Cart';
import history from 'Util/History';
import { fireInsiderPageEvent } from 'Util/Insider';
import { appendWithStoreCode, getPathnameFromURL } from 'Util/Url';

import { fireCartEvent } from '../../@scandiweb/gtm/event/cart';
import { fireSdktracker } from '../../util/Insider';

export const BreadcrumbsDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Breadcrumbs/Breadcrumbs.dispatcher'
);

export const CartDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Cart/Cart.dispatcher'
);

/** @namespace Seedsman/Route/CartPage/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    totals: state.CartReducer.cartTotals,
    headerState: state.NavigationReducer[TOP_NAVIGATION_TYPE].navigationState,
    guest_checkout: state.ConfigReducer.guest_checkout,
    device: state.ConfigReducer.device,
    cartDisplayConfig: state.ConfigReducer.cartDisplayConfig,
    minimum_order_amount: state.ConfigReducer.minimum_order_amount,
    cartSubtotal: getCartSubtotal(state),
    cartSubtotalSubPrice: getCartSubtotalSubPrice(state),
    cartTotalSubPrice: getCartTotalSubPrice(state),
    cartShippingPrice: getCartShippingPrice(state),
    cartShippingSubPrice: getCartShippingSubPrice(state),
    isLoading: state.CartReducer.isLoading,
    handleRemoveItem: state.PopupReducer.popupPayload?.CartPagePopup?.handleRemoveItem,
    isFreeShippingActive: state.ConfigReducer.carriers_freeshipping_active,
    freeShippingAmount: state.ConfigReducer.carriers_freeshipping_free_shipping_subtotal,
    productsInWishlist: state.WishlistReducer.productsInWishlist,
    isCouponCodeValid: state.CartReducer.isCouponCodeValid
});

/** @namespace Seedsman/Route/CartPage/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    changeHeaderState: (state) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state)),
    updateBreadcrumbs: (breadcrumbs) => BreadcrumbsDispatcher.then(
        ({ default: dispatcher }) => dispatcher.update(breadcrumbs, dispatch)
    ),
    addPromoProductToCart: (options) => CartDispatcher.then(
        ({ default: dispatcher }) => dispatcher.addPromoProductToCart(dispatch, options)
    ),
    showOverlay: (overlayKey) => dispatch(toggleOverlayByKey(overlayKey)),
    setNavigationState: (stateName) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, stateName)),
    showNotification: (type, message) => dispatch(showNotification(type, message)),
    updateMeta: (meta) => dispatch(updateMeta(meta)),
    updateCrossSellProducts: (items) => CartDispatcher.then(
        ({ default: dispatcher }) => dispatcher.updateCrossSellProducts(items, dispatch)
    ),
    updateInitialCartData: () => CartDispatcher.then(
        ({ default: dispatcher }) => dispatcher.updateInitialCartData(dispatch, true)
    )
});

/** @namespace Seedsman/Route/CartPage/Container */
export class CartPageContainer extends SourceCartPageContainer {
    containerFunctions = {
        onCheckoutButtonClick: this.onCheckoutButtonClick.bind(this),
        onCartItemLoading: this.onCartItemLoading.bind(this),
        handleAddMoreFromWishlist: this.handleAddMoreFromWishlist.bind(this),
        addToCart: this.addToCart.bind(this),
        renderShoppingAction: this.renderShoppingAction.bind(this),
        handleFreebieChoice: this.handleFreebieChoice.bind(this),
        handleFreebies: this.handleFreebies.bind(this)
    };

    state = {
        isCartItemLoading: false,
        isInitialLoad: true,
        isFreebieRequired: true
    };

    componentDidMount() {
        const {
            updateMeta, updateInitialCartData,
            totals: { items = {}, quote_currency_code }
        } = this.props;

        updateMeta({ title: 'Cart' });

        this._updateBreadcrumbs();
        this._changeHeaderState();
        this._updateCrossSellProducts();
        updateInitialCartData();
        fireInsiderPageEvent('Basket');
        fireCartEvent(items, quote_currency_code);
        const url = getPathnameFromURL();
        if (url === 'CART') {
            fireInsiderPageEvent({});
        }
    }

    containerProps() {
        const {
            totals,
            totals: {
                items = []
            } = {},
            device,
            isLoading,
            handleRemoveItem,
            minimum_order_amount,
            isFreeShippingActive,
            freeShippingAmount,
            productsInWishlist,
            isCouponCodeValid
        } = this.props;

        const { isCartItemLoading, isInitialLoad, isFreebieRequired } = this.state;

        return {
            hasOutOfStockProductsInCart: this.hasOutOfStockProductsInCartItems(items),
            totals,
            isCartItemLoading,
            isInitialLoad,
            device,
            handleRemoveItem,
            minimum_order_amount,
            isLoading,
            isFreeShippingActive,
            freeShippingAmount,
            isFreebieRequired,
            productsInWishlist,
            isCouponCodeValid
        };
    }

    componentDidUpdate(prevProps) {
        const { location: { pathname: prevPathname } } = prevProps;
        const { location: { pathname: newpathname } } = this.props;

        if (prevPathname !== newpathname) {
            const url = getPathnameFromURL();
            if (url === 'CART') {
                fireInsiderPageEvent({});
            }
        }
    }

    handleFreebies() {
        const { isFreebieRequired } = this.state;

        this.setState({
            isFreebieRequired: !isFreebieRequired
        });
    }

    handleFreebieChoice() {
        const { isFreebieRequired } = this.state;

        this.setState({
            isFreebieRequired: !isFreebieRequired
        });
    }

    onCheckoutButtonClick(e) {
        const {
            history,
            showOverlay,
            showNotification,
            device,
            setNavigationState,
            totals: { items = [] } = {},
            totals
        } = this.props;

        // to prevent outside-click handler trigger
        e.nativeEvent.stopImmediatePropagation();

        const {
            grand_total, shipping_amount, tax_amount, quote_currency_code, id
        } = totals;

        const data = {
            unique_id: id,
            sale_amount: grand_total,
            tax_amount,
            shipping_amount,
            type: 'order_checkout',
            currency: quote_currency_code
        };

        fireSdktracker(data);

        if (this.hasOutOfStockProductsInCartItems(items)) {
            return;
        }

        if (!isSignedIn()) {
            showNotification('info', 'Please sign-in to complete checkout!');
            showOverlay(CUSTOMER_ACCOUNT_OVERLAY_KEY);
            setNavigationState({
                name: CHECKOUT_ACCOUNT,
                title: 'Sign in',
                onCloseClick: this.closeOverlay
            });

            return;
        }

        if (isSignedIn()) {
            history.push({
                pathname: appendWithStoreCode(CHECKOUT_URL)
            });
            scrollToTop();

            return;
        }

        // fir notification whatever device that is
        showNotification('info', 'Please sign-in to complete checkout!');

        if (device.isMobile) { // for all mobile devices, simply switch route
            history.push({ pathname: appendWithStoreCode(ACCOUNT_URL) });

            return;
        }

        // for desktop, just open customer overlay
        showOverlay(CUSTOMER_ACCOUNT_OVERLAY_KEY);
    }

    async addToCart(option) {
        const { totals: { id }, addPromoProductToCart } = this.props;

        const { quantity, sku } = option;
        const options = {
            cartId: id,
            products: [
                {
                    quantity,
                    sku
                }
            ]
        };

        await addPromoProductToCart(options);
    }

    renderShoppingAction() {
        history.push({ pathname: appendWithStoreCode('/') });
    }

    handleAddMoreFromWishlist() {
        history.push(appendWithStoreCode(CUSTOMER_WISHLIST));
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartPageContainer);
