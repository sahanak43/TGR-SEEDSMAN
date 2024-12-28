/* eslint-disable no-nested-ternary */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable no-prototype-builtins */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-magic-numbers */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable eqeqeq */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-props-destruction */
/* eslint-disable max-lines */
/* eslint-disable arrow-spacing */
/* eslint-disable max-len */
/* eslint-disable no-undef */
import { lazy, Suspense } from 'react';

import { RATINGS_WIDGET_URL, REVIEWS_WIDGET_URL } from 'Component/AddScriptLinks/AddScriptLinks.config';
import { TIMEOUT } from 'Component/BablicDropdown/BablicDropdown.config';
import ChevronIcon from 'Component/ChevronIcon';
import CmsBlock from 'Component/CmsBlock';
import ExpandableContent from 'Component/ExpandableContent';
import FIELD_TYPE from 'Component/Field/Field.config';
import Link from 'Component/Link';
import Loader from 'Component/Loader/Loader.component';
import { LAB_REPORT, PRODUCT_TYPE, SEED_COA } from 'Component/Product/Product.config';
import ProductConfigurableAttributes from 'Component/ProductConfigurableAttributes/ProductConfigurableAttributes.container';
import ProductLinks from 'Component/ProductLinks';
import ShowMoreOrLessContent from 'Component/ShowMoreOrLessContent';
import SocialShare from 'Component/SocialShare';
import TextPlaceholder from 'Component/TextPlaceholder';
import Tooltip from 'Component/Tooltip';
import NotifyStockStatusQuery from 'Query/NotifyStockStatus.query';
import { GRID_LAYOUT } from 'Route/CategoryPage/CategoryPage.config';
import Html from 'SourceComponent/Html';
import { ProductActions as ParentProductActions } from 'SourceComponent/ProductActions/ProductActions.component';
import { RELATED } from 'Store/LinkedProducts/LinkedProducts.reducer';
import { isCrawler, isSSR } from 'Util/Browser';
import { noopFn } from 'Util/Common';
import { getAttributesWithValues } from 'Util/Product';
import { fetchMutation, getErrorMessage } from 'Util/Request';
import { importScript, removeScript } from 'Util/Script';
import { getStoreCodes } from 'Util/Url';
import { ratingsWidget, reviewWidget } from 'Util/Widget';

import './ProductActions.style';

export const ProductAttributes = lazy(() => import(
    /* webpackMode: "lazy", webpackChunkName: "product-attributes" */
    'Component/ProductAttributes'
));

/**
 * Product actions
 * @class ProductActions
 * @namespace Seedsman/Component/ProductActions/Component */
export class ProductActionsComponent extends ParentProductActions {
    state = {
        isScriptLoaded: false,
        isLoading: false
    };

    handleEmailInput = this.handleEmailInput.bind(this);

    renderPriceWithGlobalSchema = this.renderPriceWithGlobalSchema.bind(this);

    handleNotify= this.handleNotify.bind(this);

    componentDidUpdate(prevProps) {
        const {
            product: { id: prevId }
        } = prevProps;
        const {
            product: { id },
            minQuantity,
            setQuantity
        } = this.props;

        if (id !== prevId) {
            this.renderReviewsWidget();
            this.renderRatingsWidget();
            this.renderSchemaScript();
            this.renderScript();
            setQuantity(minQuantity);
        }
    }

    componentDidMount() {
        this.renderReviewsWidget();
        this.renderRatingsWidget();
        this.renderSchemaScript();
        this.renderScript();
    }

    handleEmailInput(emailInput) {
        this.setState({ email: emailInput.target.value });
    }

    handleNotify() {
        const {
            website_id, showNotification, getActiveProduct, product
        } = this.props;

        const { id } = getActiveProduct();
        const { id: parentId } = product;

        const options = {
            parentId,
            id,
            website_id,
            email: ''
        };

        this.setState({ isLoading: true });

        const mutation = NotifyStockStatusQuery.getNotifyStockStatus(options);
        return fetchMutation(mutation).then(
            /** @namespace Seedsman/Component/ProductActions/Component/ProductActionsComponent/handleNotify/fetchMutation/then */
            ({ subscribeStockNotice = [] }) => {
                if (subscribeStockNotice.length && subscribeStockNotice[0]) {
                    const { message } = subscribeStockNotice[0];
                    if (message === 'true') {
                        showNotification('success', 'Stock status notify Successfully added');
                    } else {
                        showNotification('info', message);
                    }
                } else {
                    showNotification('success', 'Stock status notify Successfully added');
                }
                this.setState({ isLoading: false });
            },

            /** @namespace Seedsman/Component/ProductActions/Component/ProductActionsComponent/handleNotify/fetchMutation/then/catch */
            (error) => {
                showNotification('error', getErrorMessage(error));
                this.setState({ isLoading: false });
            }
        );
    }

    componentWillUnmount() {
        removeScript('schemaScript');
    }

    renderSchemaScript() {
        const {
            product: { attributes: { rich_snippet } = {} } = {}
        } = this.props;

        if (!rich_snippet) {
            return null;
        }

        const { attribute_value } = rich_snippet;

        if (attribute_value !== null) {
            const value = attribute_value
                .replace(/&quot;/g, '"')
                .replace(/<br \/>/g, '')
                .replace(/`/g, '');

            const script = document.createElement('script');
            script.textContent = value;
            script.type = 'application/ld+json';
            script.id = 'schemaScript';
            script.defer = true;
            return document.head.appendChild(script);
        }

        return null;
    }

    renderScript() {
        const {
            ratingWidgetUrl = RATINGS_WIDGET_URL,
            reviewWidgetUrl = REVIEWS_WIDGET_URL,
            enableReviews
        } = this.props;

        const reviewScript = document.getElementById('reviewsWidget');

        if (reviewScript === null && enableReviews) {
            importScript(reviewWidgetUrl, 'reviewsWidget');
            importScript(ratingWidgetUrl, 'ratingsScript');
            this.setState({
                isScriptLoaded: true
            });
        }
    }

    renderReviewsWidget() {
        const { isScriptLoaded } = this.state;
        const { product: { sku } = {} } = this.props;

        const scriptLoading = setInterval(() => {
            if (!isScriptLoaded && typeof ReviewsWidget !== 'function') {
                this.renderReviewsWidget();
            } else {
                if (typeof ReviewsWidget === 'function' && sku) {
                    const script = document.createElement('script');
                    script.textContent = reviewWidget(sku);
                    script.id = 'reviewsWidget';
                    script.async = true;
                    script.defer = true;
                    document.head.appendChild(script);
                }
                clearInterval(scriptLoading);
            }
        }, TIMEOUT);
    }

    renderRatingsWidget() {
        const { isScriptLoaded } = this.state;
        const { product: { sku } = {} } = this.props;

        const scriptLoading = setInterval(() => {
            if (!isScriptLoaded && typeof ratingSnippet !== 'function') {
                this.renderRatingsWidget();
            } else {
                if (typeof ratingSnippet === 'function' && sku) {
                    const script = document.createElement('script');
                    script.textContent = ratingsWidget();
                    script.id = 'ratingsWidget';
                    script.async = true;
                    script.defer = true;
                    document.head.appendChild(script);
                }
                clearInterval(scriptLoading);
            }
        // eslint-disable-next-line no-magic-numbers
        }, 1000);
    }

    renderRatings() {
        const {
            isLoading, product: { sku } = {},
            scrollToReview
        } = this.props;

        if (isLoading) {
            <Loader isLoading={ isLoading } />;
        }

        return (
            <div
              block="ProductActions"
              elem="reviewScrollButton"
              onClick={ scrollToReview }
            >
                <div className="ruk_rating_snippet" data-sku={ sku } />
            </div>
        );
    }

    renderAttributeLabels() {
        const { product: { attributes = {}, name } = {} } = this.props;

        if (!name) {
            return null;
        }

        const filteredArray = [];

        const FeaturesList = [
            'seeds_feminised',
            'seeds_flowering_type'
        ];

        if (attributes) {
            const { usp: { attribute_value } = {} } = attributes;

            if (attribute_value) {
                const attributeArray = attribute_value.split(',');
                attributeArray.map((attribute) => filteredArray.push(attributes[attribute]));
            } else {
                FeaturesList.map((attribute) => filteredArray.push(attributes[attribute]));
            }
        }

        const value = filteredArray.map((attribute) => {
            if (attribute) {
                const { attribute_type } = attribute;

                if (
                    attribute_type === 'select'
                    || attribute_type === 'multiselect'
                ) {
                    const {
                        attribute_options,
                        attribute_value
                    } = attribute;

                    return (
                        <li block="striped-row">
                            <span block="striped-col2">
                                { attribute_options[attribute_value].label }
                            </span>
                        </li>
                    );
                }
            }

            return null;
        });

        return (
            <ul block="ProductCard" elem="table-striped">
                { value }
            </ul>
        );
    }

    renderShortDescriptionContent() {
        const { product: { short_description }, scrollToDescription } = this.props;
        const { html } = short_description || {};

        return (
            <div block="ProductActions" elem="ShortDescription">
                <div itemProp="description">
                    { html ? <><h3><ShowMoreOrLessContent description={ html } /></h3></> : <p><TextPlaceholder length="long" /></p> }
                </div>
                <button block="ProductActions" elem="scrollToDescription" onClick={ scrollToDescription }>Read more</button>
            </div>
        );
    }

    renderShortDescription() {
        const { product: { short_description, id } } = this.props;
        const { html } = short_description || {};

        if (!html && id) {
            return null;
        }

        return (
            <section
              block="ProductActions"
              elem="Section"
              mods={ { type: 'short' } }
              aria-label="Product short description"
            >
                { this.renderAttributeLabels() }
                { this.renderShortDescriptionContent() }
            </section>
        );
    }

    renderSpecificAttribute() {
        const { product } = this.props;

        const attributesWithValues = getAttributesWithValues(product);

        if (!attributesWithValues?.Sex) {
            return null;
        }

        const { attribute_options, attribute_value } = attributesWithValues?.Sex;

        return (
            <p>{ attribute_options[attribute_value].label }</p>
        );
    }

    renderOfferTag() {
        const {
            product: {
                variants
            }
        } = this.props;

        const result = variants?.filter((product) => {
            const value = product.attributes?.save_x_percent?.attribute_value ?? '';
            if (value) {
                return value;
            }
        });

        if (!result || !result.length) {
            return null;
        }

        return (
            <div className="labels">
                <span>Offer</span>
            </div>
        );
    }

    renderTopSection() {
        const {
            product: {
                sku
            }
        } = this.props;

        return (
            <div block="ProductActions" elem="NameSection">
                <div className="WishlistWrapper">
                    { this.renderOfferTag() }
                    <div className="ActionBlock">
                        { this.renderShareIcons() }
                        { this.renderWishlistButton() }
                    </div>
                </div>
                { this.renderRatings() }
                { this.renderName() }
                <div block="ProductActions" elem="BrandNameAttributes">
                        { this.renderBrandName() }
                        { this.renderSpecificAttribute() }
                </div>
                { this.renderPriceWithGlobalSchema() }
                <span block="ProductActions" elem="Sku">{ sku }</span>
                { this.renderShortDescription() }
            </div>
        );
    }

    renderName(header = true, dynamic = false) {
        const {
            getActiveProduct,
            parameters,
            product: {
                name,
                sku,
                id,
                variants = [],
                category_path = []
            }
        } = this.props;

        const { sku: ActiveProductSku, id: ActiveProductId } = getActiveProduct() || {};

        // eslint-disable-next-line no-nested-ternary
        const nameToRender = dynamic ? productName : name;

        const useActiveProduct = Object.keys(parameters).length > 0;

        // eslint-disable-next-line no-nested-ternary
        const selectedSku = useActiveProduct ? ActiveProductSku : (variants.length > 0 ? variants[0]?.sku : sku);
        // eslint-disable-next-line no-nested-ternary
        const selectedId = useActiveProduct ? ActiveProductId : (variants.length > 0 ? variants[0]?.id : id);
        const categoryPaths = category_path.map((category) => category.category_path).join(' , ');
        if (!header) {
            return (
                <p
                  data-productName={ nameToRender }
                  data-productSku={ selectedSku }
                  data-productId={ selectedId }
                  data-groupItemId={ sku }
                  data-productCategoryPaths={ categoryPaths }
                  block={ this.className }
                  elem="Name"
                  bablic-exclude="true"
                >
                    <TextPlaceholder content={ nameToRender } length="medium" />
                </p>
            );
        }

        return (
            <h1
              data-productName={ nameToRender }
              data-productSku={ selectedSku }
              data-productId={ selectedId }
              data-groupItemId={ sku }
              data-productCategoryPaths={ categoryPaths }
              block={ this.className }
              elem="Title"
              bablic-exclude="true"
              itemProp="name"
            >
                <TextPlaceholder content={ nameToRender } length="medium" />
            </h1>
        );
    }

    renderConfigurableOptions() {
        const {
            setActiveProduct,
            parameters,
            product: { type_id: type, variants = {} },
            inStock,
            addToCartTriggeredWithError,
            updateAddToCartTriggeredWithError,
            showOverlay,
            getActiveProduct
        } = this.props;

        if (type !== PRODUCT_TYPE.configurable) {
            return null;
        }

        return (
            <div
              block="ProductActions"
              elem="AttributesWrapper"
            >
                <ProductConfigurableAttributes
                  // eslint-disable-next-line no-magic-numbers
                  numberOfPlaceholders={ [2, 4] }
                  updateAddToCartTriggeredWithError={ updateAddToCartTriggeredWithError }
                  addToCartTriggeredWithError={ addToCartTriggeredWithError }
                  mix={ { block: this.className, elem: 'Attributes' } }
                  parameters={ parameters }
                  variants={ variants }
                  updateConfigurableVariant={ setActiveProduct }
                  configurable_options={ this.getConfigurableAttributes() }
                  isContentExpanded
                  isPdp
                  inStock={ inStock }
                  showProductAttributeAsLink={ false }
                  renderPriceWithGlobalSchema={ this.renderPriceWithGlobalSchema }
                  showOverlay={ showOverlay }
                  getActiveProduct={ getActiveProduct }
                />
            </div>
        );
    }

    renderPriceWithGlobalSchema() {
        const {
            offerType,
            product: { type_id: type },
            productPrice: {
                price: {
                    finalPrice = {},
                    originalPrice = {}
                } = {}
            } = {}
        } = this.props;

        if (!finalPrice?.value || !originalPrice?.value) {
            return null;
        }

        if (type === PRODUCT_TYPE.grouped) {
            return null;
        }

        return (
            <div
              block="ProductActions"
              elem="Schema"
              itemType={ offerType }
              itemProp="offers"
              itemScope
            >
                { this.renderPriceWithSchema() }
            </div>
        );
    }

    renderQty() {
        return (
            <div block="ProductActions" elem="Qty_main">
                <h5 block="Heading">Select Quantity:</h5>
                { this.renderQuantityChanger() }
            </div>
        );
    }

    renderCmsBlock() {
        const { inStock, areDetailsLoaded } = this.props;

        if (!inStock) {
            return (
                <div block="ProductActions" elem="SimilarProductCms">
                    <ProductLinks
                      isPdp
                      linkType={ RELATED }
                      title="Similar products"
                      areDetailsLoaded={ areDetailsLoaded }
                    />
                </div>
            );
        }

        return (
            <div block="ProductActions" elem="PaymentMethodCms">
                <CmsBlock identifier="payment_methods" />
            </div>
        );
    }

    renderShareIcons() {
        const {
            metaLink, product: {
                id,
                small_image: { url = '' } = {}
            } = {}
        } = this.props;

        if (!url) {
            return null;
        }

        return (
            <div block="ProductActions" elem="SocialShareWrapper">
                <SocialShare description={ metaLink } productId={ id } contentType={ url } isBoth />
            </div>
        );
    }

    renderOutOfStock() {
        const { isLoading } = this.state;

        return (
            <div
              block="ProductActions"
              elem="OutOfStock"
            >
                <Loader isLoading={ isLoading } />
                <div className="label">
                    <div className="content">
                        <Tooltip
                          content={ noopFn }
                          isCenter="CENTER"
                          direction="top"
                        />
                        <span>Out of Stock</span>
                    </div>
                    <p>Email me when back in stock</p>
                </div>
                <div block="Notify" elem="Wrapper">
                    <button
                      block="Notify"
                      elem="Button"
                      type={ FIELD_TYPE.button }
                      mods={ { isHollow: true } }
                      onClick={ this.handleNotify }
                    >
                        Notify me
                        <ChevronIcon />
                    </button>
                </div>
            </div>
        );
    }

    renderAddToCartActionBlock() {
        const { inStock, device: { isMobile } = {} } = this.props;

        if (inStock) {
            return (
                <div
                  block="ProductActions"
                  elem="AddToCartWrapper"
                  mods={ { isPrerendered: isSSR() || isCrawler() } }
                >
                    { this.renderQty() }
                    { !isMobile && (
                        <>
                        { this.renderAddToCartButton(GRID_LAYOUT, true) }
                        </>
                    ) }
                </div>
            );
        }

        if (!isMobile) {
            return this.renderOutOfStock();
        }

        return null;
    }

    renderAddToCartActionBlockMobile() {
        const { inStock } = this.props;

        if (inStock) {
            return (
                <div
                  block="ProductActions"
                  elem="AddToCartWrapperMobile"
                  mods={ { isPrerendered: isSSR() || isCrawler() } }
                >
                    { this.renderAddToCartButton(GRID_LAYOUT, true) }
                </div>
            );
        }

        return this.renderOutOfStock();
    }

    renderDescription() {
        const {
            product: { description, id }
            // contentExpand
        } = this.props;
        const { html } = description || {};

        if (!html && id) {
            return null;
        }

        return (
            <ExpandableContent
              isArrow
              heading="Description"
              mix={ { block: 'ProductIn', elem: 'Content' } }
              isContentExpanded
              isHeadingRequired
            >
                <div block="ProductActions" elem="ShortDescription ProductPageDescription">
                    { html ? (
                        <Html content={ html } />
                    ) : (
                        <p>
                            <TextPlaceholder length="long" />
                        </p>
                    ) }
                </div>
            </ExpandableContent>
        );
    }

    renderReviews() {
        return (
            <div id="Sectionreviews">
                <ExpandableContent
                  mix={ { block: 'Product', elem: 'Reviews' } }
                  isContentExpanded
                  isArrow
                  heading="Reviews"
                  isHeadingRequired
                >
                    <div id="ReviewsWidget" />
                </ExpandableContent>
            </div>
        );
    }

    renderCharacteristics() {
        const {
            product: activeProduct,
            areDetailsLoaded
        } = this.props;

        return (
            <Suspense fallback={ <Loader /> }>
                <ProductAttributes
                  product={ activeProduct }
                  areDetailsLoaded={ areDetailsLoaded }
                />
            </Suspense>
        );
    }

    renderDesktopTabs() {
        const attributeToRender = [
            {
                name: 'Germination Promise',
                identifier: 'Germination-Promise',
                isExpanded: false,
                isArrow: true
            },
            {
                name: 'Buy With Confidence',
                identifier: 'Buy-With-Confidence',
                isExpanded: false,
                isArrow: true
            },
            {
                name: 'Help & Support',
                identifier: 'Help-Support',
                isExpanded: false,
                isArrow: true
            },
            {
                name: `Orders are sent from the ${getStoreCodes().toUpperCase()}`,
                identifier: 'Shipped-from-EU',
                isExpanded: false,
                flag: true,
                isArrow: true

            },
            {
                name: 'Secure Payments',
                identifier: 'SecurePayments',
                isExpanded: false
            }
        ];

        return attributeToRender.map((attribute, key) => (
            <ExpandableContent
              // eslint-disable-next-line react/no-array-index-key
              key={ key }
              isArrow
              isContentExpanded={ attribute.isExpanded }
              flag={ attribute.flag }
              heading={ attribute.name }
              mix={ { block: 'ProductIn', elem: 'Content' } }
              isHeadingRequired
            >
                <div block="ProductActions" elem={ attribute.name }>
                    <CmsBlock key={ attribute.identifier } identifier={ attribute.identifier } />
                </div>
            </ExpandableContent>
        ));
    }

    renderReportLink() {
        const { product: { attributes = {} } = {}, secureBaseUrl } = this.props;

        if (!attributes[SEED_COA]?.attribute_value && !attributes[LAB_REPORT]?.attribute_value) {
            return null;
        }

        return (
            <div block="ProductActions" elem="ReportLink">
                { attributes[SEED_COA]?.attribute_value
                    ? (
                        <Link to={ `${secureBaseUrl}catalog/product/${attributes[SEED_COA]?.attribute_code}/${attributes[SEED_COA]?.attribute_value}` } isOpenInNewTab={ true }>
                            <div block="ProductActions" elem="ReportLinkSeed">
                                SEED COA
                            <ChevronIcon />
                            </div>
                        </Link>
                    ) : null }
                { attributes[LAB_REPORT]?.attribute_value
                    ? (
                            <Link to={ `${secureBaseUrl}catalog/product/${attributes[LAB_REPORT]?.attribute_code}/${attributes[LAB_REPORT]?.attribute_value}` } isOpenInNewTab={ true }>
                                <div block="ProductActions" elem="ReportLinkSeed">
                                    Lab report
                                <ChevronIcon />
                                </div>
                            </Link>
                    ) : null }
            </div>
        );
    }

    renderSupportBlock() {
        return (
            <Link
              to="https://support.seedsman.com/hc/en-us/requests/new"
              block="ProductActions"
              elem="SupportWrapperLink"
              isOpenInNewTab={ true }
            >
                <div block="ProductActions" elem="SupportWrapper">
                    <div className="TopContent">
                        <div className="HelpCenter">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.95 18C12.3 18 12.596 17.879 12.838 17.637C13.0793 17.3957 13.2 17.1 13.2 16.75C13.2 16.4 13.0793 16.1043 12.838 15.863C12.596 15.621 12.3 15.5 11.95 15.5C11.6 15.5 11.304 15.621 11.062 15.863C10.8207 16.1043 10.7 16.4 10.7 16.75C10.7 17.1 10.8207 17.3957 11.062 17.637C11.304 17.879 11.6 18 11.95 18ZM12.1 7.7C12.5667 7.7 12.9417 7.829 13.225 8.087C13.5083 8.34567 13.65 8.68333 13.65 9.1C13.65 9.38333 13.5543 9.67067 13.363 9.962C13.171 10.254 12.9 10.5583 12.55 10.875C12.05 11.3083 11.6833 11.725 11.45 12.125C11.2167 12.525 11.1 12.925 11.1 13.325C11.1 13.5583 11.1877 13.754 11.363 13.912C11.5377 14.0707 11.7417 14.15 11.975 14.15C12.2083 14.15 12.4167 14.0667 12.6 13.9C12.7833 13.7333 12.9 13.525 12.95 13.275C13 12.9917 13.1127 12.7293 13.288 12.488C13.4627 12.246 13.75 11.9333 14.15 11.55C14.6667 11.0667 15.0293 10.625 15.238 10.225C15.446 9.825 15.55 9.38333 15.55 8.9C15.55 8.05 15.2293 7.354 14.588 6.812C13.946 6.27067 13.1167 6 12.1 6C11.4 6 10.7793 6.13333 10.238 6.4C9.696 6.66667 9.275 7.075 8.975 7.625C8.85833 7.84167 8.81667 8.054 8.85 8.262C8.88333 8.47067 9 8.64167 9.2 8.775C9.41667 8.90833 9.65433 8.95 9.913 8.9C10.171 8.85 10.3833 8.70833 10.55 8.475C10.7333 8.225 10.9543 8.03333 11.213 7.9C11.471 7.76667 11.7667 7.7 12.1 7.7ZM12 22C10.6333 22 9.34167 21.7373 8.125 21.212C6.90833 20.6873 5.846 19.975 4.938 19.075C4.02933 18.175 3.31267 17.1167 2.788 15.9C2.26267 14.6833 2 13.3833 2 12C2 10.6167 2.26267 9.31667 2.788 8.1C3.31267 6.88333 4.02933 5.825 4.938 4.925C5.846 4.025 6.90833 3.31233 8.125 2.787C9.34167 2.26233 10.6333 2 12 2C13.4 2 14.7083 2.26233 15.925 2.787C17.1417 3.31233 18.2 4.025 19.1 4.925C20 5.825 20.7083 6.88333 21.225 8.1C21.7417 9.31667 22 10.6167 22 12C22 13.3833 21.7417 14.6833 21.225 15.9C20.7083 17.1167 20 18.175 19.1 19.075C18.2 19.975 17.1417 20.6873 15.925 21.212C14.7083 21.7373 13.4 22 12 22ZM12 20C14.2333 20 16.125 19.221 17.675 17.663C19.225 16.1043 20 14.2167 20 12C20 9.78333 19.225 7.89567 17.675 6.337C16.125 4.779 14.2333 4 12 4C9.81667 4 7.93733 4.779 6.362 6.337C4.78733 7.89567 4 9.78333 4 12C4 14.2167 4.78733 16.1043 6.362 17.663C7.93733 19.221 9.81667 20 12 20Z" fill="black" />
                        </svg>
                            <span>Help & Support</span>
                        </div>
                        <span className="Subtext">
                            Go to our dedication Seedsman Support Center.
                        </span>
                    </div>
                    <div>
                        <ChevronIcon />
                    </div>
                </div>
            </Link>
        );
    }

    renderMobile() {
        return (
            <>
                { this.renderTierPrices() }
                { this.renderTopSection() }
                { this.renderAddToCartActionBlockMobile() }
                { this.renderConfigurableOptions() }
                { this.renderAddToCartActionBlock() }
                { this.renderCustomAndBundleOptions() }
                { this.renderGroupedOptions() }
                { this.renderDownloadableSamples() }
                { this.renderDownloadableLinks() }
                { this.renderCmsBlock() }
                { this.renderDescription() }
                { this.renderCharacteristics() }
                { this.renderDesktopTabs() }
                { this.renderReviews() }
                { this.renderReportLink() }
                { this.renderSupportBlock() }
            </>
        );
    }

    renderDesktop() {
        return (
            <>
                { this.renderTopSection() }
                { this.renderConfigurableOptions() }
                { this.renderCustomAndBundleOptions() }
                { this.renderGroupedOptions() }
                { this.renderDownloadableSamples() }
                { this.renderDownloadableLinks() }
                { this.renderTierPrices() }
                { this.renderAddToCartActionBlock() }
                { this.renderCmsBlock() }
                { this.renderDescription() }
                { this.renderCharacteristics() }
                { this.renderDesktopTabs() }
                { this.renderReviews() }
                { this.renderReportLink() }
                { this.renderSupportBlock() }
            </>
        );
    }

    render() {
        const { device: { isMobile } = {}, setValidator } = this.props;

        return (
            <article block="ProductActions" ref={ (elem) => setValidator(elem) }>
                { isMobile ? this.renderMobile() : this.renderDesktop() }
            </article>
        );
    }
}
export default ProductActionsComponent;
