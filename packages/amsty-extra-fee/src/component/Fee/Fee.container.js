/**
 * Amasty Extra Fee compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { FeeType } from '../../type/Fee.type';
import Fee from './Fee.component';

/** @namespace Scandiweb/AmastyExtraFee/Component/Fee/Container/mapStateToProps */
export const mapStateToProps = (_state) => ({
    currencyCode: _state.CartReducer.cartTotals?.quote_currency_code
});

/** @namespace Scandiweb/AmastyExtraFee/Component/Fee/Container/mapDispatchToProps */
export const mapDispatchToProps = (_dispatch) => ({});

/** @namespace Scandiweb/AmastyExtraFee/Component/Fee/Container */
export class FeeContainer extends PureComponent {
    static propTypes = {
        applyFee: PropTypes.func.isRequired,
        fee: FeeType.isRequired,
        currencyCode: PropTypes.string.isRequired
    };

    containerFunctions = {
        applyFeeSelect: this.applyFeeSelect.bind(this),
        applyFeeCheckbox: this.applyFeeCheckbox.bind(this)
    };

    __construct(props) {
        super.__construct(props);
    }

    applyFeeSelect(value) {
        const {
            applyFee,
            fee: {
                entity_id
            }
        } = this.props;

        applyFee(entity_id, value || -1);
    }

    applyFeeCheckbox(event) {
        const { currentTarget: { value } } = event;

        const {
            applyFee,
            fee: {
                entity_id
            }
        } = this.props;

        applyFee(entity_id, value);
    }

    containerProps() {
        const {
            fee,
            currencyCode
        } = this.props;

        return {
            fee,
            currencyCode
        };
    }

    render() {
        return (
            <Fee
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeeContainer);
