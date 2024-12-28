/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
    MyAccountOrderTab as SourceMyAccountOrderTab
} from 'SourceComponent/MyAccountOrderTab/MyAccountOrderTab.component';

import './MyAccountOrderTab.style';

/** @namespace Seedsman/Component/MyAccountOrderTab/Component */
export class MyAccountOrderTabComponent extends SourceMyAccountOrderTab {
    render() {
        const { title, isActive, handleClickOnTab } = this.props;

        return (
            <li
              block="MyAccountOrderTab"
              elem="Item"
              mods={ { isActive } }
            >
                <button
                  mix={ { block: 'MyAccountOrderTab', elem: 'Button' } }
                  onClick={ handleClickOnTab }
                >
                    { title }
                </button>
            </li>
        );
    }
}

export default MyAccountOrderTabComponent;
