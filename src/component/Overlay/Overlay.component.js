/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
import {
    Overlay as SourceOverlay
} from 'SourceComponent/Overlay/Overlay.component';
import { toggleScroll } from 'Util/Browser';

import './Overlay.override.style.scss';

/** @namespace Seedsman/Component/Overlay/Component */
export class OverlayComponent extends SourceOverlay {
    freezeScroll() {
        this.YoffsetWhenScrollDisabled = window.pageYOffset || document.body.scrollTop;
        toggleScroll(false);
    }
}

export default OverlayComponent;
