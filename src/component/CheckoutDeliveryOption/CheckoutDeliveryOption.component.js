import Field from 'Component/Field';
import FIELD_TYPE from 'Component/Field/Field.config';
import {
    CheckoutDeliveryOption as SourceCheckoutDeliveryOption
} from 'SourceComponent/CheckoutDeliveryOption/CheckoutDeliveryOption.component';

import './CheckoutDeliveryOption.override.style';

/** @namespace Seedsman/Component/CheckoutDeliveryOption/Component */
export class CheckoutDeliveryOptionComponent extends SourceCheckoutDeliveryOption {
    renderRow() {
        const {
            option: {
                method_title,
                available
            } = {}
        } = this.props;

        return (
            <div
              block="CheckoutDeliveryOption"
              elem="Row"
              ref={ this.rowRef }
            >
                <span block="CheckoutDeliveryOption" elem="Span" mods={ { isDisabled: !available } }>
                    { method_title }
                </span>
                { this.renderPrice() }
                { this.renderAvailabilityMessage() }
            </div>
        );
    }

    renderPrice() {
        const {
            option: {
                available
            } = {}
        } = this.props;

        if (!available) {
            return null;
        }

        return (
            <span
              block="CheckoutDeliveryOption"
              elem="Price"
            >
                { ` | ${ this.getOptionPrice() }` }
                { this.renderSubPrice() }
            </span>
        );
    }

    render() {
        const {
            option: {
                carrier_title,
                available,
                carrier_code,
                method_code
            } = {},
            onOptionClick,
            isSelected
        } = this.props;

        if (!available) {
            return null;
        }

        return (
            <li
              block="CheckoutDeliveryOption"
              mods={ {
                  isDisabled: !available,
                  isActive: isSelected,
                  isHoverExcluded: !available || isSelected
              } }
            >
                <button
                  block="CheckoutDeliveryOption"
                  mods={ { isDisabled: !available } }
                  elem="Button"
                  type="button"
                  onClick={ onOptionClick }
                  disabled={ !available }
                >
                    <Field
                      type={ FIELD_TYPE.radio }
                      attr={ {
                          id: `option-${ carrier_title }`,
                          name: `option-${ carrier_title }`,
                          checked: !!isSelected,
                          defaultValue: `${carrier_code}_${method_code}`
                      } }
                    />
                    { this.renderRow() }
                </button>
            </li>
        );
    }
}

export default CheckoutDeliveryOptionComponent;
