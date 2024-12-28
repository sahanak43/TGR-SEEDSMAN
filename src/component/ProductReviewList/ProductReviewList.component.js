import ProductReviewItem from 'Component/ProductReviewItem';
import {
    ProductReviewList as SourceProductReviewList
} from 'SourceComponent/ProductReviewList/ProductReviewList.component';

import './ProductReviewList.style';

/**
 * @class ProductReviewList
 * @namespace Seedsman/Component/ProductReviewList/Component */
export class ProductReviewListComponent extends SourceProductReviewList {
    renderReviews() {
        const { product: { items } } = this.props;

        return items?.map((reviewItem, i) => (
            <ProductReviewItem
              reviewItem={ reviewItem }
              // eslint-disable-next-line react/no-array-index-key
              key={ i }
            />
        ));
    }

    renderNoReview() {
        return (
            <div block="ProductReviews" elem="NoReviews"> There are no reviews available.</div>
        );
    }

    render() {
        const { product } = this.props;
        const hasReviews = product.items && Object.keys(product.items).length > 0;

        if (!hasReviews) {
            return this.renderNoReview();
        }

        return (
            <ul block="ProductReviewList">
                { this.renderReviews() }
            </ul>
        );
    }
}

export default ProductReviewListComponent;
