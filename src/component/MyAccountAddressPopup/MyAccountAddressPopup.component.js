/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
import Loader from 'Component/Loader';
import MyAccountAddressForm from 'Component/MyAccountAddressForm';
import MyAccountAddressTable from 'Component/MyAccountAddressTable';
import Popup from 'Component/Popup';
import {
    MyAccountAddressPopup as SourceMyAccountAddressPopup
} from 'SourceComponent/MyAccountAddressPopup/MyAccountAddressPopup.component';

import {
    ADDRESS_POPUP_ID
} from './MyAccountAddressPopup.config';

import './MyAccountAddressPopup.override.style';

/** @namespace Seedsman/Component/MyAccountAddressPopup/Component */
export class MyAccountAddressPopupComponent extends SourceMyAccountAddressPopup {
    renderAddressForm() {
        const { payload: { address, title }, handleAddress } = this.props;

        return (
            <MyAccountAddressForm
              address={ address }
              title={ title }
              onSave={ handleAddress }
              isPopUp
            />
        );
    }

    renderDeleteNotice() {
        const {
            payload: { address }, handleDeleteAddress, handleCancel, isMobile
        } = this.props;

        return (
            <>
                <p block="MyAccountAddressPopup" elem="heading">
                    Are you sure you want to delete this address?
                </p>
                <div block="MyAccountAddressPopup" elem="Address">
                    <MyAccountAddressTable address={ address } title="Address details" />
                </div>
                <div block="Action-block">
                    { isMobile ? (
                        <button
                          block="Button"
                          mix={ { block: 'MyAccount', elem: 'Button_Cancel' } }
                          mods={ { isHollow: true } }
                          onClick={ handleCancel }
                        >
                        Cancel
                        </button>
                    ) : null }
                    <button
                      block="Button"
                      mix={ { block: 'MyAccount', elem: 'Button_Delete' } }
                      onClick={ handleDeleteAddress }
                    >
                        Yes, delete address
                    </button>
                </div>
            </>
        );
    }

    render() {
        const { isLoading } = this.props;

        return (
            <Popup
              id={ ADDRESS_POPUP_ID }
              clickOutside={ false }
              mix={ { block: 'MyAccountAddressPopup' } }
            >
                <div block="MyAccountAddressPopup" elem="popup">
                    <Loader isLoading={ isLoading } />
                    { this.renderContent() }
                </div>
            </Popup>
        );
    }
}

export default MyAccountAddressPopupComponent;
