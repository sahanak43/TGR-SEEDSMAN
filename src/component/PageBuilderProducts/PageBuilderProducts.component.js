/* eslint-disable no-unused-vars */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-props-destruction */
/* eslint-disable max-len */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
// import PropTypes from 'prop-types';
import { lazy, PureComponent } from 'react';

import './PageBuilderProducts.style';

export const ProductListWidget = lazy(() => import(
    /* webpackMode: "lazy", webpackChunkName: "widget-product-list" */
    'Component/ProductListWidget'
));

export const ProductListCarouselWidget = lazy(() => import(
    /* webpackMode: "lazy", webpackChunkName: "widget-product-carousel" */
    'Component/ProductListCarousel'
));

/** @namespace Seedsman/Component/PageBuilderProducts/Component */
export class PageBuilderProductsComponent extends PureComponent {
    static propTypes = {
        // TODO: implement prop-types
    };

    __construct(props) {
        super.__construct(props);

        const { PageBuilderProducts, CatalogProductWidget } = props.elements;
        this.pagebuilderProductsProps = PageBuilderProducts.propsBag.length > 0
            ? PageBuilderProducts.propsBag[0]
            : {};
        this.catalogProductsWidgetProps = CatalogProductWidget.propsBag.length > 0
            ? CatalogProductWidget.propsBag[0]
            : [];
    }

    render() {
        const {
            'data-appearance': dataApperance,
            'data-autoplay': dataAutoplay,
            'data-autoplay-speed': dataAutoplaySpeed,
            'data-carousel-mode': dataCarouselMode,
            'data-content-type': dataContentType,
            'data-infinite-loop': dataInfiniteLoop,
            'data-show-arrows': dataShowArrows,
            'data-show-dots': dataShowDots,
            className
        } = this.pagebuilderProductsProps;

        if (dataApperance === 'carousel') {
            return (
                <div block="PageBuilderProducts">
                    <ProductListCarouselWidget
                      { ...{
                          dataAutoplay,
                          dataAutoplaySpeed,
                          dataCarouselMode,
                          dataContentType,
                          dataInfiniteLoop,
                          dataShowArrows,
                          dataShowDots,
                          className
                      } }
                      { ...this.catalogProductsWidgetProps }
                    />
                </div>
            );
        }

        return (
            <div block="PageBuilderProducts">
                <ProductListWidget { ...this.catalogProductsWidgetProps } />
            </div>
        );
    }
}

export default PageBuilderProductsComponent;
