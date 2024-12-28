export const UPDATE_SEARCH_BAR = 'UPDATE_XSEARCH_BAR';
export const UPDATE_SEARCH_LOAD_STATUS = 'UPDATE_XSEARCH_LOAD_STATUS';
export const CLEAR_SEARCH_RESULTS = 'CLEAR_XSEARCH_RESULTS';
export const UPDATE_RELATED_TERMS = 'UPDATE_RELATED_TERMS';
export const UPDATE_RECENT_SEARCH = 'UPDATE_RECENT_SEARCH';
export const UPDATE_SEARCH_CATEGORIES = 'UPDATE_SEARCH_CATEGORIES';

/** @namespace Seedsman/Store/Xsearch/Action/updateSearchBar */
export const updateSearchBar = (result) => ({
    type: UPDATE_SEARCH_BAR,
    result
});

/** @namespace Seedsman/Store/Xsearch/Action/updateLoadStatus */
export const updateLoadStatus = (status) => ({
    type: UPDATE_SEARCH_LOAD_STATUS,
    isLoading: status
});

/** @namespace Seedsman/Store/Xsearch/Action/clearSearchResults */
export const clearSearchResults = () => ({
    type: CLEAR_SEARCH_RESULTS
});

/** @namespace Seedsman/Store/Xsearch/Action/updateRelatedTerms */
export const updateRelatedTerms = (result) => ({
    type: UPDATE_RELATED_TERMS,
    result
});

/** @namespace Seedsman/Store/Xsearch/Action/updateRecentSearch */
export const updateRecentSearch = (result) => ({
    type: UPDATE_RECENT_SEARCH,
    result
});

/** @namespace Seedsman/Store/Xsearch/Action/updateSearchCategories */
export const updateSearchCategories = (result) => ({
    type: UPDATE_SEARCH_CATEGORIES,
    result
});
