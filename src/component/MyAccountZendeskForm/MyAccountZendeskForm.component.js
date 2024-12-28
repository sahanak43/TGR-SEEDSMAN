/* eslint-disable react/jsx-no-bind */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
/* eslint-disable react/prop-types */
// import PropTypes from 'prop-types';
import PropTypes from 'prop-types';

import FieldForm from 'Component/FieldForm';
import Loader from 'Component/Loader';
import { ACCOUNT_MYTICKETS } from 'Route/MyAccount/MyAccount.config';
import history from 'Util/History';
// import { showNotification } from 'SourceStore/Notification/Notification.action';
import { appendWithStoreCode } from 'Util/Url';

import { myTicketsForm } from './MyAccountZendeskForm.form';

import './MyAccountZendeskForm.style';

/** @namespace Seedsman/Component/MyAccountZendeskForm/Component */
export class MyAccountZendeskFormComponent extends FieldForm {
    static propTypes = {
        isLoading: PropTypes.bool,
        onFormSubmit: PropTypes.func.isRequired
    };

    get fieldMap() {
        return myTicketsForm();
    }

    getFormProps() {
        const { onFormSubmit } = this.props;

        return {
            onSubmit: onFormSubmit
        };
    }

    handelBackButton() {
        history.push({ pathname: appendWithStoreCode(ACCOUNT_MYTICKETS) });
    }

    renderActions() {
        // const { onFormSubmit } = this.props;
        return (
            <div block="acton" elem="section">
                <button
                  block="Button button-back"
                  onClick={ () => {
                      this.handelBackButton();
                  } }
                >
                    Back
                </button>
                <button type="submit" block="Button">
                    submit
                </button>
            </div>
        );
    }

    renderHeading() {
        return (
            <div block="MyAccount" elem="HeadingSection">
                <h2 block="MyAccount" elem="Heading">
                    Create new ticket
                </h2>
            </div>
        );
    }

    render() {
        const { isLoading } = this.props;

        return (
            <>
        <Loader isLoading={ isLoading } />
            <div block="MyTickets-form">

                { this.renderHeading() }
                { super.render() }
            </div>
            </>
        );
    }
}

export default MyAccountZendeskFormComponent;
