/**
 * Amasty Extra Fee compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import PropTypes from 'prop-types';

export const FeeType = PropTypes.shape({
    entity_id: PropTypes.string,
    description: PropTypes.string,
    frontend_type: PropTypes.string,
    name: PropTypes.string,
    options: PropTypes.objectOf(PropTypes.shape({
        entity_id: PropTypes.string,
        price: PropTypes.string,
        label: PropTypes.string,
        isApplied: PropTypes.bool
    })),
    is_required: PropTypes.bool
});

export const FeesType = PropTypes.objectOf(FeeType);

export const ExtraFeesType = PropTypes.shape({
    id: PropTypes.number,
    fee_label: PropTypes.string,
    fee_option_label: PropTypes.string,
    fee_amount: PropTypes.number
});
