/* eslint-disable react/boolean-prop-naming */
import PropTypes from 'prop-types';

import Loader from 'Component/Loader';
import MyAccountCustomerForm from 'Component/MyAccountCustomerForm';
import {
    MyAccountInformation as sourceMyAccountInformation
} from 'SourceComponent/MyAccountInformation/MyAccountInformation.component';
import { CustomerType } from 'Type/Account.type';

import './MyAccountInformation.style';

/** @namespace Seedsman/Component/MyAccountInformation/Component */
export class MyAccountInformationComponent extends sourceMyAccountInformation {
    static propTypes = {
        onCustomerSave: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        customer: CustomerType.isRequired,
        showEmailChangeField: PropTypes.bool.isRequired,
        showPasswordChangeField: PropTypes.bool.isRequired,
        handleChangeEmailCheckbox: PropTypes.func.isRequired,
        handleChangePasswordCheckbox: PropTypes.func.isRequired
    };

    renderCustomerForm() {
        const {
            customer,
            onCustomerSave,
            showEmailChangeField,
            showPasswordChangeField,
            handleChangeEmailCheckbox,
            handleChangePasswordCheckbox
        } = this.props;

        return (
            <MyAccountCustomerForm
              customer={ customer }
              onSave={ onCustomerSave }
              showEmailChangeField={ showEmailChangeField }
              showPasswordChangeField={ showPasswordChangeField }
              handleChangeEmailCheckbox={ handleChangeEmailCheckbox }
              handleChangePasswordCheckbox={ handleChangePasswordCheckbox }
            />
        );
    }

    render() {
        const { isLoading } = this.props;

        return (
            <div
              block="MyAccountInformation"
              elem="Wrapper"
            >
                <Loader isLoading={ isLoading } />
                { this.renderCustomerForm() }
            </div>
        );
    }
}

export default MyAccountInformationComponent;
