/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
/* eslint-disable no-magic-numbers */
/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable max-len */
import {
    ProductReviewRating as SourceProductReviewRating
} from 'SourceComponent/ProductReviewRating/ProductReviewRating.component';

import './ProductReviewRating.style';

/** @namespace Seedsman/Component/ProductReviewRating/Component */
export class ProductReviewRatingComponent extends SourceProductReviewRating {
    countFormatter(count) {
        return Math.abs(count) > 999 ? `${Math.sign(count) * ((Math.abs(count) / 1000).toFixed(1)) }k` : Math.sign(count) * Math.abs(count);
    }

    render() {
        const {
            summary,
            code,
            placeholder,
            mix,
            count
        } = this.props;

        if (count === 0) {
            return null;
        }

        const ONE_FIFTH_OF_A_HUNDRED = 20;
        const rating = parseFloat(summary / ONE_FIFTH_OF_A_HUNDRED).toFixed(1);

        const ariaText = this.getAriaText(summary, code);

        if (placeholder) {
            return this.renderPlaceholder();
        }

        return (
        <div
          block="Rating"
          title={ `${summary}%` }
          ref={ this.reviewRating }
          aria-label={ ariaText }
          mix={ mix }
        >

        <div block="Rating-inner">
            <span block="Rating" elem="stars">
                <span block="Rating" elem="text">
                   { rating }
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="17.8" height="16.5" viewBox="0 0 17.8 16.5">
                    <path id="Polygon_43" data-name="Polygon 43" d="M7.978,2.2a1,1,0,0,1,1.844,0L11.11,5.271a1,1,0,0,0,.85.611l3.348.241a1,1,0,0,1,.564,1.769L13.348,9.973a1,1,0,0,0-.334,1.015l.794,3.157a1,1,0,0,1-1.487,1.1l-2.9-1.754a1,1,0,0,0-1.034,0l-2.9,1.754a1,1,0,0,1-1.487-1.1l.794-3.157a1,1,0,0,0-.334-1.015L1.928,7.892a1,1,0,0,1,.564-1.769L5.84,5.882a1,1,0,0,0,.85-.611Z" />
                </svg>
            </span>
            <span block="Rating" elem="border"> </span>
            <span block="Rating" elem="text count-text">
               { count }
            </span>
        </div>
        </div>
        );
    }
}

export default ProductReviewRatingComponent;
