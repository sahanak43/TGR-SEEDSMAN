/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-props-destruction */
/* eslint-disable max-len */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable max-lines */
import { lazy, Suspense } from 'react';

import AffiliateConfig from 'Component/Affiliate/Affiliate.config';
import BablicDropdown from 'Component/BablicDropdown';
import CartIcon from 'Component/CartIcon';
import ClickOutside from 'Component/ClickOutside';
import CloseIcon from 'Component/CloseIcon';
import CmsBlock from 'Component/CmsBlock';
import CurrencySwitcher from 'Component/CurrencySwitcher';
// import LanguageSwitcher from 'Component/LanguageSwitcher';
import Link from 'Component/Link';
import Menu from 'Component/Menu';
import { DEFAULT_STATE_NAME } from 'Component/NavigationAbstract/NavigationAbstract.config';
import OfflineNotice from 'Component/OfflineNotice';
import SearchField from 'Component/SearchField';
import UserIcon from 'Component/UserIcon';
import { Header as SourceHeader } from 'SourceComponent/Header/Header.component';
import { isSignedIn } from 'Util/Auth';
import { isCrawler, isSSR } from 'Util/Browser';
import { Cookies } from 'Util/Cookies';
import history from 'Util/History';

import {
    CART,
    CART_EDITING,
    CART_OVERLAY,
    CATEGORY,
    CHECKOUT,
    CHECKOUT_ACCOUNT,
    CHECKOUT_SUCCESS,
    CMS_PAGE,
    CONTACT_US,
    CUSTOMER_ACCOUNT,
    CUSTOMER_ACCOUNT_PAGE,
    CUSTOMER_ORDER,
    CUSTOMER_SUB_ACCOUNT,
    CUSTOMER_WISHLIST,
    FILTER,
    HEADER_MOBILE_TOPBAR,
    HEADER_MOBILE_YELLOW_TOPBAR,
    HEADER_TOPBAR,
    MENU,
    MENU_SUBCATEGORY,
    NO_MATCH,
    PDP,
    POPUP,
    PRODUCT_COMPARE,
    SEARCH
} from './Header.config';

import './Header.override.style.scss';

// eslint-disable-next-line @scandipwa/scandipwa-guidelines/create-config-files
export const CHECKOUT_URL = '/checkout';
export const MyAccountOverlay = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "overlay" */ 'Component/MyAccountOverlay'));
export const CartOverlay = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "overlay" */ 'Component/CartOverlay'));

/** @namespace Seedsman/Component/Header/Component */
export class HeaderComponent extends SourceHeader {
    renderMap = {
        cancel: this.renderCancelButton.bind(this),
        back: this.renderBackButton.bind(this),
        // close: this.renderCloseButton.bind(this),
        // mobileMenu: this.renderMenuButton.bind(this),
        // title: this.renderTitle.bind(this),
        logo: this.renderLogo.bind(this),
        search: this.renderSearchField.bind(this),
        renderDesktopIcons: this.renderDesktopIcons.bind(this),
        // share: this.renderShareWishListButton.bind(this),
        ok: this.renderOkButton.bind(this)
    };

    static defaultProps = {
        logo_alt: 'Seedsman',
        logo_height: 25,
        logo_width: 200,
        showMyAccountLogin: false,
        header_logo_src: '',
        isLoading: true
    };

    stateMap = {
        [DEFAULT_STATE_NAME]: {
            title: true,
            logo: true
        },
        [NO_MATCH]: {
            title: true
        },
        [POPUP]: {
            title: true,
            close: true
        },
        [PDP]: {
            back: true,
            title: true
        },
        [CATEGORY]: {
            back: true,
            title: true
        },
        [CUSTOMER_ACCOUNT]: {
            title: true
        },
        [CUSTOMER_SUB_ACCOUNT]: {
            title: true,
            back: true
        },
        [CUSTOMER_ACCOUNT_PAGE]: {
            title: true
        },
        [CUSTOMER_WISHLIST]: {
            share: true,
            title: true
        },
        [CUSTOMER_ORDER]: {
            title: true,
            back: true
        },
        [MENU]: {
            search: false,
            account: false
        },
        [MENU_SUBCATEGORY]: {
            back: true,
            title: true,
            search: true
        },
        [SEARCH]: {
            search: true
        },
        [CART]: {
            title: true
        },
        [CART_OVERLAY]: {
            title: true
        },
        [CART_EDITING]: {
            ok: true,
            title: true,
            cancel: true
        },
        [FILTER]: {
            close: true,
            title: true
        },
        [CHECKOUT]: {
            back: true,
            title: true,
            account: true
        },
        [CHECKOUT_SUCCESS]: {
            title: true,
            account: true
        },
        [CHECKOUT_ACCOUNT]: {
            title: true,
            close: true
        },
        [CMS_PAGE]: {
            back: true,
            title: true
        },
        [CONTACT_US]: {
            title: true,
            back: true
        },
        [PRODUCT_COMPARE]: {
            title: true,
            back: true
        }
    };

    componentDidMount() {
        document.addEventListener('scroll', this.resizeHeaderOnScroll);
    }

    /**
    * Add the class name in Header div when screen scroll
    */
    resizeHeaderOnScroll() {
        const {
            location: {
                pathname
            }
        } = history;

        const isCheckout = pathname.includes(CHECKOUT_URL);
        const scrollTop = window.scrollY;
        const element = document.getElementById('Header-Wrapper');
        const header1 = document.querySelector('Header').firstChild;
        const totalHeaderHeight = (header1 ? header1.offsetHeight : 0);

        if (scrollTop > totalHeaderHeight && !isCheckout) {
            element.style.position = 'sticky';
            element.style.top = `-${header1.offsetHeight}px`;
            element.style.zIndex = 100;
        } else if (isCheckout) {
            element.style.position = 'sticky';
            element.style.top = '0';
            element.style.zIndex = 100;
        } else {
            element.style.position = 'relative';
            element.style.top = 'unset';
            element.style.zIndex = 'unset';
        }
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.resizeHeaderOnScroll, false);
    }

    renderTopMenu() {
        const { isCheckout, device: { isMobile } } = this.props;
        const { contact_us_content: { headertopbar = HEADER_TOPBAR } = {} } = window.contentConfiguration;

        if (!headertopbar || (isCheckout && !isMobile)) {
            return null;
        }

        return (
            <div block="Header" elem="TopMenu">
                <CmsBlock key={ headertopbar } identifier={ headertopbar } />
            </div>
        );
    }

    renderDesktopTopMenu() {
        const {
            device: { isMobile },
            menuOverlay
        } = this.props;

        if (isMobile) {
            const { contact_us_content: { headertopbar = HEADER_MOBILE_TOPBAR } = {} } = window.contentConfiguration;
            return (
                <div block="Header" elem={ menuOverlay ? 'MobileTopMenu' : 'TopMenu' }>
                    <CmsBlock key={ headertopbar } identifier={ HEADER_MOBILE_TOPBAR } />
                </div>
            );
        }

        return (this.renderTopMenu());
    }

    renderMobileTopMenu() {
        const {
            device: { isMobile },
            onMenuCloseClick
        } = this.props;

        const { contact_us_content: { headertopbar = HEADER_TOPBAR } = {} } = window.contentConfiguration;

        if (!headertopbar && !isMobile) {
            return null;
        }

        document.querySelectorAll('.Megamenu-links')
            .forEach((input) => input.addEventListener('click', onMenuCloseClick));

        return (this.renderTopMenu());
    }

    renderSearchField(isVisible = false) {
        const {
            searchCriteria,
            onSearchOutsideClick,
            onSearchBarFocus,
            onSearchBarChange,
            onClearSearchButtonClick,
            navigationState: { name },
            isCheckout,
            hideActiveOverlay,
            goToPreviousNavigationState
        } = this.props;

        if (isCheckout) {
            return null;
        }

        return (
            <SearchField
              key="search"
              searchCriteria={ searchCriteria }
              onSearchOutsideClick={ onSearchOutsideClick }
              onSearchBarFocus={ onSearchBarFocus }
              onSearchBarChange={ onSearchBarChange }
              onClearSearchButtonClick={ onClearSearchButtonClick }
              isVisible={ isVisible }
                // eslint-disable-next-line no-undef
              isActive={ name === SEARCH }
              hideActiveOverlay={ hideActiveOverlay }
              goToPreviousNavigationState={ goToPreviousNavigationState }
            />
        );
    }

    renderMenuButton(isVisible = false) {
        const { device: { isMobile } = {}, isCheckout, onMenuCloseClick } = this.props;

        if (!isMobile || isCheckout) {
            return null;
        }

        return (
            <div block="Header" elem="MenuButtonSideBar">
                <button
                  key="menu"
                  block="Header"
                  elem="MenuButton"
                  aria-label="Go to menu and search"
                  onClick={ onMenuCloseClick }
                  mods={ { isVisible } }
                >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20.561"
                      height="21.5"
                      viewBox="0 0 20.561 21.5"
                    >
                        <g
                          id="Group_58094"
                          data-name="Group 58094"
                          transform="translate(17416.869 20568.439)"
                        >
                            <g
                              id="Group_58093"
                              data-name="Group 58093"
                              transform="translate(-17413.771 -20564.289)"
                            >
                                <path
                                  id="Path_75235"
                                  data-name="Path 75235"
                                  d="M-17127.131-20446.289h20.561"
                                  transform="translate(17124.033 20442.889)"
                                  fill="none"
                                  stroke="#000"
                                  strokeWidth="1.5"
                                />
                                <path
                                  id="Path_75236"
                                  data-name="Path 75236"
                                  d="M-17127.131-20446.289h20.561"
                                  transform="translate(17124.033 20452.889)"
                                  fill="none"
                                  stroke="#000"
                                  strokeWidth="1.5"
                                />
                                <path
                                  id="Path_75237"
                                  data-name="Path 75237"
                                  d="M-17127.131-20446.289h20.561"
                                  transform="translate(17124.033 20462.889)"
                                  fill="none"
                                  stroke="#000"
                                  strokeWidth="1.5"
                                />
                            </g>
                        </g>
                    </svg>
                </button>
            </div>
        );
    }

    renderAccountOverlay() {
        const {
            isCheckout,
            onSignIn
        } = this.props;

        return (
            <Suspense fallback={ this.renderAccountOverlayFallback() }>
                <MyAccountOverlay
                  onSignIn={ onSignIn }
                  isCheckout={ isCheckout }
                />
            </Suspense>
        );
    }

    renderSwitch() {
        return (
            <div block="Header" elem="Switcher">
                   { this.renderCurrencySwitcher() }
                   { /* { this.renderlanguageSwitcher() } */ }
            </div>
        );
    }

    renderMobileIcons(status) {
        if (status === true) {
            return (
                <div block="Header" elem="MenuIcons">
                    { this.renderTrackOrder() }
                    { /* { this.renderSeedFinder() } */ }
                    { this.renderCurrencySwitcher() }
                    { this.renderlanguageSwitcher() }
                    { this.renderStoreSwitcher() }
                </div>
            );
        }

        return (
            <div block="Header" elem="IconsWrapper">
                { this.renderSearchField(true) }
                { this.renderAccount() }
                { this.renderMinicart() }
                { this.renderMenuButton() }
            </div>
        );
    }

    renderMinicart(isVisible = false) {
        const {
            onMinicartOutsideClick,
            isCheckout,
            navigationState: { name }
        } = this.props;

        if (isCheckout || name === MENU) {
            return null;
        }

        return (
            <ClickOutside onClick={ onMinicartOutsideClick } key="minicart">
                <div
                  block="Header"
                  elem="Button"
                  mods={ { isVisible, type: 'minicart' } }
                >
                    { this.renderMinicartButton() }
                    { this.renderMinicartOverlay() }
                </div>
            </ClickOutside>
        );
    }

    renderMinicartOverlay() {
        const { shouldRenderCartOverlay, onMinicartOutsideClick } = this.props;

        if (!shouldRenderCartOverlay) {
            return null;
        }

        return (
            <Suspense fallback={ this.renderMinicartOverlayFallback() }>
                <CartOverlay onMinicartOutsideClick={ onMinicartOutsideClick } />
            </Suspense>
        );
    }

    renderMinicartButton() {
        const { onMinicartButtonClick } = this.props;

        return (
            <button
              block="Header"
              elem="MinicartButtonWrapper"
              tabIndex="0"
              onClick={ onMinicartButtonClick }
              aria-label="Cart"
            >
                <CartIcon />
                { this.renderMinicartItemsQty() }
            </button>
        );
    }

    renderAccount(isVisible = false) {
        const {
            onMyAccountOutsideClick,
            isCheckout,
            navigationState: { name }
        } = this.props;

        // on mobile hide button if not in checkout
        // if (isMobile && !isCheckout) {
        //     return null;
        // }

        if (name === MENU) {
            return null;
        }

        if (isCheckout && isSignedIn()) {
            return null;
        }

        return (
            <div key="account" block="Header" elem="MyAccountContainer">
                <ClickOutside onClick={ onMyAccountOutsideClick }>
                    <div
                      aria-label="My account"
                      block="Header"
                      elem="MyAccount"
                    >
                        { this.renderAccountButton(isVisible) }
                        { this.renderAccountOverlay() }
                    </div>
                </ClickOutside>
            </div>
        );
    }

    renderMinicartItemsQty() {
        const {
            cartTotals: { items_qty }
        } = this.props;
        // After getting items from backened in add to cart remove below comments
        // if (!items_qty) {
        //     return null;
        // }

        return (
            <span
              aria-label="Items in cart"
              block="Header"
              elem="MinicartItemCount"
            >
                { items_qty }
            </span>
        );
    }

    renderCurrencySwitcher() {
        const {
            device: { isMobile },
            currencyData: {
                available_currencies_data: availableCurrencies
            } = {}
        } = this.props;

        if (availableCurrencies && availableCurrencies.length > 1) {
            return (
            <div block="MenuIcon Header" elem="CurrencySwitcher">
                { isMobile }
                <CurrencySwitcher />
            </div>
            );
        }

        return null;
    }

    renderStoreSwitcher() {
        return null;
    }

    renderlanguageSwitcher() {
        const {
            device: { isMobile }
        } = this.props;

        return (
            <div block="MenuIcon Header" elem="LanguageSwitcher">
                { isMobile }
                { <BablicDropdown /> }
            </div>
        );
    }

    renderSeedFinder() {
        const { onMenuCloseClick } = this.props;
        return (
            <div block="MenuIcon Header" elem="SeedFinder" onClick={ onMenuCloseClick }>
                <Link
                  to="/seed-finder"
                  block="Header"
                  elem="SeedFinderTitle"
                >
                    Seed Finder
                </Link>
            </div>
        );
    }

    renderTrackOrder() {
        const { onMenuCloseClick } = this.props;
        return (
            <div block="MenuIcon Header" elem="TrackOrder" onClick={ onMenuCloseClick }>
                <Link
                  to="/sales/order/history/"
                  block="Header"
                  elem="TrackOrderTitle"
                >
                    Track Order
                </Link>
            </div>
        );
    }

    renderYellowTopBarBlock() {
        const {
            device: { isMobile }
            // menuOverlay
        } = this.props;

        if (isMobile) {
            const { contact_us_content: { headertopbar = HEADER_MOBILE_YELLOW_TOPBAR } = {} } = window.contentConfiguration;
            return (
                <div block="Header" elem="Yellow_TopMenu">
                    <CmsBlock key={ headertopbar } identifier={ HEADER_MOBILE_YELLOW_TOPBAR } />
                </div>
            );
        }

        return null;
    }

    renderDesktopIcons() {
        const {
            device: { isMobile }, isCheckout
        } = this.props;

        if (isMobile) {
            return this.renderMobileIcons();
        }

        if (isCheckout) {
            return null;
        }

        return (
            <div block="Header" elem="IconsWrapper">
                { this.renderTrackOrder() }
                { /* { this.renderSeedFinder() } */ }
                { this.renderCurrencySwitcher() }
                { this.renderlanguageSwitcher() }
                { this.renderStoreSwitcher() }
                { this.renderAccount() }
                { this.renderMinicart() }
            </div>
        );
    }

    renderWelcomeMessage() {
        const { firstname } = this.props;

        if (!isSignedIn() || !firstname) {
            return (
                <div
                  block="Header"
                  elem="Welcome"
                >
                    Account
                </div>
            );
        }

        return (
            <div
              block="Header"
              elem="Welcome"
            >
                Account
            </div>
        );
    }

    renderAccountButton() {
        const {
            onMyAccountButtonClick,
            device: { isMobile }
        } = this.props;

        return (
            <button
              block="Header"
              elem="MyAccountWrapper"
              tabIndex="0"
              onClick={ onMyAccountButtonClick }
              aria-label="Open my account"
              id="myAccount"
            >
                <UserIcon isMobile={ isMobile } />
                { this.renderWelcomeMessage() }
            </button>
        );
    }

    renderLogo(isVisible = false) {
        const { isLoading } = this.props;

        if (isLoading) {
            return null;
        }

        return (
            <Link
              to="/"
              aria-label="Go to homepage by clicking on Seedsman logo"
              aria-hidden={ !isVisible }
              tabIndex={ isVisible ? 0 : -1 }
              block="Header"
              elem="LogoWrapper"
              mods={ { isVisible } }
              key="logo"
            >
                { this.renderLogoImage() }
            </Link>
        );
    }

    renderNavbarBorder() {
        const {
            device: { isMobile }
        } = this.props;

        if (isMobile) {
            return null;
        }

        return <div block="Header" elem="NavbarBorder" />;
    }

    renderManiMenu() {
        const {
            menuOverlay,
            device: { isMobile },
            onMenuCloseClick
        } = this.props;

        if (!isMobile) {
            return null;
        }

        const isFirstTimeCustomer = Cookies.get('isFirstTimeCustomer');

        return (
            <div
              block="MobileMenu"
              className="MobileMenu"
              elem={ menuOverlay && isMobile ? 'visible' : 'hide' }
            >
               <div>
                <div block="MobileMenu" elem="logo-section">
                        <div block="logo" onClick={ onMenuCloseClick }>{ this.renderLogo() }</div>
                        <button
                          key="menu"
                          block="Header"
                          elem="MenuButton"
                          onClick={ onMenuCloseClick }
                        >
                            <CloseIcon />
                        </button>
                </div>
                { this.renderSwitch() }
                { isFirstTimeCustomer && isFirstTimeCustomer?.value === 'true'
                    ? null : <Menu { ...this.props } onMenuCloseClick={ onMenuCloseClick } /> }
                { this.renderYellowTopBarBlock() }
                { this.renderMobileTopMenu() }
               </div>

            </div>
        );
    }

    renderMenu() {
        const { device: { isMobile }, isCheckout } = this.props;
        const customerVisited = Cookies.get('isFirstTimeCustomer');

        if (isMobile || (customerVisited && customerVisited.value === 'true')) {
            return null;
        }

        return <Menu isCheckout={ isCheckout } />;
    }

    removeBlogGtmSCriptScript() {
        const existingScript = document.getElementById('GtmBlogContainerBodyScript');
        if (existingScript) {
            existingScript.parentNode.removeChild(existingScript);
        }
    }

    renderContinueShoppingBtn() {
        const { location: { pathname } } = history;
        const { device: { isMobile } } = this.props;

        const isSuccessPage = pathname.includes('checkout/success');

        if (!isSuccessPage || isMobile) {
            return null;
        }

        return (
            <div block="Header" elem="ButtonWrapper">
                <Link
                  mix={ { block: 'Header', elem: 'ContinueButton' } }
                  to="/"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    render() {
        const { stateMap } = this;
        const {
            navigationState: { name, isHiddenOnMobile = false },
            isCheckout,
            device: { isMobile }
        } = this.props;

        if (!isMobile) {
            // hide edit button on desktop
            stateMap[CUSTOMER_WISHLIST].edit = false;
            stateMap[CUSTOMER_WISHLIST].share = false;
            stateMap[CART_OVERLAY].edit = false;
        }

        return (
            // eslint-disable-next-line react/react-in-jsx-scope
            <section
              id="Header-Wrapper"
              block="Header"
              elem="Wrapper"
              mods={ { isPrerendered: isSSR() || isCrawler() } }
            >
                <header
                  block="Header"
                  mods={ { name, isHiddenOnMobile, isCheckout } }
                  mix={ { block: 'FixedElement', elem: 'Top' } }
                  ref={ this.logoRef }
                >
                <AffiliateConfig />
                    { this.renderDesktopTopMenu() }
                    <div className="HeaderWrapper">
                        <nav block="Header" elem="Nav">
                            { this.removeBlogGtmSCriptScript() }
                            { this.renderNavigationState() }
                            { this.renderContinueShoppingBtn() }
                        </nav>
                        { this.renderManiMenu() }
                        { this.renderNavbarBorder() }
                    { this.renderMenu() }
                    </div>
                    <OfflineNotice />
                </header>
            </section>
            // eslint-disable-next-line max-lines
        );
    }
}

export default HeaderComponent;
