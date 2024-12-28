/**
 * Adobe Recommendations compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import { PureComponent } from 'react';

import ProductCard from 'Component/ProductCard';
import SwiperSlider from 'Component/SwiperSlider';

import { UnitType } from '../../type/Recommendations.type';

import './RecommendationUnit.style';

/** @namespace Scandiweb/AdobeRecommendations/Component/RecommendationUnit/Component */
export class RecommendationUnitComponent extends PureComponent {
    static propTypes = {
        unit: UnitType.isRequired
    };

    renderTitle() {
        const { unit: { storefrontLabel } } = this.props;

        if (!storefrontLabel) {
            return null;
        }

        return (
            <h2 block="RecommendationUnit" elem="Title">
                { storefrontLabel }
            </h2>
        );
    }

    renderProduct = (product) => (
        <ProductCard key={ product.id } product={ product } />
    );

    renderProducts() {
        const { unit: { products = [] } } = this.props;

        return (
            <div block="RecommendationUnit" elem="Products">
              <SwiperSlider
                slidesperview="4"
                mobileslidesperview="2.1"
                progressbar="progressbar"
                tabletslidesperview="3.1"
                block="ProductLinks"
                elem="List"
                className="HideProgressBar"
              >
                { products.map(this.renderProduct) }
              </SwiperSlider>
            </div>
        );
    }

    render() {
        return (
            <div block="RecommendationUnit">
                { this.renderTitle() }
                { this.renderProducts() }
            </div>
        );
    }
}

export default RecommendationUnitComponent;
