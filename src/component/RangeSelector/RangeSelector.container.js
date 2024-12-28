/* eslint-disable fp/no-let */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-props-destruction */
/* eslint-disable react/prop-types */
// import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import RangeSelector from './RangeSelector.component';

/** @namespace Seedsman/Component/RangeSelector/Container/mapStateToProps */
export const mapStateToProps = (_state) => ({
    minPrice: _state.ProductListReducer.min_price,
    maxPrice: _state.ProductListReducer.max_price
});

/** @namespace Seedsman/Component/RangeSelector/Container/mapDispatchToProps */
export const mapDispatchToProps = (_dispatch) => ({
    // addProduct: options => CartDispatcher.addProductToCart(dispatch, options)
});

/** @namespace Seedsman/Component/RangeSelector/Container */
export class RangeSelectorContainer extends PureComponent {
    static propTypes = {
        // TODO: implement prop-types
    };

    containerFunctions = {
        // getData: this.getData.bind(this)
    };

    containerProps = () => {
        const {
            attribute,
            handleOptionClick,
            currencyCode,
            minPrice,
            maxPrice
        } = this.props;

        const {
            customFilters
        } = this.urlStringToObject();

        let appliedMin = 0;
        let appliedMax = 0;

        if (typeof customFilters !== 'undefined') {
            const appliedFilters = customFilters.split(';');
            // eslint-disable-next-line array-callback-return
            appliedFilters.map((filter) => {
                if (filter.match('price')) {
                    // eslint-disable-next-line no-unused-vars
                    const [price, value] = filter.split(':');
                    // eslint-disable-next-line no-unused-vars
                    const [min, max] = value.split('_');
                    appliedMin = min;
                    appliedMax = max;
                }
            });
        }

        return {
            handleOptionClick,
            attribute,
            currencyCode,
            minPrice,
            maxPrice,
            appliedMin,
            appliedMax
        };
    };

    urlStringToObject() {
        const { location: { search = '' } = {} } = this.props;

        return search.substr(1).split('&').reduce((acc, part) => {
            const [key, value] = part.split('=');

            return { ...acc, [key]: value };
        }, {});
    }

    render() {
        return (
            <RangeSelector
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RangeSelectorContainer);
