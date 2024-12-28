/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-props-destruction */
/* eslint-disable max-len */
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
import { connect } from 'react-redux';

import {
    ADDRESS_POPUP_ID,
    DELETE_ADDRESS,
    EDIT_ADDRESS
} from 'Component/MyAccountAddressPopup/MyAccountAddressPopup.config';
import { MyAccountAddressTableContainer as ParentMyAccountAddressTableContainer } from 'SourceComponent/MyAccountAddressTable/MyAccountAddressTable.container';
import { showPopup } from 'Store/Popup/Popup.action';
import { Addresstype } from 'Type/Account.type';
import { MixType } from 'Type/Common.type';
import { CountriesType } from 'Type/Config.type';

import MyAccountAddressTable from './MyAccountAddressTable.component';

/** @namespace Seedsman/Component/MyAccountAddressTable/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    countries: state.ConfigReducer.countries,
    allCountries: state.ConfigReducer?.allCountries,
    addressTypeOptions: state.ConfigReducer.getAddressTypeOptions
});

/** @namespace Seedsman/Component/MyAccountAddressTable/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    showEditPopup: (payload) => dispatch(showPopup(ADDRESS_POPUP_ID, payload))
});

/** @namespace Seedsman/Component/MyAccountAddressTable/Container */
export class MyAccountAddressTableContainer extends ParentMyAccountAddressTableContainer {
    static propTypes = {
        mix: MixType,
        address: Addresstype.isRequired,
        showEditPopup: PropTypes.func.isRequired,
        countries: CountriesType.isRequired,
        allCountries: CountriesType.isRequired,
        showAdditionalFields: PropTypes.bool,
        showActions: PropTypes.bool,
        title: PropTypes.string
    };

    state = {
        isSelecte: false,
        preveId: ''
    };

    static defaultProps = {
        showAdditionalFields: false,
        showActions: true,
        mix: {},
        title: ''
    };

    containerFunctions = {
        onEditClick: this.onEditClick.bind(this),
        onDeleteClick: this.onDeleteClick.bind(this),
        renderActiveAddress: this.renderActiveAddress.bind(this)
    };

    containerProps() {
        const {
            address,
            countries,
            mix,
            showAdditionalFields,
            showActions,
            title,
            dashBoard,
            addressTypeOptions,
            isBilling,
            allCountries
        } = this.props;

        return {
            address,
            countries,
            mix,
            showAdditionalFields,
            showActions,
            title,
            dashBoard,
            addressTypeOptions,
            isBilling,
            allCountries
        };
    }

    renderActiveAddress(e) {
        if (e.target.id !== this.state.preveId) {
            this.setState(
                {
                    isSelecte: !this.state.isSelecte,
                    preveId: e.target.id
                }
            );
        }
    }

    onEditClick() {
        const { showEditPopup, address } = this.props;

        showEditPopup({
            action: EDIT_ADDRESS,
            title: 'Edit Address',
            address
        });
    }

    onDeleteClick() {
        const { showEditPopup, address } = this.props;

        showEditPopup({
            action: DELETE_ADDRESS,
            title: 'Confirm delete',
            address
        });
    }

    render() {
        return (
            <MyAccountAddressTable
              { ...this.state }
              { ...this.containerProps() }
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountAddressTableContainer);
