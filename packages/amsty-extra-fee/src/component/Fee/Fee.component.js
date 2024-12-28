/**
 * Amasty Extra Fee compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Field from 'Component/Field';
import FIELD_TYPE from 'Component/Field/Field.config';

import { FeeType } from '../../type/Fee.type';
import { getPriceFromType } from '../../util/AmastyExtraFees';
import {
    FEE_TYPE_CHECKBOX,
    FEE_TYPE_DROPDOWN,
    FEE_TYPE_RADIO
} from './Fee.config';

import './Fee.style';

/** @namespace Scandiweb/AmastyExtraFee/Component/Fee/Component */
export class FeeComponent extends PureComponent {
    static propTypes = {
        fee: FeeType.isRequired,
        applyFeeSelect: PropTypes.func.isRequired,
        applyFeeCheckbox: PropTypes.func.isRequired,
        currencyCode: PropTypes.string.isRequired
    };

    typeRenderMap = {
        [FEE_TYPE_DROPDOWN]: this.renderDropdown.bind(this),
        [FEE_TYPE_CHECKBOX]: this.renderCheckbox.bind(this),
        [FEE_TYPE_RADIO]: this.renderDropdown.bind(this)
    };

    renderName() {
        const { fee: { name, is_required } } = this.props;

        return (
            <div block="Fee" elem="Name" mods={ { Mandatory: is_required } }>{ name }</div>
        );
    }

    renderDescription() {
        const { fee: { description } } = this.props;

        return (
            <div block="Fee" elem="Description">{ description }</div>
        );
    }

    renderDropdown() {
        const {
            fee: { entity_id: feeId, options },
            applyFeeSelect,
            currencyCode
        } = this.props;

        // eslint-disable-next-line fp/no-let
        let selectedOptionId = '';

        const selectOptions = Object.entries(options).map(([optionId, option]) => {
            const {
                converted_fee_amount,
                label,
                isApplied,
                price_type
            } = option;

            const rightPrice = getPriceFromType(converted_fee_amount, price_type, currencyCode);

            if (isApplied) {
                selectedOptionId = optionId;
            }

            return {
                label: `${label} ${rightPrice}`,
                value: optionId
            };
        });

        return (
            <Field
              type={ FIELD_TYPE.select }
              attr={ {
                  id: feeId,
                  name: feeId
              } }
              value={ selectedOptionId }
              events={ { onChange: applyFeeSelect } }
              options={ selectOptions }
              mods={ { type: 'Select' } }
            />
        );
    }

    renderCheckbox() {
        const {
            fee: { entity_id: feeId, options },
            applyFeeCheckbox
        } = this.props;

        return Object.entries(options).map(([optionId, option]) => {
            const {
                price, price_type, label, isApplied
            } = option;

            const rightPrice = getPriceFromType(price, price_type);
            const id = `${feeId}-${optionId}`;

            return (
                <Field
                  key={ optionId }
                  type={ FIELD_TYPE.checkbox }
                  attr={ {
                      id,
                      name: id,
                      value: optionId,
                      checked: !!isApplied
                  } }
                  label={ `${label} ${rightPrice}` }
                  events={ { onChange: applyFeeCheckbox } }
                  mods={ { type: 'Checkbox' } }
                />
            );
        });
    }

    renderFeeOptions() {
        const { fee: { frontend_type } } = this.props;
        const renderer = this.typeRenderMap[frontend_type];

        return renderer();
    }

    render() {
        return (
            <div block="Fee">
                { this.renderName() }
                { this.renderDescription() }
                { this.renderFeeOptions() }
            </div>
        );
    }
}

export default FeeComponent;
