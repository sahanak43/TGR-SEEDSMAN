/* eslint-disable max-len */
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { CheckoutAddressFormContainer as SourceCheckoutAddressFormContainer } from 'SourceComponent/CheckoutAddressForm/CheckoutAddressForm.container';
import { updateShippingFields } from 'Store/Checkout/Checkout.action';
import { showNotification } from 'Store/Notification/Notification.action';
import { hideActiveOverlay } from 'Store/Overlay/Overlay.action';
import { getErrorMessage } from 'Util/Request';
import transformCountriesToOptions from 'Util/Store/Transform';

export const MyAccountDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/MyAccount/MyAccount.dispatcher'
);

export const CheckoutDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Checkout/Checkout.dispatcher'
);

/** @namespace Seedsman/Component/CheckoutAddressForm/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    countries: transformCountriesToOptions(state.ConfigReducer.countries || []),
    defaultCountry: state.ConfigReducer.default_country,
    addressLinesQty: state.ConfigReducer.address_lines_quantity,
    showVatNumber: state.ConfigReducer.show_vat_number_on_storefront,
    regionDisplayAll: state.ConfigReducer.region_display_all,
    shippingFields: state.CheckoutReducer.shippingFields,
    addressTypeOptions: state.ConfigReducer.getAddressTypeOptions
});

/** @namespace Seedsman/Component/CheckoutAddressForm/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    showErrorNotification: (error) => dispatch(showNotification('error', getErrorMessage(error))),
    showSuccessNotification: (message) => dispatch(showNotification('success', message)),
    updateCustomerDetails: () => MyAccountDispatcher.then(
        ({ default: dispatcher }) => dispatcher.requestCustomerData(dispatch),
    ),
    updateShippingFields: (fields) => dispatch(updateShippingFields(fields)),
    handleUpdateAddress: (address) => CheckoutDispatcher.then(({ default: d }) => d.handleUpdateAddress(address, dispatch))
});

/** @namespace Seedsman/Component/CheckoutAddressForm/Container */
export class CheckoutAddressFormContainer extends SourceCheckoutAddressFormContainer {
    static propTypes = {
        ...super.propTypes,
        onShippingEstimationFieldsChange: PropTypes.func.isRequired,
        onAddressUpdate: PropTypes.func.isRequired,
        onSave: PropTypes.func
    };

    containerProps() {
        const {
            onShippingEstimationFieldsChange, onAddressUpdate, prepareAddressAndSetToQuote,
            showErrorNotification, showSuccessNotification, id, updateCustomerDetails, updateShippingFields,
            addressTypeOptions, handleUpdateAddress, shippingFields
        } = this.props;

        return {
            onShippingEstimationFieldsChange,
            onAddressUpdate,
            hideActiveOverlay,
            showErrorNotification,
            showSuccessNotification,
            updateCustomerDetails,
            updateShippingFields,
            id,
            addressTypeOptions,
            prepareAddressAndSetToQuote,
            handleUpdateAddress,
            shippingFields,
            ...super.containerProps()
        };
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutAddressFormContainer);
