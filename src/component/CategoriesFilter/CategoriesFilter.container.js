/* eslint-disable max-lines */
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
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { FILTER } from 'Component/Header/Header.config';
import { changeNavigationState, goToPreviousNavigationState } from 'Store/Navigation/Navigation.action';
import { BOTTOM_NAVIGATION_TYPE, TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { hideActiveOverlay } from 'Store/Overlay/Overlay.action';
import { SelectedFiltersType } from 'Type/Category.type';
import { FilterAttributeType } from 'Type/ProductList.type';
import { HistoryType, LocationType } from 'Type/Router.type';
import { setQueryParams } from 'Util/Url';

import CategoriesFilter from './CategoriesFilter.component';

/** @namespace Seedsman/Component/CategoriesFilter/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    isInfoLoading: state.ProductListInfoReducer.isLoading,
    isProductsLoading: state.ProductListReducer.isLoading,
    totalPages: state.ProductListReducer.totalPages
});

/** @namespace Seedsman/Component/CategoriesFilter/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    hideActiveOverlay: () => dispatch(hideActiveOverlay()),
    goToPreviousHeaderState: () => dispatch(goToPreviousNavigationState(TOP_NAVIGATION_TYPE)),
    goToPreviousNavigationState: () => dispatch(goToPreviousNavigationState(BOTTOM_NAVIGATION_TYPE)),
    changeHeaderState: (state) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state)),
    changeNavigationState: (state) => dispatch(changeNavigationState(BOTTOM_NAVIGATION_TYPE, state))
});

/** @namespace Seedsman/Component/CategoriesFilter/Container */
export class CategoriesFilterContainer extends PureComponent {
     static propTypes = {
         history: HistoryType.isRequired,
         location: LocationType.isRequired,
         selectedFilters: SelectedFiltersType.isRequired,
         hideActiveOverlay: PropTypes.func.isRequired,
         goToPreviousHeaderState: PropTypes.func.isRequired,
         goToPreviousNavigationState: PropTypes.func.isRequired,
         changeHeaderState: PropTypes.func.isRequired,
         onFilterChange: PropTypes.func.isRequired,
         changeNavigationState: PropTypes.func.isRequired,
         availableFilters: FilterAttributeType.isRequired,
         isInfoLoading: PropTypes.bool.isRequired,
         isCategoryAnchor: PropTypes.bool,
         isMatchingInfoFilter: PropTypes.bool,
         isProductsLoading: PropTypes.bool.isRequired,
         isSearchPage: PropTypes.bool.isRequired,
         totalPages: PropTypes.number.isRequired
     };

     static defaultProps = {
         isCategoryAnchor: true,
         isMatchingInfoFilter: false
     };

     containerFunctions = {
         onSeeResultsClick: this.onSeeResultsClick.bind(this),
         onVisible: this.onVisible.bind(this),
         onHide: this.onHide.bind(this),
         onResetButtonClick: this.onResetButtonClick.bind(this)
     };

     onResetButtonClick() {
         const { location, history } = this.props;

         setQueryParams({
             filterDirections: '',
             page: ''
         }, location, history);
     }

     onSeeResultsClick() {
         const {
             hideActiveOverlay,
             goToPreviousHeaderState,
             goToPreviousNavigationState
         } = this.props;

         hideActiveOverlay();
         goToPreviousHeaderState();
         goToPreviousNavigationState();
     }

     onVisible() {
         const {
             hideActiveOverlay,
             changeHeaderState,
             changeNavigationState,
             goToPreviousNavigationState,
             location: { pathname, search }
         } = this.props;

         changeHeaderState({
             name: FILTER,
             title: 'Filters',
             onCloseClick: () => {
                 hideActiveOverlay();
                 goToPreviousNavigationState();
             }
         });

         changeNavigationState({
             name: FILTER,
             isHidden: true
         });

         window.addEventListener('popstate', this.historyBackHook);

         history.pushState(
             { overlayOpen: true },
             '',
             pathname + search
         );
     }

     historyBackHook() {
         const {
             goToPreviousNavigationState,
             selectedFilters,
             hideActiveOverlay,
             goToPreviousHeaderState
         } = this.props;

         goToPreviousNavigationState();

         // close filter only if no applied filters left
         if (Object.keys(selectedFilters).length === 0) {
             hideActiveOverlay();
             goToPreviousHeaderState();
         }
     }

     onHide() {
         window.removeEventListener('popstate', this.historyBackHook);
     }

     containerProps() {
         const {
             availableFilters,
             selectedFilters,
             isCategoryAnchor,
             isInfoLoading,
             isMatchingInfoFilter,
             isProductsLoading,
             onFilterChange,

             isSearchPage,
             totalPages
         } = this.props;

         return {
             availableFilters,
             isCategoryAnchor,
             isInfoLoading,
             isProductsLoading,
             isMatchingInfoFilter,
             isSearchPage,
             onFilterChange,
             totalPages,
             selectedFilters
         };
     }

     urlStringToObject() {
         const { location: { search } } = this.props;

         return search.substr(1).split('&').reduce((acc, part) => {
             const [key, value] = part.split('=');

             return { ...acc, [key]: value };
         }, {});
     }

     render() {
         return (
             <CategoriesFilter
               { ...this.containerFunctions }
               { ...this.containerProps() }
             />
         );
     }
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(CategoriesFilterContainer)
);
