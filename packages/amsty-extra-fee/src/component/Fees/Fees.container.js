/**
 * Amasty Extra Fee compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { AmastyExtraFeesContext } from '../../context/AmastyExtraFees';
import Fees from './Fees.component';

/** @namespace Scandiweb/AmastyExtraFee/Component/Fees/Container/mapStateToProps */
export const mapStateToProps = (_state) => ({});

/** @namespace Scandiweb/AmastyExtraFee/Component/Fees/Container/mapDispatchToProps */
export const mapDispatchToProps = (_dispatch) => ({});

/** @namespace Scandiweb/AmastyExtraFee/Component/Fees/Container */
export class FeesContainer extends PureComponent {
    static propTypes = {};

    static contextType = AmastyExtraFeesContext;

    containerFunctions = {};

    containerProps() {
        const {
            indexedAppliedFees,
            isLoading, applyFee
        } = this.context;

        return {
            isLoading,
            applyFee,
            fees: indexedAppliedFees
        };
    }

    render() {
        return (
            <Fees
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeesContainer);
