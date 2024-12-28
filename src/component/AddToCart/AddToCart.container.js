/* eslint-disable max-len */
import { connect } from 'react-redux';

import { AddToCartContainer as SourceAddToCartContainer, mapDispatchToProps, mapStateToProps } from 'SourceComponent/AddToCart/AddToCart.container';
import { ADD_TO_CART } from 'Util/Product';
import { magentoProductTransform } from 'Util/Product/Transform';
import { publishEvent } from 'Util/Script';

/* @namespace Seedsman/Component/AddToCart/Container */
export class AddToCartContainer extends SourceAddToCartContainer {
    getConfigurableVariantIndex(sku, variants) {
        return Object.keys(variants).find((i) => variants[i].sku === sku);
    }

    async addProductToCart(e) {
        const {
            product, product: item, addToCart,
            handlePopup, isPlpPopUp
        } = this.props;

        if ((!product || Object.keys(product).length === 0) && !addToCart) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();
        this.setState({ isAdding: true });

        if (!this.validate()) {
            return;
        }

        if (typeof addToCart === 'function') {
            try {
                await addToCart();
                publishEvent('insiderIntegration', {
                    type: 'ADD_TO_CART',
                    data: item
                });
            } finally {
                this.setState({ isAdding: false });
            }
        } else {
            const {
                quantity,
                cartId,
                fallbackAddToCart
            } = this.props;
            const magentoProduct = magentoProductTransform(ADD_TO_CART, product, quantity);

            try {
                await fallbackAddToCart({
                    products: magentoProduct,
                    cartId
                });
            } finally {
                this.setState({ isAdding: false });
            }
        }

        if (isPlpPopUp) {
            handlePopup();
        }
        this.setState({ isAdding: false });
    }

    containerProps() {
        const {
            isDisabled,
            isIconEnabled,
            mix,
            layout,
            isConfigProduct,
            isPdp,
            handlePopup
        } = this.props;

        const {
            isAdding
        } = this.state;

        return {
            isDisabled,
            isIconEnabled,
            mix,
            layout,
            isAdding,
            isConfigProduct,
            isPdp,
            handlePopup
        };
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddToCartContainer);
