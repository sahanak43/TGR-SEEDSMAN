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

import Html from 'Component/Html';
import {
    CmsBlock as SourceCmsBlockComponent
} from 'SourceComponent/CmsBlock/CmsBlock.component';

import './CmsBlock.style';

/**
 * Cms Block
 * @class CmsBlock
 * @namespace Seedsman/Component/CmsBlock/Component */
export class CmsBlockComponent extends SourceCmsBlockComponent {
    render() {
        const {
            cmsBlock: {
                identifier,
                content,
                disabled
            },
            blockType
        } = this.props;

        if (disabled || !content) {
            return null;
        }

        if (identifier === undefined) {
            return this.renderPlaceholder();
        }

        return (
            <div
              block="CmsBlock"
              elem="Wrapper"
              mods={ { type: blockType } }
            >
                <Html content={ content } />
            </div>
        );
    }
}

export default CmsBlockComponent;
