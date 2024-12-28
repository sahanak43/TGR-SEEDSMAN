import { FieldContainer as SourceFieldContainer } from 'SourceComponent/Field/Field.container';
import { validate } from 'Util/Validator';

import { FIELD_TYPE } from './Field.config';

/**
 * Field
 * @class FieldContainer
 * @namespace Seedsman/Component/Field/Container */
export class FieldContainer extends SourceFieldContainer {
    state = {
        validationResponse: null,
        showLengthError: false,
        currentField: null
    };

    clearErrorMessage() {
        const { validationResponse: { errorMessages = [], value } = {} } = this.state;

        if (errorMessages && !value) {
            setTimeout(() => {
                this.resetField();
            // eslint-disable-next-line no-magic-numbers
            }, 5000);
        }
    }

    validate(data) {
        const {
            validationRule: { range: { max: maxValidLength = 0 } = {} }, type, attr: { name } = {}
        } = this.props;
        const { showLengthError } = this.state;
        const value = type === FIELD_TYPE.checkbox || type === FIELD_TYPE.radio
            ? !!this.fieldRef.checked
            : this.fieldRef.value;
        const newValidRule = this.handleShowLengthError();
        const response = validate(type === FIELD_TYPE.file
            ? value.toLowerCase()
            : value, newValidRule);
        const output = response !== true ? { ...response, type, name } : response;

        // If validation is called from different object you can pass object
        // to store validation error values
        if (data && data.detail && response !== true) {
            if (!data.detail.errors) {
                // eslint-disable-next-line no-param-reassign
                data.detail.errors = [];
            }

            // Validates length on submit, renders special message
            if (maxValidLength && value.length > maxValidLength && !showLengthError) {
                this.setState({ showLengthError: true });
                output.errorMessages.unshift(__('Please enter no more than %s characters.', maxValidLength));
            }

            data.detail.errors.push(output);
        }

        // When submit and response equals true (it can be object) reset show length error
        if (response === true) {
            this.setState({ showLengthError: false });
        }

        this.setState({ validationResponse: output }, () => this.clearErrorMessage());

        return output;
    }

    // Adds validation event listener to field
    setRef(elem) {
        const { validationRule, elemRef } = this.props;

        if (elem && this.fieldRef !== elem) {
            this.fieldRef = elem;
            this.setState({
                currentField: this.fieldRef
            });

            if (elemRef) {
                elemRef.current = elem;
            }

            elem.addEventListener('resetField', this.resetField.bind(this));

            if (!validationRule || Object.keys(validationRule).length === 0) {
                return;
            }

            elem.addEventListener('validate', this.validate.bind(this));
        }
    }

    containerProps() {
        const {
            events,
            validateOn,
            type,
            attr: {
                autoComplete,
                autocomplete,
                ...attr
            } = {},
            isDisabled,
            mix,
            value,
            options,
            showErrorAsLabel,
            label,
            subLabel,
            addRequiredTag,
            changeValueOnDoubleClick,
            isSortSelect,
            bablicExclude
        } = this.props;
        const { validationResponse, lengthError, currentField } = this.state;
        const { validate } = this.containerFunctions;

        // Surrounds events with validation
        const newEvents = { ...events };
        validateOn.forEach((eventName) => {
            const { [eventName]: baseEvent } = events;
            newEvents[eventName] = baseEvent ? this.validateOnEvent.bind(this, baseEvent) : validate;
        });

        return {
            type,
            attr: {
                ...attr,
                autoComplete: autoComplete || autocomplete
            },
            value,
            isDisabled,
            bablicExclude,
            mix,
            options,
            showErrorAsLabel,
            label,
            subLabel,
            addRequiredTag,
            changeValueOnDoubleClick,
            isSortSelect,
            validationResponse,
            events: newEvents,
            fieldRef: this.fieldRef || currentField,
            setRef: this.setRef.bind(this),
            lengthError
        };
    }
}

export default FieldContainer;
