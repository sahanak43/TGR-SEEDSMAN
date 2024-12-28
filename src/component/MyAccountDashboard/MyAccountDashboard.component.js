/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-magic-numbers */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable max-lines */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
import Link from 'Component/Link';
import Loader from 'Component/Loader';
import MyAccountAddressTable from 'Component/MyAccountAddressTable';
import MyAccountCustomerTable from 'Component/MyAccountCustomerTable';
import {
    ACCOUNT_NEWSLETTERS,
    ACCOUNT_ORDER_HISTORY,
    ACCOUNT_ORDER_URL
} from 'Route/MyAccount/MyAccount.config';
import {
    MyAccountDashboard as SourceMyAccountDashboard
} from 'SourceComponent/MyAccountDashboard/MyAccountDashboard.component';
import { formatPrice } from 'SourceUtil/Price';
import { DeviceType } from 'Type/Device.type';
import { formatDate } from 'Util/DateTime';
import history from 'Util/History';
import { appendWithStoreCode } from 'Util/Url';

import './MyAccountDashboard.override.style';

/** @namespace Seedsman/Component/MyAccountDashboard/Component */
export class MyAccountDashboardComponent extends SourceMyAccountDashboard {
    static propTypes = {
        // TODO: implement prop-types
        device: DeviceType.isRequired
    };

    componentDidMount() {
        const { getOrderList } = this.props;
        getOrderList();
    }

    renderAddressBlockTitle() {
        return (
            <div block="MyAccountDashboard" elem="BlockTitle">
                <span>Address Book</span>
                <Link
                  block="MyAccountDashboard"
                  elem="showLink"
                  to="/sales/order/history"
                >
                    View All
                </Link>
            </div>
        );
    }

    renderOrderActions(val) {
        return (
            <button
              block="VeiwButton"
              onClick={ () => this.renderOnViewClick(val.id) }
            >
                View order
            </button>
        );
    }

    renderOnViewClick(orderId) {
        history.push({
            pathname: appendWithStoreCode(`${ACCOUNT_ORDER_URL}/${orderId}`)
        });
    }

    renderOrderMobileTable() {
        const {
            customer: { firstname, lastname } = {},
            orderList: { items } = {}
        } = this.props;

        return (
            <>
                { items
                    && items.reverse().slice(0, 5).map((val, index) => {
                        const {
                            increment_id, status, created_at, total: { grand_total: { value } = {} } = {}
                        } = val;

                        if (index < 5) {
                            return (
                        <div block="Orders-Wrapper">
                            <div block="Inner">
                                <div block="OrderNumber">
                                    <span block="title-txt">{ `Order ID:#${increment_id}` }</span>
                                    <span block="seperator" />
                                    <span block="bold">{ status }</span>
                                </div>
                                <div block="shipTo oredr-row">
                                    <span block="title-txt">Ship To</span>
                                    <span block="bold">
                                        { `${firstname} ${lastname}` }
                                    </span>
                                </div>
                                <div block="OrderDate oredr-row">
                                    <span block="title-txt">Date</span>
                                    <span block="bold">
                                        { formatDate(created_at) }
                                    </span>
                                </div>
                                <div block="totalOrder oredr-row">
                                    <span block="title-txt">Order Total</span>
                                    <span block="bold">
                                        { value }
                                    </span>
                                </div>
                                <div block="OrderAction">
                                    { this.renderOrderActions(val) }
                                </div>
                            </div>
                        </div>
                            );
                        }

                        return null;
                    }) }
            </>
        );
    }

    renderOrderTable() {
        const {
            customer: { firstname, lastname } = {},
            orderList: { items } = {},
            isMobile
        } = this.props;

        if (!items?.length) {
            return null;
        }

        if (isMobile) {
            return (
                <div block="OrderTableMobile">
                    <div block="Heading_Section">
                        <h3 block="OrderHeading">Recent Orders</h3>
                        <Link block="VeiwAll_button" to={ ACCOUNT_ORDER_HISTORY }>
                            View All
                        </Link>
                    </div>
                    { this.renderOrderMobileTable() }
                </div>
            );
        }

        return (
            <div block="OrdersTable">
                <div block="Heading_Section">
                    <h3 block="OrderHeading">Recent Orders</h3>
                    <Link block="VeiwAll_button" to={ ACCOUNT_ORDER_HISTORY }>
                        View All
                    </Link>
                </div>
                <div block="OrderTable1">
                    <table block="Orders">
                        <tr block="border-bottom">
                            <th>Order Number</th>
                            <th>Date</th>
                            <th>Ship To</th>
                            <th>Order Total</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                        { items
                            && items.reverse().slice(0, 5).map((val) => {
                                const {
                                    increment_id, status, created_at,
                                    total: { grand_total: { value, currency } = {} } = {}
                                } = val;

                                return (
                                        <tr>
                                            <td>{ increment_id }</td>
                                            <td>
                                                { formatDate(created_at) }
                                            </td>
                                            <td>
                                                { `${firstname} ${lastname}` }
                                            </td>
                                            <td>{ formatPrice(value, currency) }</td>
                                            <td block={ status }>
                                                { status }
                                            </td>
                                            <td>
                                                { this.renderOrderActions(val) }
                                            </td>
                                        </tr>
                                );
                            }) }
                    </table>
                </div>
            </div>
        );
    }

    renderCustomerTable() {
        return (
            <div block="MyAccountDashboard" elem="CustomerData">
                <div block="MyAccountDashboard" elem="BlockTitle">
                    <h3>My Profile</h3>
                </div>
            </div>
        );
    }

    renderCustomerTableGrid() {
        const { customer } = this.props;
        return (
            <div block="MyAccountDashboard" elem="CustomerAccountGrid">
                <div block="CustomerAccount-section">
                    <div block="Heading_Section">
                        <h3 block="Address-heading">Contact Information</h3>
                    </div>
                    <MyAccountCustomerTable customer={ customer } />
                </div>
                <div block="CustomerAccount-section">
                    <div block="Heading_Section">
                        <h3 block="Heading">Newsletter</h3>
                    </div>
                    { this.renderNewsletterSubscription() }
                </div>
                { /* { this.renderCreditLimit() } */ }
            </div>
        );
    }

    renderNewsletterAction() {
        history.push({ pathname: appendWithStoreCode('/newsletter/manage') });
    }

    renderNewsletterSubscription() {
        const { customer } = this.props;
        const { is_subscribed } = customer;

        return (
            <div block="NewsletterSubscription CustomerAccount-container">
                { !is_subscribed ? (
                    <p block="Subscribe">You are not Subscribed</p>
                ) : (
                    <div block="NewsletterSubscription" elem="inner">
                    <p block="subscribe">
                        You are Subscribed to
                        <span block="bold-text">
                            “General Subscription”
                        </span>
                    </p>

                    <Link to={ ACCOUNT_NEWSLETTERS } block="EditButton">
                            Edit
                    </Link>

                    </div>
                ) }
            </div>
        );
    }

    renderNoDefaultAddressConfigured(name) {
        return (
            <div key={ name } block="MyAccountDashboard" elem="DefaultAddress">
                <h3>
                    Default
                    { ' ' }
                    { name }
                    { ' ' }
                    address
                </h3>
                <div block="CustomerAccount-container NoDefaultAddressConfigured">
                    <p block="MyAccountDashboard" elem="Info">
                        No %s address configured,
                        { ' ' }
                        { name }
                    </p>
                    { this.renderLinkToAddressBook() }
                </div>
            </div>
        );
    }

    renderDefaultAddressTable(isBilling) {
        const { getDefaultAddress } = this.props;
        const name = isBilling ? 'billing' : 'shipping';
        const address = getDefaultAddress(isBilling);

        if (!address) {
            return this.renderNoDefaultAddressConfigured(name);
        }

        return (
            <div key={ name } block="MyAccountDashboard" elem="DefaultAddress">
                <h3>
                    Default
                    { ' ' }
                    { name }
                    { ' ' }
                    address
                </h3>
                <MyAccountAddressTable
                  address={ address }
                  showAdditionalFields
                  title={ __('Default %s address', name) }
                  dashBoard
                />
            </div>
        );
    }

    renderNoAddresses() {
        return (
            <div block="NoAddress CustomerAccount-container">
                <p block="MyAccountDashboard" elem="Info">
                    You have no configured addresses.
                </p>
                { this.renderLinkToAddressBook() }
            </div>
        );
    }

    renderDefaultAddressTables() {
        const {
            customer: { addresses = [] }
        } = this.props;

        if (!addresses.length) {
            return this.renderNoAddresses();
        }

        return (
            <div block="MyAccountDashboard" elem="Addresses">
                <div block="MyAccountDashboard" elem="AddressesWrapper">
                    { this.renderDefaultAddressTable() }
                    { this.renderDefaultAddressTable(true) }
                </div>
            </div>
        );
    }

    render() {
        const { customer } = this.props;
        return (
            <div block="MyAccountDashboard">
                <Loader isLoading={ !Object.keys(customer).length } />
                { this.renderCustomerTable() }
                { this.renderCustomerTableGrid() }
                { /* { this.renderDefaultAddressTables() } */ }
                { this.renderOrderTable() }
            </div>
        );
    }
}

export default MyAccountDashboardComponent;
