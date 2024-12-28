/**
 * Amasty Extra Fee compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { ExtraFeesType } from '../../type/Fee.type';
import AdditionalFeesPopup from './AdditionalFeesPopup.component';

/** @namespace Scandiweb/AmastyExtraFee/Component/AdditionalFeesPopup/Container/mapStateToProps */
export const mapStateToProps = (_state) => ({});

/** @namespace Scandiweb/AmastyExtraFee/Component/AdditionalFeesPopup/Container/mapDispatchToProps */
export const mapDispatchToProps = (_dispatch) => ({});

/** @namespace Scandiweb/AmastyExtraFee/Component/AdditionalFeesPopup/Container */
export class AdditionalFeesPopupContainer extends PureComponent {
    static propTypes = {
        extraFees: PropTypes.arrayOf(ExtraFeesType),
        currencyCode: PropTypes.string
    };

    static defaultProps ={
        extraFees: [],
        currencyCode: 'USD'
    };

    containerFunctions = {};

    containerProps() {
        const extraFees = this._getOrderExtraFeesFromState();
        const currencyCode = this._getCurrencyCodeFromState();

        return {
            extraFees,
            currencyCode
        };
    }

    __construct(props) {
        super.__construct(props);

        const { extraFees, currencyCode } = this.props;

        this.state = {
            extraFees,
            currencyCode
        };
    }

    _getCurrencyCodeFromState() {
        const { currencyCode } = this.state;
        return currencyCode;
    }

    _getOrderExtraFeesFromState() {
        const { extraFees } = this.state;
        return extraFees;
    }

    render() {
        return (
            <AdditionalFeesPopup
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdditionalFeesPopupContainer);
