/* eslint-disable max-len */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable jsx-a11y/label-has-associated-control */
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

import Loader from 'Component/Loader';
import { FieldFile as SourceFieldFile } from 'SourceComponent/FieldFile/FieldFile.component';

/**
 * Field File
 * @class FieldFile
 * @namespace Seedsman/Component/FieldFile/Component */
export class FieldFileComponent extends SourceFieldFile {
    renderFileLabel() {
        const {
            attr: { id = '' } = {},
            fileName = '',
            isLoading = false
        } = this.props;

        if (isLoading) {
            return <Loader isLoading />;
        }

        if (fileName) {
            return (
                <label htmlFor={ id }>
                    <p>{ fileName }</p>
                </label>
            );
        }

        // const dropLabel = multiple ? __('Drop files here or') : __('Drop file here or');
        // const selectLabel = multiple ? __('Select files') : __('Select file');

        return (
            <label htmlFor={ id }>
                <span>
                    <svg
                      width="24"
                      height="24"
                      xmlns="http://www.w3.org/2000/svg"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    >
                        <path d="M17.843 1c2.159 0 3.912 1.753 3.912 3.912 0 .395-.053 1.704-1.195 2.813l-8.465 8.465c-.596.671-2.12 1.279-3.299.099-1.178-1.177-.586-2.685.088-3.29l4.409-4.409.707.707-3.164 3.163.014.003-1.411 1.413.004.003c-.97 1.151.618 2.93 1.977 1.572l8.383-8.384c.656-.652.94-1.393.94-2.155 0-1.601-1.299-2.9-2.9-2.9-.783 0-1.495.311-2.018.818l-.003-.003c-.573.573-11.502 11.494-11.534 11.527l-.002-.002c-.795.812-1.286 1.923-1.286 3.148 0 2.483 2.017 4.5 4.5 4.5.65 0 1.84.007 3.52-1.668l10.273-10.267.707.707-10.477 10.477c-1.004 1.077-2.435 1.751-4.023 1.751-3.035 0-5.5-2.465-5.5-5.5 0-1.577.666-3 1.731-4.004 10.668-10.667 10.835-10.839 11.295-11.297.277-.278 1.215-1.199 2.817-1.199" />
                    </svg>
                </span>
            </label>
        );
    }
}

export default FieldFileComponent;
