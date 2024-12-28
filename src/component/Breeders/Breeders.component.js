/* eslint-disable react/jsx-no-bind */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-props-destruction */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable max-lines */

import PropTypes from 'prop-types';
import {
    createRef, lazy, PureComponent, Suspense
} from 'react';

import BackIcon from 'Component/BackIcon';
import CategoriesSort from 'Component/CategoriesSort';
import { CATEGORY_FILTER_OVERLAY_ID } from 'Component/CategoryFilterOverlay/CategoryFilterOverlay.config';
import Field from 'Component/Field';
import FIELD_TYPE from 'Component/Field/Field.config';
import Image from 'Component/Image';
import Link from 'Component/Link';
import Overlay from 'Component/Overlay';
import Pagination from 'Component/Pagination';
import TextPlaceholder from 'Component/TextPlaceholder';
import { DeviceType } from 'Type/Device.type';

import ContentWrapperComponent from '../ContentWrapper/ContentWrapper.component';
import { CATEGORY_SORT_OVERLAY_ID, DISPLAY_MODE_BOTH, DISPLAY_MODE_PRODUCTS } from './Breeders.config';

import './Breeders.style.scss';

export const CategoriesFilter = lazy(() => import(
    /* webpackMode: "lazy", webpackChunkName: "overlays-category-overi" */ 'Component/CategoriesFilter'
));
/** @namespace Seedsman/Component/Breeders/Component */
export class BreedersComponent extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        device: DeviceType.isRequired

    };

    fieldRef = createRef();

    onFilterButtonClick = this.onFilterButtonClick.bind(this);

    renderSublabel = this.renderSublabel.bind(this);

    renderCategoryTitle() {
        const { categories: { total_count = '' }, isLoading, device: { isMobile } } = this.props;

        return (
            <div block="CategoryListWidgetBreeders" elem="HeadingContent">
                  { isLoading ? <TextPlaceholder mod="sort" length="medium" /> : <h1 block="CategoryListWidget" elem="categoryTitle">Shop By Breeder</h1> }
                  <div block="CategoryListWidgetBreeders" elem="totalResult">
                  { isLoading ? <TextPlaceholder /> : `${total_count} Results` }
                  </div>
                  { !isMobile ? (
                    <div block="CategoryListWidgetBreeders" elem="Sort">
                                        <div block="CategoryListWidgetBreeders" elem="sortLabel"><label>Sort:</label></div>
                                            { this.renderCategoriesSorting() }
                    </div>
                  ) : '' }

            </div>
        );
    }

    renderSublabel(subLabel) {
        if (!subLabel) {
            return null;
        }

        return (
            <div block="CategoryListWidgetBreeders" elem="filterCount">
                <strong
                  block="ProductAttributeValue"
                  elem="SubLabel"
                >
                { /* { subLabel } */ }
                </strong>
            </div>
        );
    }

    getSortingOrderList() {
        const orderSortList = [{ label: 'Position', value: '' }, { label: 'Ascending', value: 'ASC' },
            { label: 'Descending', value: 'DESC' }];

        return orderSortList;
    }

    renderCategoriesSorting() {
        const { handleSortingSelect, sortVal, isLoading } = this.props;
        if (isLoading) {
            return <TextPlaceholder />;
        }

        return (
        <div block="CategoryListWidgetBreeders" elem="SortField">
        <Field
          type={ FIELD_TYPE.select }
          attr={ {
              id: 'CategoryListWidgetBreeders',
              name: 'CategoryListWidgetBreeders',
              defaultValue: sortVal,
              noPlaceholder: true
          } }
          events={ {
              onChange: (e) => handleSortingSelect(e)
          } }
          options={ this.getSortingOrderList() }
        />
        </div>
        );
    }

    renderCategoryDetails(children) {
        return (

            children?.map((subCategory) => this.renderSubcategory(subCategory)));
    }

    renderSubCategoryIcon(icon) {
        return (
            <div block="CategoryListWidget" elem="subCategoryItemIcon">
                   <Image
                     mix={ { block: 'CategoryListWidget', elem: 'FigureImage' } }
                     ratio="custom"
                     src={ icon }
                     isPlaceholder={ !icon }
                   />

            </div>
        );
    }

    renderShopNowButton(url) {
        return (
                 <Link
                   to={ url }
                   block="Button CategoryListWidget"
                   elem="ShopNow"
                   id="ShopNow"
                   onClick={ () => {
                       document.documentElement.scrollIntoView({ block: 'start' });
                   } }
                 >
                     <span block="CategoryListWidget" elem="ShopNowButtonText">
                    Shop Now
                     </span>
                 </Link>
        );
    }

    renderFilterHeading() {
        const { isLoading } = this.props;
        return (
            <div block="CategoryListWidgetBreeders" elem="Heading">
                <div block="CategoryListWidgetBreeders" elem="FilterHeading">
                <div block="CategoryListWidgetBreeders" elem="FilterTitle">
                  { isLoading ? <TextPlaceholder /> : 'FILTERS' }
                </div>
                <div block="CategoryListWidgetBreeders" elem="ResetSection">
                  { this.renderResetButton() }
                </div>
                </div>
                <div block="CategoryListWidgetBreeders" elem="HeadingBorder" />
            </div>
        );
    }

    renderResetButton() {
        const { filterName, resetFilterValue } = this.props;
        if (!filterName) {
            return null;
        }

        return (
            <div
              block="CategoryListWidgetBreeders"
              elem="ResetButton"
            >
                <button
                  onClick={ resetFilterValue }
                  block="ResetButton"
                  elem="Button"
                  mix={ {
                      block: 'Button',
                      mods: { isHollow: true }
                  } }
                >
                    clear
                </button>
            </div>
        );
    }

    renderFilterOverlay() {
        const {
            onFilterChange,
            isMatchingInfoFilter,
            selectedValue
        } = this.props;

        if (!this.displayProducts()) {
            return null;
        }

        return (
            <Suspense fallback={ this.renderFilterPlaceholder() }>
                <CategoriesFilter
                  onFilterChange={ onFilterChange }
                  availableFilters={ this.categoryFilter() }
                  selectedFilters={ selectedValue?.filterDirections }
                  isMatchingInfoFilter={ isMatchingInfoFilter }
                  renderPlaceholder={ this.renderPlaceholder }
                />
            </Suspense>
        );
    }

    renderFilterTitle() {
        return (
            <div block="CategoryListWidgetBreeders" elem="Title">
                Shop By Alphabetic Order
            </div>
        );
    }

    onFilterButtonClick() {
        const { showOverlay } = this.props;
        showOverlay(CATEGORY_FILTER_OVERLAY_ID);
    }

    categoryFilter() {
        const alphabet = ['All', '0-9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
            'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        return alphabet;
    }

    renderCategoryFilter() {
        const { onFilterNameClick, categories: { total_count }, filterName } = this.props;

        const FilterData = this.categoryFilter();
        const subLabel = total_count;
        return (
            <div block="CategoryListWidget" elem="breedersFilter">
                { FilterData.map((filterLabel) => (
                     <div block="CategoryListWidgetBreeders" elem="breedersFilterData">
                        <Field
                          ref={ this.fieldRef }
                          type={ FIELD_TYPE.radio }
                          attr={ {
                              id: 'category-sort',
                              name: 'category-sort',
                              defaultValue: filterLabel,
                              noPlaceholder: true,
                              checked: filterName === filterLabel
                          } }
                          events={ { onChange: () => onFilterNameClick(filterLabel) } }
                          label={ filterLabel }
                          mix={ { block: 'CategoryListWidgetBreeders', elem: 'Checkbox' } }
                        />
                         { this.renderSublabel(subLabel) }
                     </div>
                )) }
            </div>
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

    renderCategorySort() {
        const {
            device: { isMobile }, onSortChange, sortVal
        } = this.props;

        return (
            <>
            <CategoriesSort
              onSortChange={ onSortChange }
              sortFields={ this.getSortingOrderList() }
              selectedSortVal={ sortVal }
            />
            { isMobile ? this.renderSeeResults() : null }
            </>
        );
    }

    renderSeeResults() {
        const { onSeeResultsClick } = this.props;

        return (
            <div
              block="CategorySortOverlay"
              elem="SeeResults"
            >
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

    renderSubCategoryName(name) {
        const { isLoading } = this.props;

        return (
            <div block="CategoryListWidget" elem="subCategoryItemTitle">
                { isLoading ? <TextPlaceholder /> : name }
            </div>
        );
    }

    renderPagination() {
        const {
            isLoading,
            categories: {
                page_info
            }
        } = this.props;

        if (!page_info?.total_pages) {
            return null;
        }

        return (
            <Pagination
              isLoading={ isLoading }
              totalPages={ page_info?.total_pages }
              mix={ { block: 'MyAccountMyOrders', elem: 'Pagination' } }
            />
        );
    }

    renderSortButton() {
        const { totalPages, onSortButtonClick } = this.props;
        if (totalPages === 0) {
            return null;
        }

        return (
            <button
              block="CategoryListWidgetBreeders"
              elem="SortBy"
              onClick={ onSortButtonClick }
            >
                <span>SORT BY</span>
            </button>
        );
    }

    renderFilterButton() {
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

    renderFiltersCount() {
        // const { appliedFiltersCount } = this.props;

        return (
            <span block="CategoryPage" elem="Subheading">
                { /* { ` (${appliedFiltersCount})` } */ }
            </span>
        );
    }

    renderMiscellaneous() {
        return (
            <aside block="CategoryListWidgetBreeders" elem="Miscellaneous">
                <div block="CategoryListWidgetBreeders" elem="LayoutWrapperFilter">
                { this.renderFilterButton() }
                </div>
                { this.renderSortButton() }

            </aside>
        );
    }

    renderBlockPlaceholder() {
        const {
            numberOfPlaceholders
        } = this.props;

        return Array.from({ length: numberOfPlaceholders }, (_, i) => (

            <div block="CategoryListWidget" elem="subCategoryItem" key={ i }>
                <div block="CategoryListWidget" elem="subCategoryItemContent">
                { this.renderSubCategoryIcon() }
                { this.renderSubCategoryName() }
                </div>
            </div>

        ));
    }

    renderSubcategory(subCategoryItem) {
        const { isLoading } = this.props;

        if (isLoading) {
            return this.renderBlockPlaceholder();
        }

        return (

            <div block="CategoryListWidget" elem="subCategoryItem">
                <div block="CategoryListWidget" elem="subCategoryItemContent">
                { this.renderSubCategoryIcon(subCategoryItem?.category_icon) }
                { this.renderSubCategoryName(subCategoryItem?.name) }

                { this.renderShopNowButton(subCategoryItem?.url) }

                </div>
            </div>
        );
    }

    displayProducts() {
        const {
            category: {
                display_mode = DISPLAY_MODE_PRODUCTS
            } = {}
        } = this.props;

        return display_mode === null
            || display_mode === DISPLAY_MODE_PRODUCTS
            || display_mode === DISPLAY_MODE_BOTH;
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

    rendernoCategories() {
        return (
            <div block="CategoryListWidgetBreeders" elem="RenderNoCategories">
               No Data Found
            </div>
        );
    }

    renderFilterPlaceholder() {
        return (
            <div block="CategoryPage" elem="PlaceholderWrapper">
                <div block="CategoryPage" elem="PlaceholderContainer">
                    <h3 block="CategoryPage" elem="PlaceholderHeading">
                        Filters
                    </h3>
                    <div block="CategoryPage" elem="PlaceholderList">
                        <div block="CategoryPage" elem="PlaceholderListItem" />
                        <div block="CategoryPage" elem="PlaceholderListItem" />
                        <div block="CategoryPage" elem="PlaceholderListItem" />
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const { categories, device: { isMobile } } = this.props;

        return (

                <ContentWrapperComponent>
                    <div block="CategoryListWidgetBreeders">
                    { !isMobile
                        ? (
                        <div block="CategoryListWidgetBreeders" elem="Filters">
                         { this.renderFilterHeading() }
                            { this.renderFilterTitle() }
                            { this.renderCategoryFilter() }

                        </div>
                        ) : this.renderMiscellaneous() }
                        <div block="CategoryListWidgetBreeders" elem="category">
                            { this.renderCategoryTitle() }
                            <div block="CategoryListWidgetBreeders" elem="SubCategory">
                            { (categories?.total_count === 0) ? this.rendernoCategories() : '' }
                             { (categories?.items) ? this.renderCategoryDetails(categories?.items) : (
                                 <>
                                 { this.renderBlockPlaceholder() }

                                 </>
                             ) }
                            </div>
                            { this.renderPagination() }
                        </div>
                        { isMobile
                            ? (
                                <>
                            { this.renderFilterOverlay() }
                            { this.renderSortOverlay() }

                                </>
                            ) : '' }

                    </div>
                </ContentWrapperComponent>

        );
    }
}

export default BreedersComponent;
