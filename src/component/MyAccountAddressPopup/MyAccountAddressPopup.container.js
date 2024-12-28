/* eslint-disable max-len */
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import MyAccountQuery from 'Query/MyAccount.query';
import { mapDispatchToProps as sourcemapDispatchToProps, mapStateToProps as sourcemapStateToProps, MyAccountAddressPopupContainer as SourceMyAccountAddressPopupContainer } from 'SourceComponent/MyAccountAddressPopup/MyAccountAddressPopup.container';
import { Addresstype } from 'Type/Account.type';
import { DeviceType } from 'Type/Device.type';
import { isSignedIn } from 'Util/Auth';
import { fetchMutation } from 'Util/Request';

export const CheckoutDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Checkout/Checkout.dispatcher'
);

/** @namespace Seedsman/Component/MyAccountAddressPopup/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    ...sourcemapStateToProps(state),
    isMobile: state.ConfigReducer.device.isMobile
});

/** @namespace Seedsman/Component/MyAccountAddressPopup/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    ...sourcemapDispatchToProps(dispatch),
    handleUpdateAddress: (address) => CheckoutDispatcher.then(({ default: d }) => d.handleUpdateAddress(address, dispatch))
});

/** @namespace Seedsman/Component/MyAccountAddressPopup/Container */
export class MyAccountAddressPopupContainer extends SourceMyAccountAddressPopupContainer {
    static propTypes = {
        showErrorNotification: PropTypes.func.isRequired,
        showSuccessNotification: PropTypes.func.isRequired,
        updateCustomerDetails: PropTypes.func.isRequired,
        hideActiveOverlay: PropTypes.func.isRequired,
        goToPreviousHeaderState: PropTypes.func.isRequired,
        device: DeviceType.isRequired,
        payload: PropTypes.shape({
            address: Addresstype
        }).isRequired
    };

    containerFunctions = {
        handleAddress: this.handleAddress.bind(this),
        handleDeleteAddress: this.handleDeleteAddress.bind(this),
        handleCancel: this.handleCancel.bind(this)
    };

    containerProps() {
        const { payload, isMobile } = this.props;
        const { isLoading } = this.state;

        return { isLoading, payload, isMobile };
    }

    async handleCreateAddress(address) {
        const { handleUpdateAddress } = this.props;

        if (!isSignedIn()) {
            return;
        }

        const query = MyAccountQuery.getCreateAddressMutation(address);

        try {
            await fetchMutation(query).then(
                /** @namespace Seedsman/Component/MyAccountAddressPopup/Container/MyAccountAddressPopupContainer/handleCreateAddress/fetchMutation/then */
                (response) => {
                    const { createCustomerAddress } = response;

                    if (createCustomerAddress) {
                        handleUpdateAddress({ address_id: createCustomerAddress.id, isLastUpdated: true });
                    }
                }
            );
            this.handleAfterAction('success', 'saved');
        } catch (e) {
            this.handleError(e);
        }
    }

    handleCancel() {
        const { hideActiveOverlay, goToPreviousHeaderState } = this.props;

        hideActiveOverlay();
        goToPreviousHeaderState();
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountAddressPopupContainer);
