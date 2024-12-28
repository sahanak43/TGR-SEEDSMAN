/* eslint-disable no-magic-numbers */
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    ProductReviewsContainer as ParentProductReviewsContainer
} from 'SourceComponent/ProductReviews/ProductReviews.container';
import { showNotification } from 'Store/Notification/Notification.action';
import { DeviceType } from 'Type/Device.type';
import { ProductType } from 'Type/ProductList.type';
import { fetchQuery, getErrorMessage } from 'Util/Request';

import ProductListQuery from '../../query/ProductList.query';
import ProductReviews from './ProductReviews.component';

/** @namespace Seedsman/Component/ProductReviews/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    isEnabled: state.ConfigReducer.reviews_are_enabled,
    isGuestEnabled: state.ConfigReducer.reviews_allow_guest,
    productDetails: state.ProductReducer.product,
    device: state.ConfigReducer.device
});

/** @namespace Seedsman/Component/ProductReviews/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    showErrorNotification: (error) => dispatch(showNotification(
        'error',
        typeof error === 'string' ? error : getErrorMessage(error)
    ))
});

/** @namespace Seedsman/Component/ProductReviews/Container */
export class ProductReviewsContainer extends ParentProductReviewsContainer {
     static propTypes = {
         showInfoNotification: PropTypes.func.isRequired,
         isGuestEnabled: PropTypes.bool,
         isEnabled: PropTypes.bool,
         product: ProductType.isRequired,
         areDetailsLoaded: PropTypes.bool,
         device: DeviceType.isRequired
     };

     state = {
         isLoading: true,
         sortVal: 'MOST_RECENT',
         currentPage: 1

     };

     static defaultProps = {
         isEnabled: true,
         isGuestEnabled: true,
         areDetailsLoaded: false
     };

     containerFunctions = {
         handleSortingSelect: this.handleSortingSelect.bind(this),
         getProductsData: this.getProductsData.bind(this),
         totalPages: this.getTotalPages()
     };

     componentDidMount() {
         const { productId } = this.props;
         const { sortVal } = this.state;

         const options = {
             args: {
                 filter: { productID: productId }

             },
             isSingleProduct: true,
             sort: sortVal
         };

         this.getReviewsField(options);
     }

     _getFirstFramePage() {
         const { paginationFrame = 3 } = this.props;
         const { currentPage } = this.state;

         const totalPages = this.getTotalPages();
         const maxFirstPage = currentPage - Math.ceil(paginationFrame / 2) + 1;
         const minFirstPage = totalPages - paginationFrame + 1;

         return Math.max(1, Math.min(maxFirstPage, minFirstPage));
     }

     _getLastFramePage() {
         const { paginationFrame = 3 } = this.props;
         const { reviews } = this.state;
         if (reviews) {
             const { page_info: { total_pages } } = reviews;
             return Math.min(total_pages, this._getFirstFramePage() + paginationFrame - 1);
         }

         return null;
     }

     getTotalPages() {
         const { reviews } = this.state;
         return reviews?.page_info?.total_pages;
     }

     getProductsData(pageNumber) {
         this.setState({
             currentPage: pageNumber
         });
         const { product: { id } } = this.props;
         const { sortVal } = this.state;
         const options = {
             args: {
                 filter: { productID: id }

             },
             isSingleProduct: true,
             sort: sortVal,
             currentPage: pageNumber
         };

         this.getReviewsField(options);
     }

     handleSortingSelect(sortValue) {
         // eslint-disable-next-line fp/no-let
         let { currentPage } = this.state;
         const { sortVal } = this.state;
         const { productId } = this.props;
         if (sortVal !== sortValue) {
             currentPage = 1;
         }
         const options = {
             args: {
                 filter: { productID: productId }

             },
             isSingleProduct: true,
             sort: sortValue,
             currentPage
         };

         this.setState({ isLoading: true, sortVal: sortValue });
         this.getReviewsField(options);
     }

     async getReviewsField(options) {
         const { showErrorNotification } = this.props;

         try {
             this.setState({ isLoading: true });
             const { products: { items } } = await fetchQuery(ProductListQuery.getQuery(options));

             if (items) {
                 const { reviews } = items[0];
                 this.setState({ reviews, isLoading: false });
             }
         } catch (e) {
             showErrorNotification(getErrorMessage(e));
         }
     }

     containerProps() {
         const { reviews, sortVal } = this.state;
         const {
             areDetailsLoaded,
             device,
             isEnabled,
             product
         } = this.props;

         return {
             areDetailsLoaded,
             device,
             isEnabled,
             getLastFramePage: this._getLastFramePage(),
             getFirstFramePage: this._getFirstFramePage(),
             paginationFrame: 3,
             reviews,
             sortVal,
             product
         };
     }

     render() {
         const { isEnabled } = this.props;
         if (!isEnabled) {
             return null;
         }

         return (
             <ProductReviews
               { ...this.containerProps() }
               { ...this.containerFunctions }
             />
         );
     }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductReviewsContainer);
