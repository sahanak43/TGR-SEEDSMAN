import { connect } from 'react-redux';

import { mapDispatchToProps as sourceMapDispatchToProps } from 'Component/Product/Product.container';
import {
    mapStateToProps as sourceMapStateToProps, ProductActionsContainer as SourceProductActionsContainer
} from 'SourceComponent/ProductActions/ProductActions.container';
import { showNotification } from 'Store/Notification/Notification.action';
import { toggleOverlayByKey } from 'Store/Overlay/Overlay.action';
import { getFixedElementHeight } from 'Util/CSS';

/** @namespace Seedsman/Component/ProductActions/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    ...sourceMapStateToProps(state),
    reviewWidgetUrl: state.ConfigReducer.reviews_widget_url,
    enableReviews: state.ConfigReducer.pdp_enable,
    enableRatings: state.ConfigReducer.plp_enable,
    ratingWidgetUrl: state.ConfigReducer.reviews_url,
    website_id: state.ConfigReducer.website_id,
    storeCode: state.ConfigReducer.code,
    secureBaseUrl: state.ConfigReducer.secure_base_media_url
});

/** @namespace Seedsman/Component/ProductActions/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    ...sourceMapDispatchToProps(dispatch),
    showOverlay: (overlayKey) => dispatch(toggleOverlayByKey(overlayKey)),
    showNotification: (type, message) => dispatch(showNotification(type, message))
});

/** @namespace Seedsman/Component/ProductActions/Container */
export class ProductActionsContainer extends SourceProductActionsContainer {
    containerFunctions = {
        ...this.containerFunctions,
        showOnlyIfLoaded: this.showOnlyIfLoaded.bind(this),
        scrollToReview: this.scrollToReview.bind(this),
        scrollToDescription: this.scrollToDescription.bind(this)
    };

    containerProps() {
        const {
            areDetailsLoaded,
            areReviewsEnabled,
            displayProductStockStatus,
            getLink,
            isInStockAlertEnabled,
            isPriceAlertEnabled,
            enableRatings,
            ratingWidgetUrl,
            reviewWidgetUrl,
            enableReviews,
            website_id,
            showNotification,
            showOverlay,
            storeCode,
            secureBaseUrl
        } = this.props;

        const { contentExpand } = this.state;

        return {
            ...super.containerProps(),
            areDetailsLoaded,
            areReviewsEnabled,
            displayProductStockStatus,
            getLink,
            isInStockAlertEnabled,
            isPriceAlertEnabled,
            isPricePreview: this.isPricePreview(),
            offerCount: this.getOfferCount(),
            offerType: this.getOfferType(),
            stockMeta: this.getStockMeta(),
            metaLink: this.getMetaLink(),
            enableRatings,
            ratingWidgetUrl,
            reviewWidgetUrl,
            enableReviews,
            website_id,
            showNotification,
            showOverlay,
            storeCode,
            secureBaseUrl,
            contentExpand
        };
    }

    scrollToExpandedContent(elem) {
        const elemToWindowTopDist = elem.getBoundingClientRect().top;
        const windowToPageTopDist = document.body.getBoundingClientRect().top;
        const topToElemDistance = elemToWindowTopDist - windowToPageTopDist;
        const {
            total: totalFixedElementHeight,
            bottom: bottomFixedElementHeight
        } = getFixedElementHeight();

        const elemMaxOffsetHeight = screen.height > elem.offsetHeight + bottomFixedElementHeight
            ? elem.offsetHeight
            : screen.height - totalFixedElementHeight;
        const scrollTo = topToElemDistance - (screen.height - bottomFixedElementHeight - elemMaxOffsetHeight);

        // checking if button is in a view-port
        if (-windowToPageTopDist >= scrollTo) {
            return;
        }

        window.scrollTo({ behavior: 'smooth', top: scrollTo });
    }

    scrollToReview() {
        const reviewId = document.getElementById('Sectionreviews');
        this.scrollToExpandedContent(reviewId);
    }

    scrollToDescription() {
        const elem = document.getElementsByClassName('ProductPageDescription')[0];
        this.setState({
            contentExpand: true
        });
        this.scrollToExpandedContent(elem);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductActionsContainer);
