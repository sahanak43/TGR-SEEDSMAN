import { connect } from 'react-redux';

import {
    getCartShippingPrice,
    getCartShippingSubPrice,
    getCartSubtotal,
    getCartSubtotalSubPrice,
    getCartTotalSubPrice
} from 'Util/Cart';

// eslint-disable-next-line import/no-cycle
import CheckoutOrderSummary from './CheckoutOrderSummary.component';

/** @namespace Seedsman/Component/CheckoutOrderSummary/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    cartDisplayConfig: state.ConfigReducer.cartDisplayConfig,
    storeConfig: state.ConfigReducer.display_tax_in_checkout,
    cartSubtotal: getCartSubtotal(state),
    cartSubtotalSubPrice: getCartSubtotalSubPrice(state),
    cartShippingPrice: getCartShippingPrice(state),
    cartShippingSubPrice: getCartShippingSubPrice(state),
    cartTotalSubPrice: getCartTotalSubPrice(state),
    isLoading: state.CartReducer.isLoading,
    isMobile: state.ConfigReducer.device.isMobile,
    cartFoomanCharge: state.CheckoutReducer.foomanCharges
});

/** @namespace Seedsman/Component/CheckoutOrderSummary/Container/mapDispatchToProps */
export const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutOrderSummary);
