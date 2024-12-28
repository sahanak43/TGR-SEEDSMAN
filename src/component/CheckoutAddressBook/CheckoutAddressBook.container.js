/* eslint-disable max-lines */
/* eslint-disable max-len */
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ADD_ADDRESS, ADDRESS_POPUP_ID } from 'Component/MyAccountAddressPopup/MyAccountAddressPopup.config';
import { SHIPPING_ADDRESS } from 'Route/Checkout/Checkout.config';
import { CheckoutAddressBookContainer as SourceCheckoutAddressBookContainer } from 'SourceComponent/CheckoutAddressBook/CheckoutAddressBook.container';
import { updateBillingFields, updateEditingStep, updateShippingFields } from 'Store/Checkout/Checkout.action';
import { showPopup } from 'Store/Popup/Popup.action';
import { CustomerType } from 'Type/Account.type';
import { trimShippingAddress } from 'Util/Address';
import { isSignedIn } from 'Util/Auth';
import { scrollToTop } from 'Util/Browser';
import { noopFn } from 'Util/Common';

import CheckoutAddressBook from './CheckoutAddressBook.component';

export const MyAccountDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/MyAccount/MyAccount.dispatcher'
);

export const CheckoutDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Checkout/Checkout.dispatcher'
);

/** @namespace Seedsman/Component/CheckoutAddressBook/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    customer: state.MyAccountReducer.customer,
    shipping_method_code: state.CheckoutReducer.shipping_method_code,
    shippingFields: state.CheckoutReducer.shippingFields,
    all_shipping_methods: state.CheckoutReducer.all_shipping_methods,
    updatedAddress: state.CheckoutReducer.address,
    step: state.CheckoutReducer.editingStep
});

/** @namespace Seedsman/Component/CheckoutAddressBook/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    requestCustomerData: () => MyAccountDispatcher.then(
        ({ default: dispatcher }) => dispatcher.requestCustomerData(dispatch)
    ),
    showPopup: (payload) => dispatch(showPopup(ADDRESS_POPUP_ID, payload)),
    updateShippingFields: (fields) => dispatch(updateShippingFields(fields)),
    updateBillingFields: (fields) => dispatch(updateBillingFields(fields)),
    updateEditingStep: (step) => dispatch(updateEditingStep(step)),
    handleUpdateAddress: (address) => CheckoutDispatcher.then(({ default: d }) => d.handleUpdateAddress(address, dispatch))
});

/** @namespace Seedsman/Component/CheckoutAddressBook/Container */
export class CheckoutAddressBookContainer extends SourceCheckoutAddressBookContainer {
    static propTypes = {
        requestCustomerData: PropTypes.func.isRequired,
        onShippingEstimationFieldsChange: PropTypes.func,
        onAddressSelect: PropTypes.func,
        customer: CustomerType.isRequired,
        isBilling: PropTypes.bool,
        isSubmitted: PropTypes.bool,
        is_virtual: PropTypes.bool
    };

    static defaultProps = {
        isBilling: false,
        onAddressSelect: noopFn,
        onShippingEstimationFieldsChange: noopFn,
        isSubmitted: false,
        is_virtual: false,
        isEditing: false
    };

    _getDefaultAddressId(props) {
        const { customer, isBilling } = props;
        const defaultKey = isBilling ? 'default_billing' : 'default_shipping';
        const { [defaultKey]: defaultAddressId, addresses } = customer;

        if (defaultAddressId) {
            return +defaultAddressId;
        }

        if (addresses && addresses.length) {
            return addresses[0].id;
        }

        return 0;
    }

    static _getDefaultAddressId(props) {
        const { customer, isBilling } = props;
        const defaultKey = isBilling ? 'default_billing' : 'default_shipping';
        const { [defaultKey]: defaultAddressId, addresses } = customer;

        // eslint-disable-next-line eqeqeq
        const isSelectedAddressAvailable = addresses?.find((item) => item.id == defaultAddressId);

        if (defaultAddressId && isSelectedAddressAvailable) {
            return +defaultAddressId;
        }

        if (addresses && addresses.length) {
            return addresses[0].id;
        }

        return 0;
    }

    containerFunctions = ({
        onAddressSelect: this.onAddressSelect.bind(this),
        prepareAddressAndSetToQuote: this.prepareAddressAndSetToQuote.bind(this),
        showCreateNewPopup: this.showCreateNewPopup.bind(this),
        handleAddressEdit: this.handleAddressEdit.bind(this),
        // handleAddressSubmit: this.handleAddressSubmit.bind(this),
        handleAddressChange: this.handleAddressChange.bind(this)
    });

    __construct(props) {
        super.__construct(props);

        const {
            requestCustomerData,
            customer: { id, addresses },
            onAddressSelect
        } = props;

        if (isSignedIn() && !id) {
            requestCustomerData();
        }

        const defaultAddressId = CheckoutAddressBookContainer._getDefaultAddressId(props);

        if (defaultAddressId) {
            onAddressSelect(defaultAddressId);
            this.estimateShipping(defaultAddressId);
            addresses.every((address) => {
                if (address.id === defaultAddressId) {
                    this.onAddressSelect(address);
                    return false;
                }

                return true;
            });
        }

        this.state = {
            prevDefaultAddressId: defaultAddressId,
            selectedAddressId: defaultAddressId,
            showAddress: false
        };
    }

    static getDerivedStateFromProps(props, state) {
        const { prevDefaultAddressId } = state;
        const defaultAddressId = CheckoutAddressBookContainer._getDefaultAddressId(props);
        if (defaultAddressId !== prevDefaultAddressId) {
            return {
                selectedAddressId: defaultAddressId,
                prevDefaultAddressId: defaultAddressId
            };
        }

        return null;
    }

    componentDidMount() {
        const { selectedAddressId } = this.state;
        const { onAddressSelect } = this.props;

        if (selectedAddressId) {
            onAddressSelect(selectedAddressId);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            onAddressSelect,
            requestCustomerData,
            customer,
            handleUpdateAddress,
            updatedAddress: { isLastUpdated, address_id }
        } = this.props;
        const { selectedAddressId: prevSelectedAddressId } = prevState;
        const { selectedAddressId } = this.state;

        if (isSignedIn() && !Object.keys(customer).length) {
            requestCustomerData();
        }

        if (selectedAddressId !== prevSelectedAddressId) {
            if (selectedAddressId === 0) {
                return;
            }
            onAddressSelect(selectedAddressId);
            this.estimateShipping(selectedAddressId);
        }

        if (isLastUpdated === true) {
            const { addresses } = customer;
            const defaultAddress = this._getDefaultAddressId(this.props);
            if (defaultAddress) {
                addresses.every((address) => {
                    if (address.id === address_id) {
                        this.onAddressSelect(address);
                        handleUpdateAddress({ address_id: 0, isLastUpdated: false });
                        return false;
                    }

                    return true;
                });
            } else {
                handleUpdateAddress({ address_id: 0, isLastUpdated: false });
            }
        }

        if (selectedAddressId !== prevSelectedAddressId && !prevSelectedAddressId) {
            const { addresses } = customer;
            if (selectedAddressId === 0) {
                return;
            }
            // eslint-disable-next-line array-callback-return
            addresses.map((address) => {
                if (address.id === selectedAddressId) {
                    this.onAddressSelect(address);
                }
            });
        }
    }

    containerProps() {
        const {
            customer,
            onShippingEstimationFieldsChange,
            isBilling,
            isSubmitted,
            is_virtual,
            updateShippingFields,
            shipping_method_code,
            updateEditingStep,
            showError,
            step,
            isSameAsShipping,
            onSameAsShippingChange,
            selectedShippingMethod
        } = this.props;
        const { selectedAddressId, showAddress } = this.state;

        return {
            customer,
            onShippingEstimationFieldsChange,
            isBilling,
            selectedAddressId,
            isSubmitted,
            is_virtual,
            updateShippingFields,
            shipping_method_code,
            updateEditingStep,
            showError,
            step,
            showAddress,
            isSameAsShipping,
            onSameAsShippingChange,
            selectedShippingMethod
        };
    }

    handleAddressChange(e) {
        e.stopPropagation();
        e.preventDefault();

        const { showAddress } = this.state;

        this.setState({
            showAddress: !showAddress
        }, () => scrollToTop());
    }

    handleAddressEdit() {
        const { updateEditingStep, removePaymentMethodCode } = this.props;

        updateEditingStep(SHIPPING_ADDRESS);
        removePaymentMethodCode();
    }

    // handleAddressSubmit() {
    //     const { updateEditingStep } = this.props;

    //     updateEditingStep(DELIVERY_METHOD);
    //     scrollToTop();
    // }

    showCreateNewPopup() {
        const { showPopup } = this.props;

        showPopup({
            action: ADD_ADDRESS,
            title: 'Add Address',
            address: {}
        });
    }

    onAddressSelect(address) {
        const {
            updateShippingFields, isBilling, updateBillingFields
        } = this.props;

        if (Object.keys(address).length && isBilling) {
            updateBillingFields(address);
        } else {
            updateShippingFields(address);
        }
        const { id = 0 } = address;
        this.setState({ selectedAddressId: id });

        if (address && !isBilling) {
            this.setState({
                showAddress: false
            });
            this.prepareAddressAndSetToQuote(address);
        }

        // if (isBilling) {
        //     const options = {
        //         billing_address: trimCheckoutAddress(address),
        //         paymentMethod: '',
        //         same_as_shipping: false
        //     };

        //     saveBillingAddress(options);
        // }
    }

    async prepareAddressAndSetToQuote(address) {
        if (!Object.keys(address).length) {
            return;
        }

        const { saveAddressInformation } = this.props;

        const data = {
            billing_address: trimShippingAddress(address),
            shipping_address: trimShippingAddress(address)
        };

        await saveAddressInformation(data, false);
    }

    estimateShipping(addressId) {
        const {
            onShippingEstimationFieldsChange,
            customer: { addresses = [] }
        } = this.props;

        const address = addresses.find(({ id }) => id === addressId);

        if (!address) {
            return;
        }

        const {
            city,
            country_id,
            postcode,
            region: {
                region_id,
                region
            } = {}
        } = address;

        if (!country_id) {
            return;
        }

        onShippingEstimationFieldsChange({
            city,
            country_id,
            region_id,
            region,
            postcode
        });
    }

    render() {
        return (
            <CheckoutAddressBook
              { ...this.containerProps() }
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutAddressBookContainer);
