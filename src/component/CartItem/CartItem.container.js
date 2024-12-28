/* eslint-disable max-len */
/* eslint-disable max-lines */
import { connect } from 'react-redux';

import { CART_POPUP } from 'Component/CartPagePopup/CartPagePopup.config';
import { CartItemContainer as SourceCartItemContainer } from 'SourceComponent/CartItem/CartItem.container';
import { goToPreviousNavigationState } from 'Store/Navigation/Navigation.action';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { showNotification } from 'Store/Notification/Notification.action';
import { hideActiveOverlay } from 'Store/Overlay/Overlay.action';
import { showPopup } from 'Store/Popup/Popup.action';
import { scrollToTop } from 'Util/Browser';
import { getMaxQuantity, getMinQuantity } from 'Util/Product/Extract';

import CartItem from './CartItem.component';

export const CartDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Cart/Cart.dispatcher'
);

/** @namespace Seedsman/Component/CartItem/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    isMobile: state.ConfigReducer.device.isMobile,
    cartId: state.CartReducer.id,
    itemId: state.PopupReducer.popupPayload?.CartPagePopup?.id,
    cartLength: state.CartReducer.cartTotals.items
});

/** @namespace Seedsman/Component/CartItem/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    addProduct: (options) => CartDispatcher.then(
        ({ default: dispatcher }) => dispatcher.addProductToCart(dispatch, options)
    ),
    hideActiveOverlay: () => dispatch(hideActiveOverlay()),
    goToPreviousNavigationState: (state) => dispatch(goToPreviousNavigationState(TOP_NAVIGATION_TYPE, state)),
    changeItemQty: (options) => CartDispatcher.then(
        ({ default: dispatcher }) => dispatcher.changeItemQty(dispatch, options)
    ),
    removeProduct: (options) => CartDispatcher.then(
        ({ default: dispatcher }) => dispatcher.removeProductFromCart(dispatch, options)
    ),
    updateCrossSellProducts: (items) => CartDispatcher.then(
        ({ default: dispatcher }) => dispatcher.updateCrossSellProducts(items, dispatch)
    ),
    showNotification: (type, title, error) => dispatch(showNotification(type, title, error)),
    showPopup: (payload) => dispatch(showPopup(CART_POPUP, payload))
});

/** @namespace Seedsman/Component/CartItem/Container */
export class CartItemContainer extends SourceCartItemContainer {
    setStateNotLoading = this.setStateNotLoading.bind(this);

    containerFunctions = {
        handleChangeQuantity: this.handleChangeQuantity.bind(this),
        handleRemoveItem: this.handleRemoveItem.bind(this),
        getCurrentProduct: this.getCurrentProduct.bind(this),
        getProductVariant: this.getProductVariant.bind(this),
        handleRemovePopup: this.handleRemovePopup.bind(this)
    };

    componentDidMount() {
        this.setStateNotLoading();
    }

    containerProps() {
        const {
            item,
            currency_code,
            isEditing,
            isCartOverlay,
            isMobile,
            showLoader,
            isWishlistItem
        } = this.props;
        const { isLoading } = this.state;

        return {
            item,
            currency_code,
            isEditing,
            isCartOverlay,
            isMobile,
            isLoading,
            showLoader,
            isWishlistItem,
            linkTo: this._getProductLinkTo(),
            thumbnail: this._getProductThumbnail(),
            minSaleQuantity: getMinQuantity(this.getCurrentProduct()),
            maxSaleQuantity: getMaxQuantity(this.getCurrentProduct()),
            isProductInStock: this.productIsInStock(),
            optionsLabels: this.getConfigurableOptionsLabels(),
            isMobileLayout: this.getIsMobileLayout(),
            optionsArray: this.getConfigurableOptionsArray()
        };
    }

    _getProductThumbnail() {
        const product = this.getCurrentProduct();
        const { thumbnail: { url: thumbnail } = {} } = product || {};

        return thumbnail || '';
    }

    getConfigurableOptionsLabels() {
        const {
            item: {
                product: {
                    configurable_options,
                    variants
                } = {}
            } = {}
        } = this.props;

        if (!variants || !configurable_options) {
            return [];
        }

        const { attributes = [] } = this.getCurrentProduct() || {};

        return Object.entries(attributes)
            .filter(([attrKey]) => Object.keys(configurable_options).includes(attrKey))
            .map(this.getConfigurationOptionLabel.bind(this))
            .filter((label) => label);
    }

    scrolltoTop() {
        const { cartLength } = this.props;

        const CartRemove = cartLength.filter((item) => {
            if (item.is_promo_item) {
                return null;
            }

            return item;
        });

        if (CartRemove.length === 1) {
            return scrollToTop();
        }

        return null;
    }

    setStateNotLoading() {
        this.notifyAboutLoadingStateChange(false);
        this.setState({ isLoading: false }, () => this.scrolltoTop());
    }

    /**
     * @param {Promise} promise
     * @returns {void}
     */
    hideLoaderAfterPromise(promise) {
        this.registerCancelablePromise(promise)
            .promise.then(this.setStateNotLoading, this.setStateNotLoading);
    }

    async removeProductAndUpdateCrossSell() {
        const {
            removeProduct,
            updateCrossSellProducts,
            updateCrossSellsOnRemove,
            item: { item_id },
            hideActiveOverlay,
            goToPreviousNavigationState
        } = this.props;

        hideActiveOverlay();
        goToPreviousNavigationState();

        const result = await removeProduct(item_id);

        if (result && updateCrossSellsOnRemove) {
            await updateCrossSellProducts(result.items);
        }

        return result;
    }

    handleRemovePopup(id, handleRemoveItem) {
        const { showPopup } = this.props;
        showPopup({
            action: CART_POPUP,
            id,
            handleRemoveItem
        });
    }

    getConfigurableOptionsArray() {
        const {
            item: {
                product: {
                    configurable_options,
                    variants
                } = {}
            } = {}
        } = this.props;

        if (!variants || !configurable_options) {
            return [];
        }

        const { attributes = [] } = this.getCurrentProduct() || {};

        return Object.entries(attributes)
            .filter(([attrKey]) => Object.keys(configurable_options).includes(attrKey))
            .map(this.getConfigurationOptionData.bind(this));
        // .filter((label) => label);
    }

    _getVariantIndex() {
        const {
            item: {
                sku: itemSku,
                product: { variants = [], wishlist: { sku: wishlistSKU } = {} } = {}
            },
            isWishlistItem
        } = this.props;

        if (isWishlistItem) {
            return variants.findIndex(({ sku }) => sku === wishlistSKU || wishlistSKU.includes(sku));
        }

        return variants.findIndex(({ sku }) => sku === itemSku || itemSku.includes(sku));
    }

    // eslint-disable-next-line no-unused-vars
    getConfigurationOptionData([key, attribute]) {
        const {
            item: {
                product: {
                    variants,
                    configurable_options = {}
                }
            }
        } = this.props;

        const { attribute_code, attribute_value } = attribute;
        const {
            [attribute_code]: { // configurable option attribute
                attribute_options: {
                    [attribute_value]: { // attribute option value label
                        label
                    } = []
                }
            }
        } = configurable_options;

        const configurableData = [];

        // eslint-disable-next-line array-callback-return
        variants.map((data) => {
            // data.attributes[attribute_code].attribute_value = attribute_value;
            const item = [];
            item.attribute_code = data.attributes[attribute_code].attribute_code;
            item.attribute_label = data.attributes[attribute_code].attribute_label;
            item.attribute_value = label || null;
            configurableData.push(item);
        });

        if (!configurableData.length) {
            return null;
        }

        return configurableData;
    }

    render() {
        return (
                <CartItem
                  { ...this.containerFunctions }
                  { ...this.containerProps() }
                />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartItemContainer);
