/**
 * Mageplaza Product Label compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import PropTypes from 'prop-types';

export const ProcessedLabelType = PropTypes.shape({
    ruleId: PropTypes.string,
    productId: PropTypes.string,
    positionStyle: PropTypes.objectOf(PropTypes.string),
    textStyle: PropTypes.objectOf(PropTypes.string),
    customCss: PropTypes.string,
    imageSrc: PropTypes.string,
    label: PropTypes.string,
    tooltipLabel: PropTypes.string
});

export const ProcessedLabelsType = PropTypes.arrayOf(ProcessedLabelType);
