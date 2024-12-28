/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines */
/* eslint-disable react/boolean-prop-naming */
/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import ProductListQuery from 'Query/ProductList.query';
import { updateNoMatch } from 'Store/NoMatch/NoMatch.action';
import { showNotification } from 'Store/Notification/Notification.action';
import { getIndexedProducts } from 'Util/Product';
import DataContainer from 'Util/Request/DataContainer';

import ProductListCarousel from './ProductListCarousel.component';

/** @namespace Seedsman/Component/ProductListCarousel/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    device: state.ConfigReducer.device
});

/** @namespace Seedsman/Component/ProductListCarousel/Container/mapDispatchToProps */
export const mapDispatchToProps = () => ({
    updateNoMatch,
    showNotification
});

/** @namespace Seedsman/Component/ProductListCarousel/Container */
export class ProductListCarouselContainer extends DataContainer {
    containerFunctions = {
        requestProductList: this.requestProductList.bind(this),
        updateLoadStatus: this.updateLoadStatus.bind(this)
    };

    __construct(props) {
        super.__construct(props, 'ProductListCarouselContainer', false);
    }

    containerProps() {
        const { device, className } = this.props;
        const { items, isLoading } = this.state;
        return {
            items,
            isLoading,
            device,
            className
        };
    }

    state = {
        items: [],
        totalItems: 0,
        totalPages: 0,
        isLoading: true
    };

    componentDidMount() {
        const {
            sort,
            noAttributes,
            noVariants,
            productsCount,
            conditionsEncoded: conditions
        } = this.props;

        const options = {
            isNext: false,
            noAttributes,
            noVariants,
            args: {
                sort,
                filter: { conditions },
                pageSize: productsCount,
                currentPage: 1
            }
        };

        this.requestProductList(options);
    }

    onError = this.onError.bind(this);

    updateProductListItems = this.updateProductListItems.bind(this);

    dataModelName = 'ProductListWidget';

    onError(error) {
        const { showNotification, updateNoMatch } = this.props;
        showNotification('error', 'Error fetching Product List!', error);
        updateNoMatch(true);
    }

    updateProductListItems(data) {
        const {
            products: {
                items,
                total_count: totalItems
            } = {}
        } = data;

        this.setState({
            isLoading: false,
            totalItems,
            items: getIndexedProducts(items)
        });
    }

    updateLoadStatus(isLoading) {
        this.setState({ isLoading });
    }

    requestProductList(options) {
        const { isNext } = options;

        if (!isNext) {
            this.updateLoadStatus(true);
        }
        this.fetchData(
            [ProductListQuery.getQuery(options)],
            this.updateProductListItems,
            this.onError
        );
    }

    render() {
        const { device: { isMobile } } = this.props;
        return (
            <ProductListCarousel
              numberOfPlaceholders={ isMobile ? 2 : 4 }
              mix={ { block: 'ProductListWidget' } }
              { ...this.containerProps() }
              { ...this.containerFunctions }
            />
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductListCarouselContainer));
