/* eslint-disable fp/no-let */
/* eslint-disable react/prop-types */
/* eslint-disable react/boolean-prop-naming */
/* eslint-disable max-lines */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-did-update-set-state */

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { CART_TAB } from 'Component/NavigationTabs/NavigationTabs.config';
import PRODUCT_TYPE from 'Component/Product/Product.config';
import CheckoutQuery from 'Query/Checkout.query';
import MyAccountQuery from 'Query/MyAccount.query';
import { ACCOUNT_LOGIN_URL } from 'Route/MyAccount/MyAccount.config';
import { CheckoutContainer as ParentCheckoutContainer } from 'SourceRoute/Checkout/Checkout.container';
import { toggleBreadcrumbs } from 'Store/Breadcrumbs/Breadcrumbs.action';
import { updateShippingPrice } from 'Store/Cart/Cart.action';
import {
    updateEditingStep, updateEmail, updateFoomanCharges, updateShippingFields
} from 'Store/Checkout/Checkout.action';
import { updateMeta } from 'Store/Meta/Meta.action';
import { changeNavigationState } from 'Store/Navigation/Navigation.action';
import { BOTTOM_NAVIGATION_TYPE, TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { showNotification } from 'Store/Notification/Notification.action';
import { CustomerType } from 'Type/Account.type';
import { TotalsType } from 'Type/MiniCart.type';
import { HistoryType } from 'Type/Router.type';
import { removeEmptyStreets } from 'Util/Address';
import { getAuthorizationToken, isSignedIn } from 'Util/Auth';
import BrowserDatabase from 'Util/BrowserDatabase';
import { deleteGuestQuoteId, getCartTotalSubPrice, getGuestQuoteId } from 'Util/Cart';
import history from 'Util/History';
import { fireInsiderPageEvent } from 'Util/Insider';
import {
    debounce,
    fetchMutation,
    fetchQuery,
    getErrorMessage
} from 'Util/Request';
import { ONE_MONTH_IN_SECONDS } from 'Util/Request/QueryDispatcher';
import { appendWithStoreCode } from 'Util/Url';

import { fireLoyalityPoints } from '../../@scandiweb/gtm/event/cart';
import Checkout from './Checkout.component';
import {
    BILLING_STEP, DELIVERY_METHOD, PAYMENT_METHOD, PAYMENT_TOTALS, SHIPPING_ADDRESS,
    SHIPPING_STEP, SUCCESS_URL,
    UPDATE_EMAIL_CHECK_FREQUENCY
} from './Checkout.config';

export const CartDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Cart/Cart.dispatcher'
);
export const MyAccountDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/MyAccount/MyAccount.dispatcher'
);
export const CheckoutDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Checkout/Checkout.dispatcher'
);

/** @namespace Seedsman/Route/Checkout/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    totals: state.CartReducer.cartTotals,
    cartTotalSubPrice: getCartTotalSubPrice(state),
    customer: state.MyAccountReducer.customer,
    guest_checkout: state.ConfigReducer.guest_checkout,
    minimum_order_amount: state.ConfigReducer.minimum_order_amount,
    countries: state.ConfigReducer.countries,
    isEmailAvailable: state.CheckoutReducer.isEmailAvailable,
    isMobile: state.ConfigReducer.device.isMobile,
    isInStoreActivated: state.ConfigReducer.delivery_instore_active,
    isGuestNotAllowDownloadable: state.ConfigReducer.downloadable_disable_guest_checkout,
    savedEmail: state.CheckoutReducer.email,
    isSignedIn: state.MyAccountReducer.isSignedIn,
    isTotalsLoading: state.CheckoutReducer.isLoading,
    checkoutStep: state.CheckoutReducer.editingStep,
    point: state.CartReducer.cartTotals.amasty_rewards_used_points?.used_points,
    recaptcha_key: state.CheckoutReducer.creditCardDetails?.recaptcha
});

/** @namespace Seedsman/Route/Checkout/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    updateMeta: (meta) => dispatch(updateMeta(meta)),
    resetCart: () => CartDispatcher.then(
        ({ default: dispatcher }) => dispatcher.updateInitialCartData(dispatch, getAuthorizationToken())
    ),
    resetGuestCart: () => CartDispatcher.then(
        ({ default: dispatcher }) => {
            dispatcher.resetGuestCart(dispatch);
            dispatcher.createGuestEmptyCart(dispatch);
        }
    ),
    toggleBreadcrumbs: (state) => dispatch(toggleBreadcrumbs(state)),
    showErrorNotification: (message) => dispatch(showNotification('error', message)),
    showInfoNotification: (message) => dispatch(showNotification('info', message)),
    showSuccessNotification: (message) => dispatch(showNotification('success', message)),
    setHeaderState: (stateName) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, stateName)),
    setNavigationState: (stateName) => dispatch(changeNavigationState(BOTTOM_NAVIGATION_TYPE, stateName)),
    createAccount: (options) => MyAccountDispatcher.then(
        ({ default: dispatcher }) => dispatcher.createAccount(options, dispatch)
    ),
    updateShippingFields: (fields) => dispatch(updateShippingFields(fields)),
    updateEmail: (email) => dispatch(updateEmail(email)),
    checkEmailAvailability: (email) => CheckoutDispatcher.then(
        ({ default: dispatcher }) => dispatcher.handleData(dispatch, email)
    ),
    updateShippingPrice: (data) => dispatch(updateShippingPrice(data)),
    updateInitialCartData: () => CartDispatcher.then(
        ({ default: dispatcher }) => dispatcher.updateInitialCartData(dispatch, true)
    ),
    applyStoreCredit: (cartId) => CartDispatcher.then(
        ({ default: dispatcher }) => dispatcher.applyStoreCredit(dispatch, cartId)
    ),
    removeStoreCredit: (cartId) => CartDispatcher.then(
        ({ default: dispatcher }) => dispatcher.removeStoreCredit(dispatch, cartId)
    ),
    getRewardPoints: () => MyAccountDispatcher.then(
        ({ default: dispatcher }) => dispatcher.getCustomerQueryDetails(dispatch)
    ),
    updateEditingStep: (step) => dispatch(updateEditingStep(step)),
    updateFoomanCharges: (foomanCharge) => dispatch(updateFoomanCharges(foomanCharge))
});

/** @namespace Seedsman/Route/Checkout/Container */
export class CheckoutContainer extends ParentCheckoutContainer {
    static propTypes = {
        showErrorNotification: PropTypes.func.isRequired,
        showInfoNotification: PropTypes.func.isRequired,
        showSuccessNotification: PropTypes.func.isRequired,
        toggleBreadcrumbs: PropTypes.func.isRequired,
        setNavigationState: PropTypes.func.isRequired,
        createAccount: PropTypes.func.isRequired,
        updateMeta: PropTypes.func.isRequired,
        resetCart: PropTypes.func.isRequired,
        resetGuestCart: PropTypes.func.isRequired,
        guest_checkout: PropTypes.bool.isRequired,
        totals: TotalsType.isRequired,
        history: HistoryType.isRequired,
        customer: CustomerType.isRequired,
        countries: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string,
                id: PropTypes.string,
                available_regions: PropTypes.arrayOf(
                    PropTypes.shape({
                        code: PropTypes.string,
                        name: PropTypes.string,
                        id: PropTypes.number
                    })
                )
            })
        ).isRequired,
        match: PropTypes.shape({
            params: PropTypes.shape({
                step: PropTypes.string
            })
        }).isRequired,
        updateShippingFields: PropTypes.func.isRequired,
        updateEmail: PropTypes.func.isRequired,
        checkEmailAvailability: PropTypes.func.isRequired,
        isEmailAvailable: PropTypes.bool.isRequired,
        updateShippingPrice: PropTypes.func.isRequired,
        setHeaderState: PropTypes.func.isRequired,
        isMobile: PropTypes.bool.isRequired,
        cartTotalSubPrice: PropTypes.number,
        isInStoreActivated: PropTypes.bool.isRequired,
        isGuestNotAllowDownloadable: PropTypes.bool.isRequired,
        isSignedIn: PropTypes.bool.isRequired,
        minimum_order_amount: PropTypes.arrayOf(
            PropTypes.shape({
                minimum_amount: PropTypes.number,
                description_message: PropTypes.string,
                enable: PropTypes.bool
            })
        ),
        getRewardPoints: PropTypes.func.isRequired
    };

    static defaultProps = {
        cartTotalSubPrice: null,
        minimum_order_amount: []
    };

    containerFunctions = {
        setLoading: this.setLoading.bind(this),
        setDetailsStep: this.setDetailsStep.bind(this),
        savePaymentInformation: this.savePaymentInformation.bind(this),
        saveAddressInformation: this.saveAddressInformation.bind(this),
        onShippingEstimationFieldsChange: this.onShippingEstimationFieldsChange.bind(this),
        onEmailChange: this.onEmailChange.bind(this),
        onCreateUserChange: this.onCreateUserChange.bind(this),
        onPasswordChange: this.onPasswordChange.bind(this),
        goBack: this.goBack.bind(this),
        handleSelectDeliveryMethod: this.handleSelectDeliveryMethod.bind(this),
        onStoreSelect: this.onStoreSelect.bind(this),
        onShippingMethodSelect: this.onShippingMethodSelect.bind(this),
        handleApplyStoreCredit: this.handleApplyStoreCredit.bind(this),
        setPaymentMethod: this.setPaymentMethod.bind(this),
        onClickSummaryOverlay: this.onClickSummaryOverlay.bind(this),
        onClickExpandItems: this.onClickExpandItems.bind(this),
        saveBillingAddress: this.saveBillingAddress.bind(this),
        removePaymentMethodCode: this.removePaymentMethodCode.bind(this)
    };

    checkEmailAvailability = debounce((email) => {
        const { checkEmailAvailability } = this.props;
        checkEmailAvailability(email);
    }, UPDATE_EMAIL_CHECK_FREQUENCY);

    _handleError = this._handleError.bind(this);

    componentDidMount() {
        const {
            history,
            showInfoNotification,
            guest_checkout,
            updateMeta,
            isGuestNotAllowDownloadable,
            totals: {
                base_subtotal,
                items = []
            },
            minimum_order_amount
        } = this.props;

        const { email } = this.state;

        if (!items.length) {
            showInfoNotification('Please add at least one product to cart!');
            history.push(appendWithStoreCode('/cart'));
        }

        if (base_subtotal < (minimum_order_amount[0]?.minimum_amount) && minimum_order_amount[0]?.enable) {
            showInfoNotification(minimum_order_amount[0]?.description_message);
            history.push(appendWithStoreCode('/cart'));
        }

        // if guest checkout is disabled and user is not logged in => throw him to homepage
        if (!guest_checkout && !isSignedIn()) {
            history.push(appendWithStoreCode('/'));
        }

        // if guest is not allowed to checkout with downloadable => redirect to login page
        if (!isSignedIn() && isGuestNotAllowDownloadable) {
            this.handleRedirectIfDownloadableInCart();
        }

        if (email) {
            this.checkEmailAvailability(email);
        }

        this.getCustomerQueryDetails();

        updateMeta({ title: 'Checkout' });
        fireInsiderPageEvent('Checkout');
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            match: { params: { step: urlStep } }, isEmailAvailable, updateEmail, checkoutStep
        } = this.props;
        const { match: { params: { step: prevUrlStep } }, checkoutStep: prevCheckoutStep } = prevProps;
        const { email } = this.state;
        const { email: prevEmail } = prevState;

        // Handle going back from billing to shipping
        if (/shipping/.test(urlStep) && /billing/.test(prevUrlStep)) {
            BrowserDatabase.deleteItem(PAYMENT_TOTALS);

            this.setState({
                checkoutStep: SHIPPING_STEP,
                isGuestEmailSaved: false
            });
        }

        // Change URL when going back from billing step to shipping step
        if (prevCheckoutStep === PAYMENT_METHOD && [SHIPPING_ADDRESS, DELIVERY_METHOD].includes(checkoutStep)) {
            this.setState({
                checkoutStep: SHIPPING_STEP
            });
        }

        if (email !== prevEmail) {
            this.checkEmailAvailability(email);
        }

        if (!isEmailAvailable) {
            updateEmail(email);
        }

        return null;
    }

    componentWillUnmount() {
        const { toggleBreadcrumbs } = this.props;
        toggleBreadcrumbs(true);
    }

    __construct(props) {
        super.__construct(props);

        const {
            toggleBreadcrumbs,
            totals: {
                is_virtual,
                applied_store_credit: { applied_balance: { value: storeCreditValue } = {} } = {}
            },
            savedEmail
        } = props;

        toggleBreadcrumbs(false);

        this.state = {
            isLoading: is_virtual,
            isDeliveryOptionsLoading: false,
            requestsSent: 0,
            paymentMethods: [],
            shippingMethods: [],
            shippingAddress: {},
            billingAddress: {},
            selectedShippingMethod: '',
            checkoutStep: is_virtual ? BILLING_STEP : SHIPPING_STEP,
            orderID: '',
            orderNumber: '',
            paymentTotals: BrowserDatabase.getItem(PAYMENT_TOTALS) || {},
            email: savedEmail || '',
            isGuestEmailSaved: false,
            isCreateUser: false,
            estimateAddress: {},
            isPickInStoreMethodSelected: false,
            useStoreCredit: !!storeCreditValue,
            paymentMethod: null,
            appliedStoreCreditValue: null,
            currentStoreCreditValue: null,
            showError: false,
            showOverlay: false,
            isContentExpanded: false
        };

        if (is_virtual) {
            this._getPaymentMethods();
        }
    }

    async getCustomerQueryDetails() {
        const { getRewardPoints } = this.props;

        await getRewardPoints();
    }

    onEmailChange(email) {
        this.setState({ email });
    }

    onCreateUserChange() {
        const { isCreateUser } = this.state;
        this.setState({ isCreateUser: !isCreateUser });
    }

    onPasswordChange(password) {
        this.setState({ password });
    }

    onShippingMethodSelect(selectedShippingMethod) {
        const { method_code } = selectedShippingMethod;
        this.setState({ selectedShippingMethod: method_code });
    }

    onShippingEstimationFieldsChange(address) {
        const { requestsSent } = this.state;
        const guestQuoteId = getGuestQuoteId();

        if (!guestQuoteId) {
            return;
        }

        this.setState({
            requestsSent: requestsSent + 1,
            estimateAddress: address
        });
    }

    handleRedirectIfDownloadableInCart() {
        const { totals: { items }, showInfoNotification } = this.props;

        const isDownloadable = items.find(({ product }) => product.type_id === PRODUCT_TYPE.downloadable);

        if (!isDownloadable) {
            return;
        }

        showInfoNotification('Please sign in or remove downloadable products from cart!');
        history.replace(appendWithStoreCode(ACCOUNT_LOGIN_URL));
    }

    handleSelectDeliveryMethod() {
        const { isPickInStoreMethodSelected } = this.state;

        this.setState({ isPickInStoreMethodSelected: !isPickInStoreMethodSelected });
    }

    onStoreSelect(address) {
        this.setState({ selectedStoreAddress: address });
    }

    goBack() {
        const { checkoutStep } = this.state;

        if (checkoutStep === BILLING_STEP) {
            this.setState({
                isLoading: false
            });
            BrowserDatabase.deleteItem(PAYMENT_TOTALS);
        }

        history.goBack();
    }

    setDetailsStep(orderID, orderNumber) {
        const { resetCart, resetGuestCart, setNavigationState } = this.props;

        deleteGuestQuoteId();
        BrowserDatabase.deleteItem(PAYMENT_TOTALS);

        if (isSignedIn()) {
            resetCart();
        } else {
            resetGuestCart();
        }

        this.setState({
            isLoading: false,
            paymentTotals: {},
            // checkoutStep: DETAILS_STEP,
            orderID,
            orderNumber
        });

        setNavigationState({
            name: CART_TAB
        });

        history.push(appendWithStoreCode(SUCCESS_URL));
    }

    setLoading(isLoading = true) {
        this.setState({ isLoading });
    }

    async setShippingAddress(isDefaultShipping = false) {
        const { shippingAddress } = this.state;
        const { region, region_id, ...address } = shippingAddress;

        const mutation = MyAccountQuery.getCreateAddressMutation({
            ...address,
            region: { region, region_id },
            default_shipping: isDefaultShipping
        });

        const data = await fetchMutation(mutation);

        if (data?.createCustomerAddress) {
            this.setState({
                shippingAddress: {
                    ...shippingAddress,
                    id: data.createCustomerAddress.id
                }
            });
        }

        return true;
    }

    containerProps() {
        const {
            cartTotalSubPrice,
            history,
            isEmailAvailable,
            isMobile,
            setHeaderState,
            totals,
            isInStoreActivated,
            isSignedIn,
            isTotalsLoading,
            applyStoreCredit,
            removeStoreCredit
        } = this.props;
        const {
            billingAddress,
            checkoutStep,
            email,
            estimateAddress,
            isCreateUser,
            isDeliveryOptionsLoading,
            isGuestEmailSaved,
            isLoading,
            orderID,
            orderNumber,
            paymentMethods,
            paymentTotals,
            selectedShippingMethod,
            shippingAddress,
            shippingMethods,
            selectedStoreAddress,
            isPickInStoreMethodSelected,
            foomanCharges,
            showError,
            useStoreCredit,
            paymentMethod,
            appliedStoreCreditValue,
            currentStoreCreditValue,
            showOverlay,
            isContentExpanded
        } = this.state;

        return {
            billingAddress,
            cartTotalSubPrice,
            checkoutStep,
            checkoutTotals: this._getCheckoutTotals(),
            email,
            estimateAddress,
            history,
            isCreateUser,
            isDeliveryOptionsLoading,
            isEmailAvailable,
            isGuestEmailSaved,
            isInStoreActivated,
            isSignedIn,
            isLoading,
            isMobile,
            orderID,
            orderNumber,
            paymentMethods,
            paymentTotals,
            selectedShippingMethod,
            setHeaderState,
            shippingAddress,
            shippingMethods,
            totals,
            selectedStoreAddress,
            isPickInStoreMethodSelected,
            foomanCharges,
            isTotalsLoading,
            showError,
            appliedStoreCreditValue,
            currentStoreCreditValue,
            applyStoreCredit,
            removeStoreCredit,
            useStoreCredit,
            paymentMethod,
            showOverlay,
            isContentExpanded
        };
    }

    onClickSummaryOverlay() {
        const { showOverlay } = this.state;

        this.setState({
            showOverlay: !showOverlay
        });
    }

    onClickExpandItems() {
        const { isContentExpanded } = this.state;

        this.setState({
            isContentExpanded: !isContentExpanded
        });
    }

    _handleError(error) {
        const { showErrorNotification } = this.props;

        this.setState({
            isDeliveryOptionsLoading: false,
            isLoading: false
        }, () => {
            showErrorNotification(getErrorMessage(error));
        });

        return false;
    }

    _getPaymentMethods() {
        fetchQuery(CheckoutQuery.getPaymentMethodsQuery(
            getGuestQuoteId()
        )).then(
            /** @namespace Seedsman/Route/Checkout/Container/CheckoutContainer/_getPaymentMethods/fetchQuery/then */
            ({ getPaymentMethods: paymentMethods }) => {
                this.setState({ isLoading: false, paymentMethods });
            },
            this._handleError
        );
    }

    _getCheckoutTotals() {
        const { totals: cartTotals } = this.props;
        const { paymentTotals: { shipping_amount } } = this.state;

        return shipping_amount
            ? { ...cartTotals, shipping_amount }
            : cartTotals;
    }

    saveGuestEmail() {
        const { email } = this.state;
        const { updateEmail } = this.props;
        const guestCartId = getGuestQuoteId();

        if (!guestCartId || !email) {
            return null;
        }

        const mutation = CheckoutQuery.getSaveGuestEmailMutation(email, guestCartId);

        updateEmail(email);

        return fetchMutation(mutation).then(
            /** @namespace Seedsman/Route/Checkout/Container/CheckoutContainer/saveGuestEmail/fetchMutation/then */
            ({ setGuestEmailOnCart: data }) => {
                if (data) {
                    this.setState({ isGuestEmailSaved: true });
                }

                return data;
            },
            this._handleError
        );
    }

    async createUserOrSaveGuest() {
        const {
            createAccount,
            totals: { is_virtual },
            showSuccessNotification,
            isEmailAvailable
        } = this.props;

        const {
            email,
            password,
            isCreateUser,
            shippingAddress: {
                firstname,
                lastname
            }
        } = this.state;

        if (!isCreateUser || !isEmailAvailable) {
            return this.saveGuestEmail();
        }

        const options = {
            customer: {
                email,
                firstname,
                lastname
            },
            password
        };

        const creation = await createAccount(options);

        if (!creation) {
            return creation;
        }

        showSuccessNotification('Your account has been created successfully!');

        if (!is_virtual) {
            return this.setShippingAddress(true);
        }

        return true;
    }

    async handleApplyStoreCredit() {
        const { useStoreCredit } = this.state;
        const { updateShippingPrice } = this.props;

        if (useStoreCredit) {
            this.setState({ useStoreCredit: false, isLoading: true });

            // eslint-disable-next-line react/prop-types
            const { removeStoreCredit } = this.props;

            const cartId = BrowserDatabase.getItem('guest_quote_id');

            const removeStoreCreditFromCart = await removeStoreCredit(cartId.token);
            this.setState({
                isLoading: false,
                paymentMethods: removeStoreCreditFromCart.cart.available_payment_methods,
                appliedStoreCreditValue: removeStoreCreditFromCart.cart.applied_store_credit.applied_balance,
                currentStoreCreditValue: removeStoreCreditFromCart.cart.applied_store_credit.current_balance
            });
        } else {
            this.setState({ useStoreCredit: true, isLoading: true });
            // eslint-disable-next-line react/prop-types
            const { applyStoreCredit } = this.props;

            const cartId = BrowserDatabase.getItem('guest_quote_id');

            const applyStoreCreditToCart = await applyStoreCredit(cartId.token);
            this.setState({
                isLoading: false,
                paymentMethods: applyStoreCreditToCart.cart.available_payment_methods,
                appliedStoreCreditValue: applyStoreCreditToCart.cart.applied_store_credit.applied_balance,
                currentStoreCreditValue: applyStoreCreditToCart.cart.applied_store_credit.current_balance
            });
        }
    }

    async saveAddressInformation(addressInformation, isPlaceOrder = true) {
        const { requestsSent } = this.state;
        const {
            updateShippingPrice, showErrorNotification, countries, updateEditingStep
        } = this.props;
        const { shipping_address, shipping_address: { id, country_id }, shipping_method_code } = addressInformation;

        // find a country by country ID
        const isCountryAllowed = countries.find(({ id }) => id === country_id);

        if (!isCountryAllowed) {
            this.setState({
                showError: true
            });

            return;
        }

        this.setState({
            isLoading: true,
            isDeliveryOptionsLoading: true,
            showError: false,
            shippingAddress: shipping_address,
            selectedShippingMethod: shipping_method_code
        });

        if (!isSignedIn()) {
            if (!await this.createUserOrSaveGuest()) {
                this.setState({ isLoading: false });

                return;
            }
        }

        const input = {
            cart_id: getGuestQuoteId(),
            shipping_addresses: [
                { customer_address_id: id }
            ]
        };

        if (!id) {
            return;
        }

        await fetchMutation(CheckoutQuery.getSaveShippingAddressesOnCart(input)).then(
            /** @namespace Seedsman/Route/Checkout/Container/CheckoutContainer/saveAddressInformation/fetchMutation/then */
            async ({
                setShippingAddressesOnCart: {
                    cart: { available_payment_methods, prices }, totals,
                    shipping_method: shippingMethods
                }
            }) => {
                await updateShippingPrice(totals);
                const { fooman_applied_surcharges = [] } = prices;
                BrowserDatabase.setItem(
                    totals,
                    PAYMENT_TOTALS,
                    ONE_MONTH_IN_SECONDS
                );

                if (isPlaceOrder) {
                    this.setState({
                        isLoading: false,
                        checkoutStep: BILLING_STEP,
                        shippingMethods,
                        paymentMethods: available_payment_methods,
                        paymentTotals: totals,
                        foomanCharges: fooman_applied_surcharges,
                        isDeliveryOptionsLoading: false,
                        requestsSent: requestsSent - 1
                    });
                    await updateEditingStep(PAYMENT_METHOD);
                } else {
                    this.setState({
                        isLoading: false,
                        shippingMethods,
                        paymentMethods: available_payment_methods,
                        paymentTotals: totals,
                        isDeliveryOptionsLoading: false,
                        requestsSent: requestsSent - 1
                    });
                }
            },
            /** @namespace Seedsman/Route/Checkout/Container/CheckoutContainer/saveAddressInformation/fetchMutation/then/catch */
            (error) => {
                showErrorNotification('Something went wrong, Please try again');
                this.setState({
                    isDeliveryOptionsLoading: false,
                    isLoading: false
                });
            }
        );
    }

    async savePaymentInformation(paymentInformation) {
        const { totals: { is_virtual }, point } = this.props;
        const {
            billing_address: {
                firstname: billingFirstName,
                lastname: billingLastName
            },
            billing_address: billingAddress
        } = paymentInformation;

        /**
         * If cart contains only virtual products then set firstname & lastname
         * from billing step into shippingAddress for user creating.
         */
        if (is_virtual) {
            this.setState({
                shippingAddress: {
                    firstname: billingFirstName,
                    lastname: billingLastName
                }
            });
        }

        this.setState({ isLoading: true, billingAddress });

        if (!isSignedIn()) {
            if (!await this.createUserOrSaveGuest()) {
                this.setState({ isLoading: false });

                return;
            }
        }

        const data = {
            paymentInformation,
            point
        };

        await this.savePaymentMethodAndPlaceOrder(data);
    }

    trimAddressMagentoStyle(address) {
        const { countries } = this.props;

        const {
            id, // drop this
            country_id,
            region_code, // drop this
            purchaseOrderNumber, // drop this
            region_id,
            region,
            street,
            guest_email,
            ...restOfBillingAddress
        } = address;

        const newAddress = {
            ...restOfBillingAddress,
            country_code: country_id,
            region,
            region_id,
            street: removeEmptyStreets(street)
        };

        /**
         * If there is no region specified, but there is region ID
         * get the region code by the country ID
         */
        if (region_id) {
            // find a country by country ID
            const { available_regions } = countries.find(
                ({ id }) => id === country_id
            ) || {};

            if (!available_regions) {
                return newAddress;
            }

            // find region by region ID
            const { code } = available_regions.find(
                ({ id }) => +id === +region_id
            ) || {};

            if (!code) {
                return newAddress;
            }

            newAddress.region = code;
        }

        return newAddress;
    }

    async saveBillingAddress(paymentInformation) {
        const isCustomerSignedIn = isSignedIn();
        const guest_cart_id = !isCustomerSignedIn ? getGuestQuoteId() : '';

        if (!isCustomerSignedIn && !getGuestQuoteId) {
            return;
        }

        const { billing_address, same_as_shipping } = paymentInformation;
        const {
            shippingAddress: {
                id: shippingAddressId = null
            } = {}
        } = this.state;
        const billingAddress = {
            address: this.trimAddressMagentoStyle(billing_address)
        };

        if (same_as_shipping && shippingAddressId) {
            billingAddress.customer_address_id = shippingAddressId;
        }

        this.setState({
            isLoading: true
        });

        await fetchMutation(CheckoutQuery.getSetBillingAddressOnCart({
            guest_cart_id,
            same_as_shipping,
            billing_address: billingAddress
        })).then(/** @namespace Seedsman/Route/Checkout/Container/CheckoutContainer/saveBillingAddress/fetchMutation/then */
            ({ billingAddress: { cart: { available_payment_methods = [] } = {} } }) => {
                this.setState({
                    isLoading: false,
                    paymentMethods: available_payment_methods
                });
            },
            this._handleError
        );
    }

    async savePaymentMethodAndPlaceOrder({ paymentInformation }) {
        const { point, recaptcha_key } = this.props;
        const { paymentMethod: { code, additional_data, purchase_order_number } } = paymentInformation;
        const isCustomerSignedIn = isSignedIn();
        const guest_cart_id = !isCustomerSignedIn ? getGuestQuoteId() : '';

        if (!isCustomerSignedIn && !guest_cart_id) {
            return;
        }

        try {
            await fetchMutation(CheckoutQuery.getSetPaymentMethodOnCartMutation({
                guest_cart_id,
                payment_method: {
                    code,
                    [code]: additional_data,
                    purchase_order_number
                }
            }));

            let recaptchaKeyToSend = '';
            if (code === 'rootways_nmi_option') {
                recaptchaKeyToSend = recaptcha_key || '';
            } else {
                recaptchaKeyToSend = recaptcha_key;
            }

            // eslint-disable-next-line max-len
            const orderData = await fetchMutation(CheckoutQuery.getPlaceOrderMutation(guest_cart_id, recaptchaKeyToSend));

            const { placeOrder: { order: { order_id, order_int } } } = orderData;
            const orderDetails = { order_id, order_int };

            fireLoyalityPoints(point);

            BrowserDatabase.setItem(orderDetails, 'LastOrderDetails');

            this.setDetailsStep(order_id, order_int);
        } catch (e) {
            this._handleError(e);
        }
    }

    removePaymentMethodCode() {
        this.setState({ paymentMethod: null });
    }

    async setPaymentMethod(code) {
        const { updateShippingPrice, updateFoomanCharges } = this.props;
        const guest_cart_id = isSignedIn() ? getGuestQuoteId() : '';
        this.setState({ paymentMethod: code });

        const input = {
            guest_cart_id,
            payment_method: {
                code
            }
        };

        this.setState({
            isLoading: true
        });

        await fetchMutation(CheckoutQuery.getSetPaymentMethodOnCartMutation(input)).then(
            /** @namespace Seedsman/Route/Checkout/Container/CheckoutContainer/setPaymentMethod/fetchMutation/then */
            async ({ paymentMethod: { fooman_applied_surge_charges = [], totals } }) => {
                await updateShippingPrice(totals);
                await updateFoomanCharges(fooman_applied_surge_charges);

                this.setState({
                    isLoading: false
                });
            },
            this._handleError
        );
    }

    render() {
        return (
            <Checkout
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutContainer);
