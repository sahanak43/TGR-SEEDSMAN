/**
 * Adobe Recommendations compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import { PureComponent } from 'react';

import ContentWrapper from 'Component/ContentWrapper';

import { UnitsType } from '../../type/Recommendations.type';
import RecommendationUnit from '../RecommendationUnit';

import './Recommendations.style';

/** @namespace Scandiweb/AdobeRecommendations/Component/Recommendations/Component */
export class RecommendationsComponent extends PureComponent {
    static propTypes = {
        units: UnitsType.isRequired
    };

    renderUnit = (unit) => (
        <RecommendationUnit key={ unit.unitId } unit={ unit } />
    );

    renderUnits() {
        const { units } = this.props;
        return units.map(this.renderUnit);
    }

    render() {
        return (
            <ContentWrapper
              mix={ { block: 'Reccomendations' } }
              wrapperMix={ { block: 'Reccomendations', elem: 'Wrapper' } }
            >
                { this.renderUnits() }
            </ContentWrapper>
        );
    }
}

export default RecommendationsComponent;
