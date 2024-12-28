/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
import PropTypes from 'prop-types';

import ExpandableContent from 'Component/ExpandableContent';
import LogoutPopup from 'Component/LogoutPopup';
import MyAccountTabListItem from 'Component/MyAccountTabListItem';
import {
    MyAccountTabList as SourceMyAccountTabList
} from 'SourceComponent/MyAccountTabList/MyAccountTabList.component';
import { ActiveTabType, TabMapType } from 'Type/Account.type';
import { isSignedIn } from 'Util/Auth';

import './MyAccountTabList.style';

/** @namespace Seedsman/Component/MyAccountTabList/Component */
export class MyAccountTabListComponent extends SourceMyAccountTabList {
    static propTypes = {
        tabMap: TabMapType.isRequired,
        activeTab: ActiveTabType.isRequired,
        handleLogout: PropTypes.func.isRequired,
        onTabClick: PropTypes.func.isRequired,
        isContentExpanded: PropTypes.bool.isRequired,
        toggleExpandableContent: PropTypes.func.isRequired
    };

    state = {
        reward_points: {}
    };

    renderTabListItem(tabEntry, index, tabArray) {
        const { activeTab, onTabClick, device } = this.props;
        const [key, tab] = tabEntry;
        const { section } = tab;
        const nextTab = tabArray[index + 1] || [];
        const { section: nextTabSection = section } = nextTab[1] || {};
        if (!device.isMobile && key === 'my_dashboard') {
            return null;
        }

        return (
            <MyAccountTabListItem
              key={ key }
              isActive={ activeTab === key }
              changeActiveTab={ onTabClick }
              tabEntry={ tabEntry }
            >
                { nextTabSection !== section ? this.renderLine() : null }
            </MyAccountTabListItem>
        );
    }

    renderLine() {
        return (
            <div block="MyAccountTabList" elem="Separator" />
        );
    }

    renderLogoutPopup() {
        return <LogoutPopup />;
    }

    renderLogoutTab() {
        const { handleLogout } = this.props;

        return (
            <li
              key="logout"
              block="MyAccountTabListItem"
            >
                <button
                  block="MyAccountTabListItem"
                  elem="Button"
                  onClick={ handleLogout }
                  role="link"
                >
                    Logout
                </button>
            </li>
        );
    }

    renderMyProfileSection() {
        const { device: { isMobile }, customer: { firstname, lastname } } = this.props;

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
                { ' ' }
                { lastname }

               </span>

            { this.renderGreenPoints() }
                </>
            ) : (
                <>
                    Welcome
                    <div block="LoginSection">
                        <span>Login or SignUp</span>
                    </div>
                </>
            ) }
                </div>
            </div>
        );
    }

    renderCustomerPhoneNo() {
        const { customer: { addresses = [] } = {} } = this.props;
        const defaultShippingAddress = addresses.find((address) => {
            if (address.default_shipping) {
                return address;
            }
        });

        if (!defaultShippingAddress) {
            return;
        }

        const { telephone } = defaultShippingAddress;

        return (
            <span block="Phone">
                { telephone }
            </span>
        );
    }

    renderGreenPoints() {
        const { reward_points: { balance: { points } = {} } } = this.state;
        if (!isSignedIn() || !points) {
            return null;
        }

        return (
            <span block="GreenPoints">
                { `${points} Green Points Earned` }
            </span>
        );
    }

    renderUserDetails() {
        const { customer: { firstname, lastname }, device: { isMobile } } = this.props;

        if (isMobile) {
            return null;
        }

        return (
            <div
              block="MyAccountTabList"
              elem="UserDetails"
            >
                <span block="Name">
                { firstname }
                { ' ' }
                { lastname }
                </span>
                { this.renderCustomerPhoneNo() }
                { /* { this.renderGreenPoints() } */ }
            </div>
        );
    }

    render() {
        const {
            isContentExpanded,
            tabMap,
            toggleExpandableContent
        } = this.props;

        const tabs = [
            ...Object.entries(tabMap).map(this.renderTabListItem.bind(this)),
            this.renderLogoutTab()
        ];

        return (
            <ExpandableContent
              isContentExpanded={ isContentExpanded }
              mix={ { block: 'MyAccountTabList' } }
              onClick={ toggleExpandableContent }
              mods={ { isWithoutBorder: true } }
            >
                { this.renderUserDetails() }
                <ul>
                    { this.renderMyProfileSection() }
                    { tabs }
                </ul>
                { this.renderLogoutPopup() }
            </ExpandableContent>
        );
    }
}

export default MyAccountTabListComponent;
