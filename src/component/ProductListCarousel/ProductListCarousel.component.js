/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/prop-types */
/* eslint-disable max-lines */
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

import { PureComponent } from 'react';
import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import ProductCard from 'Component/ProductCard';
import { GRID_LAYOUT } from 'Route/CategoryPage/CategoryPage.config';

import 'swiper/swiper.min.css';
import 'swiper/modules/pagination/pagination.min.css';
import './ProductListCarousel.style';

/**
 * List of category products
 * @class ProductList
 * @namespace Seedsman/Component/ProductListCarousel/Component */
export class ProductListCarouselComponent extends PureComponent {
    nodes = {};

    observedNodes = [];

    pagesIntersecting = [];

    state = {
        siblingsHaveBrands: false,
        siblingsHavePriceBadge: false,
        siblingsHaveTierPrice: false,
        siblingsHaveConfigurableOptions: false
    };

    containerProps() {
        const {
            siblingsHaveBrands,
            siblingsHavePriceBadge,
            siblingsHaveTierPrice,
            siblingsHaveConfigurableOptions
        } = this.state;

        return {
            productCardFunctions: {
                setSiblingsHaveBrands: () => this.setState({ siblingsHaveBrands: true }),
                setSiblingsHavePriceBadge: () => this.setState({ siblingsHavePriceBadge: true }),
                setSiblingsHaveTierPrice: () => this.setState({ siblingsHaveTierPrice: true }),
                setSiblingsHaveConfigurableOptions: () => this.setState({ siblingsHaveConfigurableOptions: true })
            },
            productCardProps: {
                siblingsHaveBrands,
                siblingsHavePriceBadge,
                siblingsHaveTierPrice,
                siblingsHaveConfigurableOptions
            }
        };
    }

    renderTitle() {
        const { title } = this.props;

        if (!title) {
            return null;
        }

        return <h2>{ title }</h2>;
    }

    renderPlaceholders() {
        const {
            numberOfPlaceholders,
            device: { isMobile = false } = {},
            mix: { mods: { layout = GRID_LAYOUT } = {} }
        } = this.props;

        if (isMobile) {
            return Array.from({ length: numberOfPlaceholders }, (_, i) => (
                <ProductCard key={ i } product={ {} } layout={ layout } ProductcardTagStatus />
            ));
        }

        return Array.from({ length: numberOfPlaceholders }, (_, i) => (
            <SwiperSlide>
                <ProductCard key={ i } product={ {} } layout={ layout } ProductcardTagStatus />
            </SwiperSlide>
        ));
    }

    renderPlaceholderItems() {
        return (
            <>
                <li block="ProductListPage" elem="Offset" />
                { this.renderPlaceholders() }
            </>
        );
    }

    renderPageItems() {
        const {
            items,
            selectedFilters,
            mix: { mods: { layout = GRID_LAYOUT } = {} }
        } = this.props;

        return items.map((product, i) => (
           <SwiperSlide>
             <ProductCard
               ProductcardTagStatus
               product={ product }
                // eslint-disable-next-line react/no-array-index-key
               key={ i }
               selectedFilters={ selectedFilters }
               layout={ layout }
               { ...this.containerProps() }
             />
           </SwiperSlide>
        ));
    }

    renderItems() {
        const { items, isLoading } = this.props;

        if (!items.length || isLoading) {
            return this.renderPlaceholderItems();
        }

        return this.renderPageItems();
    }

    render() {
        const { device: { isMobile = false } = {}, className } = this.props;
        const SlidesPerView = className === 'ProductWidgetPreview';
        // eslint-disable-next-line no-magic-numbers
        const SlidesPerViewValue = SlidesPerView ? 1.5 : 4;

        if (isMobile) {
            return (
                <Swiper
                  modules={ [Navigation] }
                  navigation={ true }
                  spaceBetween={ 30 }
                  slidesPerView={ 2 }
                  breakpoints={ {
                      320: {
                          slidesPerView: 2,
                          spaceBetween: 15
                      },
                      640: {
                          slidesPerView: 2,
                          spaceBetween: 15
                      }
                  } }
                >
                    { this.renderItems() }
                </Swiper>
            );
        }

        return (
            <Swiper
              modules={ [Navigation, Pagination] }
              navigation
              spaceBetween={ 25 }
              slidesPerView={ SlidesPerViewValue }
              pagination={ {
                  clickable: true,
                  dynamicBullets: true

              } }
              breakpoints={ {
                  320: {
                      slidesPerView: 2,
                      spaceBetween: 15
                  },
                  640: {
                      slidesPerView: 2,
                      spaceBetween: 15
                  },
                  1200: {
                      slidesPerView: SlidesPerViewValue
                  }
              } }
            >
                { this.renderItems() }
            </Swiper>
        );
    }
}

export default ProductListCarouselComponent;
