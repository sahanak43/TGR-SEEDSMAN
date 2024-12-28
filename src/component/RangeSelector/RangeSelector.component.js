/* eslint-disable no-magic-numbers */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable no-console */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
// import PropTypes from 'prop-types';
// import PropTypes from 'prop-types';
// import Slider, { Range } from 'rc-slider';
import { PureComponent } from 'react';
import InputRange from 'react-input-range';

import { formatPrice } from 'Util/Price';

import 'react-input-range/lib/css/index.css';
import './RangeSelector.style';

/** @namespace Seedsman/Component/RangeSelector/Component */
export class RangeSelectorComponent extends PureComponent {
    /**
     * Get selected value
     * @return {Number}
     */
    getValue() {
        const { value: stateValue } = this.state;
        const { minPrice, maxPrice } = this.props;

        return {
            min: stateValue.min !== minPrice ? minPrice : stateValue.min,
            max: stateValue.max !== minPrice ? maxPrice : stateValue.max
        };
    }

    __construct() {
        super.__construct();
        this.handleRangeChange.bind(this);
        this.onChangeComplete.bind(this);
        this.state = {
            value: { min: 0, max: 99999 }
        };
    }

    onChangeComplete() {
        const {
            handleOptionClick,
            attribute
        } = this.props;

        const { value } = this.state;

        const attribute_value = `${value.min}_${value.max}`;
        handleOptionClick({
            attribute_code: attribute,
            attribute_value
        });
    }

    handleRangeChange(value) {
        this.setState({ value });
    }

    render() {
        const { currencyCode, appliedMin, appliedMax } = this.props;
        const { value } = this.state;
        // eslint-disable-next-line fp/no-let
        let appliedValue = {};

        // const { min, max } = this.getValue();
        if (appliedMin !== 0 && appliedMax !== 0) {
            appliedValue = {
                min: appliedMin,
                max: appliedMax
            };
        } else {
            appliedValue = { ...value };
        }
        const {
            minPrice, maxPrice
        } = this.props;

        return (
           <div block="RangeSelector" elem="Wrapper">
             <InputRange
               minValue={ minPrice }
               maxValue={ maxPrice }
               value={ appliedValue }
               onChangeComplete={ () => this.onChangeComplete() }
               onChange={ (value) => this.handleRangeChange(value) }
             />
             <div block="RangeSelector" elem="DetailsWrapper">
               <span block="RangeSelector" elem="PriceItem">
                { appliedMin === 0 ? formatPrice(minPrice, currencyCode) : formatPrice(appliedMin, currencyCode) }
               </span>
                <div block="RangeSelector" elem="PriceDivider">
                    TO
                </div>
                <span block="RangeSelector" elem="PriceItem">
                { appliedMax === 0 ? formatPrice(maxPrice, currencyCode) : formatPrice(appliedMax, currencyCode) }
                </span>
             </div>
           </div>
        );
    }
}

export default RangeSelectorComponent;
