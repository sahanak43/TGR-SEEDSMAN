/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable no-magic-numbers */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable fp/no-let */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
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

import Star from 'Component/StarIcon';
import {
    ProductReviewItem as SourceProductReviewItem
} from 'SourceComponent/ProductReviewItem/ProductReviewItem.component';
import { ReviewItemType } from 'Type/Rating.type';

import './ProductReviewItem.style';

/**
 * @class ProductReviewItem
 * @namespace Seedsman/Component/ProductReviewItem/Component */
export class ProductReviewItemComponent extends SourceProductReviewItem {
    static propTypes = {
        reviewItem: ReviewItemType.isRequired
    };

    getFormattedDate(created_at) {
        // Safari bug
        const d = new Date(created_at);
        let month = `${ d.getMonth() + 1}`;
        let day = `${ d.getDate()}`;
        const year = d.getFullYear();

        if (month.length < 2) {
            month = `0${ month}`;
        }
        if (day.length < 2) {
            day = `0${ day}`;
        }

        return [day, month, year].join('/');
    }

    renderReviewListItemRating(ratingVoteItem, i) {
        const {
            percent
        } = ratingVoteItem;

        return (
            <>
            <div
              key={ i }
              block="ProductReviewItem"
              elem="RatingSummaryItem"
              itemType="http://schema.org/Rating"
              itemScope
              itemProp="reviewRating"
            >
                <meta itemProp="ratingValue" content={ percent } />
                <meta itemProp="worstRating" content={ 0 } />
                <meta itemProp="bestRating" content={ 100 } />

            </div>
                { /* <span className="fa fa-star checked" />
                <span className="fa fa-star checked" />
                <span className="fa fa-star checked" />
                <span className="fa fa-star checked" />
                <span className="fa fa-star-o" /> */ }
            </>
        );
    }

    renderAuthor(reviewItem) {
        const { nickname, created_at } = reviewItem;

        return (
            <p block="ProductReviewItem" elem="ReviewAuthor">
                <div block="ProductReviewItem" elem="ReviewAuthors">
                { nickname }
                </div>
                <div block="ProductReviewItem" elem="ReviewDate">
                <meta itemProp="datePublished" content={ this.getFormattedDate(created_at) } />
                { this.getFormattedDate(created_at) }
                </div>
            </p>
        );
    }

    renderReturnStars(ratingCount) {
        const streets = [];
        for (let i = 0; i < ratingCount; i++) {
            streets.push(i);
        }

        return streets;
    }

    renderFullStars() {
        return (<Star starFill="full" />);
    }

    renderEmptyStars() {
        return (<Star starFill="empty" />);
    }

    renderTotalCount() {
        const {
            reviewItem: {
                rating_votes
            }
        } = this.props;

        let ratingCount = rating_votes[0]?.value;
        if (!ratingCount) {
            ratingCount = 0;
        }
        const ratingStarsArr = this.renderReturnStars(ratingCount);
        const restRatingStarsArr = this.renderReturnStars(5 - ratingCount);
        return (
            <>
            <div block="ProductReviews" elem="totalRatingStars">
               { ratingStarsArr.map(() => (this.renderFullStars())) }
               { restRatingStarsArr.map(() => (this.renderEmptyStars())) }
            </div>
               <div block="ProductReviews" elem="totalCounts">

            { (rating_votes[0]?.value) ? (`${rating_votes[0]?.value}.0`) : '' }
               </div>
            </>
        );
    }

    render() {
        const {
            reviewItem,
            reviewItem: {
                title,
                detail,
                rating_votes
            }
        } = this.props;

        return (
            <>
            <li
              block="ProductReviewItem"
              itemType="http://schema.org/Review"
              itemProp="review"
              itemScope
            >
                <div block="ProductReviewItem" elem="ReviewTotal">
                    <div block="ProductReviewItem" elem="ReviewTitle">
                        { title }
                    </div>
                    <div block="ProductReviewItem" elem="ReviewRating">
                        { this.renderTotalCount() }
                    </div>
                </div>
                <div block="ProductReviewItem" elem="RatingSummary">
                    { rating_votes.map(this.renderReviewListItemRating) }
                </div>
                <div block="ProductReviewItem" elem="Content">
                    <p block="ProductReviewItem" elem="ReviewDetails" itemProp="reviewBody">
                        { detail }
                    </p>
                    { this.renderAuthor(reviewItem) }
                </div>
            </li>
            <div className="ProductReviews-Border" />
            </>
        );
    }
}

export default ProductReviewItemComponent;
