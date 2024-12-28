/* eslint-disable no-nested-ternary */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable max-len */
import ChevronIcon from 'Component/ChevronIcon';
import { BOTTOM, TOP } from 'Component/ChevronIcon/ChevronIcon.config';
import TextPlaceholder from 'Component/TextPlaceholder';
import { ExpandableContent as ParentExpandableContent } from 'SourceComponent/ExpandableContent/ExpandableContent.component';
import { getStoreCodes } from 'Util/Url';

import './ExpandableContent.override.style';
/** @namespace Seedsman/Component/ExpandableContent/Component */
export class ExpandableContentComponent extends ParentExpandableContent {
    renderButtonIcon() {
        const { isContentExpanded } = this.state;
        const { isArrow } = this.props;

        // if (!isMobile) {
        //     return null;
        // }

        if (isArrow) {
            return <ChevronIcon direction={ isContentExpanded ? TOP : BOTTOM } />;
        }

        return this.renderTogglePlusMinus();
    }

    renderButton() {
        const { isContentExpanded } = this.state;
        const {
            heading, mix, isSelected, flag, isHeadingRequired
        } = this.props;

        return (
            <div
              role="button"
              tabIndex={ 0 }
              block="ExpandableContent"
              elem={ isSelected ? 'Button Selected' : 'Button' }
              mods={ { isContentExpanded } }
              mix={ { ...mix, elem: 'ExpandableContentButton' } }
              onClick={ this.toggleExpand }
            >
                <div
                  block="ExpandableContent"
                  elem="Heading"
                  mix={ { ...mix, elem: 'ExpandableContentHeading' } }
                >
                    { typeof heading === 'string' ? (
                        isHeadingRequired
                            ? <h2><TextPlaceholder content={ heading } length="medium" /></h2>
                            : <TextPlaceholder content={ heading } length="medium" />
                    ) : (
                        <>
                            { heading }
                            { flag && <img block="flag" src={ `https://flagcdn.com/48x36/${getStoreCodes() === 'uk' ? 'gb' : getStoreCodes() }.png` } alt="flag" /> }
                        </>
                    ) }
                </div>
                { this.renderButtonIcon() }
            </div>
        );
    }
}

export default ExpandableContentComponent;
