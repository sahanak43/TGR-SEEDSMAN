/* eslint-disable fp/no-let */
/* eslint-disable no-magic-numbers */
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

import { Field } from 'Util/Query';

/**
  * Categories Query
  * @class CategoriesQuery
  * @namespace Seedsman/Query/Categories/Query  */
export class CategoriesQuery {
    getCategoriesQuery(parentOption, currentPage = 1, sortVal, filterName = '', pageSize) {
        const categoriesListField = new Field('categories');
        // If filterName is set then add that in arguement
        let sortValFilter = {};
        if (sortVal) {
            sortValFilter = {
                name: sortVal
            };
        }

        if (!filterName || filterName === 'All' || filterName === '#') {
            categoriesListField
                .addArgument('pageSize', 'Int', pageSize)
                .addArgument('currentPage', 'Int', currentPage)
                .addArgument('filters', 'CategoryFilterInput', {
                    parent_id: {
                        eq: parentOption
                    }
                })
                .addArgument('sort', 'CategorySortInput', sortValFilter)
                .addField(this._getPageInfoField())
                .addField(this._getTotalItemField())
                .addField(this._getPageItemField());
        } else {
            categoriesListField
                .addArgument('pageSize', 'Int', pageSize)
                .addArgument('currentPage', 'Int', currentPage)
            // add the filter argument
                .addArgument('filters', 'CategoryFilterInput', {
                    parent_id: {
                        eq: parentOption
                    },
                    name: {
                        match: filterName
                    }
                })
                .addArgument('sort', 'CategorySortInput', sortValFilter)
                .addField(this._getPageInfoField())
                .addField(this._getTotalItemField())
                .addField(this._getPageItemField());
        }

        return categoriesListField;
    }

    _getPageInfoField() {
        return new Field('page_info')
            .addFieldList(this._getPageInfoFields());
    }

    _getPageInfoFields() {
        return [
            'current_page',
            'page_size',
            'total_pages'
        ];
    }

    _getTotalItemField() {
        return new Field('total_count');
    }

    _getPageItemField() {
        return new Field('items')
            .addFieldList(this._getPageItemFields());
    }

    _getPageItemFields() {
        return [
            'name',
            'url',
            'description',
            'category_icon'
        ];
    }
}

export default new CategoriesQuery();
