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

import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import BackIcon from 'Component/BackIcon';
import Field from 'Component/Field';
import FIELD_TYPE from 'Component/Field/Field.config';
import Loader from 'Component/Loader';
import Overlay from 'Component/Overlay';
// import ResetAttributes from 'Component/ResetAttributes';
import ResetButton from 'Component/ResetButton';
import { AttributesType } from 'Type/ProductList.type';

import { CATEGORY_FILTER_OVERLAY_ID } from './CategoryFilterOverlay.config';

import './CategoriesFilter.style';

/** @namespace Seedsman/Component/CategoriesFilter/Component */
export class CategoriesFilterComponent extends PureComponent {
    handleFilter = this.handleFilter.bind(this);

     static propTypes = {
         isInfoLoading: PropTypes.bool.isRequired,
         selectedFilters: AttributesType.isRequired,
         availableFilters: AttributesType.isRequired,
         isContentFiltered: PropTypes.bool.isRequired,
         isProductsLoading: PropTypes.bool.isRequired,
         onFilterChange: PropTypes.func.isRequired,
         onSeeResultsClick: PropTypes.func.isRequired,
         onVisible: PropTypes.func.isRequired,
         onHide: PropTypes.func.isRequired,
         totalPages: PropTypes.number.isRequired,
         isCategoryAnchor: PropTypes.bool.isRequired,
         isSearchPage: PropTypes.bool.isRequired
     };

     handleFilter(value) {
         const { onFilterChange } = this.props;
         const [directions] = value.split(' ');
         onFilterChange(directions);
     }

     renderFilters() {
         const {
             availableFilters,
             selectedFilters
         } = this.props;

         return (
            <div block="CategoryFilterOverlay" elem="MobileWrapper">
                    { availableFilters.map((Filters) => (
                            <Field
                              type={ FIELD_TYPE.radio }
                              attr={ {
                                  id: 'category-filter',
                                  name: 'category-filter',
                                  defaultValue: `${ Filters }`,
                                  checked: Filters === selectedFilters,
                                  noPlaceholder: true
                              } }
                              events={ { onChange: () => this.handleFilter(`${Filters}`) } }
                              label={ Filters }
                              mix={ { block: 'CategoryListWidgetBreeders', elem: 'FilterRadio' } }
                            />
                    )) }

            </div>

         );
     }

     renderSeeResults() {
         const { onSeeResultsClick } = this.props;

         return (
             <div
               block="CategoryFilterOverlay"
               elem="SeeResults"
             >
                 <button
                   block="CategoryFilterOverlay"
                   elem="Button"
                   mix={ { block: 'Button' } }
                   onClick={ onSeeResultsClick }
                 >
                     SEE RESULTS
                 </button>
             </div>
         );
     }

     renderResetButton() {
         const { onSeeResultsClick } = this.props;

         return (
             <ResetButton
               onClick={ onSeeResultsClick }
               mix={ { block: 'CategoryFilterOverlay', elem: 'ResetButton' } }
             />
         );
     }

     //  renderResetAttributes() {
     //      const { customFiltersValues, availableFilters, toggleCustomFilter } = this.props;

     //      return (
     //          <ResetAttributes
     //            customFiltersValues={ customFiltersValues }
     //            availableFilters={ availableFilters }
     //            toggleCustomFilter={ toggleCustomFilter }
     //          />
     //      );
     //  }

     renderHeading() {
         const { isContentFiltered } = this.props;

         return (
             <h3 block="CategoryFilterOverlay" elem="Heading" mods={ { isContentFiltered } }>
                 Filters
             </h3>
         );
     }

     renderNoResults() {
         return (
             <p block="CategoryFilterOverlay" elem="NoResults">
                 The selected filter combination returned no results.
                 Please try again, using a different set of filters.
             </p>
         );
     }

     renderEmptyFilters() {
         return (
             <>
                 { this.renderNoResults() }
                 { this.renderResetButton() }
                 { this.renderSeeResults() }
             </>
         );
     }

     renderFilterTitle() {
         return (
            <div block="CategoryListWidgetBreeders" elem="Title">
                Shop By Alphabetic Order
            </div>
         );
     }

     renderMinimalFilters() {
         return this.renderSeeResults();
     }

     renderDefaultFilters() {
         return (
             <>
                 { this.renderHeading() }
                 { this.renderFilterTitle() }
                 { this.renderFilters() }
             </>
         );
     }

     renderContent() {
         const {
             totalPages,
             isProductsLoading
         } = this.props;

         if (!isProductsLoading && totalPages === 0) {
             return this.renderEmptyFilters();
         }

         return (
             <>
                 { this.renderDefaultFilters() }
                 { this.renderSeeResults() }
             </>
         );
     }

     renderLoader() {
         const {
             isInfoLoading,
             availableFilters
         } = this.props;

         const isLoaded = availableFilters && !!Object.keys(availableFilters).length;
         if (isLoaded) { // hide loader if filters are loaded.
             return null;
         }

         return (
             <Loader isLoading={ isInfoLoading } />
         );
     }

     render() {
         const {
             onVisible,
             onHide,
             totalPages,
             isProductsLoading,
             isContentFiltered,
             isCategoryAnchor,
             onSeeResultsClick,
             // eslint-disable-next-line react/prop-types
             onResetButtonClick,
             isSearchPage
         } = this.props;

         // show CategoryFilterOverlay for 1. categories marked as `anchor` in Magento admin 2. Search page
         if ((!isProductsLoading && totalPages === 0 && !isContentFiltered) || (!isCategoryAnchor && !isSearchPage)) {
             return (
                 <div block="CategoryFilterOverlay" />
             );
         }

         return (
             <Overlay
               onVisible={ onVisible }
               onHide={ onHide }
               mix={ { block: 'CategoryFilterOverlay' } }
               id={ CATEGORY_FILTER_OVERLAY_ID }
               isRenderInPortal={ false }
             >
                 <div block="CategoryFilterOverlay" elem="Wrapper">
                 <header block="CategoryFilterOverlay" elem="FilterHeader">
                            <div className="action-icons">
                                <button
                                  block="CategoryFilterOverlay"
                                  elem="BackButton"
                                  onClick={ onSeeResultsClick }
                                >
                                    <BackIcon />
                                </button>
                                <span>Filters</span>
                            </div>
                            <button onClick={ onResetButtonClick }>
                                Clear All
                            </button>
                 </header>
                     { this.renderContent() }
                     { this.renderLoader() }
                 </div>
             </Overlay>
         );
     }
}

export default CategoriesFilterComponent;
