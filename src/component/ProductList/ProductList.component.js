/* eslint-disable no-unused-vars */
/* eslint-disable max-lines */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
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

import {
    ProductList as SourceProductList
} from 'SourceComponent/ProductList/ProductList.component';

import './ProductList.style';

/**
 * List of category products
 * @class ProductList
 * @namespace Seedsman/Component/ProductList/Component */
export class ProductListComponent extends SourceProductList {
    renderLoadButton() {
        const {
            isShowLoading,
            isInfiniteLoaderEnabled,
            loadPrevPage
        } = this.props;

        if (!isShowLoading || !isInfiniteLoaderEnabled) {
            return null;
        }

        return (
            <div
              block="ProductList"
              elem="LoadButton"
              role="button"
              tabIndex="0"
              onKeyUp={ loadPrevPage }
              onClick={ loadPrevPage }
            >
               <span block="LoadButton_txt">
             Load Previous
               </span>
            </div>
        );
    }
}

export default ProductListComponent;
