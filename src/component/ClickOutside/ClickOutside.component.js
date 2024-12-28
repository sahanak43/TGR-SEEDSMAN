/* eslint-disable no-unused-expressions */
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

import PropTypes from 'prop-types';

import {
    ClickOutside as SourceClickOutside
} from 'SourceComponent/ClickOutside/ClickOutside.component';
import { ChildrenType } from 'Type/Common.type';

/** @namespace Seedsman/Component/ClickOutside/Component */
export class ClickOutsideComponent extends SourceClickOutside {
    static propTypes = {
        onClick: PropTypes.func,
        children: ChildrenType,
        isClickOutside: PropTypes.bool.isRequired
    };

    handleClick({ target }) {
        const { onClick, isClickOutside } = this.props;

        if (this.childrenRefs.every(
            (ref) => {
                const elementRef = ref.current?.overlayRef?.current || ref.current;

                return !elementRef.contains(target);
            }
        )) {
            isClickOutside ? null : onClick();
        }
    }
}

export default ClickOutsideComponent;
