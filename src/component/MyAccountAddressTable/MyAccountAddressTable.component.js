/* eslint-disable max-lines */
/* eslint-disable no-nested-ternary */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable max-len */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
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

import PropTypes from 'prop-types';

import Loader from 'Component/Loader';
import { MyAccountAddressTable as ParentMyAccountAddressTable } from 'SourceComponent/MyAccountAddressTable/MyAccountAddressTable.component';
import { Addresstype } from 'Type/Account.type';
import { MixType } from 'Type/Common.type';
import { CountriesType } from 'Type/Config.type';

import { getAddressTablePairArray } from './MyAccountAddressTable.table';

// import './MyAccountAddressTable.style';

/** @namespace Seedsman/Component/MyAccountAddressTable/Component */
export class MyAccountAddressTableComponent extends ParentMyAccountAddressTable {
    static propTypes = {
        mix: MixType.isRequired,
        isSelected: PropTypes.bool,
        address: Addresstype.isRequired,
        showActions: PropTypes.bool.isRequired,
        showAdditionalFields: PropTypes.bool.isRequired,
        onEditClick: PropTypes.func.isRequired,
        onDeleteClick: PropTypes.func.isRequired,
        countries: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string,
                id: PropTypes.string,
                available_regions: PropTypes.arrayOf(
                    PropTypes.shape({
                        code: PropTypes.string,
                        name: PropTypes.string,
                        id: PropTypes.number
                    })
                )
            })
        ).isRequired,
        allCountries: CountriesType.isRequired
    };

    static defaultProps = {
        isSelected: false
    };

    get dataPairArray() {
        return getAddressTablePairArray(this.props);
    }

    renderAddressType() {
        const { address: { custom_attributes = [] }, addressTypeOptions = [] } = this.props;

        // eslint-disable-next-line eqeqeq
        const address = addressTypeOptions.filter((type) => custom_attributes?.find((sourceType) => type.value == sourceType.value));
        const { label } = address[0] || [];

        if (!label) {
            return null;
        }

        return (
            <span className="Addresstype">
                { label }
            </span>
        );
    }

    renderTable() {
        return (
            <div block="KeyValueTable" elem="Wrapper">
                <table block="KeyValueTable">
                    <thead>
                        { this.renderHeading() }
                    </thead>
                    <tbody>
                        { this.dataPairArray.map(this.renderTableRow.bind(this)) }
                        { this.renderActions() }
                    </tbody>
                    { this.renderAddressType() }
                </table>
            </div>
        );
    }

    renderActions() {
        const {
            onEditClick,
            onDeleteClick,
            showActions,
            address: { default_billing, default_shipping },
            isBilling
        } = this.props;

        const isDeleteAllowed = default_shipping || default_billing;

        if (!showActions) {
            return null;
        }

        return (
            <div className="Address-Action">
                <span className="Action-Buttons">
                    <button
                      type="button"
                      block="Button"
                      mods={ { isHollow: true, isWithoutBorder: true } }
                      onClick={ onEditClick }
                    >
                        Edit
                    </button>
                    <button
                      type="button"
                      block="Button"
                      mods={ { isHollow: true, isWithoutBorder: true } }
                      onClick={ onDeleteClick }
                      disabled={ isDeleteAllowed }
                      title={ isDeleteAllowed
                          ? 'Can not delete - address is set as default.'
                          : 'Delete this address' }
                    >
                        Remove
                    </button>
                </span>
                { (default_billing && default_shipping)
                    ? (
                        <div block="DefaultAddress" elem="Wrapper">
                            <span className="DefaultAddress-label">
                                Billing Address
                            </span>
                            <span className="DefaultAddress-label">
                                Shipping Address
                            </span>
                        </div>
                    )
                    : (default_billing || default_shipping)
                    && (
                        <span className="DefaultAddress-label">
                            { isBilling ? 'Billing Address' : 'Shipping Address' }
                        </span>
                    ) }
            </div>
        );
    }

    renderCountryName() {
        const {
            countries,
            allCountries = [],
            address: {
                country_id
            } = {}
        } = this.props;

        const allowedCountry = countries.find((val) => val.id === country_id);
        const allCountry = allCountries.find((val) => val.id === country_id);

        if (allowedCountry?.label) {
            return <p block="country">{ allowedCountry?.label }</p>;
        }
        if (allCountry?.label) {
            return <p block="country">{ allCountry?.label }</p>;
        }

        return null;
    }

    renderAddress() {
        const {
            address: {
                id,
                firstname,
                lastname,
                email,
                telephone,
                city,
                street,
                postcode
            },
            dashBoard
        } = this.props;

        return (
            <div
              className="AddressContainer"
            >
                <label htmlFor={ id }>
                    <div className="AddressContent">
                        <div block="AccountAddress">
                            { this.renderAddressType() }
                            <address>
                                <p className="FullName">
                                    <span>{ firstname }</span>
                                    <span>{ lastname }</span>
                                </p>
                                <p>{ email }</p>
                                <p>
                                    { !dashBoard ? (street.map((val) => (
                                        <span block="street">{ val }</span>
                                    ))) : (<span>{ `${street} ${city} ${postcode}` }</span>) }
                                </p>
                                <p>{ !dashBoard && city }</p>
                                { this.renderCountryName() }
                                <p block="Telephone-no">
                                    Mobile:
                                    <span block="Phone-no">{ telephone }</span>
                                </p>
                            </address>
                        </div>
                    </div>
                    { this.renderActions() }
                </label>
            </div>
        );
    }

    render() {
        const { countries, mix } = this.props;

        return (
            <div block="MyAccountAddressTable" mix={ mix }>
                <Loader isLoading={ !countries.length } />
                { this.renderAddress() }
            </div>
        );
    }
}

export default MyAccountAddressTableComponent;
