/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
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
import ClickOutside from 'Component/ClickOutside';
import CloseIcon from 'Component/CloseIcon';
import { Popup as ParentPopup } from 'SourceComponent/Popup/Popup.component';

import './Popup.override.style';

/** @namespace Seedsman/Component/Popup/Component */
export class PopupComponent extends ParentPopup {
    renderContent() {
        const { children, contentMix, isClickOutside } = this.props;
        const isVisible = this.getIsVisible();

        if (!isVisible) {
            return null;
        }

        return (
            <ClickOutside onClick={ this.hidePopUp } isClickOutside={ isClickOutside }>
                <div block="Popup" elem="Content" mix={ contentMix }>
                    <header block="Popup" elem="Header">
                        { this.renderTitle() }
                        { isClickOutside ? null : this.renderCloseButton() }
                    </header>
                    { this.renderNotifications() }
                    { children }
                </div>
            </ClickOutside>
        );
    }

    renderCloseButton() {
        return (
            <button
              block="Popup"
              elem="CloseBtn"
              aria-label="Close"
              onClick={ this.hidePopUp }
            >
                <CloseIcon />
            </button>
        );
    }
}

export default PopupComponent;
