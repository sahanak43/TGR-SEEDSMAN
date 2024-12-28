/* eslint-disable no-magic-numbers */
/* eslint-disable array-callback-return */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable max-lines */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
/* eslint-disable no-undef */
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

import PropTypes from 'prop-types';

import ExpandableContent from 'Component/ExpandableContent';
import Field from 'Component/Field';
import FIELD_TYPE from 'Component/Field/Field.config';
import ProductReviewList from 'Component/ProductReviewList';
import ProductReviewPagination from 'Component/ProductReviewPagination';
import ProductReviewRating from 'Component/ProductReviewRating';
import Star from 'Component/StarIcon';
import { ProductReviews as ParentProductReviews } from 'SourceComponent/ProductReviews/ProductReviews.component';
import { DeviceType } from 'Type/Device.type';
import { ProductType } from 'Type/ProductList.type';
import { showNewReviewPopup } from 'Util/Product';

import './ProductReviews.style';

/** @namespace Seedsman/Component/ProductReviews/Component */
export class ProductReviewsComponent extends ParentProductReviews {
    static propTypes = {
        product: ProductType.isRequired,
        areDetailsLoaded: PropTypes.bool.isRequired,
        getProductsData: PropTypes.func.isRequired,
        device: DeviceType.isRequired
    };

    renderButton() {
        return (
            <button
              block="ProductReviews"
              elem="Button"
              mix={ { block: 'Button', mods: { isHollow: true } } }
              onClick={ showNewReviewPopup }
            >
                Write a review
            </button>
        );
    }

    renderNoRating() {
        const {
            device: { isMobile }
        } = this.props;

        if (isMobile) {
            return (
                <p>
                    There are no reviews yet! Click button below to submit one!
                </p>
            );
        }

        return (
            <p>
                There are no reviews yet! Click button on the right to submit one!
            </p>
        );
    }

    renderRatingSchema(percent, reviewCount) {
        return (
            <>
                <meta itemProp="ratingValue" content={ percent } />
                <meta itemProp="worstRating" content={ 0 } />
                <meta itemProp="bestRating" content={ 100 } />
                <meta itemProp="reviewCount" content={ reviewCount } />
            </>
        );
    }

    getReviewTitle() {
        const {
            product: { review_summary: { review_count } = {} },
            device: { isMobile }
        } = this.props;

        if (review_count === '0') {
            return null;
        }

        return (
            <span block="ProductReviews" elem="DropdownTitle">
                Reviews
                { isMobile
                    ? (
                        <div block="ProductReviews" elem="totalRating">
                            { this.renderTotalRatingData() }
                        </div>
                    )
                    : '' }
            </span>
        );
    }

    renderTotalRatingData() {
        const {
            product: {
                review_summary: {
                    rating_summary,
                    review_count
                } = {}
            }
        } = this.props;

        if (!review_count) {
            return null;
        }

        return (
            <ProductReviewRating summary={ rating_summary || 0 } count={ review_count } />
        );
    }

    renderRatingData() {
        const {
            product: { review_summary: { rating_summary, review_count } = {} }
        } = this.props;

        const STARS_COUNT = 5;
        const PERCENT = 100;

        // eslint-disable-next-line no-mixed-operators
        const percent = parseFloat(
            (STARS_COUNT * (rating_summary || 0)) / PERCENT
        ).toFixed(2);

        return (
            <div block="ProductReviews" elem="SummaryDetails">
                     <div block="ProductReviews" elem="ReviewDetails">
                        <div block="ProductReviews" elem="ReviewCount">
                            { percent }
                        </div>
                        <Star starFill="full" />
                     </div>
                     <div block="ProductReviews" elem="ReviewBy">
                     <span>
                        { __(`Reviewed by  ${review_count}`, review_count || 0) }
                         customers
                     </span>
                     </div>
            </div>
        );
    }

    renderRatingStarsData() {
        const { product: { rating_breakDown, review_count } } = this.props;

        return (
            <div block="ProductReviews" elem="RatingStarsDetails">
               { rating_breakDown?.map((breakDownVal) => (
                    <div block="ProductReviews" elem="RatingStarsCount">
                        <div block="ProductReviews" elem="starPercentage" />
                        <div block="ProductReviews" elem="RatingCount">{ breakDownVal?.value }</div>
                        <Star starFill="full" />
                        <div className="bar-container">
                            { this.renderBarRatingCode(breakDownVal?.count, review_count) }
                        </div>
                        <div block="ProductReviews" elem="RatingPerson">{ breakDownVal?.count }</div>

                    </div>
               )) }
            </div>
        );
    }

    renderBarRatingCode(ratingCount, review_count) {
        const ratingPer = Math.floor((ratingCount / review_count) * 100);

        return (
                <div block="ProductReviews" elem="bar" style={ { width: `${ratingPer}%` } } />
        );
    }

    renderPagination() {
        const {
            reviews, getFirstFramePage, getLastFramePage, getProductsData
        } = this.props;

        if (reviews) {
            const { page_info: { current_page, total_pages } } = reviews;

            return (
                <ProductReviewPagination
                  getFirstFramePage={ getFirstFramePage }
                  getLastFramePage={ getLastFramePage }
                  currentPage={ current_page }
                  paginationFrame={ 3 }
                  totalPages={ total_pages }
                  getProductsData={ getProductsData }
                  mix={ { block: 'ProductReviews', elem: 'Pagination' } }
                />
            );
        }

        return null;
    }

    renderSummary() {
        const {
            product: { review_summary: { review_count } = {} }
        } = this.props;

        return (
            <>
                <div block="ProductReviews" elem="ReviewsButton">
                 { this.renderButton() }
                </div>
                { !review_count ? this.renderNoRating() : '' }
                <div
                  block="ProductReviews"
                  elem="Summary"
                  itemType={ review_count
                      ? 'http://schema.org/AggregateRating'
                      : null }
                  itemProp={ review_count ? 'aggregateRating' : null }
                  itemScope={ review_count ? true : null }
                >
                    { review_count ? this.renderRatingData() : '' }
                    { review_count ? this.renderRatingStarsData() : '' }

                </div>

               { review_count ? (
                   <>
                <div className="ProductReviews-Border" />
                <div block="ProductReviews" elem="TotalRating">
                    { this.renderTotalCount() }
                </div>
                   </>
               ) : '' }

                { this.renderList() }
            </>
        );
    }

    renderTotalCount() {
        const {
            product: { review_summary: { review_count } = {} },
            handleSortingSelect,
            sortVal
        } = this.props;

        const reviewSortList = [{ value: 'MOST_RECENT', label: 'Most Recent' },
            { value: 'LAST_WEEK', label: 'Last Week' },
            { value: 'LAST_MONTH', label: 'Last Month' },
            { value: 'LAST_YEAR', label: 'Last Year' }];

        return (
            <div block="ProductReviews" elem="totalCount">
                <div block="ProductReviews" elem="totalReviewCount">
                    { __(`${review_count} Reviews`, review_count || 0) }
                </div>
            <div block="ProductReviews" elem="reviewSorting">
                    <Field
                      type={ FIELD_TYPE.select }
                      attr={ {
                          id: 'reviewSortList',
                          name: 'reviewSortList',
                          defaultValue: sortVal,
                          noPlaceholder: true
                      } }
                      events={ {
                          onChange: (e) => handleSortingSelect(e)
                      } }
                      options={ reviewSortList }
                    />
            </div>
            </div>
        );
    }

    renderList() {
        const { reviews = [], product: { review_count } } = this.props;

        if (!review_count) {
            return null;
        }

        return <ProductReviewList product={ reviews } />;
    }

    render() {
        return (
            <ExpandableContent
              heading={ this.getReviewTitle() }
              mix={ { block: 'ProductReviews', elem: 'Content' } }
            >
                { this.renderSummary() }
                { this.renderPagination() }
            </ExpandableContent>
        );
    }
}

export default ProductReviewsComponent;
