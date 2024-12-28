import { Field, prepareQuery } from 'Util/Query';
import { executePost, executePostWithError } from 'Util/Request/Request';

/** @namespace Seedsman/Util/Request/Query/fetchQuery */
// eslint-disable-next-line import/prefer-default-export
export const fetchQuery = (rawQueries) => {
    const queries = rawQueries instanceof Field ? [rawQueries] : rawQueries;

    return executePost(prepareQuery(queries, true));
};
/** @namespace Seedsman/Util/Request/Query/fetchQueryWithError */
export const fetchQueryWithError = (rawQueries) => {
    const queries = rawQueries instanceof Field ? [rawQueries] : rawQueries;

    return executePostWithError(prepareQuery(queries, true));
};
