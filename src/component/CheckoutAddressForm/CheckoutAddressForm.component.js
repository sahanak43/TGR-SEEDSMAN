/* eslint-disable max-lines */
/* eslint-disable max-len */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable no-sequences */
/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
/* eslint-disable react/jsx-no-bind */
import Loader from 'Component/Loader';
import MyAccountQuery from 'Query/MyAccount.query';
import {
    CheckoutAddressForm as SourceCheckoutAddressForm
} from 'SourceComponent/CheckoutAddressForm/CheckoutAddressForm.component';
import { isSignedIn } from 'Util/Auth';
import transformToNameValuePair from 'Util/Form/Transform';
import { fetchMutation } from 'Util/Request';

import { hasAllFieldsInAddress, hasRegionInAddress } from './CheckoutAddressForm.config';

import './CheckoutAddressForm.override.style';

/** @namespace Seedsman/Component/CheckoutAddressForm/Component */
export class CheckoutAddressFormComponent extends SourceCheckoutAddressForm {
    state = {
        shippingData: {},
        isLoading: false
    };

    onAddressChange = this.onAddressChange.bind(this);

    onStreetChange = this.onStreetChange.bind(this);

    onTextChange = this.onTextChange.bind(this);

    get fieldMap() {
        const fieldMap = super.fieldMap;
        const addressGroup = fieldMap.find(({ name }) => name === 'addressGroup');

        if (addressGroup) {
            addressGroup.events = {
                // Updates shipping methods on address blurt
                onBlur: this.onAddressChange,
                // Updates shipping methods on start
                onLoad: this.onAddressChange
            };
        }

        const streetFields = fieldMap.find(({ name }) => name === 'streetGroup');
        if (streetFields) {
            streetFields.events = {
                onBlur: this.onStreetChange,
                onLoad: this.onStreetChange
            };
        }

        fieldMap.filter((field) => {
            if (field.type === 'text') {
                field.events = {
                    onChange: this.onTextChange
                };
            }
        });

        return fieldMap;
    }

    onTextChange({ target: { name, value } }) {
        const { shippingData } = this.state;
        shippingData[name] = value;
        this.setState({
            ...this.state,
            shippingData
        });
    }

    onStreetChange(event, data) {
        const { fields = {} } = data;
        const { addressLinesQty } = this.props;
        const { shippingData } = this.state;
        const formattedFields = transformToNameValuePair(fields);

        if (addressLinesQty > 1) {
            formattedFields.street = [];
            // eslint-disable-next-line fp/no-let
            for (let i = 0; i < addressLinesQty; i++) {
                if (formattedFields[`street_${i}`]) {
                    formattedFields.street.push(formattedFields[`street_${i}`]);
                }
            }
        }

        this.setState((state) => ({
            shippingData: {
                ...state.shippingData,
                ...formattedFields
            }
        }));

        // If shippingData hasn't changed, then ignore.
        if (JSON.stringify(shippingData) === JSON.stringify(this.lastRequest)) {
            return;
        }

        // Caches last shippingData
        this.lastRequest = shippingData;
    }

    onAddressChange(event, data) {
        const { fields = {} } = data;
        const {
            country_id,
            region_id: regionId,
            region_string: region,
            city,
            postcode
        } = transformToNameValuePair(fields);

        const { onShippingEstimationFieldsChange } = this.props;
        const shippingData = {
            ...this.state.shippingData,
            country_id,
            region_id: regionId || 0,
            region,
            city,
            postcode
        };

        const address = {
            country_id,
            region_id: regionId !== '' ? regionId : 0,
            region,
            city,
            postcode
        };

        this.setState({
            shippingData
        });

        // If shippingData hasn't changed, then ignore.
        if (JSON.stringify(shippingData) === JSON.stringify(this.lastRequest)) {
            return;
        }

        onShippingEstimationFieldsChange(address);
        // Caches last shippingData
        this.lastRequest = shippingData;
    }

    // eslint-disable-next-line consistent-return
    handleAddressUpdateAndClose = async (isSave = true) => {
        const { shippingData } = this.state;
        const {
            onAddressUpdate, addressType, updateCustomerDetails,
            defaultAddress: { default_billing }, showErrorNotification,
            showSuccessNotification, updateShippingFields, handleUpdateAddress, shippingFields: { id }
        } = this.props;

        const {
            region, region_id, street_0, street_1, street_2, alternate_phone_number, ...address
        } = shippingData;

        if (!isSave) { // handle cancel
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (id) {
                handleUpdateAddress({ address_id: id, isLastUpdated: true });
            }
            onAddressUpdate();
        } else if (hasAllFieldsInAddress(shippingData) || hasRegionInAddress(shippingData)) {
            const customerAddress = {
                ...address,
                street: [street_0, street_1, street_2],
                region: { region, region_id },
                default_shipping: true,
                default_billing,
                custom_attributes: [
                    {
                        attribute_code: 'c_address_type',
                        value: addressType || ''
                    },
                    {
                        attribute_code: 'alternate_phone_number',
                        value: alternate_phone_number || ''
                    }
                ]
            };

            this.setState({ isLoading: true });
            const mutation = MyAccountQuery.getCreateAddressMutation(customerAddress);

            await fetchMutation(mutation).then(
                /** @namespace Seedsman/Component/CheckoutAddressForm/Component/CheckoutAddressFormComponent/fetchMutation/then */
                async (response) => {
                    const { createCustomerAddress } = response;

                    if (createCustomerAddress) {
                        handleUpdateAddress({ address_id: createCustomerAddress.id, isLastUpdated: true });
                    }

                    updateCustomerDetails();
                    updateShippingFields(customerAddress);
                    this.setState({ isLoading: false });
                    showSuccessNotification('You saved the address');
                },
                /** @namespace Seedsman/Component/CheckoutAddressForm/Component/CheckoutAddressFormComponent/fetchMutation/then/catch */
                (error) => {
                    this.setState({ isLoading: false });
                    showErrorNotification(error);
                }
            );

            this.setState({ isLoading: false });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            onAddressUpdate();
        } else {
            return null;
        }
    };

    render() {
        const { isLoading, shippingData: { country_id, region_id } } = this.state;
        const { id } = this.props;
        const isBilling = id === 'BILLING_STEP';
        const countryID = country_id === 'US';
        // eslint-disable-next-line no-unneeded-ternary
        const region = region_id > 0 ? true : false;
        return (
            <div block="CheckoutAddressForm">
                { this.renderFormBody() }
                { isSignedIn() && !isBilling
                    ? <div block="CheckoutAddressForm" elem="Actions">
                    <button onClick={ () => this.handleAddressUpdateAndClose(countryID ? region : true) } type="submit" block="Button" className="Save">
                        Save
                    </button>
                      </div>
                    : null }
                <Loader isLoading={ isLoading } />
            </div>
        );
    }
}

export default CheckoutAddressFormComponent;
