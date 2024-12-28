// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Field from 'Component/Field';
import FIELD_TYPE from 'Component/Field/Field.config';
import { VALIDATION_INPUT_TYPE } from 'Util/Validator/Config';

import './CheckoutAchForm.style.scss';

/** @namespace Seedsman/Component/CheckoutAchForm/Component */
export class CheckoutAchFormComponent extends PureComponent {
    render() {
        return (
          <div block="CheckoutArchFrom" elem="CheckoutArchContainer">
            <Field
              type={ FIELD_TYPE.text }
              label="Routing Number"
              attr={ {
                  id: 'Routing_Number',
                  name: 'Routing_Number',
                  placeholder: '056008849',
                  'aria-label': 'RoutingNumber'
              } }
              mix={ {
                  block: 'CheckoutArchFrom',
                  elem: 'InputTextRouting'
              } }
              validationRule={ {
                  isRequired: true,
                  inputType: VALIDATION_INPUT_TYPE.numeric
              } }
              validateOn={ ['onChange'] }
              addRequiredTag

            />
            <Field
              type={ FIELD_TYPE.text }
              label="Account Number"
              mix={ {
                  block: 'CheckoutArchFrom',
                  elem: 'InputTextAccountNumber'
              } }
              validationRule={ {
                  isRequired: true,
                  inputType: VALIDATION_INPUT_TYPE.numeric
              } }
              validateOn={ ['onChange'] }
              addRequiredTag
              attr={ {
                  placeholder: 'xxxx xxxx xxxx xxx',
                  'aria-label': 'AccountNumber',
                  id: 'Account_Number',
                  name: 'Account_Number'
              } }
            />
          </div>
        );
    }
}
export default CheckoutAchFormComponent;
