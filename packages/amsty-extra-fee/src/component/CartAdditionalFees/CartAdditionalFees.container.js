/**
 * Amasty Extra Fee compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { AmastyExtraFeesContext } from '../../context/AmastyExtraFees';
import CartAdditionalFees from './CartAdditionalFees.component';

/** @namespace Scandiweb/AmastyExtraFee/Component/CartAdditionalFees/Container/mapStateToProps */
export const mapStateToProps = (_state) => ({
    currencyCode: _state.CartReducer.cartTotals?.quote_currency_code
});

/** @namespace Scandiweb/AmastyExtraFee/Component/CartAdditionalFees/Container/mapDispatchToProps */
export const mapDispatchToProps = (_dispatch) => ({});

/** @namespace Scandiweb/AmastyExtraFee/Component/CartAdditionalFees/Container */
export class CartAdditionalFeesContainer extends PureComponent {
    static propTypes = {
        currencyCode: PropTypes.string.isRequired
    };

    static contextType = AmastyExtraFeesContext;

    containerFunctions = {};

    containerProps() {
        const { currencyCode } = this.props;
        const valuesToRender = this.filterFees();
        return { valuesToRender, currencyCode };
    }

    filterFees() {
        const { indexedAppliedFees: fees } = this.context;
        const valuesToRender = Object.values(fees).map((fee) => {
            const appliedOptions = Object.values(fee.options).filter((option) => option.isApplied);
            return appliedOptions;
        });

        return valuesToRender;
    }

    render() {
        return (
            <CartAdditionalFees
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartAdditionalFeesContainer);
