/* eslint-disable max-lines */
/* eslint-disable fp/no-let */
import CheckoutQuery from 'Query/Checkout.query';
import { getAuthorizationToken, isSignedIn } from 'Util/Auth';
import BrowserDatabase from 'Util/BrowserDatabase';
import { deleteGuestQuoteId, getGuestQuoteId } from 'Util/Cart';
import { fetchMutation } from 'Util/Request';
import getStore from 'Util/Store';

import { fireLoyalityPoints } from '../../../../../src/@scandiweb/gtm/event/cart';
import { firePaymonixPurchaseEvent } from '../../../../../src/@scandiweb/gtm/event/checkout';
import PaymentQuery from '../query/Payment.query';
import { redirectToUrl } from '../util/Redirect';

const PAYMONIX_PAYMENT = 'sds_paymentgate_gateway';
const SNAP_SCAN_PAYMENT = 'snapPay';
const ZION_PAYMENT = 'oppcw_creditcard';
const BTC_PAYMENT = 'btcpay';
const FIBNOTRIX_PAYMENT = 'paragon';

export const CartDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Cart/Cart.dispatcher'
);

export const resetCart = () => {
    CartDispatcher.then(
        ({ default: dispatcher }) => dispatcher.updateInitialCartData(getStore().dispatch, getAuthorizationToken())
    );
};

export const resetGuestCart = () => {
    CartDispatcher.then(
        ({ default: dispatcher }) => {
            dispatcher.resetGuestCart(getStore().dispatch);
            dispatcher.createGuestEmptyCart(getStore().dispatch);
        }
    );
};

const placeOrderMethod = async ({
    code, additional_data, purchase_order_number, guest_cart_id, instance, point
}) => {
    try {
        await fetchMutation(CheckoutQuery.getSetPaymentMethodOnCartMutation({
            guest_cart_id,
            payment_method: {
                code,
                [code]: additional_data,
                purchase_order_number
            }
        }));

        let error_res;
        let redirect_url_res;
        let orderData_res;

        switch (code) {
        case PAYMONIX_PAYMENT: {
            // call paymonix payment mutations
            const orderData = await fetchMutation(PaymentQuery.getPaymonixPlaceOrderMutation(guest_cart_id));
            const {
                getPaymonixPaymentGatewayUrl: {
                    error,
                    order_id,
                    order_int,
                    redirect_url
                }
            } = orderData;

            error_res = error;
            redirect_url_res = redirect_url;
            orderData_res = orderData;

            const orderDetails = {
                order_id,
                order_int
            };

            // save the order id in localstorage
            BrowserDatabase.setItem(orderDetails, 'LastOrderDetails');
            await firePaymonixPurchaseEvent(order_id);
            break;
        }
        case SNAP_SCAN_PAYMENT: {
            // call snapscan payment mutations
            const orderData = await fetchMutation(PaymentQuery.getSnapScanPlaceOrderMutation(guest_cart_id));
            const {
                getSnapScanPaymentGatewayUrl: {
                    error,
                    order_id,
                    order_int,
                    redirect_url
                }
            } = orderData;

            error_res = error;
            redirect_url_res = redirect_url;
            orderData_res = orderData;

            const orderDetails = {
                order_id,
                order_int
            };

            // save the order id in localstorage
            BrowserDatabase.setItem(orderDetails, 'LastOrderDetails');
            await firePaymonixPurchaseEvent(order_id);

            break;
        }
        case ZION_PAYMENT: {
            // call zion payment mutations
            const orderData = await fetchMutation(PaymentQuery.getZionPlaceOrderMutation(guest_cart_id));
            const {
                getZionPaymentRedirectUrl: {
                    error,
                    order_id,
                    order_int,
                    redirect_url
                }
            } = orderData;

            error_res = error;
            redirect_url_res = redirect_url;
            orderData_res = orderData;

            const orderDetails = {
                order_id,
                order_int
            };

            // save the order id in localstorage
            BrowserDatabase.setItem(orderDetails, 'LastOrderDetails');
            await firePaymonixPurchaseEvent(order_id);
            break;
        }

        case BTC_PAYMENT: {
            // call btc payment mutations
            const orderData = await fetchMutation(PaymentQuery.getBtcPlaceOrderMutation(guest_cart_id));
            const {
                getBTCPaymentRedirectUrl: {
                    error,
                    order_id,
                    order_int,
                    redirect_url
                }
            } = orderData;

            error_res = error;
            redirect_url_res = redirect_url;
            orderData_res = orderData;

            const orderDetails = {
                order_id,
                order_int
            };

            // save the order id in localstorage
            BrowserDatabase.setItem(orderDetails, 'LastOrderDetails');
            await firePaymonixPurchaseEvent(order_id);
            break;
        }

        case FIBNOTRIX_PAYMENT: {
            // call fibnotrix payment mutations
            const orderData = await fetchMutation(PaymentQuery.getFibnotrixPlaceOrderMutation(guest_cart_id));
            const {
                getFibonatixPaymentRedirectUrl: {
                    error,
                    order_id,
                    order_int,
                    redirect_url
                }
            } = orderData;

            error_res = error;
            redirect_url_res = redirect_url;
            orderData_res = orderData;

            const orderDetails = {
                order_id,
                order_int
            };

            // save the order id in localstorage
            BrowserDatabase.setItem(orderDetails, 'LastOrderDetails');
            await firePaymonixPurchaseEvent(order_id);
            break;
        }

        default:
            break;
        }
        // We take the redirect URL we requested in the previous step and redirect to it
        if (!error_res && redirect_url_res) {
            deleteGuestQuoteId();
            BrowserDatabase.deleteItem('PAYMENT_TOTALS');

            if (isSignedIn()) {
                resetCart();
            } else {
                resetGuestCart();
            }
            fireLoyalityPoints(point);

            redirectToUrl(redirect_url_res);
        } else {
            throw Error('Expected redirect url in order data, none found', orderData_res);
        }
    } catch (e) {
        instance._handleError(e);
    }
};

// eslint-disable-next-line consistent-return
const savePaymentMethodAndPlaceOrder = async (args, callback, instance) => {
    const [data] = args || [];
    const { paymentInformation, point } = data;

    const { paymentMethod: { code, additional_data, purchase_order_number } = {} } = paymentInformation;
    const guest_cart_id = !isSignedIn() ? getGuestQuoteId() : '';

    switch (code) {
    case PAYMONIX_PAYMENT: {
        const paymonixData = {
            code,
            additional_data,
            purchase_order_number,
            guest_cart_id,
            instance,
            point
        };

        placeOrderMethod(paymonixData);
        break;
    }
    case SNAP_SCAN_PAYMENT: {
        const snapScanData = {
            code,
            additional_data,
            purchase_order_number,
            guest_cart_id,
            instance,
            point
        };

        placeOrderMethod(snapScanData);
        break;
    }

    case ZION_PAYMENT: {
        const zionData = {
            code,
            additional_data,
            purchase_order_number,
            guest_cart_id,
            instance,
            point
        };

        placeOrderMethod(zionData);
        break;
    }

    case BTC_PAYMENT: {
        const btcData = {
            code,
            additional_data,
            purchase_order_number,
            guest_cart_id,
            instance,
            point
        };

        placeOrderMethod(btcData);
        break;
    }

    case FIBNOTRIX_PAYMENT: {
        const fibData = {
            code,
            additional_data,
            purchase_order_number,
            guest_cart_id,
            instance,
            point
        };

        placeOrderMethod(fibData);
        break;
    }

    default:
        return callback(...args);
    }
};

// Afain, we need to export the plugin configuration:
export default {
    'Seedsman/Route/Checkout/Container': {
        'member-function': {
            savePaymentMethodAndPlaceOrder
        }
    }
};
