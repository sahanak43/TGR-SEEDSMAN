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

import Popup from 'Component/Popup';
import {
    NewVersionPopup as SourceNewVersionPopup
} from 'SourceComponent/NewVersionPopup/NewVersionPopup.component';

import { NEW_VERSION_POPUP_ID } from './NewVersionPopup.config';

import './NewVersionPopup.override.style';

/** @namespace Seedsman/Component/NewVersionPopup/Component */
export class NewVersionPopupComponent extends SourceNewVersionPopup {
    render() {
        return (
            <Popup
              id={ NEW_VERSION_POPUP_ID }
              clickOutside={ false }
              mix={ { block: 'NewVersionPopup' } }
            >
                { this.renderContent() }
            </Popup>
        );
    }
}

export default NewVersionPopupComponent;
