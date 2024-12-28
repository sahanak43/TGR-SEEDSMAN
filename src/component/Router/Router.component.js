/* eslint-disable react/jsx-no-bind */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-props-destruction */
/* eslint-disable max-lines */
/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable @scandipwa/scandipwa-guidelines/no-jsx-variables */
import { lazy } from 'react';
import { Route } from 'react-router-dom';

import {
    PRINT_ALL_INVOICES,
    PRINT_ALL_REFUNDS,
    PRINT_ALL_SHIPMENT,
    PRINT_INVOICE,
    PRINT_ORDER as PRINT_ORDER_REQUEST,
    PRINT_REFUND,
    PRINT_SHIPMENT
} from 'Component/MyAccountOrderPrint/MyAccountOrderPrint.config';
import UrlRewrites from 'Route/UrlRewrites';
import {
    Breadcrumbs as SourceBreadcrumbs,
    CartPage as SourceCartPage,
    Checkout as SourceCheckout,
    CmsPage as SourceCmsPage,
    ConfirmAccountPage as SourceConfirmAccountPage,
    ContactPage as SourceContactPage,
    CookiePopup as SourceCookiePopup,
    CreateAccountPage as SourceCreateAccountPage,
    DemoNotice as SourceDemoNotice,
    Footer as SourceFooter,
    ForgotPasswordPage as SourceForgotPasswordPage,
    Header as SourceHeader,
    HomePage as SourceHomePage,
    LoginAccountPage as SourceLoginAccountPage,
    MenuPage as SourceMenuPage,
    MyAccount as SourceMyAccount,
    NavigationTabs as SourceNavigationTabs,
    NewVersionPopup as SourceNewVersionPopup,
    NotificationList as SourceNotificationList,
    OfflineNotice as SourceOfflineNotice,
    OrderPrintPage as SourceOrderPrintPage,
    PasswordChangePage as SourcePasswordChangePage,
    ProductComparePage as SourceProductComparePage,
    Router as SourceRouter,
    SearchPage as SourceSearchPage,
    SomethingWentWrong as SourceSomethingWentWrong,
    StyleGuidePage as SourceStyleGuidePage,
    WishlistShared as SourceWishlistShared
} from 'SourceComponent/Router/Router.component';
import {
    ADDRESS_BOOK, MY_DOWNLOADABLE, MY_ORDERS,
    MY_TICKETS, MY_WISHLIST, NEWSLETTER_SUBSCRIPTION
} from 'Type/Account.type';

import {
    ACCOUNT_FORGOT_PASSWORD,
    Add_SCRIPT_LINKS,
    BEFORE_ITEMS_TYPE,
    BLOG,
    BREADCRUMBS,
    CART,
    CHANGE_PASSWORD,
    CHECKOUT,
    CHECKOUT_FAILURE,
    CHECKOUT_SUCCESS,
    CMS_PAGE,
    COMPARE,
    CONFIRM_ACCOUNT,
    CONTACT_PAGE,
    CREATE_ACCOUNT,
    DEMO_NOTICE,
    HEADER,
    HOME,
    LOGIN,
    MENU,
    MY_ACCOUNT,
    MY_ACCOUNT_ADDRESS,
    MY_ACCOUNT_DOWNLOADABLE,
    MY_ACCOUNT_MY_TICKET,
    MY_ACCOUNT_MY_TICKETS,
    MY_ACCOUNT_NEW_TICKET,
    MY_ACCOUNT_NEWSLETTER,
    MY_ACCOUNT_ORDER,
    MY_ACCOUNT_ORDERS,
    MY_ACCOUNT_WISHLIST,
    NEW_VERSION_POPUP,
    NOTIFICATION_LIST,
    POST,
    POST_AFFILIATE,
    PRINT_ORDER,
    SEARCH,
    SELECT_COUNTRY_POPUP,
    SHARED_WISHLIST,
    STYLE_GUIDE,
    SWITCH_ITEMS_TYPE,
    URL_REWRITES
} from './Router.config';

// TODO: implement CartPage
export const CartPage = SourceCartPage;

// TODO: implement Checkout
export const Checkout = SourceCheckout;

// TODO: implement CmsPage
export const CmsPage = SourceCmsPage;

// TODO: implement CookiePopup
export const CookiePopup = SourceCookiePopup;

// TODO: implement DemoNotice
export const DemoNotice = SourceDemoNotice;

// TODO: implement Header
export const Header = SourceHeader;

// TODO: implement HomePage
export const HomePage = SourceHomePage;

// TODO: implement MyAccount
export const MyAccount = SourceMyAccount;

// TODO: implement PasswordChangePage
export const PasswordChangePage = SourcePasswordChangePage;

// TODO: implement SearchPage
export const SearchPage = SourceSearchPage;

// TODO: implement ConfirmAccountPage
export const ConfirmAccountPage = SourceConfirmAccountPage;

// TODO: implement MenuPage
export const MenuPage = SourceMenuPage;

// TODO: implement Footer
export const Footer = SourceFooter;

// TODO: implement NavigationTabs
export const NavigationTabs = SourceNavigationTabs;

// TODO: implement NewVersionPopup
export const NewVersionPopup = SourceNewVersionPopup;

// TODO: implement NotificationList
export const NotificationList = SourceNotificationList;

// TODO: implement WishlistShared
export const WishlistShared = SourceWishlistShared;

// TODO: implement OfflineNotice
export const OfflineNotice = SourceOfflineNotice;

// TODO: implement ContactPage
export const ContactPage = SourceContactPage;

// TODO: implement ProductComparePage
export const ProductComparePage = SourceProductComparePage;

// TODO: implement CreateAccountPage
export const CreateAccountPage = SourceCreateAccountPage;

// TODO: implement LoginAccountPage
export const LoginAccountPage = SourceLoginAccountPage;

// TODO: implement ForgotPasswordPage
export const ForgotPasswordPage = SourceForgotPasswordPage;

// TODO: implement SomethingWentWrong
export const SomethingWentWrong = SourceSomethingWentWrong;

// TODO: implement StyleGuidePage
export const StyleGuidePage = SourceStyleGuidePage;

// TODO: implement Breadcrumbs
export const Breadcrumbs = SourceBreadcrumbs;

// TODO: implement OrderPrintPage
export const OrderPrintPage = SourceOrderPrintPage;

export const CheckoutSuccess = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "checkoutSuccess" */ 'Route/CheckoutSuccess'));
export const CheckoutFailure = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "checkoutFailure" */ 'Route/CheckoutFailure'));

// TODO: implement withStoreRegex
/** @namespace Seedsman/Component/Router/Component/withStoreRegex */
export const withStoreRegex = (path) => {
    const { storeList } = window;
    // eslint-disable-next-line prefer-const, fp/no-let
    let newStoreRegax = [];
    storeList.map((store) => {
        newStoreRegax.push(`${store}-en`);
        newStoreRegax.push(`${store}-fr`);
        newStoreRegax.push(`${store}-it`);
        newStoreRegax.push(`${store}-es`);
        newStoreRegax.push(`${store}-de`);
        newStoreRegax.push(`${store}-nl`);
        return null;
    });
    window.newStoreList = newStoreRegax;
    newStoreRegax = newStoreRegax.join('|');
    newStoreRegax = `/(${ newStoreRegax })?`;
    // Add this to get virtual store data as in Website
    const newStoreList = ['us-en', 'us-fr', 'us-it', 'us-es', 'uk-en', 'uk-fr', 'uk-it', 'uk-es', 'tigerone_usa_store_view-en', 'tigerone_usa_store_view-fr', 'tigerone_usa_store_view-it', 'tigerone_usa_store_view-es', 'tigerone_uk_store_view-en', 'tigerone_uk_store_view-fr', 'tigerone_uk_store_view-it', 'tigerone_uk_store_view-es', 'tigerone_sa_store_view-en', 'tigerone_sa_store_view-fr', 'tigerone_sa_store_view-it', 'tigerone_sa_store_view-es', 'tigeron_eu_store_view-en', 'tigeron_eu_store_view-fr', 'tigeron_eu_store_view-it', 'tigeron_eu_store_view-es', 'sa-en', 'sa-fr', 'sa-it', 'sa-es', 'pytho_nation_store_view-en', 'pytho_nation_store_view-fr', 'pytho_nation_store_view-it', 'pytho_nation_store_view-es', 'eztestkits_usa_store_view-en', 'eztestkits_usa_store_view-fr', 'eztestkits_usa_store_view-it', 'eztestkits_usa_store_view-es', 'eztestkits_uk_store_view-en', 'eztestkits_uk_store_view-fr', 'eztestkits_uk_store_view-it', 'eztestkits_uk_store_view-es', 'eztestkits_sa_store_view-en', 'eztestkits_sa_store_view-fr', 'eztestkits_sa_store_view-it', 'eztestkits_sa_store_view-es', 'eztestkits_eu_store_view-en', 'eztestkits_eu_store_view-fr', 'eztestkits_eu_store_view-it', 'eztestkits_eu_store_view-es', 'eu-en', 'eu-fr', 'eu-it', 'eu-es'];
    newStoreRegax = '/(us-en|us-fr|us-it|us-es|uk-en|uk-fr|uk-it|uk-es|tigerone_usa_store_view-en|tigerone_usa_store_view-fr|tigerone_usa_store_view-it|tigerone_usa_store_view-es|tigerone_uk_store_view-en|tigerone_uk_store_view-fr|tigerone_uk_store_view-it|tigerone_uk_store_view-es|tigerone_sa_store_view-en|tigerone_sa_store_view-fr|tigerone_sa_store_view-it|tigerone_sa_store_view-es|tigeron_eu_store_view-en|tigeron_eu_store_view-fr|tigeron_eu_store_view-it|tigeron_eu_store_view-es|sa-en|sa-fr|sa-it|sa-es|pytho_nation_store_view-en|pytho_nation_store_view-fr|pytho_nation_store_view-it|pytho_nation_store_view-es|eztestkits_usa_store_view-en|eztestkits_usa_store_view-fr|eztestkits_usa_store_view-it|eztestkits_usa_store_view-es|eztestkits_uk_store_view-en|eztestkits_uk_store_view-fr|eztestkits_uk_store_view-it|eztestkits_uk_store_view-es|eztestkits_sa_store_view-en|eztestkits_sa_store_view-fr|eztestkits_sa_store_view-it|eztestkits_sa_store_view-es|eztestkits_eu_store_view-en|eztestkits_eu_store_view-fr|eztestkits_eu_store_view-it|eztestkits_eu_store_view-es|eu-en|eu-fr|eu-it|eu-es)?';
    window.newStoreList = newStoreList;
    // END
    window.newStoreRegax = newStoreRegax;
    return newStoreRegax.concat(path);
};

export const SelectCountryPopup = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "notice" */ 'Component/SelectCountryPopup'));
export const PostAffiliate = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "post-affiliate" */ 'Component/PostAffiliatePro'));
export const BlogPage = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "blog" */ 'Route/BlogPage'));
export const PostPage = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "blog" */ 'Route/PostPage'));
export const AddScriptLinks = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "post-affiliate" */ 'Component/AddScriptLinks'));
/** @namespace Seedsman/Component/Router/Component */
export class RouterComponent extends SourceRouter {
    [BEFORE_ITEMS_TYPE] = [
        {
            component: <NotificationList />,
            position: 10,
            name: NOTIFICATION_LIST
        },
        {
            component: <DemoNotice />,
            position: 15,
            name: DEMO_NOTICE
        },
        {
            component: <Header />,
            position: 20,
            name: HEADER
        },
        {
            component: <Breadcrumbs />,
            position: 30,
            name: BREADCRUMBS
        },
        {
            component: <NewVersionPopup />,
            position: 35,
            name: NEW_VERSION_POPUP
        },
        {
            component: <SelectCountryPopup />,
            position: 36,
            name: SELECT_COUNTRY_POPUP
        },
        {
            component: <PostAffiliate />,
            position: 70,
            name: POST_AFFILIATE
        },
        {
            component: <AddScriptLinks />,
            position: 71,
            name: Add_SCRIPT_LINKS
        }
    ];

    [SWITCH_ITEMS_TYPE] = [
        {
            component: <Route path={ withStoreRegex('/') } exact render={ (props) => <HomePage { ...props } /> } />,
            position: 10,
            name: HOME
        },
        {
            component: <Route path={ withStoreRegex('/search/:query/') } render={ (props) => <SearchPage { ...props } /> } />,
            position: 25,
            name: SEARCH
        },
        {
            component: <Route path={ withStoreRegex('/page') } render={ (props) => <CmsPage { ...props } /> } />,
            position: 40,
            name: CMS_PAGE
        },
        {
            component: <Route path={ withStoreRegex('/cart') } exact render={ (props) => <CartPage { ...props } /> } />,
            position: 50,
            name: CART
        },
        {
            component: <Route path={ withStoreRegex('/blog/category/:tab?') } exact render={ (props) => <BlogPage { ...props } /> } />,
            position: 50,
            name: BLOG
        },
        {
            component: <Route path={ withStoreRegex('/blog') } exact render={ (props) => <BlogPage { ...props } /> } />,
            position: 50,
            name: BLOG
        },
        {
            component: <Route path={ withStoreRegex('/blog/:tab?') } exact render={ (props) => <PostPage { ...props } /> } />,
            position: 50,
            name: POST
        },
        {
            component: <Route path={ withStoreRegex('/checkout/success') } render={ (props) => <CheckoutSuccess { ...props } /> } />,
            position: 54,
            name: CHECKOUT_SUCCESS
        },
        {
            component: <Route path={ withStoreRegex('/checkout/:step?') } render={ (props) => <Checkout { ...props } /> } />,
            position: 55,
            name: CHECKOUT
        },
        {
            component: <Route path={ withStoreRegex('/checkout/failure') } render={ (props) => <CheckoutFailure { ...props } /> } />,
            position: 53,
            name: CHECKOUT_FAILURE
        },
        {
            component: <Route path={ withStoreRegex('/customer/account/createPassword/') } render={ (props) => <PasswordChangePage { ...props } /> } />,
            position: 60,
            name: CHANGE_PASSWORD
        },
        {
            component: <Route path={ withStoreRegex('/customer/account/create/') } render={ (props) => <CreateAccountPage { ...props } /> } />,
            position: 61,
            name: CREATE_ACCOUNT
        },
        {
            component: <Route path={ withStoreRegex('/customer/account/login/') } render={ (props) => <LoginAccountPage { ...props } /> } />,
            position: 62,
            name: LOGIN
        },
        {
            component: <Route path={ withStoreRegex('/customer/account/forgotpassword/') } render={ (props) => <ForgotPasswordPage { ...props } /> } />,
            position: 63,
            name: ACCOUNT_FORGOT_PASSWORD
        },
        {
            component: <Route path={ withStoreRegex('/customer/account/confirm') } render={ (props) => <ConfirmAccountPage { ...props } /> } />,
            position: 65,
            name: CONFIRM_ACCOUNT
        },
        {
            component: <Route path={ withStoreRegex('/sales/order/view/order_id/:orderId?') } render={ (props) => <MyAccount { ...props } selectedTab={ MY_ORDERS } /> } />,
            position: 70,
            name: MY_ACCOUNT_ORDER
        },
        {
            component: <Route path={ withStoreRegex('/sales/order/history') } render={ (props) => <MyAccount { ...props } selectedTab={ MY_ORDERS } /> } />,
            position: 71,
            name: MY_ACCOUNT_ORDERS
        },
        {
            component: <Route path={ withStoreRegex('/downloadable/customer/products') } render={ (props) => <MyAccount { ...props } selectedTab={ MY_DOWNLOADABLE } /> } />,
            position: 72,
            name: MY_ACCOUNT_DOWNLOADABLE
        },
        {
            component: <Route path={ withStoreRegex('/wishlist') } render={ (props) => <MyAccount { ...props } selectedTab={ MY_WISHLIST } /> } />,
            position: 81,
            name: MY_ACCOUNT_WISHLIST
        },
        {
            component: <Route path={ withStoreRegex('/customer/address') } render={ (props) => <MyAccount { ...props } selectedTab={ ADDRESS_BOOK } /> } />,
            position: 74,
            name: MY_ACCOUNT_ADDRESS
        },
        {
            component: <Route path={ withStoreRegex('/newsletter/manage') } render={ (props) => <MyAccount { ...props } selectedTab={ NEWSLETTER_SUBSCRIPTION } /> } />,
            position: 75,
            name: MY_ACCOUNT_NEWSLETTER
        },
        {
            component: <Route path={ withStoreRegex('/customer/account/:tab?') } render={ (props) => <MyAccount { ...props } /> } />,
            position: 76,
            name: MY_ACCOUNT
        },
        {
            component: <Route path={ withStoreRegex('/menu') } render={ (props) => <MenuPage { ...props } /> } />,
            position: 80,
            name: MENU
        },
        {
            component: <Route path={ withStoreRegex('/wishlist/shared/:code') } render={ (props) => <WishlistShared { ...props } /> } />,
            position: 73,
            name: SHARED_WISHLIST
        },
        {
            component: <Route path={ withStoreRegex('/contact') } render={ (props) => <ContactPage { ...props } /> } />,
            position: 82,
            name: CONTACT_PAGE
        },
        {
            component: <Route path={ withStoreRegex('/compare') } render={ (props) => <ProductComparePage { ...props } /> } />,
            position: 83,
            name: COMPARE
        },
        {
            component: <Route path={ withStoreRegex('/styleguide') } render={ (props) => <StyleGuidePage { ...props } /> } />,
            position: 84,
            name: STYLE_GUIDE
        },
        {
            component: <Route path={ withStoreRegex('/sales/order/print/order_id/:orderId?') } render={ (props) => <OrderPrintPage { ...props } orderPrintRequest={ PRINT_ORDER_REQUEST } /> } />,
            position: 90,
            name: PRINT_ORDER
        },
        {
            component: <Route path={ withStoreRegex('/sales/order/printInvoice/order_id/:orderId?') } render={ (props) => <OrderPrintPage { ...props } orderPrintRequest={ PRINT_ALL_INVOICES } /> } />,
            position: 91,
            name: PRINT_ORDER
        },
        {
            component: <Route path={ withStoreRegex('/sales/order/printShipment/order_id/:orderId?') } render={ (props) => <OrderPrintPage { ...props } orderPrintRequest={ PRINT_ALL_SHIPMENT } /> } />,
            position: 92,
            name: PRINT_ORDER
        },
        {
            component: <Route path={ withStoreRegex('/sales/order/printCreditmemo/order_id/:orderId?') } render={ (props) => <OrderPrintPage { ...props } orderPrintRequest={ PRINT_ALL_REFUNDS } /> } />,
            position: 93,
            name: PRINT_ORDER
        },
        {
            component: <Route path={ withStoreRegex('/sales/order/printInvoice/invoice_id/:invoiceId?') } render={ (props) => <OrderPrintPage { ...props } orderPrintRequest={ PRINT_INVOICE } /> } />,
            position: 94,
            name: PRINT_ORDER
        },
        {
            component: <Route path={ withStoreRegex('/sales/order/printShipment/shipment_id/:shipmentId?') } render={ (props) => <OrderPrintPage { ...props } orderPrintRequest={ PRINT_SHIPMENT } /> } />,
            position: 95,
            name: PRINT_ORDER
        },
        {
            component: <Route path={ withStoreRegex('/sales/order/printCreditmemo/creditmemo_id/:refundId?') } render={ (props) => <OrderPrintPage { ...props } orderPrintRequest={ PRINT_REFUND } /> } />,
            position: 95,
            name: PRINT_ORDER
        },
        {
            component: <Route path={ withStoreRegex('/ticket/view/order_id/:orderId?') } render={ (props) => <MyAccount { ...props } selectedTab={ MY_TICKETS } /> } />,
            position: 103,
            name: MY_ACCOUNT_MY_TICKET
        },
        {
            component: <Route path={ withStoreRegex('/ticket/history') } render={ (props) => <MyAccount { ...props } selectedTab={ MY_TICKETS } /> } />,
            position: 104,
            name: MY_ACCOUNT_MY_TICKETS
        },
        {
            component: <Route path={ withStoreRegex('/ticket/new') } render={ (props) => <MyAccount { ...props } selectedTab={ MY_TICKETS } /> } />,
            position: 105,
            name: MY_ACCOUNT_NEW_TICKET
        },
        {
            component: <Route render={ (props) => <UrlRewrites { ...props } /> } />,
            position: 1000,
            name: URL_REWRITES
        }
    ];
}

export default RouterComponent;
