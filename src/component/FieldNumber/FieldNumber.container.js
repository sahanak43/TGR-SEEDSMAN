/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-did-update-set-state */

import PropTypes from 'prop-types';

import { FieldNumberContainer as SourceFieldNumberContainer } from 'SourceComponent/FieldNumber/FieldNumber.container';
import { EventsType, FieldAttrType } from 'Type/Field.type';
import { DEFAULT_MAX_PRODUCTS } from 'Util/Product/Extract';

import FieldNumber from './FieldNumber.component';

/**
  * Field Number
  * @class FieldNumberContainer
  * @namespace Seedsman/Component/FieldNumber/Container */
export class FieldNumberContainer extends SourceFieldNumberContainer {
     static propTypes = {
         // Field attributes
         attr: FieldAttrType.isRequired,
         events: EventsType.isRequired,
         setRef: PropTypes.func.isRequired,
         isDisabled: PropTypes.bool.isRequired,
         value: PropTypes.number.isRequired
     };

     state = {
         value: 0
     };

     containerFunctions = {
         handleValueChange: this.handleValueChange.bind(this),
         setRef: this.setRef.bind(this)
     };

     componentDidMount() {
         const { attr: { defaultValue = 0 } } = this.props;
         this.handleInitialLoad(defaultValue);
     }

     componentDidUpdate(prevProps) {
         const { attr: { min, defaultValue = min } = {} } = this.props;
         const { attr: { defaultValue: prevDefaultValue } = {} } = prevProps;
         const { value } = this.state;

         if (defaultValue <= 0 || prevDefaultValue <= 0) {
             this.setState({ value: min });
         }

         if (defaultValue !== prevDefaultValue) {
             this.setState({ value: defaultValue });
         }

         if (defaultValue <= min) {
             this.handleInitialLoad(value);
         }
     }

     setRef(elem) {
         const { setRef } = this.props;
         setRef(elem);

         if (elem && this.fieldRef !== elem) {
             this.fieldRef = elem;
         }
     }

     setValue(value1) {
         const {
             attr: { min = 0, max = DEFAULT_MAX_PRODUCTS } = {}
         } = this.props;

         const { value: stateValue } = this.state;

         // eslint-disable-next-line no-nested-ternary
         const rangedValue = value1 <= min ? min : value1 > max ? max : value1;
         if (stateValue >= 0) {
             this.fieldRef.value = value1;
             this.setState({ value: value1 });

             return rangedValue;
         }

         return null;
     }

     handleInitialLoad(value) {
         const {
             events: { onLoad } = {}
         } = this.props;

         const newValue = this.setValue(value);
         if (typeof onLoad === 'function') {
             onLoad(newValue);
         }
     }

     handleValueChange(value) {
         const {
             events: { onChange } = {}
         } = this.props;

         this.handleInitialLoad(value);

         const newValue = this.setValue(value);

         if (typeof onChange === 'function') {
             onChange(newValue);
         }
     }

     containerProps() {
         const {
             attr: {
                 autoComplete,
                 autocomplete,
                 defaultValue,
                 ...attr
             } = {},
             value,
             events,
             setRef,
             isDisabled
         } = this.props;

         const { value: stateValue } = this.state;

         return {
             attr: {
                 ...attr,
                 autoComplete: autoComplete || autocomplete
             },
             value,
             events,
             setRef,
             isDisabled,
             stateValue
         };
     }

     render() {
         return (
             <FieldNumber
               { ...this.containerProps() }
               { ...this.containerFunctions }
             />
         );
     }
}

export default FieldNumber;
