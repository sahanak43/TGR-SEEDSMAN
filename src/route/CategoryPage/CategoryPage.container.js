/* eslint-disable fp/no-let */
/* eslint-disable max-lines */
import { connect } from 'react-redux';

import { SORT_DIRECTION_TYPE } from 'Route/CategoryPage/CategoryPage.config';
import {
    CategoryPageContainer as SourceCategoryPageContainer,
    mapDispatchToProps as sourceMapDispatchToProps,
    mapStateToProps as sourceMapStateToProps
} from 'SourceRoute/CategoryPage/CategoryPage.container';
import CategoryReducer from 'Store/Category/Category.reducer';
import { goToPreviousNavigationState } from 'Store/Navigation/Navigation.action';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { hideActiveOverlay } from 'Store/Overlay/Overlay.action';
import { scrollToTop } from 'Util/Browser';
import { Cookies } from 'Util/Cookies';
import { withReducers } from 'Util/DynamicReducer';
import { fireInsiderPageEvent } from 'Util/Insider';
import { debounce } from 'Util/Request';
import { getCanonicalUrl, getQueryParam } from 'Util/Url';

import { LOADING_TIME, RINGFENCED_TIMEOUT } from './CategoryPage.config';

/** @namespace Seedsman/Route/CategoryPage/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    ...sourceMapStateToProps(state),
    device: state.ConfigReducer.device,
    catalog_default_sort_by: state.ConfigReducer.catalog_default_sort_by,
    ringFencedStatus: state.ConfigReducer.ring_fenced_status,
    ringFencedUrl: state.ConfigReducer.ring_fenced_url,
    sorting_global_direction: state.ConfigReducer.amsorting_global_direction
});

/** @namespace Seedsman/Route/CategoryPage/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    ...sourceMapDispatchToProps(dispatch),
    hideActiveOverlay: () => dispatch(hideActiveOverlay()),
    goToPreviousHeaderState: () => dispatch(goToPreviousNavigationState(TOP_NAVIGATION_TYPE))
});

/** @namespace Seedsman/Route/CategoryPage/Container */
export class CategoryPageContainer extends SourceCategoryPageContainer {
    containerFunctions = {
        onSortChange: this.onSortChange.bind(this),
        onGridButtonClick: this.onGridButtonClick.bind(this),
        onListButtonClick: this.onListButtonClick.bind(this),
        onVisible: this.onVisible.bind(this),
        onHide: this.onHide.bind(this),
        onSeeResultsClick: this.onSeeResultsClick.bind(this)
    };

    config = {
        sortKey: 'name',
        sortDirection: SORT_DIRECTION_TYPE.asc
    };

    componentDidMount() {
        const {
            categoryIds,
            category: {
                id
            }
        } = this.props;

        scrollToTop();

        /**
         * Ensure transition PLP => homepage => PLP always having proper meta
         */
        this.updateMeta();

        /**
         * Always make sure the navigation show / hide mode (on scroll)
         * is activated when entering the category page.
         * */
        this.updateNavigationState();

        /**
         * Always update the history, ensure the history contains category
         */
        this.updateHistory();

        /**
         * Make sure to update header state, if the category visited
         * was already loaded.
         */
        if (categoryIds === id) {
            this.updateBreadcrumbs();
            this.updateHeaderState();
        } else {
            /**
             * Still update header and breadcrumbs, but ignore
             * the category data, as it is outdated
             */
            this.updateHeaderState(true);
            this.updateBreadcrumbs(true);
        }

        fireInsiderPageEvent('Category');
    }

    componentDidUpdate(prevProps) {
        const {
            isOffline,
            categoryIds,
            location: {
                search
            },
            category: {
                id,
                name
            },
            currentArgs: {
                filter
            } = {},
            ringFencedUrl,
            ringFencedStatus
        } = this.props;

        const {
            breadcrumbsWereUpdated
        } = this.state;

        const {
            categoryIds: prevCategoryIds,
            category: {
                id: prevId
            },
            location: {
                search: prevSearch
            },
            currentArgs: {
                filter: prevFilter
            } = {}
        } = prevProps;

        // TODO: category scrolls up when coming from PDP

        if (isOffline) {
            debounce(this.setOfflineNoticeSize, LOADING_TIME)();
        }

        /**
         * If the URL rewrite has been changed, make sure the category ID
         * will persist in the history state.
         */
        if (categoryIds !== prevCategoryIds) {
            this.updateHistory();
        }

        /**
         * If the currently loaded category ID does not match the ID of
         * category from URL rewrite, request category.
         */
        if (categoryIds !== id) {
            this.requestCategory();
        }

        /**
         * If category ID was changed => it is loaded => we need to
         * update category specific information, i.e. breadcrumbs.
         *
         * Or if the breadcrumbs were not yet updated after category request,
         * and the category ID expected to load was loaded, update data.
         */
        const categoryChange = id !== prevId || (!breadcrumbsWereUpdated && id === categoryIds);

        if (categoryChange) {
            this.checkIsActive();
            this.updateMeta();
            this.updateBreadcrumbs();
            this.updateHeaderState();
        }

        /*
        ** if category wasn't changed we still need to update meta for correct robots meta tag [#928](https://github.com/scandipwa/base-theme/issues/928)
        */
        if (!categoryChange
            && filter
            && prevFilter
            && Object.keys(filter.customFilters).length !== Object.keys(prevFilter.customFilters).length
        ) {
            this.updateMeta();
        }

        /*
        ** if category wasn't changed but page has changed, we still need to update meta.
        */
        if (prevSearch !== search) {
            this.updateMeta();
        }

        if (id !== prevId) {
            // Check if the search string includes the ring-fenced URL and the ring-fenced status is true.
            // If both conditions are met, set cookies for the ring-fenced customer.
            if (search.includes(ringFencedUrl) && ringFencedStatus) {
                const customerVisited = Cookies.get('isFirstTimeCustomer');
                const alreadyVisited = Cookies.get('alreadyVisitedCustomer');
                let isVisited;
                let alreadyVisitedCustomer;

                // Check if both cookies are defined and have valid values.
                if (customerVisited && alreadyVisited) {
                    isVisited = customerVisited.value;
                    alreadyVisitedCustomer = alreadyVisited.value;

                    if (isVisited === 'true') {
                        return;
                    }

                    if (alreadyVisitedCustomer === 'true') {
                        return;
                    }

                    Cookies.set('ringFencedCustomer', name, __, RINGFENCED_TIMEOUT);
                    Cookies.set('isFirstTimeCustomer', false);
                }

                // Set cookie values for the ring-fenced customer.
                Cookies.set('ringFencedCustomer', name, __, RINGFENCED_TIMEOUT);
                Cookies.set('isFirstTimeCustomer', true);
                Cookies.set('alreadyVisitedCustomer', false);
            }
        }
    }

    updateMeta() {
        const {
            updateMetaFromCategory, category, history, totalPages
        } = this.props;
        const meta_robots = history.location.search
            ? ''
            : 'follow, index';

        updateMetaFromCategory({
            ...category,
            canonical_url: totalPages ? getCanonicalUrl() : `${origin}${window.location.pathname}`,
            meta_robots
        });
    }

    onSeeResultsClick() {
        const {
            hideActiveOverlay,
            goToPreviousHeaderState
        } = this.props;

        hideActiveOverlay();
        goToPreviousHeaderState();
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
            name: 'SORT',
            title: 'sort',
            onCloseClick: () => {
                hideActiveOverlay();
                goToPreviousNavigationState();
            }
        });

        changeNavigationState({
            name: 'sort',
            isHidden: true
        });

        window.addEventListener('popstate', this.historyBackHook);

        history.pushState(
            { overlayOpen: true },
            '',
            pathname + search
        );
    }

    onHide() {
        window.removeEventListener('popstate', this.historyBackHook);
    }

    getSelectedSortFromUrl() {
        const {
            location,
            catalog_default_sort_by,
            category: {
                default_sort_by
            },
            sorting_global_direction
        } = this.props;

        const {
            sortKey: globalDefaultSortKey,
            sortDirection: defaultSortDirection
        } = this.config;

        /**
         * Default SORT DIRECTION is taken from (sequentially):
         * - URL param "sortDirection"
         * - CategoryPage class property "config"
         * */
        const sortDirection = getQueryParam('sortDirection', location)
        || sorting_global_direction?.toUpperCase() || defaultSortDirection;

        /**
         * Default SORT KEY is taken from (sequentially):
         * - URL param "sortKey"
         * - Category default sort key (Magento 2 configuration)
         * - CategoryPage class property "config"
         * */
        const defaultSortKey = default_sort_by || catalog_default_sort_by || globalDefaultSortKey;
        const sortKey = getQueryParam('sortKey', location) || defaultSortKey;

        return {
            sortDirection,
            sortKey
        };
    }

    containerProps() {
        const {
            category,
            filters,
            isMobile,
            sortFields,
            toggleOverlayByKey,
            totalPages,
            totalItems,
            isSearchPage,
            device,
            location,
            ringFencedUrl,
            ringFencedStatus,
            hideActiveOverlay,
            goToPreviousHeaderState
        } = this.props;

        return {
            appliedFiltersCount: this.getAppliedFiltersCount(),
            category,
            defaultPlpType: this.getDefaultPlpType(),
            filter: this.getFilter(),
            filters,
            isContentFiltered: this.isContentFiltered(),
            isCurrentCategoryLoaded: this.isCurrentCategoryLoaded(),
            isMatchingInfoFilter: this.getIsMatchingInfoFilter(),
            isMatchingListFilter: this.getIsMatchingListFilter(),
            isMobile,
            isSearchPage,
            plpTypes: this.getPlpTypes(),
            selectedFilters: this.getSelectedFiltersFromUrl(),
            selectedSort: this.getSelectedSortFromUrl(),
            sortFields,
            toggleOverlayByKey,
            totalPages,
            totalItems,
            device,
            location,
            ringFencedUrl,
            ringFencedStatus,
            goToPreviousHeaderState,
            hideActiveOverlay
        };
    }
}

export default withReducers({
    CategoryReducer
})(connect(mapStateToProps, mapDispatchToProps)(CategoryPageContainer));
