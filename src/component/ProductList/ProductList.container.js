import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {
    mapDispatchToProps, mapStateToProps,
    ProductListContainer as SourceProductListContainer
} from 'SourceComponent/ProductList/ProductList.container';
import { scrollToTop } from 'Util/Browser';
import { debounce } from 'Util/Request';
import { getQueryParam } from 'Util/Url';

import { UPDATE_PAGE_FREQUENCY } from './ProductList.config';

/** @namespace Seedsman/Component/ProductList/Container */
export class ProductListContainer extends SourceProductListContainer {
    requestPage = debounce((currentPage = 1, isNext = false) => {
        const {
            sort,
            search,
            filter,
            pageSize,
            requestProductList,
            requestProductListInfo,
            noAttributes,
            noVariants,
            isWidget,
            device
        } = this.props;

        /**
         * In case the wrong category was passed down to the product list,
         * prevent it from being requested.
         */
        if (filter.categoryIds === -1) {
            return;
        }

        /**
         * Do not request page if there are no filters
         */
        if (!search && !this.isEmptyFilter()) {
            return;
        }

        // TODO: product list requests filters alongside the page
        // TODO: sometimes product list is requested more then once
        // TODO: the product list should not request itself, when coming from PDP

        const options = {
            isNext,
            noAttributes,
            noVariants,
            args: {
                sort,
                filter,
                search,
                pageSize,
                currentPage
            }
        };

        const infoOptions = {
            args: {
                filter,
                search
            }
        };

        requestProductList(options);

        if (!isWidget) {
            requestProductListInfo(infoOptions);

            if (!device.isMobile) {
                scrollToTop();
            }
        }
    }, UPDATE_PAGE_FREQUENCY);

    _getPageFromUrl(url) {
        const { location: currentLocation } = this.props;
        const location = url || currentLocation;

        return +(getQueryParam('page', location) || 1);
    }

    componentDidUpdate(prevProps) {
        const {
            sort,
            search,
            filter,
            pages,
            device
        } = this.props;
        const {
            sort: prevSort,
            search: prevSearch,
            filter: prevFilter,
            location: prevLocation
        } = prevProps;
        const { pagesCount } = this.state;
        const pagesLength = Object.keys(pages).length;
        if (pagesCount !== pagesLength) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ pagesCount: pagesLength });
        }

        const prevPage = this._getPageFromUrl(prevLocation);
        const currentPage = this._getPageFromUrl();

        if (search !== prevSearch
            || (currentPage !== prevPage && !device.isMobile)
            || JSON.stringify(sort) !== JSON.stringify(prevSort)
            || JSON.stringify(filter) !== JSON.stringify(prevFilter)
        ) {
            this.requestPage(this._getPageFromUrl());
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductListContainer));
