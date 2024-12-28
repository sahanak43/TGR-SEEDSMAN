/**
 * Adobe Recommendations compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import PropTypes from 'prop-types';

import { ProductType } from 'Type/ProductList.type';

export const UnitType = PropTypes.shape({
    unitId: PropTypes.string,
    storefrontLabel: PropTypes.string,
    products: PropTypes.arrayOf(ProductType)
});

export const UnitsType = PropTypes.arrayOf(UnitType);
