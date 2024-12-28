/* eslint-disable eqeqeq */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-props-destruction */
/* eslint-disable consistent-return */
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
import { withRouter } from 'react-router';

import { CUSTOMER_ACCOUNT_OVERLAY_KEY } from 'Component/MyAccountOverlay/MyAccountOverlay.config';
import { DEFAULT_STATE_NAME } from 'Component/NavigationAbstract/NavigationAbstract.config';
import { SHARE_WISHLIST_POPUP_ID } from 'Component/ShareWishlistPopup/ShareWishlistPopup.config';
import { CHECKOUT_URL, SHIPPING_ADDRESS } from 'Route/Checkout/Checkout.config';
import { ACCOUNT_URL } from 'Route/MyAccount/MyAccount.config';
import { HeaderContainer as ParentHeaderContainer } from 'SourceComponent/Header/Header.container';
import { updateEditingStep } from 'Store/Checkout/Checkout.action';
import { changeNavigationState, goToPreviousNavigationState } from 'Store/Navigation/Navigation.action';
import { BOTTOM_NAVIGATION_TYPE, TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { hideActiveOverlay, toggleOverlayByKey } from 'Store/Overlay/Overlay.action';
import { showPopup } from 'Store/Popup/Popup.action';
import { isSignedIn } from 'Util/Auth';
import { scrollToTop } from 'Util/Browser';
import history from 'Util/History';
import { appendWithStoreCode, getPathnameFromURL } from 'Util/Url';

import { importScript } from '../../util/Script';
import { SDK_TRACKER_URL } from '../AddScriptLinks/AddScriptLinks.config';
import Header from './Header.component';
import {
    CART, CART_OVERLAY, CHECKOUT_ACCOUNT, CUSTOMER_SUB_ACCOUNT
} from './Header.config';
/** @namespace Seedsman/Component/Header/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    navigationState: state.NavigationReducer[TOP_NAVIGATION_TYPE].navigationState,
    cartTotals: state.CartReducer.cartTotals,
    totals: state.CartReducer.cartTotals,
    compareTotals: state.ProductCompareReducer.count,
    Loading: state.MyAccountReducer.isLoading,
    header_logo_src: state.ConfigReducer.header_logo_src,
    isOffline: state.OfflineReducer.isOffline,
    logo_alt: state.ConfigReducer.logo_alt,
    logo_height: state.ConfigReducer.logo_height,
    logo_width: state.ConfigReducer.logo_width,
    isLoading: state.ConfigReducer.isLoading,
    device: state.ConfigReducer.device,
    activeOverlay: state.OverlayReducer.activeOverlay,
    isWishlistLoading: state.WishlistReducer.isLoading,
    productsInWishlist: state.WishlistReducer.productsInWishlist,
    BottomNavigationState: state.NavigationReducer[BOTTOM_NAVIGATION_TYPE].navigationState,
    currencyData: state.ConfigReducer.currencyData,
    metaTagRobots: state.ConfigReducer.seo_robots

});

/** @namespace Seedsman/Component/Header/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    showOverlay: (overlayKey) => dispatch(toggleOverlayByKey(overlayKey)),
    hideActiveOverlay: () => dispatch(hideActiveOverlay()),
    setNavigationState: (stateName) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, stateName)),
    showPopup: (payload) => dispatch(showPopup(SHARE_WISHLIST_POPUP_ID, payload)),
    goToPreviousNavigationState: () => dispatch(goToPreviousNavigationState(TOP_NAVIGATION_TYPE)),
    updateEditingStep: (step) => dispatch(updateEditingStep(step))
});

export const DEFAULT_HEADER_STATE = {
    name: DEFAULT_STATE_NAME,
    isHiddenOnMobile: false
};

/** @namespace Seedsman/Component/Header/Container */
export class HeaderContainer extends ParentHeaderContainer {
    containerFunctions = {
        onBackButtonClick: this.onBackButtonClick.bind(this),
        onCloseButtonClick: this.onCloseButtonClick.bind(this),
        onSearchBarFocus: this.onSearchBarFocus.bind(this),
        onClearSearchButtonClick: this.onClearSearchButtonClick.bind(this),
        onMyAccountButtonClick: this.onMyAccountButtonClick.bind(this),
        onSearchBarChange: this.onSearchBarChange.bind(this),
        onEditButtonClick: this.onEditButtonClick.bind(this),
        onMinicartButtonClick: this.onMinicartButtonClick.bind(this),
        onOkButtonClick: this.onOkButtonClick.bind(this),
        onCancelButtonClick: this.onCancelButtonClick.bind(this),
        onSearchOutsideClick: this.onSearchOutsideClick.bind(this),
        onMyAccountOutsideClick: this.onMyAccountOutsideClick.bind(this),
        onMinicartOutsideClick: this.onMinicartOutsideClick.bind(this),
        onSignIn: this.onSignIn.bind(this),
        shareWishlist: this.shareWishlist.bind(this),
        hideActiveOverlay: this.props.hideActiveOverlay,
        onMenuCloseClick: this.onMenuCloseClick.bind(this)
    };

    __construct(props) {
        super.__construct(props);

        this.state = {
            prevPathname: '',
            searchCriteria: '',
            isClearEnabled: this.getIsClearEnabled(),
            showMyAccountLogin: false,
            menuOverlay: false
        };
    }

    componentDidMount() {
        this.handleHeaderVisibility();
        super.componentDidMount();
        importScript(SDK_TRACKER_URL, 'sdkScript');
        this.updateMetaTagForRobots();
    }

    containerProps() {
        const {
            activeOverlay,
            navigationState,
            cartTotals,
            compareTotals,
            Loading,
            header_logo_src,
            logo_alt,
            logo_height,
            logo_width,
            isLoading,
            device,
            isWishlistLoading,
            productsInWishlist,
            currencyData,
            updateEditingStep,
            metaTagRobots
        } = this.props;

        const {
            isClearEnabled,
            searchCriteria,
            showMyAccountLogin,
            shouldRenderCartOverlay
        } = this.state;

        const {
            location: {
                pathname
            }
        } = history;

        const isCheckout = pathname.includes(CHECKOUT_URL);

        return {
            activeOverlay,
            navigationState,
            cartTotals,
            compareTotals,
            Loading,
            header_logo_src,
            logo_alt,
            logo_height,
            logo_width,
            isLoading,
            isClearEnabled,
            searchCriteria,
            isCheckout,
            showMyAccountLogin,
            device,
            isWishlistLoading,
            productsInWishlist,
            shouldRenderCartOverlay,
            firstname: this.getUserName(),
            currencyData,
            updateEditingStep,
            metaTagRobots
        };
    }

    componentDidUpdate(prevProps) {
        const { location: { pathname } } = history;
        const { location: { pathname: prevPathname } } = prevProps;
        const { location: { pathname: newpathname } } = this.props;

        if (prevPathname !== newpathname) {
            this.updateMetaTagForRobots();
        }

        this.hideSearchOnStateChange(prevProps);
        this.handleHeaderVisibility();
        this.navigateToShippingStep(prevProps);
        const { updateEditingStep } = this.props;

        const isCheckout = pathname.includes(CHECKOUT_URL);
        const isPrevCheckout = prevPathname.includes(CHECKOUT_URL);

        if (isPrevCheckout && !isCheckout) {
            updateEditingStep(SHIPPING_ADDRESS);
        }
    }

    onMinicartButtonClick() {
        const {
            showOverlay,
            navigationState: { name },
            device
        } = this.props;

        const { pathname } = location;

        if (device.isMobile && pathname !== appendWithStoreCode(`/${ CART }`)) {
            scrollToTop();
            history.push(appendWithStoreCode(`/${ CART }`));
            return;
        }

        if (device.isMobile && pathname === appendWithStoreCode(`/${ CART }`)) {
            scrollToTop();
            return;
        }

        if (name === CART_OVERLAY) {
            return;
        }

        this.setState({ shouldRenderCartOverlay: true });

        showOverlay(CART_OVERLAY);
    }

    onMinicartOutsideClick() {
        const {
            goToPreviousNavigationState,
            hideActiveOverlay,
            navigationState: { name },
            device
        } = this.props;

        if (device.isMobile || name !== CART_OVERLAY || name === CART) {
            this.setState({ shouldRenderCartOverlay: false });
        }

        if (name === CART) {
            goToPreviousNavigationState();
            hideActiveOverlay();
        }
    }

    onSearchOutsideClick() {
        const {
            goToPreviousNavigationState,
            navigationState: { name },
            device
        } = this.props;

        if (!device.isMobile && name === 'search') {
            this.hideSearchOverlay();
            goToPreviousNavigationState();
        }
    }

    onSearchBarFocus() {
        const {
            setNavigationState,
            goToPreviousNavigationState,
            showOverlay,
            navigationState: { name },
            device
        } = this.props;

        if (
            (device.isMobile && name === 'search')
            // || (device.isMobile && name !== MENU)
        ) {
            return;
        }

        showOverlay('search');

        setNavigationState({
            name: 'search',
            onBackClick: () => {
                showOverlay('menu');
                goToPreviousNavigationState();
            }
        });
    }

    onMenuCloseClick() {
        this.setState({
            menuOverlay: !this.state.menuOverlay
        });
    }

    onMyAccountButtonClick() {
        const {
            showOverlay,
            setNavigationState
        } = this.props;

        if (isSignedIn()) {
            history.push({ pathname: appendWithStoreCode(ACCOUNT_URL) });

            return;
        }

        this.setState({ showMyAccountLogin: true }, () => {
            showOverlay(CUSTOMER_ACCOUNT_OVERLAY_KEY);
            setNavigationState({
                name: CHECKOUT_ACCOUNT,
                title: 'Sign in',
                onCloseClick: this.closeOverlay
            });
        });
    }

    onMyAccountOutsideClick() {
        const {
            goToPreviousNavigationState,
            hideActiveOverlay,
            navigationState: { name },
            device
        } = this.props;

        if (device.isMobile || ![CUSTOMER_SUB_ACCOUNT].includes(name)) {
            return;
        }

        if (name === CUSTOMER_SUB_ACCOUNT) {
            return goToPreviousNavigationState();
        }

        this.goToDefaultHeaderState();
        hideActiveOverlay();
    }

    updateMetaTagForRobots() {
        const { metaTagRobots = [], location: { pathname } } = this.props;
        const url = getPathnameFromURL();
        const storedMetaTags = JSON.parse(localStorage.getItem('storedMetaTags')) || {};

        // eslint-disable-next-line fp/no-let
        let metaTagContent = storedMetaTags[pathname] || 'INDEX,FOLLOW';

        const matchedRoute = metaTagRobots.find(({ route_path }) => route_path == url);
        if (matchedRoute) {
            const { robots } = matchedRoute;
            metaTagContent = robots;
            storedMetaTags[pathname] = robots;
            localStorage.setItem('storedMetaTags', JSON.stringify(storedMetaTags));
        } else if (!storedMetaTags[pathname]) {
            storedMetaTags[pathname] = 'INDEX,FOLLOW';
            localStorage.setItem('storedMetaTags', JSON.stringify(storedMetaTags));
        }

        const metaTag = document.querySelector('meta[name="robots"]');
        if (metaTag) {
            metaTag.setAttribute('content', metaTagContent);
        }
    }

    render() {
        return (
            <Header
              { ...this.state }
              { ...this.containerProps() }
              { ...this.containerFunctions }
            />
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HeaderContainer));
