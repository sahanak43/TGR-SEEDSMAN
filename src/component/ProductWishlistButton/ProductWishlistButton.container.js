/* eslint-disable react/require-default-props */
import { connect } from 'react-redux';

import PRODUCT_TYPE from 'Component/Product/Product.config';
import {
    mapDispatchToProps as sourcemapDispatchToProps,
    mapStateToProps,
    ProductWishlistButtonContainer as SourceProductWishlistButtonContainer
} from 'SourceComponent/ProductWishlistButton/ProductWishlistButton.container';
import { changeNavigationState } from 'Store/Navigation/Navigation.action';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { showNotification } from 'Store/Notification/Notification.action';
import { isSignedIn } from 'Util/Auth';
import history from 'Util/History';
import { ADD_TO_CART } from 'Util/Product';
import { getSelectedOptions, magentoProductTransform } from 'Util/Product/Transform';
import { Debouncer } from 'Util/Request';
import { appendWithStoreCode } from 'Util/Url';

export const WishlistDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Wishlist/Wishlist.dispatcher'
);

export const CartDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Cart/Cart.dispatcher'
);

/** @namespace Seedsman/Component/ProductWishlistButton/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    ...sourcemapDispatchToProps(dispatch),
    showNotification: (type, message) => dispatch(showNotification(type, message)),
    addProductToCart: (options) => CartDispatcher.then(
        ({ default: dispatcher }) => dispatcher.addProductToCart(dispatch, options)
    ),
    updateWishlistItem: (options) => WishlistDispatcher.then(
        ({ default: dispatcher }) => dispatcher.updateWishlistItem(dispatch, options)
    ),
    removeFromWishlist: (options) => WishlistDispatcher.then(
        ({ default: dispatcher }) => dispatcher.removeItemFromWishlist(dispatch, options)
    ),
    changeHeaderState: (state) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state))
});

/** @namespace Seedsman/Component/ProductWishlistButton/Container */
export class ProductWishlistButtonContainer extends SourceProductWishlistButtonContainer {
    containerFunctions = {
        addToWishlist: this.toggleProductInWishlist.bind(this, true),
        removeFromWishlist: this.toggleProductInWishlist.bind(this, false),
        addToCart: this.addItemToCart.bind(this),
        removeItem: this.removeItem.bind(this, false, true)
    };

    changeQuantityDebouncer = new Debouncer();

    changeDescriptionDebouncer = new Debouncer();

    containerProps() {
        const { magentoProduct, mix, isFromCart } = this.props;

        return {
            mix,
            magentoProduct,
            isDisabled: this.isDisabled(),
            isInWishlist: this.isInWishlist(),
            isSignedIn: isSignedIn(),
            isFromCart
        };
    }

    // eslint-disable-next-line no-unused-vars
    async removeItem(noMessages = true, isRemoveOnly = false) {
        const { product: { wishlist: { id: item_id } }, removeFromWishlist } = this.props;

        if (!isSignedIn()) {
            return;
        }

        this.setState({ isWishlistButtonLoading: true });

        // handleSelectIdChange(item_id, isRemoveOnly);
        // TODO remove
        try {
            removeFromWishlist({ item_id, noMessages });
        } catch (e) {
            this.showNotification('error', __('Error cleaning wishlist'));
        }
    }

    getQuantity() {
        const {
            product: {
                type_id: typeId,
                wishlist: {
                    quantity,
                    buy_request: buyRequest
                }
            }
        } = this.props;

        if (typeId !== PRODUCT_TYPE.grouped) {
            return quantity;
        }

        const { super_group: superGroup = {} } = JSON.parse(buyRequest);

        return superGroup;
    }

    getProducts() {
        const {
            product: {
                wishlist: {
                    buy_request
                }
            },
            product: item
        } = this.props;

        const { currentQty } = this.state;

        const selectedOptions = getSelectedOptions(buy_request);

        // take input value in case item in wishlist hasn't been updated yet (if you change qty and click "Add to cart" immediately)
        const quantity = currentQty || this.getQuantity();

        return magentoProductTransform(ADD_TO_CART, item, quantity, [], selectedOptions);
    }

    getConfigurableVariantIndex(sku, variants) {
        return Object.keys(variants).find((i) => variants[i].sku === sku);
    }

    async addItemToCart() {
        const {
            product: item,
            addProductToCart,
            showNotification
        } = this.props;

        const {
            type_id,
            variants,
            url,
            wishlist: {
                id,
                sku
            }
        } = item;

        if (!isSignedIn()) {
            return;
        }

        if (type_id === PRODUCT_TYPE.configurable) {
            const configurableVariantIndex = this.getConfigurableVariantIndex(sku, variants);

            if (!configurableVariantIndex) {
                history.push({ pathname: appendWithStoreCode(url) });
                showNotification('info', __('Please, select product options!'));

                return;
            }

            item.configurableVariantIndex = configurableVariantIndex;
        }

        this.setState({ isWishlistButtonLoading: true });

        const products = this.getProducts();

        try {
            this.changeQuantityDebouncer.cancelDebounceAndExecuteImmediately();
            this.changeDescriptionDebouncer.cancelDebounceAndExecuteImmediately();
            await addProductToCart({ products });
            this.removeItem(id);
        } catch {
            this.setState({ isWishlistButtonLoading: false });
            history.push({ pathname: appendWithStoreCode(url) });
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductWishlistButtonContainer);
