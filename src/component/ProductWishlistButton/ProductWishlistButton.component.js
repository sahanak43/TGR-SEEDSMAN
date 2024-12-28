/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
import HeartIcon from 'Component/HeartIcon';
import {
    ProductWishlistButton as SourceProductWishlistButton
} from 'SourceComponent/ProductWishlistButton/ProductWishlistButton.component';

import './ProductWishlistButton.override.style';

/** @namespace Seedsman/Component/ProductWishlistButton/Component */
export class ProductWishlistButtonComponent extends SourceProductWishlistButton {
    getTitle() {
        const { isInWishlist, isSignedIn, isFromCart } = this.props;
        if (!isSignedIn) {
            return 'Please sign in first!';
        }

        if (isFromCart) {
            return 'Move to basket';
        }

        if (isInWishlist) {
            return 'Remove from Wishlist';
        }

        return 'Add to Wishlist';
    }

    onClick(e) {
        const {
            magentoProduct,
            isInWishlist,
            addToWishlist,
            removeFromWishlist,
            isFromCart,
            addToCart
        } = this.props;

        e.preventDefault();
        e.stopPropagation();

        if (!isInWishlist) {
            return addToWishlist(magentoProduct);
        }

        if (isFromCart) {
            return addToCart(magentoProduct);
        }

        return removeFromWishlist(magentoProduct);
    }

    renderButton() {
        const { isInWishlist, isDisabled, mix } = this.props;

        return (
            <button
              block="ProductWishlistButton"
              elem="Button"
              mods={ { isInWishlist, isDisabled } }
              mix={ { block: 'Button', mix } }
              title={ this.getTitle() }
              onClick={ this.onClick }
            >
                <HeartIcon isActive={ isInWishlist } />
            </button>
        );
    }
}

export default ProductWishlistButtonComponent;
