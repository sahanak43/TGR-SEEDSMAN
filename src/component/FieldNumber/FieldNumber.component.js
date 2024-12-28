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

import AddIcon from 'Component/AddIcon';
import { FIELD_TYPE } from 'Component/Field/Field.config';
import MinusIcon from 'Component/MinusIcon';
import { FieldNumber as SourceFieldNumber } from 'SourceComponent/FieldNumber/FieldNumber.component';
import { EventsType, FieldAttrType } from 'Type/Field.type';
import { DEFAULT_MAX_PRODUCTS } from 'Util/Product/Extract';

/**
 * Field Number
 * @class FieldNumber
 * @namespace Seedsman/Component/FieldNumber/Component */
export class FieldNumberComponent extends SourceFieldNumber {
    static propTypes = {
        attr: FieldAttrType.isRequired,
        events: EventsType.isRequired,
        setRef: PropTypes.func.isRequired,
        value: PropTypes.number.isRequired,
        handleValueChange: PropTypes.func.isRequired,
        stateValue: PropTypes.number.isRequired,
        isDisabled: PropTypes.bool.isRequired
    };

    render() {
        const {
            attr,
            attr: { min = 1, max = DEFAULT_MAX_PRODUCTS },
            value,
            events,
            setRef,
            stateValue,
            handleValueChange,
            isDisabled
        } = this.props;

        const numberValue = +value || +stateValue;

        return (
            <>
                <input
                  ref={ (elem) => setRef(elem) }
                  // eslint-disable-next-line @scandipwa/scandipwa-guidelines/jsx-no-props-destruction
                  { ...attr }
                  // eslint-disable-next-line @scandipwa/scandipwa-guidelines/jsx-no-props-destruction
                  { ...events }
                  value={ numberValue || 1 }
                  type={ FIELD_TYPE.number }
                  readOnly
                  aria-label={ __('Value') }
                  disabled={ isDisabled }
                />
                <button
                  disabled={ max === 1 || numberValue >= max || isDisabled }
                  // eslint-disable-next-line react/jsx-no-bind
                  onClick={ () => handleValueChange(numberValue + 1) }
                  aria-label={ __('Add') }
                  type={ FIELD_TYPE.button }
                >
                    <AddIcon block="SubtractButton" isPrimary />
                </button>
                <button
                  disabled={ numberValue + 1 === min || numberValue <= min || isDisabled }
                  // eslint-disable-next-line react/jsx-no-bind
                  onClick={ () => handleValueChange(numberValue - 1) }
                  aria-label={ __('Subtract') }
                  type={ FIELD_TYPE.button }
                >
                    <MinusIcon block="AddButton" isPrimary />
                </button>
            </>
        );
    }
}

export default FieldNumberComponent;
