import { connect } from 'react-redux';

import {
    CartItemPriceContainer as SourceCartItemPriceContainer,
    mapDispatchToProps,
    mapStateToProps
} from 'SourceComponent/CartItemPrice/CartItemPrice.container';

export {
    mapStateToProps,
    mapDispatchToProps
};

/** @namespace Seedsman/Component/CartItemPrice/Container */
export class CartItemPriceContainer extends SourceCartItemPriceContainer {
    containerProps() {
        const {
            getCartItemPrice,
            getCartItemSubPrice,
            currency_code,
            mix,
            productPrice,
            price_range,
            qty,
            is_promo_item,
            variantPriceRange,
            isWishlistItem,
            ...rest
        } = this.props;

        return {
            currency_code,
            mix,
            productPrice,
            price_range,
            qty,
            is_promo_item,
            variantPriceRange,
            isWishlistItem,
            price: getCartItemPrice(rest),
            subPrice: getCartItemSubPrice(rest)
        };
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartItemPriceContainer);
