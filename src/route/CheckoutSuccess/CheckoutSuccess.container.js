/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { CART } from 'Component/Router/Router.config';
import { updateMeta } from 'Store/Meta/Meta.action';
import { updateIsLoading } from 'Store/MyAccount/MyAccount.action';
import BrowserDatabase from 'Util/BrowserDatabase';
import history from 'Util/History';
import { fireInsiderPageEvent } from 'Util/Insider';
import { appendWithStoreCode } from 'Util/Url';

import { fireSdktracker } from '../../util/Insider';
import { CheckoutSuccessComponent } from './CheckoutSuccess.component';

export const OrderDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Order/Order.dispatcher'
);
export const BreadcrumbsDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Breadcrumbs/Breadcrumbs.dispatcher'
);
export const MetaDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Meta/Meta.dispatcher'
);

/** @namespace Seedsman/Route/CheckoutSuccess/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    isLoading: state.MyAccountReducer.isLoading,
    isMobile: state.ConfigReducer.device.isMobile
});

/** @namespace Seedsman/Route/CheckoutSuccess/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    updateIsLoading: (value) => dispatch(updateIsLoading(value)),
    getOrderById: (orderId) => OrderDispatcher.then(
        ({ default: dispatcher }) => dispatcher.getOrderById(dispatch, orderId)
    ),
    updateBreadcrumbs: (breadcrumbs) => BreadcrumbsDispatcher.then(
        ({ default: dispatcher }) => dispatcher.update(breadcrumbs, dispatch)
    ),
    updateMeta: (meta) => dispatch(updateMeta(meta))
});

/** @namespace Seedsman/Route/CheckoutSuccess/Container */
export class CheckoutSuccessContainer extends PureComponent {
    static propTypes = {
        updateIsLoading: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        getOrderById: PropTypes.func.isRequired,
        updateMeta: PropTypes.func.isRequired,
        isMobile: PropTypes.bool.isRequired,
        updateBreadcrumbs: PropTypes.func.isRequired
    };

    state = {
        OrderDetails: null
    };

    componentDidMount() {
        const { updateBreadcrumbs } = this.props;

        this.getOrderedSummaryDetails();
        updateBreadcrumbs([{
            url: '',
            name: 'Order Confirmation'
        }]);
        // fireInsiderPageEvent('Confirmation');
        // setTimeout(() => {
        //     fireInsiderPageEvent('Confirmation');
        // // eslint-disable-next-line no-magic-numbers
        // }, 5000);
        if (typeof fireInsiderPageEvent === 'function') {
            window.insider_object = {
                page: {
                    type: 'Confirmation'
                }
            };
        } else {
            fireInsiderPageEvent('Confirmation');
        }
    }

    containerProps() {
        const {
            isLoading,
            isMobile,
            customer_email
        } = this.props;

        const {
            OrderDetails
        } = this.state;

        return {
            customer_email,
            OrderDetails,
            isLoading,
            isMobile
        };
    }

    async getOrderedSummaryDetails() {
        const { updateIsLoading, getOrderById } = this.props;
        const { order_int } = BrowserDatabase.getItem('LastOrderDetails') || {};

        if (!parseInt(order_int, 10)) {
            history.replace(appendWithStoreCode(CART));
            fireInsiderPageEvent({});
        }

        updateIsLoading(true);
        const result = await getOrderById(parseInt(order_int, 10));

        const {
            email, items
        } = result;

        const [{
            increment_id,
            total: {
                grand_total: {
                    value: sale_amount,
                    currency
                } = {},
                total_tax: {
                    value: tax_amount
                } = {},
                shipping_handling: {
                    total_amount: {
                        value: shipping_amount
                    } = {}
                } = {}
            } = {}
        }] = items;

        const data = {
            order_id: increment_id,
            unique_id: email,
            sale_amount,
            tax_amount,
            shipping_amount,
            type: 'order_processing',
            currency
        };

        await fireSdktracker(data);

        this.setState({
            OrderDetails: result
        }, () => updateIsLoading(false));

        BrowserDatabase.deleteItem('LastOrderDetails');
    }

    render() {
        const { OrderDetails } = this.state;

        if (!OrderDetails) {
            return null;
        }

        return (
            <CheckoutSuccessComponent
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutSuccessContainer);
