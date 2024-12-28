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

import { connect } from 'react-redux';

import { mapDispatchToProps, mapStateToProps as sorucemapStateToProps, MenuItemContainer as SourceMenuItemContainer } from 'SourceComponent/MenuItem/MenuItem.container';

/** @namespace Seedsman/Component/MenuItem/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    ...sorucemapStateToProps(state),
    code: state.ConfigReducer.code
});

/** @namespace Seedsman/Component/MenuItem/Container */
export class MenuItemContainer extends SourceMenuItemContainer {
    containerProps() {
        const {
            activeMenuItemsStack,
            isExpandable,
            isLink,
            item,
            itemMods,
            onMenuCloseClick,
            device,
            code
        } = this.props;

        return {
            activeMenuItemsStack,
            isExpandable,
            isLink,
            item,
            itemMods,
            onMenuCloseClick,
            device,
            code
        };
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuItemContainer);
