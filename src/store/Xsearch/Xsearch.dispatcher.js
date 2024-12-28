import XsearchQuery from 'Query/Xsearch.query';
import { fetchQuery } from 'SourceUtil/Request';
import { QueryDispatcher } from 'Util/Request';

// import { fireSearchEventPlay } from '../../@scandiweb/gtm/plugin/events/search.plugin';
import {
    clearSearchResults, updateLoadStatus, updateRecentSearch,
    updateRelatedTerms, updateSearchBar, updateSearchCategories
} from './Xsearch.action';

/** @namespace Seedsman/Store/Xsearch/Dispatcher */
export class XsearchDispatcher extends QueryDispatcher {
    __construct() {
        super.__construct('Xsearch');
    }

    updateSearchBar(options, dispatch) {
        dispatch(updateLoadStatus(true));
        fetchQuery(XsearchQuery.getSearchProductQuery(options)).then(
            /** @namespace Seedsman/Store/Xsearch/Dispatcher/XsearchDispatcher/updateSearchBar/fetchQuery/then */
            (data) => {
                dispatch(updateLoadStatus(false));
                if (data) {
                    dispatch(updateSearchBar(data));
                }
            }
        );

        fetchQuery(XsearchQuery.getRelatedTermsQuery(options)).then(
            /** @namespace Seedsman/Store/Xsearch/Dispatcher/XsearchDispatcher/updateSearchBar/fetchQuery/then */
            (relatedTerms) => {
                if (relatedTerms) {
                    dispatch(updateRelatedTerms(relatedTerms));
                }
            }
        );

        fetchQuery(XsearchQuery.getRecentSearchesQuery()).then(
            /** @namespace Seedsman/Store/Xsearch/Dispatcher/XsearchDispatcher/updateSearchBar/fetchQuery/then */
            (recentSearchs) => {
                if (recentSearchs) {
                    dispatch(updateRecentSearch(recentSearchs));
                }
            }
        );

        fetchQuery(XsearchQuery.getSearchCategoriesQuery(options)).then(
            /** @namespace Seedsman/Store/Xsearch/Dispatcher/XsearchDispatcher/updateSearchBar/fetchQuery/then */
            (searchCategories) => {
                if (searchCategories) {
                    dispatch(updateSearchCategories(searchCategories));
                }
            }
        );
    }

    clearSearchBar(dispatch) {
        dispatch(clearSearchResults());
    }
}

export default new XsearchDispatcher();
