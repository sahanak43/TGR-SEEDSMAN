/**
 * Amasty Extra Fee compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { formatPrice } from 'Util/Price';

import { ExtraFeesType } from '../../type/Fee.type';

import './AdditionalFeesPopup.style';

/** @namespace Scandiweb/AmastyExtraFee/Component/AdditionalFeesPopup/Component */
export class AdditionalFeesPopupComponent extends PureComponent {
    static propTypes = {
        extraFees: PropTypes.arrayOf(ExtraFeesType),
        currencyCode: PropTypes.string.isRequired
    };

    static defaultProps ={
        extraFees: []
    };

    renderLabel(fee_label, fee_option_label) {
        return (
            <dt>
                { `${ fee_label } - ${ fee_option_label }:` }
            </dt>
        );
    }

    renderPrice(fee_amount) {
        const { currencyCode } = this.props;

        return (
            <dd>
                { formatPrice(fee_amount, currencyCode) }
            </dd>
        );
    }

    renderFee = ({ fee_label, fee_option_label, fee_amount }) => (
        <>
            { this.renderLabel(fee_label, fee_option_label) }
            { this.renderPrice(fee_amount) }
        </>
    );

    render() {
        const { extraFees } = this.props;
        return extraFees.map(this.renderFee);
    }
}

export default AdditionalFeesPopupComponent;
