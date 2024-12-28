/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
import { lazy, Suspense } from 'react';

import ContentWrapper from 'Component/ContentWrapper';
import Loader from 'Component/Loader/Loader.component';
import ProductActions from 'Component/ProductActions';
import ProductLinks from 'Component/ProductLinks';
import NoMatchHandler from 'Route/NoMatchHandler';
import { ProductPage as SourceProductPage } from 'SourceRoute/ProductPage/ProductPage.component';
import { RELATED, UPSELL } from 'Store/LinkedProducts/LinkedProducts.reducer';

export const ProductGallery = lazy(() => import(
    /* webpackMode: "lazy", webpackChunkName: "product-gallery" */
    'Component/ProductGallery'
));

/** @namespace Seedsman/Route/ProductPage/Component */
export class ProductPageComponent extends SourceProductPage {
    renderProductTabs() {
        return null;
    }

    renderAdditionalSections() {
        const {
            areDetailsLoaded
        } = this.props;

        return (
            <>
                { this.renderProductTabs() }
                <ProductLinks
                  linkType={ RELATED }
                  title="Recommended for you"
                  areDetailsLoaded={ areDetailsLoaded }
                />
                <ProductLinks
                  linkType={ UPSELL }
                  title="You may also like"
                  areDetailsLoaded={ areDetailsLoaded }
                />
            </>
        );
    }

    renderLeftContent() {
        const {
            areDetailsLoaded,
            activeProduct,
            useEmptyGallerySwitcher,
            isVariant
        } = this.props;

        return (
            <div block="ProductPage" elem="left-content">
                <Suspense fallback={ <Loader /> }>
                <ProductGallery
                  product={ activeProduct }
                  areDetailsLoaded={ areDetailsLoaded }
                  isWithEmptySwitcher={ useEmptyGallerySwitcher }
                  showLoader={ isVariant }
                />
                </Suspense>
            </div>
        );
    }

    renderProductPageContent() {
        const {
            getLink,
            dataSource,
            areDetailsLoaded,
            setActiveProduct,
            parameters
        } = this.props;

        return (
            <>
                { this.renderLeftContent() }
                <div block="ProductPage" elem="right-content">
                    <ProductActions
                      getLink={ getLink }
                      product={ dataSource }
                      parameters={ parameters }
                      areDetailsLoaded={ areDetailsLoaded }
                      setActiveProduct={ setActiveProduct }
                    />
                </div>
            </>
        );
    }

    render() {
        return (
            <NoMatchHandler>
                <main
                  block="ProductPage"
                  aria-label="Product page"
                  itemScope
                  itemType="http://schema.org/Product"
                >
                    <ContentWrapper
                      wrapperMix={ { block: 'ProductPage', elem: 'Wrapper' } }
                      label="Main product details"
                    >
                        { this.renderProductPageContent() }
                    </ContentWrapper>
                    { this.renderAdditionalSections() }
                    { /* { this.renderReviewPopup() } */ }
                </main>
            </NoMatchHandler>
        );
    }
}

export default ProductPageComponent;
