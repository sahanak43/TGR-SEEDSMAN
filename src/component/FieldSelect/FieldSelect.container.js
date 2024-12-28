/* eslint-disable no-unused-vars */
import { FieldSelectContainer as SourceFieldSelectContainer } from 'SourceComponent/FieldSelect/FieldSelect.container';

/**
 * Field Select
 * @class FieldSelectContainer
 * @namespace Seedsman/Component/FieldSelect/Container */
export class FieldSelectContainer extends SourceFieldSelectContainer {
    containerProps() {
        const {
            attr: {
                autoComplete,
                autocomplete,
                noPlaceholder,
                selectPlaceholder,
                ...attr
            } = {},
            events,
            setRef,
            isDisabled,
            isSortSelect,
            style,
            bablicExclude
        } = this.props;

        const {
            isExpanded,
            isDropdownOpenUpwards,
            isScrollable,
            isSelectedOptionAvailable
        } = this.state;

        return {
            attr: {
                ...attr,
                autoComplete: autoComplete || autocomplete
            },
            events,
            setRef,
            isDisabled,
            bablicExclude,
            isExpanded,
            isDropdownOpenUpwards,
            isScrollable,
            isSortSelect,
            isSelectedOptionAvailable,
            style,
            options: this.getOptions()
        };
    }

    isSelectedOptionAvailable() {
        const options = this.getOptions();
        const selectedOptionIndex = this.fieldRef.options.selectedIndex;
        const selectedOption = options[selectedOptionIndex];
        const isAvailable = selectedOption?.isAvailable !== false;

        this.setState({
            selectedOptionIndex,
            isSelectedOptionAvailable: isAvailable
        });
    }
}

export default FieldSelectContainer;
