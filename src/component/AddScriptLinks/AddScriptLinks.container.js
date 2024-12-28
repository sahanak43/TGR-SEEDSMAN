/* eslint-disable max-lines */
/* eslint-disable react/prop-types */
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { importLink, importScript } from 'Util/Script';
import { testimonialsWidget } from 'Util/Widget';

import AddScriptLinks from './AddScriptLinks.component';
import {
    COMPANY_REVIEWS, INSIDER_URL,
    RATINGS_CSS_URL, REVIEWS_CSS_URL, REVIEWS_ICON_URL,
    REVIEWS_PRECONNECT_URL, REVIEWS_WIDGET_URL
} from './AddScriptLinks.config';

/** @namespace Seedsman/Component/AddScriptLinks/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    insider_url: state.ConfigReducer.insider_url,
    enableReviews: state.ConfigReducer.pdp_enable,
    zendesk_status: state.ConfigReducer.zendesk_status,
    zendesk_script_url: state.ConfigReducer.zendesk_script_url,
    reviewWidgetUrl: state.ConfigReducer.reviews_widget_url
});

/** @namespace Seedsman/Component/AddScriptLinks/Container/mapDispatchToProps */
export const mapDispatchToProps = () => ({});

/** @namespace Seedsman/Component/AddScriptLinks/Container */
export class AddScriptLinksContainer extends PureComponent {
        static propTypes = {
            // TODO: implement prop-types
        };

        state = {
            isInsiderUrlAdded: false,
            isReviewsUrlAdded: false,
            isRatingCssLoaded: false,
            isZendeskAdded: false,
            isCompanyReviewsLoaded: false,
            isTestimonialsLoaded: false
        };

        componentDidMount() {
            this.renderRatingCssLoaded();
            this.renderReviewsUrl();
            this.renderInsider_url();
            this.renderAddZendeskScript();
            this.companyReviewsScript();
            this.testimonialsScript();
            this.renderTestimonialsWidget();
            this.gtmBlogContainerScript();
            document.addEventListener('click', this.toggleReadMore);
            document.addEventListener('change', this.scrollToSelectedHeading);
        }

        componentDidUpdate(__, prevState) {
            const {
                isInsiderUrlAdded: prev_insiderUrlAdded,
                isReviewsUrlAdded: prev_isReviewsUrlAdded,
                isRatingCssLoaded: prev_isRatingCssLoaded,
                isZendeskAdded: prev_isZendeskAdded,
                isCompanyReviewsLoaded: prevIsCompanyReviewsLoaded,
                isTestimonialsLoaded: prevIsTestimonialsLoaded
            } = prevState;
            const {
                isInsiderUrlAdded, isRatingCssLoaded, isReviewsUrlAdded,
                isZendeskAdded, isCompanyReviewsLoaded, isTestimonialsLoaded
            } = this.state;

            if (prev_insiderUrlAdded !== isInsiderUrlAdded) {
                this.renderInsider_url();
            }

            if (isReviewsUrlAdded !== prev_isReviewsUrlAdded) {
                this.renderReviewsUrl();
            }

            if (isRatingCssLoaded !== prev_isRatingCssLoaded) {
                this.renderRatingCssLoaded();
            }

            if (isZendeskAdded !== prev_isZendeskAdded) {
                this.renderAddZendeskScript();
            }

            if (prevIsCompanyReviewsLoaded !== isCompanyReviewsLoaded) {
                this.companyReviewsScript();
            }

            if (prevIsTestimonialsLoaded !== isTestimonialsLoaded) {
                this.testimonialsScript();
            }
        }

        toggleReadMore() {
            const current = event.target;

            const isReadMoreBtn = current.className.includes('readMoreButton');

            if (!isReadMoreBtn) {
                return;
            }

            const currentText = event.target.parentNode.querySelector('.ReadMoreText');

            currentText.classList.toggle('ReadMoreText-Visible');

            current.textContent = current.textContent.includes('Read More') ? 'Read Less' : 'Read More';
        }

        scrollToSelectedHeading(event) {
            const selectedOption = event.target.value;
            const selectedId = `${selectedOption }-section`;
            const targetHeading = document.getElementById(selectedId);

            if (targetHeading) {
                targetHeading.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        renderInsider_url() {
            const { insider_url = INSIDER_URL } = this.props;
            const isInsiderLoaded = document.getElementById('insiderScript');

            if (isInsiderLoaded === null) {
                window.insider_object = window.insider_object || {};
                importScript(insider_url, 'insiderScript');
                this.setState({
                    isInsiderUrlAdded: true
                });
            }
        }

        renderReviewsUrl() {
            const reviewsLinkLoaded = document.getElementById('reviewsUrl');

            if (reviewsLinkLoaded === null) {
                importLink('preconnect', REVIEWS_PRECONNECT_URL, 'reviewsUrl');
                this.setState({
                    isReviewsUrlAdded: true
                });
            }
        }

        renderRatingCssLoaded() {
            const ratingCssLoaded = document.getElementById('ratingsCss');

            if (ratingCssLoaded === null) {
                importLink('stylesheet', RATINGS_CSS_URL, 'ratingsCss');
                this.setState({
                    isRatingCssLoaded: true
                });
            }
        }

        renderAddZendeskScript() {
            const { zendesk_status, zendesk_script_url } = this.props;
            const isZendeskLoaded = document.getElementById('ze-snippet');
            if (zendesk_status && isZendeskLoaded === null) {
                importScript(zendesk_script_url, 'ze-snippet');
                this.setState({
                    isZendeskAdded: true
                });
            }
        }

        testimonialsScript() {
            const { reviewWidgetUrl = REVIEWS_WIDGET_URL } = this.props;
            const reviewScript = document.getElementById('testimonialWidget');

            if (reviewScript === null) {
                importScript(reviewWidgetUrl, 'testimonialWidget');
                this.setState({
                    isTestimonialsLoaded: true
                });
            }
        }

        renderTestimonialsWidget() {
            const { isTestimonialsLoaded } = this.state;
            const reviewContainer = document.getElementById('ReviewsWidget');
            const MAX_RETRIES = 5;
            // eslint-disable-next-line fp/no-let
            let retries = 0;
            const TIMEOUT = 1000;

            const scriptLoading = setInterval(() => {
                if (!isTestimonialsLoaded || typeof carouselInlineWidget !== 'function') {
                    if (retries < MAX_RETRIES) {
                        retries++;
                        this.renderTestimonialsWidget();
                    } else {
                        clearInterval(scriptLoading);
                    }
                } else {
                    if (typeof carouselInlineWidget === 'function' && reviewContainer) {
                        const script = document.createElement('script');
                        script.textContent = testimonialsWidget();

                        script.onload = () => {
                            // eslint-disable-next-line no-undef
                            const slider = carouselInlineWidget();
                            if (slider && typeof slider.stop === 'function') {
                                slider.stop();
                            }
                        };

                        script.id = 'testimonials';
                        script.async = true;
                        script.defer = true;
                        document.head.appendChild(script);
                    }
                    clearInterval(scriptLoading);
                }
            }, TIMEOUT);
        }

        gtmBlogContainerScript() {
            const script = document.createElement('script');
            script.textContent = '(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({\'gtm.start\':new Date().getTime(),event:\'gtm.js\'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!=\'dataLayer\'?\'&l=\'+l:\'\';j.async=true;j.src=\'https://www.googletagmanager.com/gtm.js?id=\'+i+dl;f.parentNode.insertBefore(j,f);})(window,document,\'script\',\'dataLayer\',\'GTM-NKFSQD42\')';
            script.id = 'GtmBlogContainerScript';
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        }

        companyReviewsScript() {
            const reviewsCssLoaded = document.getElementById('reviewCss');

            if (reviewsCssLoaded === null) {
                importLink('stylesheet', REVIEWS_CSS_URL, 'reviewCss');
                importLink('stylesheet', REVIEWS_ICON_URL, 'reviewIconCss');
                importScript(COMPANY_REVIEWS, 'companyReviews');

                this.setState({
                    isCompanyReviewsLoaded: true
                });
            }
        }

        render() {
            return (
                <AddScriptLinks />
            );
        }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddScriptLinksContainer);
