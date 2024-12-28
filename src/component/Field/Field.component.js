/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-props-destruction */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import FieldSelectContainer from 'Component/FieldSelect/FieldSelect.container';
import { Field as ParentField } from 'SourceComponent/Field/Field.component';
import { noopFn } from 'Util/Common';
import { getErrorIcon } from 'Util/ErrorIcon';

import { FIELD_TYPE } from './Field.config';

import './Field.override.style';

/**
  * Field
  * @class Field
  * @namespace Seedsman/Component/Field/Component  */
export class FieldComponent extends ParentField {
    // #region LABEL/TEXT RENDER
    // Renders validation error messages under field
    renderErrorMessage(message, key) {
        return <div block="Field" elem="ErrorMessage" key={ key }>{ message }</div>;
    }

    renderSelect() {
        const {
            attr,
            events,
            setRef,
            options,
            isDisabled = false,
            changeValueOnDoubleClick,
            isSortSelect,
            style,
            bablicExclude
        } = this.props;

        if (style) {
            return (
                <FieldSelectContainer
                  attr={ attr }
                  events={ events }
                  options={ options }
                  setRef={ setRef }
                  isDisabled={ isDisabled }
                  isSortSelect={ isSortSelect }
                  changeValueOnDoubleClick={ changeValueOnDoubleClick }
                  style
                />
            );
        }

        return (
            <FieldSelectContainer
              attr={ attr }
              events={ events }
              bablicExclude={ bablicExclude }
              options={ options }
              setRef={ setRef }
              isDisabled={ isDisabled }
              isSortSelect={ isSortSelect }
              changeValueOnDoubleClick={ changeValueOnDoubleClick }
            />
        );
    }

    renderErrorMessages() {
        const {
            showErrorAsLabel,
            validationResponse,
            attr: { name }
        } = this.props;

        if (!showErrorAsLabel || !validationResponse || validationResponse === true) {
            return null;
        }

        const { errorMessages = [] } = validationResponse;

        if (!errorMessages) {
            return null;
        }

        return (
          <div block="Field" elem="ErrorMessages">
              { getErrorIcon() }
              { errorMessages.map((message, index) => this.renderErrorMessage.call(this, message, name + index)) }
          </div>
        );
    }

    // Renders fields label above field
    renderLabel() {
        const { type, label, attr: { name } = {} } = this.props;

        if (!label) {
            return null;
        }

        return (
          <div block="Field" elem="LabelContainer">
                 <label block="Field" elem="Label" htmlFor={ name || `input-${type}` }>
                     { label }
                 </label>
          </div>
        );
    }

    isPreFilled() {
        const {
            validationResponse, mix, fieldRef: { value = '' } = {}, type,
            attr: { value: attrValue = '' } = {}
        } = this.props;

        const { mods: { hasError = false } = {} } = mix;

        if ([FIELD_TYPE.file, FIELD_TYPE.textarea, FIELD_TYPE.text, FIELD_TYPE.email, FIELD_TYPE.password].includes(type)) {
            if (!hasError && (validationResponse === true || validationResponse === null) && (value !== '' || attrValue !== '')) {
                return true;
            }
        }

        return false;
    }

    renderCheckboxOrRadio() {
        const {
            type,
            setRef,
            attr: { defaultChecked = false, ...newAttr } = {},
            events: { onChange },
            events,
            isDisabled,
            label
        } = this.props;
        const { id = '', checked, value = '' } = newAttr;
        const { _owner: { key = '' } = {} } = label;
        const elem = type.charAt(0).toUpperCase() + type.slice(1);
        const inputEvents = {
            ...events,
            onChange: onChange || noopFn
        };
        // if button value is "none" do not disable
        const isButtonDisabled = (!value.match('none') && isDisabled);
        const isChecked = checked || (isButtonDisabled || defaultChecked ? !isDisabled : null);

        return (
            <label htmlFor={ `${id}${key}` } block="Field" elem={ `${elem}Label` } mods={ { isDisabled } }>
                <input
                  ref={ (elem) => setRef(elem) }
                  disabled={ isButtonDisabled ? isDisabled : false }
                  type={ type }
                  { ...newAttr }
                  { ...inputEvents }
                  // shipping options have checked attr assigned so prioritize its value
                  defaultChecked={ isChecked }
                />
                <div block="input-control" disabled={ isDisabled } />
                { label }
            </label>
        );
    }

    render() {
        const {
            type, validationResponse, mix
        } = this.props;
        const inputRenderer = this.renderMap[type];
        const { mods: { hasError = false } = {} } = mix;

        return (
            <div block="Field" elem={ `Wrapper${this.isPreFilled() ? ' isPreFilled' : ''}` } mods={ { type } }>
                <div
                  block="Field"
                  mods={ {
                      type,
                      isValid: !hasError && validationResponse === true,
                      hasError: validationResponse !== true && Object.keys(validationResponse || {}).length !== 0
                  } }
                  mix={ mix }
                >
                    { type !== FIELD_TYPE.checkbox && type !== FIELD_TYPE.radio && this.renderLabel() }
                    { inputRenderer && inputRenderer() }
                </div>
                { this.renderErrorMessages() }
                { this.renderSubLabel() }
            </div>
        );
    }
}

export default FieldComponent;
