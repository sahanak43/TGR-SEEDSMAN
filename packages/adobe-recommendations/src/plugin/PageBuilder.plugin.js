/**
 * Adobe Recommendations compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import { PageBuilderRecommendationUnit } from '../component/PageBuilderRecommendationUnit.component';

export const RECOMMENDATION_CONTENT_TYPE = 'product_recommendations';
export const UNIT_ID_ATTRIBUTE = 'data-recommendation-id';

const addReplacementRule = (originalMember) => ([
    ...originalMember,
    {
        query: { dataContentType: RECOMMENDATION_CONTENT_TYPE },
        replace: (domNode) => {
            const { attribs: { [UNIT_ID_ATTRIBUTE]: unitId } } = domNode;

            return (
                <PageBuilderRecommendationUnit
                  unitId={ unitId }
                />
            );
        }
    }
]);

const addPlaceholderFieldToQuery = (args, callback) => ([
    ...callback(...args),
    'imagePlaceholderUrl',
    'alternateEnvironmentId'
]);

export default {
    'Component/Html/Component': {
        'member-property': {
            rules: addReplacementRule
        }
    },
    // vvv Include placeholder URL in request
    'Query/Config/Query': {
        'member-function': {
            _getStoreConfigFields: addPlaceholderFieldToQuery
        }
    }
};
