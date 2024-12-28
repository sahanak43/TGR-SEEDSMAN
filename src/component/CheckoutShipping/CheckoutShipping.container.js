/* eslint-disable max-len */
/* eslint-disable max-lines */
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    STORE_IN_PICK_UP_ATTRIBUTE_CODE,
    STORE_IN_PICK_UP_METHOD_CODE
} from 'Component/StoreInPickUp/StoreInPickUp.config';
import CheckoutQuery from 'Query/Checkout.query';
import { DELIVERY_METHOD, PAYMENT_TOTALS } from 'Route/Checkout/Checkout.config';
import { CheckoutShippingContainer as SourceCheckoutShippingContainer } from 'SourceComponent/CheckoutShipping/CheckoutShipping.container';
import { updateShippingPrice } from 'Store/Cart/Cart.action';
import { updateEditingStep, updateShippingFields } from 'Store/Checkout/Checkout.action';
import { Addresstype, CustomerType } from 'Type/Account.type';
import { ShippingMethodsType, ShippingMethodType, StoreType } from 'Type/Checkout.type';
import { TotalsType } from 'Type/MiniCart.type';
import {
    trimBillingAddress,
    trimCheckoutCustomerAddress,
    trimShippingAddress
} from 'Util/Address';
import { scrollToTop } from 'Util/Browser';
import BrowserDatabase from 'Util/BrowserDatabase';
import { getCartTotalSubPrice, getGuestQuoteId } from 'Util/Cart';
import scrollToError from 'Util/Form/Form';
import transformToNameValuePair from 'Util/Form/Transform';
import { fetchMutation } from 'Util/Request';
import { ONE_MONTH_IN_SECONDS } from 'Util/Request/QueryDispatcher';

import CheckoutShipping from './CheckoutShipping.component';

export const CartDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Cart/Cart.dispatcher'
);

/** @namespace Seedsman/Component/CheckoutShipping/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    customer: state.MyAccountReducer.customer,
    addressLinesQty: state.ConfigReducer.address_lines_quantity,
    totals: state.CartReducer.cartTotals,
    cartTotalSubPrice: getCartTotalSubPrice(state),
    savedShippingMethodCode: state.CheckoutReducer.shippingFields.shippingMethod,
    shipping_method_code: state.CheckoutReducer.shipping_method_code,
    shippingFields: state.CheckoutReducer.shippingFields,
    billingFields: state.CheckoutReducer.billingFields,
    all_shipping_methods: state.CheckoutReducer.all_shipping_methods,
    rewards_points: state.MyAccountReducer.reward_points,
    step: state.CheckoutReducer.editingStep
});

/** @namespace Seedsman/Component/CheckoutShipping/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    updateShippingFields: (fields) => dispatch(updateShippingFields(fields)),
    updateShippingPrice: (data) => dispatch(updateShippingPrice(data)),
    updateInitialCartData: () => CartDispatcher.then(
        ({ default: dispatcher }) => dispatcher.updateInitialCartData(dispatch, true)
    ),
    updateEditingStep: (step) => dispatch(updateEditingStep(step))
});

/** @namespace Seedsman/Component/CheckoutShipping/Container */
export class CheckoutShippingContainer extends SourceCheckoutShippingContainer {
    static propTypes = {
        saveAddressInformation: PropTypes.func.isRequired,
        shippingMethods: ShippingMethodsType.isRequired,
        customer: CustomerType.isRequired,
        addressLinesQty: PropTypes.number.isRequired,
        updateShippingFields: PropTypes.func.isRequired,
        cartTotalSubPrice: PropTypes.number,
        estimateAddress: Addresstype.isRequired,
        handleSelectDeliveryMethod: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        isPickInStoreMethodSelected: PropTypes.bool.isRequired,
        isSubmitted: PropTypes.bool,
        onShippingEstimationFieldsChange: PropTypes.func.isRequired,
        onShippingMethodSelect: PropTypes.func.isRequired,
        onStoreSelect: PropTypes.func.isRequired,
        selectedShippingMethod: ShippingMethodType,
        setSelectedShippingMethodCode: PropTypes.func,
        totals: TotalsType.isRequired,
        selectedStoreAddress: StoreType,
        rewards_points: ShippingMethodType.isRequired
    };

    static defaultProps = {
        selectedStoreAddress: {},
        selectedShippingMethod: null,
        setSelectedShippingMethodCode: null,
        isSubmitted: false,
        cartTotalSubPrice: null
    };

    containerFunctions = {
        onShippingSuccess: this.onShippingSuccess.bind(this),
        onShippingError: this.onShippingError.bind(this),
        onAddressSelect: this.onAddressSelect.bind(this),
        onShippingMethodSelect: this.onShippingMethodSelect.bind(this),
        onSameAsShippingChange: this.onSameAsShippingChange.bind(this),
        handleAddressSubmit: this.handleAddressSubmit.bind(this)
        // showCountrySelectionPopup: this.showCountrySelectionPopup.bind(this)
    };

    componentDidUpdate(prevProps) {
        const { shippingMethods: prevShippingMethods } = prevProps;
        const { shippingMethods } = this.props;

        if (prevShippingMethods !== shippingMethods) {
            this.resetShippingMethod();
        }
    }

    __construct(props) {
        super.__construct(props);

        const { shippingMethods = [], savedShippingMethodCode, customer } = props;

        const previousShippingMethod = shippingMethods.find(
            (method) => `${method.carrier_code}_${method.method_code}` === savedShippingMethodCode
        );

        const [defaultShippingMethod] = shippingMethods.filter((method) => method.available);
        const selectedShippingMethod = previousShippingMethod || defaultShippingMethod || {};
        const { method_code = '' } = selectedShippingMethod;

        this.state = {
            selectedCustomerAddressId: 0,
            isSubmitted: false,
            showCountrySelection: false,
            selectedShippingMethod: method_code && method_code !== STORE_IN_PICK_UP_METHOD_CODE
                ? selectedShippingMethod
                : {},
            isSameAsShipping: this.isSameShippingAddress(customer)
        };
    }

    // showCountrySelectionPopup() {
    //     this.setState({
    //         showCountrySelection: true
    //     });
    // }

    isSameShippingAddress({ default_billing, default_shipping }) {
        const {
            totals: { is_virtual },
            selectedShippingMethod,
            newShippingId,
            newShippingStreet
        } = this.props;

        if (is_virtual) {
            return false;
        }

        return (
            (!newShippingId && !newShippingStreet?.length && default_billing === default_shipping)
            || (default_billing && parseInt(default_billing, 10) === newShippingId)
            || (!default_billing)
        )
        && selectedShippingMethod !== STORE_IN_PICK_UP_METHOD_CODE;
    }

    onSameAsShippingChange() {
        this.setState(({ isSameAsShipping }) => ({ isSameAsShipping: !isSameAsShipping }));
    }

    async handleAddressSubmit() {
        const { updateEditingStep, shippingFields, saveAddressInformation } = this.props;

        const data = {
            shipping_address: trimShippingAddress(shippingFields)
        };

        await saveAddressInformation(data);
        updateEditingStep(DELIVERY_METHOD);
        await this.setShippingMethodOnQuote();
        scrollToTop();
    }

    resetShippingMethod() {
        const { selectedShippingMethod: { method_code: selectedMethodCode = '' } } = this.state;
        const { shippingMethods } = this.props;

        if (shippingMethods.find(({ method_code }) => method_code === selectedMethodCode)) {
            return;
        }

        const [defaultShippingMethod] = shippingMethods.filter((method) => method.available);
        const selectedShippingMethod = defaultShippingMethod || {};

        this.setState({ selectedShippingMethod });
    }

    containerProps() {
        const {
            cartTotalSubPrice,
            estimateAddress,
            handleSelectDeliveryMethod,
            isLoading,
            isPickInStoreMethodSelected,
            isSubmitted,
            setSelectedShippingMethodCode,
            shippingMethods,
            totals,
            onStoreSelect,
            onShippingEstimationFieldsChange,
            saveAddressInformation,
            customer,
            showError,
            rewards_points,
            step,
            isBilling,
            saveBillingAddress,
            removePaymentMethodCode
        } = this.props;
        const { selectedShippingMethod, showCountrySelection, isSameAsShipping } = this.state;

        return {
            cartTotalSubPrice,
            estimateAddress,
            handleSelectDeliveryMethod,
            isLoading,
            isPickInStoreMethodSelected,
            isSubmitted,
            setSelectedShippingMethodCode,
            shippingMethods,
            totals,
            selectedShippingMethod,
            onStoreSelect,
            onShippingEstimationFieldsChange,
            saveAddressInformation,
            customer,
            showError,
            showCountrySelection,
            rewards_points,
            step,
            isBilling,
            isSameAsShipping,
            saveBillingAddress,
            removePaymentMethodCode
        };
    }

    getStoreAddress(shippingAddress, isBillingAddress = false) {
        const {
            selectedStoreAddress: {
                region,
                city,
                postcode,
                phone,
                street,
                name,
                pickup_location_code,
                country_id
            }
        } = this.props;

        const storeAddress = {
            ...shippingAddress,
            country_id,
            region,
            city,
            postcode,
            telephone: phone,
            street: [street],
            firstname: name,
            lastname: 'Store'
        };

        if (isBillingAddress) {
            return storeAddress;
        }

        return {
            ...storeAddress,
            extension_attributes: [
                {
                    attribute_code: STORE_IN_PICK_UP_ATTRIBUTE_CODE,
                    value: pickup_location_code
                }
            ]
        };
    }

    async setShippingMethodOnQuote() {
        const { shipping_method_code: { carrier_code, method_code } = {}, updateShippingPrice } = this.props;
        // const { selectedShippingMethod: { carrier_code, method_code } } = this.state;

        const input = {
            cart_id: getGuestQuoteId(),
            shipping_methods: [
                {
                    carrier_code,
                    method_code
                }
            ]
        };

        const mutation = CheckoutQuery.getSaveShippingMethodsOnCart(input);

        await fetchMutation(mutation).then(
            /** @namespace Seedsman/Component/CheckoutShipping/Container/CheckoutShippingContainer/setShippingMethodOnQuote/fetchMutation/then */
            ({ setShippingMethodsOnCart: { totals } }) => {
                updateShippingPrice(totals);
                BrowserDatabase.setItem(
                    totals,
                    PAYMENT_TOTALS,
                    ONE_MONTH_IN_SECONDS
                );
            }
        );
        // await updateInitialCartData();
    }

    onAddressSelect(id) {
        this.setState({ selectedCustomerAddressId: id });
    }

    onShippingMethodSelect(method) {
        const { onShippingMethodSelect } = this.props;

        this.setState({ selectedShippingMethod: method }, () => this.setShippingMethodOnQuote());
        onShippingMethodSelect(method);
    }

    onShippingError(_, fields, validation) {
        // TODO: implement notification if some data in Form can not display error
        const { isSubmitted } = this.state;
        this.setState({ isSubmitted: !isSubmitted });
        scrollToError(fields, validation);
    }

    async onShippingSuccess(form, fields) {
        const {
            saveAddressInformation,
            // updateShippingFields,
            addressLinesQty,
            selectedStoreAddress,
            // customer: { default_shipping },
            saveBillingAddress,
            isBilling,
            billingFields,
            shippingFields,
            step,
            shipping_method_code: selectedMethodCode
        } = this.props;

        const {
            selectedCustomerAddressId,
            selectedShippingMethod,
            isSameAsShipping
        } = this.state;

        const formattedFields = transformToNameValuePair(fields);

        // Joins streets into one variable
        if (addressLinesQty > 1) {
            formattedFields.street = [];
            // eslint-disable-next-line fp/no-loops,fp/no-let
            for (let i = 0; i < addressLinesQty; i++) {
                if (formattedFields[`street_${i}`]) {
                    formattedFields.street.push(formattedFields[`street_${i}`]);
                }
            }
        }

        const formFields = trimShippingAddress(formattedFields);

        const shippingAddress = selectedCustomerAddressId
            ? this._getAddressById(selectedCustomerAddressId)
            : formFields;

        const {
            carrier_code: shipping_carrier_code,
            method_code: shipping_method_code
        } = selectedShippingMethod;

        const isInStoreDelivery = Object.keys(selectedStoreAddress).length > 0;

        const data = {
            billing_address: isInStoreDelivery ? this.getStoreAddress(shippingAddress, true) : shippingAddress,
            shipping_address: isInStoreDelivery ? this.getStoreAddress(shippingAddress) : trimShippingAddress(shippingFields),
            shipping_carrier_code,
            shipping_method_code
        };

        await saveAddressInformation(data);

        if (isSameAsShipping) {
            const options = {
                billing_address: shippingAddress,
                same_as_shipping: true
            };

            await saveBillingAddress(options);
        }

        if (!isSameAsShipping && isBilling) {
            const options = {
                billing_address: trimBillingAddress(billingFields),
                same_as_shipping: false
            };

            await saveBillingAddress(options);
        }

        if (step === DELIVERY_METHOD) {
            this.onShippingMethodSelect(selectedMethodCode);
        }

        // const shippingMethod = `${shipping_carrier_code}_${shipping_method_code}`;
        // const { street = [] } = formattedFields;

        // updateShippingFields({
        //     ...(
        //         street.length
        //         || (default_shipping && parseInt(default_shipping, 10) === data.shipping_address.id)
        //             ? formattedFields : data.shipping_address
        //     ),
        //     shippingMethod
        // });
    }

    _getAddressById(addressId) {
        const { customer: { addresses } } = this.props;
        const address = addresses.find(({ id }) => id === addressId);

        return {
            ...trimCheckoutCustomerAddress(address),
            save_in_address_book: false,
            id: addressId
        };
    }

    render() {
        return (
            <CheckoutShipping
              { ...this.containerProps() }
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutShippingContainer);
