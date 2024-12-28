/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
// import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import MyTickectsQuery from 'Query/MyTickects.query';
import { ACCOUNT_MYTICKET_NEW, ACCOUNT_MYTICKET_URL, ACCOUNT_MYTICKETS } from 'Route/MyAccount/MyAccount.config';
import history from 'Util/History';
// import { showNotification } from 'SourceStore/Notification/Notification.action';
import { fetchQuery } from 'Util/Request';
import { appendWithStoreCode } from 'Util/Url';

import MyAccountZendesk from './MyAccountZendesk.component';

/** @namespace Seedsman/Component/MyAccountZendesk/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    // wishlistItems: state.WishlistReducer.productsInWishlist
    device: state.ConfigReducer.device
});

/** @namespace Seedsman/Component/MyAccountZendesk/Container/mapDispatchToProps */
export const mapDispatchToProps = (_dispatch) => ({
    // addProduct: options => CartDispatcher.addProductToCart(dispatch, options)
});

/** @namespace Seedsman/Component/MyAccountZendesk/Container */
export class MyAccountZendeskContainer extends PureComponent {
    containerFunctions = {
        // getData: this.getData.bind(this)
    };

    containerFunctions = {
        handelviewticket: this.handelviewticket.bind(this),
        handelcreateNewTicket: this.handelcreateNewTicket.bind(this),
        handelBackButton: this.handelBackButton.bind(this)
    };

    state = {
        MyticketsData: {},
        isLoading: false
    };

    componentDidMount() {
        this.getListOfTickets();
    }

    async getListOfTickets() {
        this.setState({
            isLoading: true
        });
        const data = MyTickectsQuery.getListOfTickets();
        const result = await fetchQuery(data);
        this.setState({
            MyticketsData: result
        });

        if (this.state.MyticketsData) {
            this.setState({
                isLoading: false
            });
        }
    }

    containerProps() {
        // isDisabled: this._getIsDisabled()
        const { MyticketsData, isLoading } = this.state;
        const { device } = this.props;

        return { MyticketsData, isLoading, device };
    }

    handelviewticket(id) {
        history.push({ pathname: appendWithStoreCode(`${ACCOUNT_MYTICKET_URL}/${id}`) });
    }

    handelcreateNewTicket() {
        history.push({ pathname: appendWithStoreCode(ACCOUNT_MYTICKET_NEW) });
    }

    handelBackButton() {
        history.push({ pathname: appendWithStoreCode(ACCOUNT_MYTICKETS) });
    }

    render() {
        return (
            <MyAccountZendesk
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountZendeskContainer);
