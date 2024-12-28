/**
 * Amasty Extra Fee compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Loader from 'Component/Loader';

import { FeesType } from '../../type/Fee.type';
import Fee from '../Fee';

import './Fees.style';

/** @namespace Scandiweb/AmastyExtraFee/Component/Fees/Component */
export class FeesComponent extends PureComponent {
    static propTypes = {
        fees: FeesType.isRequired,
        applyFee: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired
    };

    renderFee = ([feeId, fee]) => {
        const { applyFee } = this.props;

        return (
            <Fee
              fee={ fee }
              key={ feeId }
              applyFee={ applyFee }
            />
        );
    };

    renderFees() {
        const { fees } = this.props;
        return Object.entries(fees).map(this.renderFee);
    }

    renderLoader() {
        const { isLoading } = this.props;
        return (
            <Loader isLoading={ isLoading } />
        );
    }

    render() {
        return (
            <div block="Fees">
                { this.renderFees() }
                { this.renderLoader() }
            </div>
        );
    }
}

export default FeesComponent;
