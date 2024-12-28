/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-props-destruction */
/* eslint-disable no-magic-numbers */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { fetchQuery } from 'Util/Request';

import CategoryQuery from '../../query/Category.query';
import CategoryListWidget from './CategoryListWidget.component';

/** @namespace Seedsman/Component/CategoryListWidget/Container */
export class CategoryListWidgetContainer extends PureComponent {
    static propTypes = {
        type: PropTypes.string.isRequired
    };

    state = {
        isLoading: true
    };

    handleShowPopup = this.handleShowPopup.bind(this);

    componentDidMount() {
        const categoryId = this.props.dataContent['data-categoryId'];

        const option = {
            categoryIds: categoryId
        };

        this.getCategoryQueryDetails(option);
    }

    async getCategoryQueryDetails(option) {
        this.setState({ isLoading: true });
        const { category } = await fetchQuery(CategoryQuery.getQuery(option));
        this.setState({ category, isLoading: false });
    }

    handleShowPopup(e) {
        const { showPopup } = this.props;
        e.preventDefault();
        showPopup();
    }

    containerProps() {
        const { category, isLoading } = this.state;
        return { category, isLoading };
    }

    render() {
        return (
            <CategoryListWidget
              numberOfPlaceholders={ 4 }
              { ...this.props }
              { ...this.state }
            //   { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default CategoryListWidgetContainer;
