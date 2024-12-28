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
    mapDispatchToProps,
    mapStateToProps as sourcemapStateToProps
} from 'Component/MyAccountAddressTable/MyAccountAddressTable.container';
import {
    CheckoutAddressTableContainer as SourceCheckoutAddressTableContainer
} from 'SourceComponent/CheckoutAddressTable/CheckoutAddressTable.container';

import CheckoutAddressTable from './CheckoutAddressTable.component';

/** @namespace Seedsman/Component/CheckoutAddressTable/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    ...sourcemapStateToProps(state),
    addresses: state.MyAccountReducer.customer.addresses
});

/** @namespace Seedsman/Component/CheckoutAddressTable/Container */
export class CheckoutAddressTableContainer extends SourceCheckoutAddressTableContainer {
    static propTypes = {
        ...super.propTypes,
        isSelected: PropTypes.bool.isRequired,
        onClick: PropTypes.func.isRequired,
        isPrimary: PropTypes.bool.isRequired
    };

    containerProps() {
        const {
            isSelected, onClick,
            isPrimary, handleAddressChange,
            showAddress, addresses
        } = this.props;

        return {
            isSelected,
            onClick,
            isPrimary,
            showAddress,
            addresses,
            handleAddressChange,
            ...super.containerProps()
        };
    }

    render() {
        return (
            <CheckoutAddressTable
              { ...this.containerProps() }
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutAddressTableContainer);
