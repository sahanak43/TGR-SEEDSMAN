import { getIndexedProducts } from 'Util/Product';

import {
    CLEAR_SEARCH_RESULTS,
    UPDATE_RECENT_SEARCH,
    UPDATE_RELATED_TERMS,
    UPDATE_SEARCH_BAR,
    UPDATE_SEARCH_CATEGORIES,
    UPDATE_SEARCH_LOAD_STATUS
} from './Xsearch.action';

/** @namespace Seedsman/Store/Xsearch/Reducer/getInitialState */
export const getInitialState = () => ({
    productsInXSearch: [],
    dataInXSearchRelatedTerms: [],
    dataInXSearchRecentSearch: [],
    dataInXSearchCategories: [],
    isLoading: true
});

/** @namespace Seedsman/Store/Xsearch/Reducer/XsearchReducer */
export const XsearchReducer = (
    state = getInitialState(),
    action
) => {
    switch (action.type) {
    case UPDATE_SEARCH_BAR:
        const { result: { xsearchProducts: { items: initialItems } } } = action;

        return {
            ...state,
            productsInXSearch: getIndexedProducts(initialItems)
        };

    case UPDATE_SEARCH_LOAD_STATUS:
        const { isLoading } = action;

        return {
            ...state,
            isLoading
        };

    case CLEAR_SEARCH_RESULTS:
        return {
            ...state,
            productsInXSearch: getInitialState().productsInXSearch,
            dataInXSearchRelatedTerms: getInitialState().dataInXSearchRelatedTerms
        };

    case UPDATE_RELATED_TERMS:
        const { result: { xsearchRelatedTerms: { items: initialRelatedItems } } } = action;

        return {
            ...state,
            dataInXSearchRelatedTerms: initialRelatedItems
        };

    case UPDATE_RECENT_SEARCH:
        const { result: { xsearchRecentSearches: { items: initialRecentSearchItems } } } = action;

        return {
            ...state,
            dataInXSearchRecentSearch: initialRecentSearchItems
        };

    case UPDATE_SEARCH_CATEGORIES:
        const { result: { xsearchCategories: { items: initialCategoriesItems } } } = action;

        return {
            ...state,
            dataInXSearchCategories: initialCategoriesItems
        };

    default:
        return state;
    }
};

export default XsearchReducer;
