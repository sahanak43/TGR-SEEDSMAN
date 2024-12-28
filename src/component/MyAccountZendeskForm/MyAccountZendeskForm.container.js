/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import { PureComponent } from 'react';
import { connect } from 'react-redux';

import MyTickectsQuery from 'Query/MyTickects.query';
import { ACCOUNT_MYTICKET_URL } from 'Route/MyAccount/MyAccount.config';
import { showNotification } from 'Store/Notification/Notification.action';
import history from 'Util/History';
import { fetchMutation, getErrorMessage } from 'Util/Request';
import { appendWithStoreCode } from 'Util/Url';

import MyAccountZendeskForm from './MyAccountZendeskForm.component';

/** @namespace Seedsman/Component/MyAccountZendeskForm/Container/mapStateToProps */
export const mapStateToProps = () => ({
});
/** @namespace Seedsman/Component/MyAccountZendeskForm/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    showSuccessNotification: (message) => dispatch(showNotification('success', message)),
    showErrorNotification: (error) => dispatch(showNotification(
        'error',
        typeof error === 'string' ? error : getErrorMessage(error)
    ))
});

/** @namespace Seedsman/Component/MyAccountZendeskForm/Container */
export class MyAccountZendeskFormContainer extends PureComponent {
    containerFunctions = {
        onFormSubmit: this.onFormSubmit.bind(this)
    };

    state = {
        ticketId: '',
        isLoading: false
    };

    onFormSubmit(form, fields) {
        const input = {};
        fields.forEach(({ name, value }) => {
            input[name] = value;
        });

        this.onClickCreateNewTicke(input);
    }

    async onClickCreateNewTicke(input) {
        const { showErrorNotification, showSuccessNotification } = this.props;
        this.setState({
            isLoading: true
        });
        const mutation = MyTickectsQuery.createNewTickectMutation(input);
        await fetchMutation(mutation).then(
            /** @namespace Seedsman/Component/MyAccountZendeskForm/Container/MyAccountZendeskFormContainer/onClickCreateNewTicke/fetchMutation/then */
            async (response) => {
                const { zendeskCreateTicket: { ticket_id } } = response;
                if (response) {
                    this.setState({
                        ticketId: ticket_id,
                        isLoading: false
                    });
                    showSuccessNotification('The ticket was been successfully created.');
                    this.handelviewticket(ticket_id);
                }
            },
            /** @namespace Seedsman/Component/MyAccountZendeskForm/Container/MyAccountZendeskFormContainer/onClickCreateNewTicke/fetchMutation/then/catch */
            (error) => {
                showErrorNotification(error);
                this.setState({
                    isLoading: false
                });
            }
        );
    }

    handelviewticket(id) {
        history.push({ pathname: appendWithStoreCode(`${ACCOUNT_MYTICKET_URL}/${id}`) });
    }

    containerProps() {
        const { isLoading, ticketId } = this.state;

        return { isLoading, ticketId };
    }

    render() {
        return (
            <MyAccountZendeskForm
              { ...this.containerProps() }
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountZendeskFormContainer);
