/* eslint-disable max-lines */
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CheckoutQuery from 'Query/Checkout.query';
import {
    DELIVERY_METHOD, PAYMENT_TOTALS, SHIPPING_STEP
} from 'Route/Checkout/Checkout.config';
import {
    CheckoutDeliveryOptionsContainer as ParentCheckoutDeliveryOptionsContainer
} from 'SourceComponent/CheckoutDeliveryOptions/CheckoutDeliveryOptions.container';
import { updateShippingPrice } from 'Store/Cart/Cart.action';
import {
    setAvailableShippingMethods, setShippingMethod, updateEditingStep, updateLoadStatus
} from 'Store/Checkout/Checkout.action';
import { Addresstype } from 'Type/Account.type';
import { ShippingMethodsType } from 'Type/Checkout.type';
import BrowserDatabase from 'Util/BrowserDatabase';
import { getGuestQuoteId } from 'Util/Cart';
import { fetchMutation } from 'Util/Request';
import { ONE_MONTH_IN_SECONDS } from 'Util/Request/QueryDispatcher';

import CheckoutDeliveryOptions from './CheckoutDeliveryOptions.component';

export const CartDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Cart/Cart.dispatcher'
);

/** @namespace Seedsman/Component/CheckoutDeliveryOptions/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    selectedAddress: state.CheckoutReducer.shippingFields,
    all_shipping_methods: state.CheckoutReducer.all_shipping_methods,
    step: state.CheckoutReducer.editingStep
});

/** @namespace Seedsman/Component/CheckoutDeliveryOptions/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    setShippingMethod: (code) => dispatch(setShippingMethod(code)),
    setAvailableShippingMethods: (methods) => dispatch(setAvailableShippingMethods(methods)),
    updateShippingPrice: (data) => dispatch(updateShippingPrice(data)),
    updateInitialCartData: () => CartDispatcher.then(
        ({ default: dispatcher }) => dispatcher.updateInitialCartData(dispatch, true)
    ),
    updateLoadStatus: (isLoading) => dispatch(updateLoadStatus(isLoading)),
    updateEditingStep: (step) => dispatch(updateEditingStep(step))
});

/** @namespace Seedsman/Component/CheckoutDeliveryOptions/Container */
export class CheckoutDeliveryOptionsContainer extends ParentCheckoutDeliveryOptionsContainer {
    static propTypes = {
        onShippingMethodSelect: PropTypes.func.isRequired,
        onStoreSelect: PropTypes.func.isRequired,
        shippingMethods: ShippingMethodsType.isRequired,
        estimateAddress: Addresstype.isRequired,
        handleSelectDeliveryMethod: PropTypes.func.isRequired,
        selectedShippingMethod: PropTypes.shape({
            amount: PropTypes.number,
            available: PropTypes.bool,
            base_amount: PropTypes.number,
            method_code: PropTypes.string,
            carrier_code: PropTypes.string,
            method_title: PropTypes.string,
            carrier_title: PropTypes.string,
            error_message: PropTypes.string,
            price_excl_tax: PropTypes.number,
            price_incl_tax: PropTypes.number
        })
    };

    static defaultProps = {
        selectedShippingMethod: {}
    };

    state = {
        isShippingMethodPreSelected: true,
        shippingCharge: ''
    };

    containerFunctions = {
        selectShippingMethod: this.selectShippingMethod.bind(this),
        handleAddressEdit: this.handleAddressEdit.bind(this)
    };

    dataMap = {};

    componentDidMount() {
        if (window.formPortalCollector) {
            window.formPortalCollector.subscribe(SHIPPING_STEP, this.collectAdditionalData, 'CheckoutDeliveryOptions');
        }
    }

    componentWillUnmount() {
        if (window.formPortalCollector) {
            window.formPortalCollector.unsubscribe(SHIPPING_STEP, 'CheckoutDeliveryOptions');
        }
    }

    // componentDidUpdate(prevProps) {
    //     const {
    //         selectedShippingMethod: { method_code } = {},
    //         selectedAddress: { id } = {}, isBilling
    //     } = this.props;
    //     const {
    //         selectedShippingMethod: { method_code: prevMethodCode } = {},
    //         selectedAddress: { id: prevId } = {}
    //     } = prevProps;

    //     if (!isBilling && (id && method_code) && ((method_code !== prevMethodCode) || (id !== prevId))) {
    //         this.setShippingMethodOnQuote(method_code);
    //     }
    // }

    containerProps() {
        const {
            estimateAddress,
            onShippingMethodSelect,
            onStoreSelect,
            shippingMethods,
            handleSelectDeliveryMethod,
            selectedShippingMethod,
            step
        } = this.props;
        const { isShippingMethodPreSelected } = this.state;

        return {
            estimateAddress,
            onShippingMethodSelect,
            onStoreSelect,
            selectedShippingMethod,
            shippingMethods,
            handleSelectDeliveryMethod,
            isShippingMethodPreSelected,
            step
        };
    }

    __construct(props) {
        super.__construct(props);

        const {
            shippingMethods, setShippingMethod, setAvailableShippingMethods,
            selectedShippingMethod: { method_code, carrier_code }
        } = props;

        this.state = { prevShippingMethods: shippingMethods };
        setAvailableShippingMethods(shippingMethods);
        if (method_code) {
            setShippingMethod({ method_code, carrier_code });
            this.state = {
                ...this.state,
                method_code
            };
        }
    }

    handleAddressEdit() {
        const { updateEditingStep, removePaymentMethodCode } = this.props;

        updateEditingStep(DELIVERY_METHOD);
        removePaymentMethodCode();
    }

    async setShippingMethodOnQuote(method) {
        const {
            updateShippingPrice, all_shipping_methods, updateLoadStatus,
            updateInitialCartData
        } = this.props;

        const selectedMethod = all_shipping_methods.find((item) => item.method_code === method);

        if (!selectedMethod) {
            return;
        }

        const { carrier_code, method_code } = selectedMethod;

        if (!carrier_code) {
            return;
        }

        const input = {
            cart_id: getGuestQuoteId(),
            shipping_methods: [
                {
                    carrier_code,
                    method_code
                }
            ]
        };

        updateLoadStatus(true);

        const mutation = CheckoutQuery.getSaveShippingMethodsOnCart(input);

        await fetchMutation(mutation).then(
            /** @namespace Seedsman/Component/CheckoutDeliveryOptions/Container/CheckoutDeliveryOptionsContainer/setShippingMethodOnQuote/fetchMutation/then */
            ({ setShippingMethodsOnCart: { totals } }) => {
                updateShippingPrice(totals);
                updateLoadStatus(false);
                BrowserDatabase.setItem(
                    totals,
                    PAYMENT_TOTALS,
                    ONE_MONTH_IN_SECONDS
                );
            },
            /** @namespace Seedsman/Component/CheckoutDeliveryOptions/Container/CheckoutDeliveryOptionsContainer/setShippingMethodOnQuote/fetchMutation/then/catch */
            // eslint-disable-next-line no-unused-vars
            (error) => {
                updateLoadStatus(false);
            }
        );
        await updateInitialCartData();
    }

    static getDerivedStateFromProps(props) {
        const {
            shippingMethods, setShippingMethod, setAvailableShippingMethods,
            selectedShippingMethod: { method_code, carrier_code }
        } = props;

        setAvailableShippingMethods(shippingMethods);

        if (method_code) {
            setShippingMethod({ method_code, carrier_code });
            return {
                method_code,
                prevShippingMethods: shippingMethods
            };
        }

        return null;
    }

    collectAdditionalData() {
        const { selectedShippingMethod: { method_code } } = this.props;
        const additionalDataGetter = this.dataMap[method_code];

        if (!additionalDataGetter) {
            return {};
        }

        return additionalDataGetter();
    }

    selectShippingMethod(shippingMethod) {
        const { onShippingMethodSelect, setShippingMethod } = this.props;
        const { method_code, carrier_code } = shippingMethod;
        const { isShippingMethodPreSelected } = this.state;

        if (isShippingMethodPreSelected) {
            this.setState({ isShippingMethodPreSelected: false });
        }

        setShippingMethod({ method_code, carrier_code });
        onShippingMethodSelect(shippingMethod);
    }

    render() {
        return (
            <CheckoutDeliveryOptions
              { ...this.containerProps() }
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutDeliveryOptionsContainer);
