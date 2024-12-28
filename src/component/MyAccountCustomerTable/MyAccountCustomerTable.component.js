/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
/* eslint-disable max-len */
import PropTypes from 'prop-types';

import Link from 'Component/Link';
import { ACCOUNT_INFORMATION_EDIT_URL } from 'Route/MyAccount/MyAccount.config';
import { MyAccountCustomerTable as SourceMyAccountCustomerTable } from 'SourceComponent/MyAccountCustomerTable/MyAccountCustomerTable.component';
import { CustomerType } from 'Type/Account.type';

import './MyAccountCustomerTable.style';

/** @namespace Seedsman/Component/MyAccountCustomerTable/Component */
export class MyAccountCustomerTableComponent extends SourceMyAccountCustomerTable {
    static propTypes = {
        handleOnEditInformation: PropTypes.func.isRequired,
        handleOnEditPassword: PropTypes.func.isRequired,
        customer: CustomerType.isRequired
    };

    renderActions() {
        const { handleOnEditInformation, handleOnEditPassword } = this.props;

        return (
            <div block="Address_Action">
                <button
                  block="EditButton"
                  onClick={ handleOnEditInformation }
                >
                    Edit information
                </button>
                <button
                  block="Password-Button"
                  onClick={ handleOnEditPassword }
                >
                    Change password
                </button>
            </div>
        );
    }

    renderAddressDashboard() {
        const { customer } = this.props;

        if (!customer) {
            return null;
        }

        const {
            firstname, lastname, email, dob, extra_attributes: {
                mobile_phone_number
            } = {}
        } = customer;

        return (
            <div block="DashboardAddress CustomerAccount-container">
                <div block="CustomerName">
                    <h4 block="FullName">
                        { firstname }
{ ' ' }
{ lastname }
                    </h4>
                    <p block="Tel-number">
                        Mobile:
                        { mobile_phone_number }
                    </p>

                    <p block="Email">
                        Email:
                        { email }
                    </p>
                    <p block="DOB">
                        Date of Birth:
                        { dob }
                    </p>
                    <span block="EditButton">
                        <Link
                          to={ ACCOUNT_INFORMATION_EDIT_URL }
                        >
                            Edit
                        </Link>
                    </span>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div block="MyAccountCustomerTable">
                { this.renderAddressDashboard() }
                { /* { this.renderActions() } */ }
            </div>
        );
    }
}

export default MyAccountCustomerTableComponent;
