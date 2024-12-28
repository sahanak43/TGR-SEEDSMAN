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
 * RegionQuery Mutations
 * @class RegionQuery
 * @namespace Seedsman/Query/Region/Query */
export class RegionQuery {
    getCountriesQuery() {
        return new Field('countries')
            .addFieldList(this._getCountryFields());
    }

    _getCountryFields() {
        return [
            'id',
            'is_state_required',
            this._getAvailableRegionsField(),
            new Field('full_name_locale').setAlias('label')
        ];
    }

    _getAvailableRegionFields() {
        return [
            'code',
            'name',
            'id'
        ];
    }

    _getAvailableRegionsField() {
        return new Field('available_regions')
            .addFieldList(this._getAvailableRegionFields());
    }

    getUpdatedCountriesQuery() {
        return new Field('countries_sort_order')
            .addFieldList(this._getUpdatedCountryFields());
    }

    _getUpdatedCountryFields() {
        return [
            'country_code',
            'id',
            'sort_order',
            'country_name'
        ];
    }
}

export default new RegionQuery();
