import { connect } from 'react-redux';

import {
    SearchOverlayContainer as SourceSearchOverlayContainer
} from 'SourceComponent/SearchOverlay/SearchOverlay.container';
import SearchBarReducer from 'Store/SearchBar/SearchBar.reducer';
import XsearchReducer from 'Store/Xsearch/Xsearch.reducer';
import { withReducers } from 'Util/DynamicReducer';

export const SearchBarDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/SearchBar/SearchBar.dispatcher'
);
export const XsearchDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Xsearch/Xsearch.dispatcher'
);

/** @namespace Seedsman/Component/SearchOverlay/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    searchResults: state.XsearchReducer.productsInXSearch,
    xSearchRelatedTerms: state.XsearchReducer.dataInXSearchRelatedTerms,
    XSearchRecentSearch: state.XsearchReducer.dataInXSearchRecentSearch,
    XSearchCategories: state.XsearchReducer.dataInXSearchCategories,
    isLoading: state.XsearchReducer.isLoading,
    currencyCode: state.ConfigReducer.currencyData.current_currency_code
});

/** @namespace Seedsman/Component/SearchOverlay/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    makeSearchRequest: (options) => XsearchDispatcher.then(
        ({ default: dispatcher }) => dispatcher.updateSearchBar(options, dispatch)
    ),
    clearSearchResults: () => XsearchDispatcher.then(
        ({ default: dispatcher }) => dispatcher.clearSearchBar(dispatch)
    )
});

/** @namespace Seedsman/Component/SearchOverlay/Container */
export class SearchOverlayContainer extends SourceSearchOverlayContainer {
    makeSearchRequest() {
        const {
            makeSearchRequest,
            clearSearchResults,
            searchCriteria
        } = this.props;

        if (searchCriteria) {
            clearSearchResults();
            const search = encodeURIComponent(searchCriteria.trim().replace(/%/g, '%25'));
            makeSearchRequest(search);
        }
    }

    closeSearch() {
        const { onSearchOutsideClick } = this.props;

        onSearchOutsideClick();
    }

    containerProps() {
        const {
            clearSearchResults,
            isHideOverlay,
            isLoading,
            searchCriteria,
            searchResults,
            hideActiveOverlay,
            xSearchRelatedTerms,
            XSearchRecentSearch,
            XSearchCategories
        } = this.props;

        return {
            clearSearchResults,
            isHideOverlay,
            isLoading,
            searchCriteria,
            searchResults,
            hideActiveOverlay,
            xSearchRelatedTerms,
            XSearchRecentSearch,
            XSearchCategories
        };
    }
}

export default withReducers({
    SearchBarReducer,
    XsearchReducer
})(connect(mapStateToProps, mapDispatchToProps)(SearchOverlayContainer));
