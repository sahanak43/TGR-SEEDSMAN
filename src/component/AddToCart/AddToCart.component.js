/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */

import { AddToCart as SourceAddToCart } from 'SourceComponent/AddToCart/AddToCart.component';

import './AddToCart.override.style';

/**
 * Button for adding product to Cart
 * @class AddToCart
 * @namespace Seedsman/Component/AddToCart/Component */
export class AddToCartComponent extends SourceAddToCart {
    render() {
        const {
            mix, addProductToCart, layout, isDisabled, isAdding
        } = this.props;

        return (
            <button
              onClick={ addProductToCart }
              block="Button AddToCart"
              mix={ mix }
              mods={ { layout } }
              disabled={ isDisabled || isAdding }
            >
                { this.renderCartIcon() }
                <span className="AddToCart">
                { isAdding ? 'Adding...' : 'Add to basket' }
                </span>
            </button>
        );
    }
}

export default AddToCartComponent;
