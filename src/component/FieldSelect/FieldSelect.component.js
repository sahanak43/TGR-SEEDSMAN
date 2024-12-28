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
import { FieldSelect as SourceFieldSelectComponent } from 'SourceComponent/FieldSelect/FieldSelect.component';

import './FieldSelect.style';

/**
 * Field Select
 * @class FieldSelect
 * @namespace Seedsman/Component/FieldSelect/Component */
export class FieldSelectComponent extends SourceFieldSelectComponent {
    renderNativeOption(option) {
        const {
            id,
            value,
            disabled,
            label,
            subLabel = '',
            isAvailable = true
        } = option;

        const { isDisabled, bablicExclude } = this.props;

        return (
            <option
              key={ id }
              id={ id }
              bablic-exclude={ bablicExclude && 'true' }
              value={ value }
              disabled={ disabled || isDisabled || !isAvailable }
            >
                { `${label} ${subLabel}` }
            </option>
        );
    }

    renderNativeSelect() {
        const {
            setRef, attr, events, isDisabled, options, handleSelectListOptionClick, isSelectedOptionAvailable,
            bablicExclude
        } = this.props;

        return (
            <select
              block="FieldSelect"
              elem="Select"
              mods={ { isDisabled: !isSelectedOptionAvailable } }
              ref={ (elem) => setRef(elem) }
              disabled={ isDisabled }
              bablic-exclude={ bablicExclude && 'true' }
              // eslint-disable-next-line @scandipwa/scandipwa-guidelines/jsx-no-props-destruction
              { ...attr }
              // eslint-disable-next-line @scandipwa/scandipwa-guidelines/jsx-no-props-destruction
              { ...events }
              onChange={ handleSelectListOptionClick }
            >
                { options.map(this.renderNativeOption.bind(this)) }
            </select>
        );
    }

    renderOption(option) {
        const {
            id,
            label,
            subLabel,
            isPlaceholder = false,
            isHovered,
            isAvailable = true
        } = option;

        const {
            isExpanded,
            handleSelectListOptionClick,
            bablicExclude
        } = this.props;

        return (
            <li
              block="FieldSelect"
              elem="Option"
              bablic-exclude={ bablicExclude && 'true' }
              mods={ {
                  isDisabled: !isAvailable,
                  isExpanded,
                  isPlaceholder,
                  isHovered
              } }
              key={ id }
              /**
               * Added 'o' as querySelector does not work with
               * ids, that consist of numbers only
               */
              id={ `o${id}` }
              role="menuitem"
              // eslint-disable-next-line react/jsx-no-bind
              onMouseDown={ () => handleSelectListOptionClick(option) }
              // eslint-disable-next-line react/jsx-no-bind
              onTouchStart={ () => handleSelectListOptionClick(option) }
              // eslint-disable-next-line react/jsx-no-bind
              onKeyPress={ () => handleSelectListOptionClick(option) }
              tabIndex={ isExpanded ? '0' : '-1' }
            >
                { label }
                { subLabel && (
                    <strong>
                        { ` ${subLabel}` }
                    </strong>
                ) }
            </li>
        );
    }
}

export default FieldSelectComponent;
