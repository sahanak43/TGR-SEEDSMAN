/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
/* eslint-disable max-lines */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable no-console */
import { lazy, Suspense } from 'react';

import BackIcon from 'Component/BackIcon';
import CategoryItemsCount from 'Component/CategoryItemsCount';
import CategoryProductList from 'Component/CategoryProductList';
import CategorySort from 'Component/CategorySort';
import ContentWrapper from 'Component/ContentWrapper';
import Html from 'Component/Html';
import Image from 'Component/Image';
import Overlay from 'Component/Overlay';
import RingFencedCustomerPopup from 'Component/RingFencedCustomerPopup';
import ShowMoreOrLessContent from 'Component/ShowMoreOrLessContent';
import TextPlaceholder from 'Component/TextPlaceholder';
import { CategoryPage as SourceCategoryPage } from 'SourceRoute/CategoryPage/CategoryPage.component';
import {
    DISPLAY_MODE_BOTH,
    DISPLAY_MODE_PRODUCTS,
    GRID_LAYOUT
} from 'SourceRoute/CategoryPage/CategoryPage.config';
import { isCrawler, isSSR } from 'Util/Browser';

import { CATEGORY_SORT_OVERLAY_ID } from './CategoryPage.config';

import './CategoryPage.style';

export const CategoryFilterOverlay = lazy(() => import(
    /* webpackMode: "lazy", webpackChunkName: "overlays-category-overi" */ 'Component/CategoryFilterOverlay'
));

/** @namespace Seedsman/Route/CategoryPage/Component */
export class CategoryPageComponent extends SourceCategoryPage {
    onSortButtonClick = this.onSortButtonClick.bind(this);

    onSortButtonClick() {
        const { toggleOverlayByKey } = this.props;
        toggleOverlayByKey(CATEGORY_SORT_OVERLAY_ID);
    }

    renderSortButton() {
        const { totalPages, isMatchingInfoFilter } = this.props;

        if (!isMatchingInfoFilter) {
            return (
                <div
                  block="CategoryPage"
                  elem="Sort"
                >
                  { this.renderFilterButtonPlaceholder() }
                </div>
            );
        }

        if (totalPages === 0) {
            return null;
        }

        return (
            <button
              block="CategoryPage"
              elem="Sort"
              onClick={ this.onSortButtonClick }
            >
                <span>SORT BY</span>
            </button>
        );
    }

    renderLayoutButtons() {
        return null;
    }

    renderCategoryDescription() {
        const {
            category: { description, id },
            isCurrentCategoryLoaded, search
        } = this.props;

        if (!description || search) {
            return null;
        }

        if (!id || !isCurrentCategoryLoaded) {
            return this.renderCategoryDescriptionPlaceholder();
        }

        return <ShowMoreOrLessContent description={ description } />;
    }

    renderCategoryDescriptionPlaceholder() {
        return (
            <TextPlaceholder length="long" />
        );
    }

    renderCategoryAdditionalDescription() {
        const {
            category: { additional_description, id },
            isCurrentCategoryLoaded
        } = this.props;

        if (!additional_description) {
            return null;
        }

        if (!id || !isCurrentCategoryLoaded) {
            return this.renderCategoryDescriptionPlaceholder();
        }

        return (
            <div block="CategoryPage" elem="additional_description">
                <Html content={ additional_description } />
            </div>
        );
    }

    renderCategoryName() {
        const {
            category: { name, id }
        } = this.props;

        if (id && !name) {
            return null;
        }

        return (
            <h1 block="CategoryDetails" elem="Heading">
                { this.renderCategoryText() }
            </h1>
        );
    }

    renderCategoryText() {
        const {
            category: { name },
            isCurrentCategoryLoaded
        } = this.props;

        if (isCurrentCategoryLoaded) {
            return <TextPlaceholder content={ name } />;
        }

        return <TextPlaceholder />;
    }

    renderCategoryImage() {
        const {
            category: { image },
            search
        } = this.props;

        if (!image || search) {
            return null;
        }

        return (
            <div block="CategoryPage" elem="CategoryImage">
                <Image
                  mix={ {
                      block: 'CategoryPage',
                      elem: 'Picture'
                  } }
                  src={ image || '' }
                  ratio="custom"
                  objectFit="cover"
                />
            </div>
        );
    }

    renderItemsCount(isVisibleOnMobile = false) {
        const { isMatchingListFilter, isMobile } = this.props;

        if (!isVisibleOnMobile && isMobile) {
            return null;
        }

        return (
            <CategoryItemsCount isMatchingListFilter={ isMatchingListFilter } />
        );
    }

    renderContent() {
        const {
            isCurrentCategoryLoaded,
            isMobile,
            search,
            totalPages,
            category: { display_mode = DISPLAY_MODE_BOTH } = {}
        } = this.props;
        const showBoth = display_mode === DISPLAY_MODE_PRODUCTS && isCurrentCategoryLoaded;

        return (
            <>
                { this.renderFilterOverlay() }
                { search ? this.renderCategoryDetails() : null }
                { this.renderSortOverlay() }
                { isMobile && !search ? (
                    <div block="CategoryPage" elem="MobileHeadings">
                        { showBoth ? this.renderCategoryImage() : null }
                        <div
                          block="CategoryDetails"
                          elem={ `Wrapper ${!showBoth ? 'Products' : ''}` }
                        >
                            { this.renderCategoryName() }
                            { totalPages ? this.renderItemsCount(true) : null }
                        </div>
                    </div>
                ) : null }
                { this.renderMiscellaneous() }
                { this.renderCategoryDescription() }
                { this.renderCmsBlock() }
                { this.renderCategoryProductList() }
            </>
        );
    }

    renderCategoryProductList() {
        const {
            filter,
            search,
            selectedSort,
            selectedFilters,
            isMatchingListFilter,
            isCurrentCategoryLoaded,
            isMatchingInfoFilter,
            isMobile
        } = this.props;

        const { activeLayoutType } = this.state;

        if (!this.displayProducts()) {
            return null;
        }

        // eslint-disable-next-line no-magic-numbers
        const currentPageSize = isMobile ? 10 : 9;

        return (
            <div
              block="CategoryPage"
              elem="ProductListWrapper"
              mods={ { isPrerendered: isSSR() || isCrawler() } }
            >
                { !isMobile && this.renderItemsCount(true) }
                <CategoryProductList
                  pageSize={ currentPageSize }
                  filter={ filter }
                  search={ search }
                  sort={ selectedSort }
                  selectedFilters={ selectedFilters }
                  isCurrentCategoryLoaded={ isCurrentCategoryLoaded }
                  isMatchingListFilter={ isMatchingListFilter }
                  isMatchingInfoFilter={ isMatchingInfoFilter }
                  layout={ activeLayoutType || GRID_LAYOUT }
                />
                { this.renderCategoryAdditionalDescription() }
            </div>
        );
    }

    renderSeeResults() {
        const { onSeeResultsClick } = this.props;

        return (
            <div block="CategorySortOverlay" elem="SeeResults">
                <button
                  block="CategorySortOverlay"
                  elem="Button"
                  mix={ { block: 'Button' } }
                  onClick={ onSeeResultsClick }
                >
                    APPLY
                </button>
            </div>
        );
    }

    renderCategorySort() {
        const {
            sortFields,
            selectedSort,
            onSortChange,
            isMatchingInfoFilter,
            isMobile
        } = this.props;

        const { options = {} } = sortFields;
        const updatedSortFields = Object.values(options).map(
            ({ value: id, label }) => ({ id, label })
        );
        const { sortDirection, sortKey } = selectedSort;

        if (isMobile && !isMatchingInfoFilter) {
            return this.renderFilterButtonPlaceholder();
        }

        return (
            <>
                <div block="CategoryPage" elem="SortLabel">
                    Sort:
                </div>
                <CategorySort
                  isMatchingInfoFilter={ isMatchingInfoFilter }
                  onSortChange={ onSortChange }
                  sortFields={ updatedSortFields }
                  sortKey={ sortKey }
                  sortDirection={ sortDirection }
                />
                { isMobile ? this.renderSeeResults() : null }
            </>
        );
    }

    renderSelectOptionPopup() {
        const { onVisible, onHide, onSeeResultsClick } = this.props;

        return (
            <Overlay
              onVisible={ onVisible }
              onHide={ onHide }
              mix={ { block: 'CategorySortOverlay' } }
              id={ CATEGORY_SORT_OVERLAY_ID }
              isRenderInPortal={ false }
            >
                <div block="CategorySortOverlay" elem="Wrapper">
                    <header block="CategorySortOverlay" elem="SortHeader">
                        <div className="action-icons">
                            <button
                              block="CategorySortOverlay"
                              elem="BackButton"
                              onClick={ onSeeResultsClick }
                            >
                                <BackIcon />
                            </button>
                            <span>SORT BY</span>
                        </div>
                    </header>
                    { this.renderCategorySort() }
                </div>
            </Overlay>
        );
    }

    renderLayoutAndSorter(mods) {
        const { isMobile, search } = this.props;
        const isLandingPage = mods;

        if (search) {
            return null;
        }

        return (
            <div
              block="CategoryPage"
              elem="MiscellaneousLayoutWrapper"
              mods={ { isLandingPage } }
            >
                <div
                  block="CategoryPage"
                  elem="LayoutWrapper"
                  mods={ { isPrerendered: isSSR() || isCrawler() } }
                >
                    { this.renderLayoutButtons() }
                    { !isMobile ? this.renderCategorySort() : null }
                </div>
            </div>
        );
    }

    renderFilterButton() {
        const {
            isContentFiltered,
            totalPages,
            category: { is_anchor },
            isSearchPage,
            isCurrentCategoryLoaded,
            isMatchingInfoFilter
        } = this.props;

        if (!isMatchingInfoFilter) {
            return this.renderFilterButtonPlaceholder();
        }

        if (
            (!isContentFiltered && totalPages === 0)
            || (!is_anchor && !isSearchPage)
            || !isCurrentCategoryLoaded
        ) {
            return null;
        }

        return (
            <button
              block="CategoryPage"
              elem="Filter"
              onClick={ this.onFilterButtonClick }
            >
                <span>Filter</span>
                { this.renderFiltersCount() }
            </button>
        );
    }

    renderMiscellaneous() {
        const {
            isCurrentCategoryLoaded,
            isMobile,
            search,
            totalPages
        } = this.props;

        if (search && !isMobile) {
            return null;
        }

        return (
            <aside block="CategoryPage" elem="Miscellaneous">
                { !isMobile ? (
                    <div block="CategoryPage" elem="Miscellaneous-Left">
                        { this.renderCategoryName() }
                        { this.renderItemsCount() }
                    </div>
                ) : null }
                { totalPages ? (
                    <div
                      block="CategoryPage"
                      elem="LayoutWrapperFilter"
                      mods={ { isPrerendered: isSSR() || isCrawler() } }
                    >
                        { this.renderFilterButton() }
                    </div>
                ) : null }
                { /* show if display mode  Products */ }
                { isMobile
                    ? this.renderSortButton()
                    : null }
                { isCurrentCategoryLoaded && !isMobile
                    ? this.renderLayoutAndSorter()
                    : null }
            </aside>
        );
    }

    renderFilterOverlay() {
        const {
            filters, selectedFilters, isMatchingInfoFilter, isSearchPage
        } = this.props;

        const {
            category: { image }
        } = this.props;

        const {
            category: { is_anchor }
        } = this.props;

        if (!this.displayProducts()) {
            return null;
        }

        return (
            <Suspense fallback={ this.renderFilterPlaceholder() }>
                <CategoryFilterOverlay
                  availableFilters={ filters }
                  customFiltersValues={ selectedFilters }
                  isMatchingInfoFilter={ isMatchingInfoFilter }
                  isCategoryAnchor={ !!is_anchor }
                  isSearchPage={ isSearchPage }
                  categoryImage={ image }
                  renderPlaceholder={ this.renderPlaceholder }
                />
            </Suspense>
        );
    }

    renderSortOverlay() {
        if (!this.displayProducts()) {
            return null;
        }

        return (
            <Suspense fallback={ this.renderFilterPlaceholder() }>
                { this.renderSelectOptionPopup() }
            </Suspense>
        );
    }

    renderPopup() {
        const {
            isCurrentCategoryLoaded,
            ringFencedStatus
        } = this.props;

        if (!isCurrentCategoryLoaded || !ringFencedStatus) {
            return null;
        }

        return (
            <RingFencedCustomerPopup />
        );
    }

    render() {
        const hideProducts = !this.displayProducts();
        const { totalItems } = this.props;

        return (
            <main block="CategoryPage" mods={ { noResults: totalItems === 0 } }>
                <ContentWrapper
                  wrapperMix={ {
                      block: 'CategoryPage',
                      elem: 'Wrapper',
                      mods: { hideProducts }
                  } }
                  label="Category page"
                >
                    { this.renderContent() }
                </ContentWrapper>
                { this.renderPopup() }
            </main>
        );
    }
}

export default CategoryPageComponent;
