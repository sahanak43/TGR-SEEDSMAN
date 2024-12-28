/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
import engflag from 'src/util/images/engflag.webp';
import usaflag from 'src/util/images/icons8-usa-24.png';

import { StoreSwitcher as SourceStoreSwitcher } from 'SourceComponent/StoreSwitcher/StoreSwitcher.component';

import './StoreSwitcher.override.style';

/** @namespace Seedsman/Component/StoreSwitcher/Component */
export class StoreSwitcherComponent extends SourceStoreSwitcher {
    renderMobileStoreSwitcher() {
        const {
            storeLabel
        } = this.props;

        return (
            <div block="StoreSwitcher">
            { this.renderFlagIcon() }
            <div block="StoreSwitcher" elem="storeLabel">
             { storeLabel }
            </div>
            </div>
        );
    }

    renderFlagIcon() {
        const { currentStoreCode } = this.props;
        return (
            <div block="StoreSwitcher" elem="flagIcon">
                  <span block="StoreSwitcher" elem="flagIconImg">
                   { currentStoreCode === 'us'
                       ? <img src={ usaflag } alt="" />
                       : <img src={ engflag } alt="" /> }

                  </span>
            </div>
        );
    }

    renderDesktopStoreSwitcher() {
        const {
            storeLabel
        } = this.props;

        return (

            <div block="StoreSwitcher">
                { this.renderFlagIcon() }
                <div block="StoreSwitcher" elem="storeLabel">
                 { storeLabel }
                </div>
            </div>
        );
    }
}
export default StoreSwitcherComponent;
