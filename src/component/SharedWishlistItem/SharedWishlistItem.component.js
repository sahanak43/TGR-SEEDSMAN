/* eslint-disable max-len */
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

import ProductCard from 'Component/ProductCard';
import { SharedWishlistItem as SourceSharedWishlistItem } from 'SourceComponent/SharedWishlistItem/SharedWishlistItem.component';

import './SharedWishlistItem.style';

/** @namespace Seedsman/Component/SharedWishlistItem/Component */
export class SharedWishlistItemComponent extends SourceSharedWishlistItem {
    render() {
        const { product, parameters, isLoading } = this.props;

        return (
             <ProductCard
               product={ product }
               selectedFilters={ parameters }
               mix={ { block: 'WishlistItem' } }
               isLoading={ isLoading }
               hideWishlistButton
               hideCompareButton
             >
                 { /* { this.renderAddToCart() } */ }
             </ProductCard>
        );
    }
}

export default SharedWishlistItemComponent;
