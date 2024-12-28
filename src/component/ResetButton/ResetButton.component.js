import {
    ResetButton as SourceResetButton
} from 'SourceComponent/ResetButton/ResetButton.component';

/** @namespace Seedsman/Component/ResetButton/Component */
export class ResetButtonComponent extends SourceResetButton {
    render() {
        const { mix, isContentFiltered } = this.props;

        if (!isContentFiltered) {
            return null;
        }

        return (
            <div
              block="ResetButton"
              mix={ mix }
            >
                <button
                  onClick={ this.onClick }
                  block="ResetButton"
                  elem="Button"
                  mix={ {
                      block: 'Button',
                      mods: { isHollow: true }
                  } }
                >
                    Clear
                </button>
            </div>
        );
    }
}

export default ResetButtonComponent;
