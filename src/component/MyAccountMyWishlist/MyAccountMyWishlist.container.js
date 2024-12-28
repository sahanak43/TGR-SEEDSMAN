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
import { connect } from 'react-redux';

import { SHARE_WISHLIST_POPUP_ID } from 'Component/ShareWishlistPopup/ShareWishlistPopup.config';
import { MyAccountMyWishlistContainer as SourceMyAccountMyWishlistContainer } from 'SourceComponent/MyAccountMyWishlist/MyAccountMyWishlist.container';
import { showNotification } from 'Store/Notification/Notification.action';
import { showPopup } from 'Store/Popup/Popup.action';
import { ProductType } from 'Type/ProductList.type';

import MyAccountMyWishlist from './MyAccountMyWishlist.component';

export const WishlistDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Wishlist/Wishlist.dispatcher'
);

/** @namespace Seedsman/Component/MyAccountMyWishlist/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    wishlistItems: state.WishlistReducer.productsInWishlist,
    sharingcode: state.WishlistReducer.sharingCode,
    isWishlistLoading: state.WishlistReducer.isLoading,
    isMobile: state.ConfigReducer.device.isMobile
});

/** @namespace Seedsman/Component/MyAccountMyWishlist/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    clearWishlist: () => WishlistDispatcher.then(
        ({ default: dispatcher }) => dispatcher.clearWishlist(dispatch)
    ),
    moveWishlistToCart: () => WishlistDispatcher.then(
        ({ default: dispatcher }) => dispatcher.moveWishlistToCart(dispatch)
    ),
    getSharingcode: () => WishlistDispatcher.then(
        ({ default: dispatcher }) => dispatcher.getShareCode(dispatch)
    ),
    showPopup: (payload) => dispatch(showPopup(SHARE_WISHLIST_POPUP_ID, payload)),
    showNotification: (message) => dispatch(showNotification('success', message)),
    showError: (message) => dispatch(showNotification('error', message)),
    removeSelectedFromWishlist: (options) => WishlistDispatcher.then(
        ({ default: dispatcher }) => dispatcher.removeItemsFromWishlist(dispatch, options)
    )
});

/** @namespace Seedsman/Component/MyAccountMyWishlist/Container */
export class MyAccountMyWishlistContainer extends SourceMyAccountMyWishlistContainer {
    static propTypes = {
        showPopup: PropTypes.func.isRequired,
        showError: PropTypes.func.isRequired,
        clearWishlist: PropTypes.func.isRequired,
        showNotification: PropTypes.func.isRequired,
        moveWishlistToCart: PropTypes.func.isRequired,
        getSharingcode: PropTypes.func.isRequired,
        wishlistItems: PropTypes.objectOf(ProductType).isRequired,
        isWishlistLoading: PropTypes.bool.isRequired,
        removeSelectedFromWishlist: PropTypes.func.isRequired,
        creatorsName: PropTypes.string,
        isEditingActive: PropTypes.bool.isRequired,
        isMobile: PropTypes.bool.isRequired
    };

    componentDidMount() {
        const { getSharingcode } = this.props;
        return getSharingcode();
    }

    containerProps() {
        const {
            isLoading,
            loadingItemsMap,
            isQtyUpdateInProgress

        } = this.state;

        const {
            isWishlistLoading,
            creatorsName,
            wishlistItems,
            isEditingActive,
            isMobile,
            sharingcode
        } = this.props;

        const isWishlistEmpty = this._getIsWishlistEmpty();

        return {
            isWishlistLoading,
            isWishlistEmpty,
            isLoading,
            isActionsDisabled: isWishlistLoading || isWishlistEmpty,
            loadingItemsMap,
            creatorsName,
            wishlistItems,
            isEditingActive,
            isMobile,
            isQtyUpdateInProgress,
            sharingcode
        };
    }

    render() {
        return (
            <MyAccountMyWishlist
              { ...this.containerProps() }
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountMyWishlistContainer);
