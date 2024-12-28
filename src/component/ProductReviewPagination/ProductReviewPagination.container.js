/* eslint-disable react/require-default-props */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import ProductReviewPagination from './ProductReviewPagination.component';

/** @namespace Seedsman/Component/ProductReviewPagination/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    paginationFrame: state.ConfigReducer.pagination_frame
});

/** @namespace Seedsman/Component/ProductReviewPagination/Container/mapDispatchToProps */
export const mapDispatchToProps = () => ({
});

/** @namespace Seedsman/Component/ProductReviewPagination/Container */
export class ProductReviewPaginationContainer extends PureComponent {
    static propTypes = {
        getFirstFramePage: PropTypes.func.isRequired,
        getLastFramePage: PropTypes.func.isRequired,
        currentPage: PropTypes.number.isRequired,
        paginationFrameSkip: PropTypes.number,
        siblingCount: PropTypes.number,
        totalPages: PropTypes.number.isRequired,
        getReviewsData: PropTypes.func.isRequired,
        getProductsData: PropTypes.func.isRequired,
        isLoading: PropTypes.bool,

        paginationFrame: PropTypes.number,

        anchorTextPrevious: PropTypes.string,
        anchorTextNext: PropTypes.string,
        id: PropTypes.string

    };

    static defaultProps = {
        isLoading: false,
        paginationFrame: 5,
        anchorTextPrevious: '',
        anchorTextNext: '',
        id: ''
    };

    containerProps() {
        const {
            getFirstFramePage = '',
            getLastFramePage = '',
            currentPage,
            totalPages,
            getProductsData,
            getReviewsData
        } = this.props;

        return {
            firstFramePage: getFirstFramePage,
            lastFramePage: getLastFramePage,
            currentPage,
            totalPages,
            getProductsData,
            getReviewsData
        };
    }

    render() {
        return (
            <ProductReviewPagination
              { ...this.containerProps() }
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductReviewPaginationContainer);
