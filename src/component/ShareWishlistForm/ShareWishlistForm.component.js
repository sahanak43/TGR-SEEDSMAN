/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
/* eslint-disable max-len */
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
import PropTypes from 'prop-types';

import Loader from 'Component/Loader';
import { ShareWishlistForm as SourceshareWishlistForm } from 'SourceComponent/ShareWishlistForm/ShareWishlistForm.component';
import transformToNameValuePair from 'Util/Form/Transform';

import shareWishlistForm from './ShareWishlistForm.form';

/** @namespace Seedsman/Component/ShareWishlistForm/Component */
export class ShareWishlistFormComponent extends SourceshareWishlistForm {
    static propTypes = {
        onSave: PropTypes.func.isRequired,
        isFormLoading: PropTypes.bool.isRequired
    };

    onFormSuccess = this.onFormSuccess.bind(this);

    get fieldMap() {
        return shareWishlistForm();
    }

    async onFormSuccess(form, fields) {
        const { onSave } = this.props;

        await onSave(transformToNameValuePair(fields));
    }

    renderActions() {
        const { isFormLoading } = this.props;

        return (
            <>
                { isFormLoading && <Loader isLoading /> }
                <button type="submit" block="Button">
                    Share Wishlist
                </button>
            </>
        );
    }

    getFormProps() {
        return {
            onSubmit: this.onFormSuccess
        };
    }
}

export default ShareWishlistFormComponent;
