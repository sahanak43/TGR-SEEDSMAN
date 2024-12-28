/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */
/* eslint-disable no-magic-numbers */
// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { fetchQuery } from 'Util/Request';

import CategoriesQuery from '../../query/Categories.query';
import TopBrands from './TopBrands.component';

/** @namespace Seedsman/Component/TopBrands/Container */
export class TopBrandsContainer extends PureComponent {
    static propTypes = {
        // TODO: implement prop-types
    };

    containerFunctions = {
        // getData: this.getData.bind(this)
    };

    state = {
        BrandsData: {}
    };

    containerProps() {
        // isDisabled: this._getIsDisabled()
        const { BrandsData } = this.state;
        return (BrandsData);
    }

    componentDidMount() {
        this.getBrandsData();
    }

    async getBrandsData() {
        const data = CategoriesQuery.getCategoriesQuery(32);
        const { categories } = await fetchQuery(data);
        this.setState({
            BrandsData: categories
        });
    }

    render() {
        return (
            <TopBrands
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default TopBrandsContainer;
