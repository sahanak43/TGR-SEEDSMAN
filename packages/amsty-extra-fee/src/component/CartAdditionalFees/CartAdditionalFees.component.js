/**
 * Amasty Extra Fee compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { getPriceFromType } from '../../util/AmastyExtraFees';

import './CartAdditionalFees.style';

/** @namespace Scandiweb/AmastyExtraFee/Component/CartAdditionalFees/Component */
export class CartAdditionalFeesComponent extends PureComponent {
    static propTypes = {
        valuesToRender: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape(PropTypes.string))),
        currencyCode: PropTypes.string.isRequired
    };

    static defaultProps = {
        valuesToRender: []
    };

    renderValue = (item) => {
        const {
            converted_fee_amount,
            price_type,
            labels,
            label
        } = item;

        const { currencyCode } = this.props;

        const priceToShow = getPriceFromType(converted_fee_amount, price_type, currencyCode);

        return (
            <div
              block="CartAdditionalFees"
              elem="Option"
              key={ labels }
            >
                <span>{ label }</span>
                <span>{ priceToShow }</span>
            </div>
        );
    };

    renderValues = (value) => {
        if (!value) {
            return null;
        }

        return value.map(this.renderValue);
    };

    renderOptions() {
        const { valuesToRender } = this.props;

        if (!valuesToRender || valuesToRender.length === 0) {
            return null;
        }

        return valuesToRender.map(this.renderValues);
    }

    render() {
        return (
            <div block="CartAdditionalFees">
               { this.renderOptions() }
            </div>
        );
    }
}

export default CartAdditionalFeesComponent;
