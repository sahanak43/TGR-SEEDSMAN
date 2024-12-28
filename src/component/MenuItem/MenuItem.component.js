/* eslint-disable no-sequences */
/* eslint-disable jsx-a11y/click-events-have-key-events */
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
import ChevronIcon from 'Component/ChevronIcon';
import { BOTTOM, TOP } from 'Component/ChevronIcon/ChevronIcon.config';
import Link from 'Component/Link';
import { MenuItem as SoureMenuItemComponent } from 'SourceComponent/MenuItem/MenuItem.component';

/** @namespace Seedsman/Component/MenuItem/Component */
export class MenuItemComponent extends SoureMenuItemComponent {
    renderPlusMinusIcon() {
        const { itemMods: { isExpanded } } = this.props;

        return <ChevronIcon direction={ isExpanded ? TOP : BOTTOM } />;
    }

    renderItemLinkContent() {
        const {
            activeMenuItemsStack,
            item,
            itemMods,
            handleCategoryHover,
            handleLinkLeave,
            onItemClick,
            onMenuCloseClick,
            device: { isMobile }
        } = this.props;

        const {
            url,
            item_id
        } = item;

        const isHovered = activeMenuItemsStack.includes(item_id);

        return (
            <Link
              to={ url }
              block="Menu"
              elem="Link"
              id={ item_id }
              onMouseEnter={ handleCategoryHover }
              onMouseLeave={ handleLinkLeave }
              mods={ { isHovered } }
              onClick={ onItemClick, (isMobile && onMenuCloseClick) }
            >
                { this.renderItemContent(item, itemMods) }
            </Link>
        );
    }
}

export default MenuItemComponent;
