/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-expressions */
// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import MyTickectsQuery from 'Query/MyTickects.query';
import { ACCOUNT_MYTICKET_URL, ACCOUNT_MYTICKETS } from 'Route/MyAccount/MyAccount.config';
import history from 'Util/History';
// import { showNotification } from 'SourceStore/Notification/Notification.action';
import { fetchQuery } from 'Util/Request';
import { appendWithStoreCode } from 'Util/Url';

import MyAccountMyTickets from './MyAccountZendeskView.component';

/** @namespace Seedsman/Component/MyAccountZendeskView/Container */
export class MyAccountZendeskViewContainer extends PureComponent {
    static propTypes = {
        // TODO: implement prop-types
    };

    containerFunctions = {
        handelviewticket: this.handelviewticket.bind(this),
        handelBackButton: this.handelBackButton.bind(this)
    };

    state = {
        MyticketsData: {},
        isLoading: false
    };

    componentDidMount() {
        this.getTicketDetails();
    }

    async getTicketDetails() {
        this.setState({
            isLoading: true
        });
        const {
            match: {
                params: { orderId }
            }
        } = this.props;

        const data = MyTickectsQuery.getIndividualTickects(orderId);
        const result = await fetchQuery(data);
        this.setState({
            MyticketsData: result,
            isLoading: false
        });
    }

    containerProps() {
        const {
            match: {
                params: { orderId }
            }
        } = this.props;
        const { MyticketsData, isLoading } = this.state;

        return { MyticketsData, orderId, isLoading };
    }

    handelviewticket(id) {
        history.push({
            pathname: appendWithStoreCode(`${ACCOUNT_MYTICKET_URL}/${id}`)
        });
    }

    handelBackButton() {
        history.push({ pathname: appendWithStoreCode(ACCOUNT_MYTICKETS) });
    }

    render() {
        return (
            <MyAccountMyTickets
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default MyAccountZendeskViewContainer;
