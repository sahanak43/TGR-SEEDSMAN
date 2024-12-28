/**
 * Adobe Recommendations compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import { getPageBuilderReccomendationUnitById } from '../util/recommendations';
import RecommendationUnit from './RecommendationUnit/RecommendationUnit.component';

/** @namespace Scandiweb/AdobeRecommendations/Component/PageBuilderRecommendationUnit/Component/PageBuilderRecommendationUnit */
export function PageBuilderRecommendationUnit(props) {
    const [unit, setUnit] = useState();
    const { unitId } = props;

    useEffect(() => {
        (async () => {
            const unit = await getPageBuilderReccomendationUnitById(unitId);
            setUnit(unit);
        })();
    }, []);

    if (!unit) {
        return null;
    }

    return (
        <RecommendationUnit unit={ unit } />
    );
}

PageBuilderRecommendationUnit.propTypes = {
    unitId: PropTypes.string.isRequired
};
