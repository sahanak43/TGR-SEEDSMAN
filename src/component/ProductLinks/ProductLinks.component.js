/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import ContentWrapper from 'Component/ContentWrapper';
import SwiperSlider from 'Component/SwiperSlider';
import { ProductLinks as SourceProductLinks } from 'SourceComponent/ProductLinks/ProductLinks.component';

import './ProductLinks.override.style';

/** @namespace Seedsman/Component/ProductLinks/Component */
export class ProductLinksComponent extends SourceProductLinks {
    render() {
        const { areDetailsLoaded, isPdp } = this.props;

        if (!areDetailsLoaded) {
            return null;
        }

        return (
            <ContentWrapper
              mix={ { block: 'ProductLinks' } }
              wrapperMix={ { block: 'ProductLinks', elem: 'Wrapper' } }
              label="Linked products"
            >
                { this.renderHeading() }
                <SwiperSlider
                  slidesperview={ isPdp ? '2' : '4' }
                  mobileslidesperview="2"
                  progressbar="progressbar"
                  tabletslidesperview="3.1"
                  block="ProductLinks"
                  elem="List"
                  className="trust-signals ProductLinks HideProgressBar"
                >
                    { this.renderItems() }
                </SwiperSlider>
            </ContentWrapper>
        );
    }
}

export default ProductLinksComponent;
