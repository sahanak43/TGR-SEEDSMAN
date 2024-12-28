/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
import { lazy } from 'react';

import RenderWhenVisible from 'SourceComponent/RenderWhenVisible';
import {
    HomeSlider,
    NewProducts,
    ProductListWidget,
    RecentlyViewedWidget,
    WidgetFactory as SourceWidgetFactory
} from 'SourceComponent/WidgetFactory/WidgetFactory.component';

import {
    CATALOG_PRODUCT_LIST,
    CATEGORY_LIST,
    NEW_PRODUCTS,
    NEWS_LETTER_WIDGET,
    RECENTLY_VIEWED,
    // SEEDS_FINDER,
    SLIDER,
    TOP_BRAND_SILDER
} from './WidgetFactory.config';

import 'SourceComponent/WidgetFactory/WidgetFactory.style';

// export const SeedsFinderWidget = lazy(() => import(
//     /* webpackMode: "lazy", webpackChunkName: "widget-seeds-finder" */
//     'Component/SeedFinder'
// ));

export const NewsletterSubscription = lazy(() => import(
    /* webpackMode: "lazy", webpackChunkName: "widget-seeds-finder" */
    'Component/NewsletterSubscription'
));

export const CategoryListWidgetFactory = lazy(() => import(
    /* webpackMode: "lazy", webpackChunkName: "widget-product-list" */
    'Component/CategoryListWidgetFactory'
));

export const Topbrandslider = lazy(() => import(
    'Component/TopBrands'
));

export {
    ProductListWidget,
    NewProducts,
    HomeSlider,
    RecentlyViewedWidget
};

/** @namespace Seedsman/Component/WidgetFactory/Component */
export class WidgetFactoryComponent extends SourceWidgetFactory {
    renderMap = {
        [SLIDER]: {
            component: HomeSlider,
            fallback: this.renderSliderFallback
        },
        [NEW_PRODUCTS]: {
            component: NewProducts
        },
        [CATALOG_PRODUCT_LIST]: {
            component: ProductListWidget
        },
        [CATEGORY_LIST]: {
            component: CategoryListWidgetFactory
        },
        [RECENTLY_VIEWED]: {
            component: RecentlyViewedWidget
        },
        // [SEEDS_FINDER]: {
        //     component: SeedsFinderWidget
        // },
        [NEWS_LETTER_WIDGET]: {
            component: NewsletterSubscription
        },
        [TOP_BRAND_SILDER]: {
            component: Topbrandslider
        }
    };

    renderContent() {
        const {
            type,
            sliderId = null,
            displayType,
            productsCount,
            showPager,
            storeId,
            title,
            conditionsEncoded
        } = this.props;

        const {
            component: Widget,
            fallback
        } = this.renderMap[type] || {};

        if (Widget !== undefined) {
            return (
                <RenderWhenVisible fallback={ fallback }>
                    <Widget
                      sliderId={ sliderId }
                      displayType={ displayType }
                      productsCount={ productsCount }
                      showPager={ showPager }
                      storeId={ storeId }
                      title={ title }
                      conditionsEncoded={ conditionsEncoded }
                      // eslint-disable-next-line @scandipwa/scandipwa-guidelines/jsx-no-props-destruction
                      { ...this.props }
                    />
                </RenderWhenVisible>
            );
        }

        return null;
    }
}

export default WidgetFactoryComponent;
