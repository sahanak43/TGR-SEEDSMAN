import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ACCOUNT_ORDER_URL } from 'Route/MyAccount/MyAccount.config';
import {
    MyAccountOrderTableRowContainer as SourceMyAccountOrderTableRowContainer
} from 'SourceComponent/MyAccountOrderTableRow/MyAccountOrderTableRow.container';
import { showNotification } from 'Store/Notification/Notification.action';
import { OrderType } from 'Type/Order.type';
import history from 'Util/History';
import { appendWithStoreCode } from 'Util/Url';

import MyAccountOrderTableRow from './MyAccountOrderTableRow.component';

/** @namespace Seedsman/Component/MyAccountOrderTableRow/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    showErrorNotification: (message) => dispatch(showNotification('error', message)),
    showSuccessNotification: (message) => dispatch(showNotification('success', message))
});

/** @namespace Seedsman/Component/MyAccountOrderTableRow/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    device: state.ConfigReducer.device
});

/** @namespace Seedsman/Component/MyAccountOrderTableRow/Container */
export class MyAccountOrderTableRowContainer extends SourceMyAccountOrderTableRowContainer {
    static propTypes = {
        order: OrderType.isRequired,
        display_tax_in_shipping_amount: PropTypes.string
    };

    static defaultProps = {
        display_tax_in_shipping_amount: ''
    };

    containerFunctions = {
        onViewClick: this.onViewClick.bind(this)
    };

    componentDidMount() {
        this.updateMetaTagOrderHistoryPage();
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.updateMetaTagOrderHistoryPage();
        }
    }

    onViewClick() {
        const { order: { id } } = this.props;

        history.push({ pathname: appendWithStoreCode(`${ACCOUNT_ORDER_URL}/${id}`) });
    }

    containerProps() {
        const {
            display_tax_in_shipping_amount,
            order,
            device
        } = this.props;

        return {
            display_tax_in_shipping_amount,
            order,
            device
        };
    }

    updateMetaTagOrderHistoryPage() {
        const metaTag = document.querySelector('meta[name="robots"]');

        if (metaTag) {
            metaTag.setAttribute('content', 'NOINDEX,FOLLOW');
        }
    }

    render() {
        return (
            <MyAccountOrderTableRow
              { ...this.containerProps() }
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountOrderTableRowContainer);
