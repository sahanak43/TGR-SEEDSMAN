/* eslint-disable object-curly-newline */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-props-destruction */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable fp/no-let */
/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines */
/* eslint-disable react/no-did-update-set-state */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import CategoryReducer from 'Store/Category/Category.reducer';
import { changeNavigationState, goToPreviousNavigationState } from 'Store/Navigation/Navigation.action';
import { BOTTOM_NAVIGATION_TYPE, TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { showNotification } from 'Store/Notification/Notification.action';
import { hideActiveOverlay, toggleOverlayByKey } from 'Store/Overlay/Overlay.action';
import { DeviceType } from 'Type/Device.type';
import { LocationType } from 'Type/Router.type';
import { scrollToTop } from 'Util/Browser';
import { withReducers } from 'Util/DynamicReducer';
import { fetchQuery, getErrorMessage } from 'Util/Request';
import { getCanonicalUrl, getQueryParam, setQueryParams } from 'Util/Url';

import CategoriesQuery from '../../query/Categories.query';
import Breeders from './Breeders.component';
import { CATEGORY_SORT_OVERLAY_ID } from './Breeders.config';

export const MetaDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Meta/Meta.dispatcher'
);

/** @namespace Seedsman/Component/Breeders/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    device: state.ConfigReducer.device
});
/** @namespace Seedsman/Component/Breeders/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    showOverlay: (overlayKey) => dispatch(toggleOverlayByKey(overlayKey)),
    hideActiveOverlay: () => dispatch(hideActiveOverlay()),
    updateMetaFromCategory: (category) => MetaDispatcher.then(
        ({ default: dispatcher }) => dispatcher.updateWithCategory(category, dispatch)
    ),
    goToPreviousHeaderState: () => dispatch(goToPreviousNavigationState(TOP_NAVIGATION_TYPE)),
    changeHeaderState: (state) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state)),
    changeNavigationState: (state) => dispatch(changeNavigationState(BOTTOM_NAVIGATION_TYPE, state)),
    showErrorNotification: (error) => dispatch(showNotification(
        'error',
        typeof error === 'string' ? error : getErrorMessage(error)
    ))
});
/** @namespace Seedsman/Component/Breeders/Container */
export class BreedersContainer extends PureComponent {
    static propTypes = {
        type: PropTypes.string.isRequired,
        location: LocationType.isRequired,
        showOverlay: PropTypes.func.isRequired,
        dataContent: PropTypes.objectOf.isRequired,
        device: DeviceType.isRequired,
        hideActiveOverlay: PropTypes.func.isRequired,
        goToPreviousNavigationState: PropTypes.func.isRequired,
        goToPreviousHeaderState: PropTypes.func.isRequired,
        changeNavigationState: PropTypes.func.isRequired,
        changeHeaderState: PropTypes.func.isRequired,
        default_sort_by: PropTypes.string.isRequired,
        history: PropTypes.objectOf.isRequired,
        showErrorNotification: PropTypes.func.isRequired,
        updateMetaFromCategory: PropTypes.func.isRequired,
        category: PropTypes.objectOf.isRequired
    };

    state = {
        isLoading: true,
        categories: {},
        currentPage: 1,
        sortVal: 'ASC',
        filterName: '',
        category_count: []
    };

    config = {
        sortKey: 'name',
        sortDirection: 'ASC'
    };

    containerFunctions = {
        handleSortingSelect: this.handleSortingSelect.bind(this),
        onSortButtonClick: this.onSortButtonClick.bind(this),
        onFilterNameClick: this.onFilterNameClick.bind(this),
        onVisible: this.onVisible.bind(this),
        onHide: this.onHide.bind(this),
        onSeeResultsClick: this.onSeeResultsClick.bind(this),
        onSortChange: this.onSortChange.bind(this),
        onFilterChange: this.onFilterChange.bind(this),
        resetFilterValue: this.resetFilterValue.bind(this)
    };

    componentDidMount() {
        // eslint-disable-next-line no-multi-assign
        const currentPage = 1;

        const {
            dataContent: {
                'data-categoryId': categoryId
            }
        } = this.props;
        const { sortVal } = this.state;
        const categoryStringId = categoryId.toString();
        this.setState({ currentPage, categoryStringId });
        this.getCategoriesQueryField(categoryStringId, currentPage, sortVal);
        /**
         * Ensure transition PLP => homepage => PLP always having proper meta
         */
        this.updateMeta();
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            currentPage: prevCurrentPage
        } = prevState;

        const {
            dataContent: {
                'data-categoryId': categoryId
            },
            device: { isMobile }
        } = this.props;

        const currentPage = this._getPageFromUrl();
        const { sortVal, filterName } = this.state;
        const categoryStringId = categoryId.toString();
        if (prevCurrentPage !== currentPage) {
            // if (currentPage !== 1 && (filterName !== 'All' || filterName !== '#')) {
            //     this.setState({ filterName: '' });
            // }
            this.setState({ currentPage, categoryStringId });
            this.getCategoriesQueryField(categoryStringId, currentPage, sortVal, filterName);
            this.updateMeta();
            scrollToTop();
        } else if (isMobile) {
            const SortedUrl = this.getSelectedValueFromUrl();

            if (SortedUrl.filterDirections) {
                this.setState({ filterName: SortedUrl.filterDirections });
            }

            if (SortedUrl.sortKey === 'name') {
                if (this.state.sortVal) {
                    this.setState({ sortVal: SortedUrl.sortDirection });
                } else {
                    this.setState({ sortVal: '' });
                }
            } else {
                this.setState({ sortVal: '', filterName: '' });
            }
            if (prevState.sortVal !== this.state?.sortVal || prevState.filterName !== this.state?.filterName) {
                this.getCategoriesQueryField(categoryStringId, currentPage, sortVal, filterName);
                scrollToTop();
            }
        }
    }

    onSeeResultsClick() {
        const {
            hideActiveOverlay,
            goToPreviousHeaderState
        } = this.props;

        hideActiveOverlay();
        goToPreviousHeaderState();
        goToPreviousNavigationState();
    }

    getSelectedValueFromUrl() {
        const {
            location,
            default_sort_by = 'name'
        } = this.props;

        const {
            sortKey: globalDefaultSortKey,
            sortDirection: defaultSortDirection,
            filterDirection: defaultFilterDirections
        } = this.config;

        /**
         * Default SORT DIRECTION is taken from (sequentially):
         * - URL param "sortDirection"
         * - CategoryPage class property "config"
         * */
        const sortDirection = getQueryParam('sortDirection', location) || defaultSortDirection;
        const filterDirections = getQueryParam('filterDirections', location) || defaultFilterDirections;
        /**
         * Default SORT KEY is taken from (sequentially):
         * - URL param "sortKey"
         * - Category default sort key (Magento 2 configuration)
         * - CategoryPage class property "config"
         * */
        const defaultSortKey = default_sort_by || globalDefaultSortKey;
        const sortKey = getQueryParam('sortKey', location) || defaultSortKey;

        return {
            sortDirection,
            filterDirections,
            sortKey
        };
    }

    onFilterNameClick(filterName) {
        const { categoryStringId, sortVal } = this.state;
        const filterNameStr = filterName.toString();
        // filterName get the character when is clicked
        const { location, history } = this.props;
        setQueryParams({ page: '' }, location, history);
        const currentPage = 1;
        this.setState({ filterName: filterNameStr });
        this.getCategoriesQueryField(categoryStringId, currentPage, sortVal, filterNameStr);
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

    handleSortingSelect(sortValue) {
        const { categoryStringId, currentPage, filterName } = this.state;
        this.setState({ isLoading: true });
        this.getCategoriesQueryField(categoryStringId, currentPage, sortValue, filterName);
        this.setState({ sortVal: sortValue });
    }

    _getPageFromUrl(url) {
        const { location: currentLocation } = this.props;
        const location = url || currentLocation;

        return +(getQueryParam('page', location) || 1);
    }

    async getCategoriesQueryField(parentOption, currentPage, sortValue, filterName = '') {
        // const filterNameStr = filterName.toString();
        const { showErrorNotification, device: { isMobile } } = this.props;
        let pageSize = 9;
        if (isMobile) {
            pageSize = 10;
        }
        try {
            this.setState({ isLoading: true });
            const {
                categories
            } = await fetchQuery(
                CategoriesQuery.getCategoriesQuery(parentOption, currentPage, sortValue, filterName, pageSize)
            );

            this.setState({ categories, isLoading: false });
        } catch (e) {
            showErrorNotification(getErrorMessage(e));
        }
    }

    resetFilterValue() {
        this.setState({ filterName: '' });
        const {
            categoryStringId, currentPage, sortVal
        } = this.state;

        const filterName = 'All';
        this.getCategoriesQueryField(categoryStringId, currentPage, sortVal, filterName);
    }

    onSortButtonClick() {
        const { showOverlay } = this.props;
        showOverlay(CATEGORY_SORT_OVERLAY_ID);
    }

    containerProps() {
        const { categories, isLoading, currentPage, sortVal } = this.state;
        const { showOverlay } = this.props;
        return {
            categories, isLoading, currentPage, showOverlay, sortVal, selectedValue: this.getSelectedValueFromUrl()
        };
    }

    onSortChange(sortDirection, sortKey) {
        const { location, history } = this.props;
        this.setState({ sortVal: sortDirection });
        setQueryParams({ sortKey, sortDirection, page: '' }, location, history);
        this.updateMeta();
    }

    onFilterChange(filterDirections) {
        const { location, history } = this.props;

        setQueryParams({ filterDirections, page: '' }, location, history);
        this.updateMeta();
    }

    updateMeta() {
        const { updateMetaFromCategory, history } = this.props;
        const { categories } = this.state;
        const meta_robots = history.location.search
            ? ''
            : 'follow, index';

        const isBreeder = Object.keys(categories).length > 0;

        updateMetaFromCategory({
            canonical_url: isBreeder ? getCanonicalUrl() : `${origin}${window.location.pathname}`,
            meta_robots
        });
    }

    onHide() {
        window.removeEventListener('popstate', this.historyBackHook);
    }

    render() {
        return (
            <Breeders
              numberOfPlaceholders={ 3 }
              mix={ { block: 'CategoryListBreeders' } }
              { ...this.props }
              { ...this.state }
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}
// eslint-disable-next-line @scandipwa/scandipwa-guidelines/always-both-mappings
export default withRouter(withReducers({
    CategoryReducer
})(connect(mapStateToProps, mapDispatchToProps)(BreedersContainer)));
