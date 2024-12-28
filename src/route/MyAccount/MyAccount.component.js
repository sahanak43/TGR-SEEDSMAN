/* eslint-disable max-lines */
/* eslint-disable max-len */
/* eslint-disable eqeqeq */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
/* eslint-disable fp/no-let */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable @scandipwa/scandipwa-guidelines/create-config-files */
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

import { lazy } from 'react';

import ContentWrapper from 'Component/ContentWrapper';
import MyAccountCommunications from 'Component/MyAccountCommunications';
import MyAccountInformation from 'Component/MyAccountInformation';
import MyAccountOrder from 'Component/MyAccountOrder';
import MyAccountTabList from 'Component/MyAccountTabList';
import MyAccountZendesk from 'Component/MyAccountZendesk';
import RewardProgram from 'Component/RewardProgram';
import StoreCreditAndRefunds from 'Component/StoreCreditAndRefunds';
import StoredPaymentMethod from 'Component/StoredPaymentMethod';
import { MyAccount as sourceMyAccount } from 'SourceRoute/MyAccount/MyAccount.component';
import {
    ACCOUNT_INFORMATION,
    ADDRESS_BOOK,
    MY_ACCOUNT,
    MY_DOWNLOADABLE,
    MY_NEWTICKET,
    MY_ORDER,
    MY_ORDERS,
    MY_TICKET,
    MY_TICKETS,
    MY_WISHLIST,
    NEWSLETTER_SUBSCRIPTION
} from 'Type/Account.type';
import { isSignedIn } from 'Util/Auth';

import {
    ACCOUNT_MYTICKET_NEW,
    ACCOUNT_MYTICKET_URL,
    ACCOUNT_ORDER_URL
} from './MyAccount.config';

// import { MY_DASHBOARD } from '../../component/Header/Header.config';
import './MyAccount.style';

export const MyAccountAddressBook = lazy(() => import(
    /* webpackMode: "lazy", webpackChunkName: "account-address" */
    'Component/MyAccountAddressBook'
));
export const MyAccountDashboard = lazy(() => import(
    /* webpackMode: "lazy", webpackChunkName: "account-dashboard" */
    'Component/MyAccountDashboard'
));
export const MyAccountDownloadable = lazy(() => import(
    /* webpackMode: "lazy", webpackChunkName: "account-downloadable" */
    'Component/MyAccountDownloadable'
));
export const MyAccountMyOrders = lazy(() => import(
    /* webpackMode: "lazy", webpackChunkName: "account-orders" */
    'Component/MyAccountMyOrders'
));
export const MyAccountMyWishlist = lazy(() => import(
    /* webpackMode: "lazy", webpackChunkName: "account-wishlist" */
    'Component/MyAccountMyWishlist'
));
export const MyAccountNewsletterSubscription = lazy(() => import(
    /* webpackMode: "lazy", webpackChunkName: "account-newsletter" */
    'Component/MyAccountNewsletterSubscription'
));

export const MyAccountMytickets = lazy(() => import(
    /* webpackMode: "lazy", webpackChunkName: "account-newsletter" */
    'Component/MyAccountZendeskView'
));

export const MyAccountNewMytickets = lazy(() => import(
    /* webpackMode: "lazy", webpackChunkName: "account-newsletter" */
    'Component/MyAccountZendeskForm'
));
export const STORE_PAYMENT_METHOD = 'stored-paymentMethod';
export const REWARD_PROGRAM = 'reward-program';
export const STORE_CREDITANDREFUNDS = 'storecredit-refunds';
export const ACCOUNT_COMMUNICATIONS = 'communications';

/** @namespace Seedsman/Route/MyAccount/Component */
export class MyAccountComponent extends sourceMyAccount {
    renderMap = {
        [MY_ACCOUNT]: MyAccountDashboard,
        [MY_ORDER]: MyAccountOrder,
        [MY_ORDERS]: MyAccountMyOrders,
        [MY_WISHLIST]: MyAccountMyWishlist,
        [ADDRESS_BOOK]: MyAccountAddressBook,
        [NEWSLETTER_SUBSCRIPTION]: MyAccountNewsletterSubscription,
        [MY_DOWNLOADABLE]: MyAccountDownloadable,
        [ACCOUNT_INFORMATION]: MyAccountInformation,
        [STORE_PAYMENT_METHOD]: StoredPaymentMethod,
        [REWARD_PROGRAM]: RewardProgram,
        [ACCOUNT_COMMUNICATIONS]: MyAccountCommunications,
        [STORE_CREDITANDREFUNDS]: StoreCreditAndRefunds,
        [MY_TICKETS]: MyAccountZendesk,
        [MY_TICKET]: MyAccountMytickets,
        [MY_NEWTICKET]: MyAccountNewMytickets
    };

    shouldComponentUpdate(nextProps) {
        const {
            activeTab,
            location: { pathname },
            tabName,
            subHeading,
            customer: { id } = {}
        } = this.props;
        const {
            activeTab: nextActiveTab,
            location: { pathname: nextPathname },
            tabName: nextTabName,
            subHeading: nextSubHeading,
            customer: { id: nextId } = {}
        } = nextProps;

        return (
            activeTab !== nextActiveTab
            || pathname !== nextPathname
            || tabName !== nextTabName
            || subHeading !== nextSubHeading
            || id !== nextId
        );
    }

    renderMyProfileSection() {
        const {
            device: { isMobile },
            customer: { firstname, lastname }
        } = this.props;

        if (!isMobile) {
            return null;
        }

        return (
            <div block="Menu" elem="ProfileSection">
                <div block="Profile">
                    { isSignedIn() ? (
                        <>
                            Hi,
                            <span>
                                { firstname }
                                <span>{ lastname }</span>
                            </span>
                        </>
                    ) : (
                        <>Welcome</>
                    ) }
                </div>
                <div block="LoginSection">
                    { isSignedIn() ? '' : <span>Login or SignUp</span> }
                </div>
            </div>
        );
    }

    getTabContent() {
        const {
            activeTab,
            location: { pathname }
        } = this.props;

        if (activeTab === MY_ORDERS && pathname.includes(ACCOUNT_ORDER_URL)) {
            return this.renderMap[MY_ORDER];
        }
        if (
            activeTab === MY_TICKETS
            && pathname.includes(ACCOUNT_MYTICKET_URL)
        ) {
            return this.renderMap[MY_TICKET];
        }
        if (
            activeTab === MY_TICKETS
            && pathname.includes(ACCOUNT_MYTICKET_NEW)
        ) {
            return this.renderMap[MY_NEWTICKET];
        }

        return this.renderMap[activeTab];
    }

    renderContent() {
        const {
            activeTab,
            tabMap,
            match: { params },
            changeActiveTab,
            onSignOut,
            device: { isMobile },
            isEditingActive,
            match,
            changeTabName,
            tabName,
            setTabSubheading,
            location: { pathname }
        } = this.props;

        if (!isSignedIn()) {
            return this.renderLoginOverlay();
        }
        const TabContent = this.getTabContent();
        const { title } = tabMap[activeTab];

        const urlTab = params?.tab;
        return (
            <ContentWrapper
              label="My Account page"
              wrapperMix={ { block: 'MyAccount', elem: 'Wrapper' } }
            >
                { !isMobile
                || (isMobile
                    && pathname.includes('/customer/account')
                    && !urlTab) ? (
                    <MyAccountTabList
                      tabMap={ tabMap }
                      activeTab={ activeTab }
                      changeActiveTab={ changeActiveTab }
                      onSignOut={ onSignOut }
                    />
                    ) : (
                        this.renderMyProfileSection()
                    ) }
                { isMobile
                && pathname.includes('/customer/account')
                && !urlTab ? (
                        ''
                    ) : (
                    <div
                      block="MyAccount"
                      elem="TabContent"
                      mods={ { activeTab } }
                    >
                        { title || tabName ? (
                            <div block="MyAccount" elem="HeadingSection">
                                <h2 block="MyAccount" elem="Heading">
                                    { title || tabName }
                                    { this.renderSubHeading() }
                                </h2>
                            </div>
                        ) : null }

                        <TabContent
                          isEditingActive={ isEditingActive }
                          match={ match }
                          changeTabName={ changeTabName }
                          tabMap={ tabMap }
                          setTabSubheading={ setTabSubheading }
                        />
                    </div>
                    ) }
            </ContentWrapper>
        );
    }
}

export default MyAccountComponent;
