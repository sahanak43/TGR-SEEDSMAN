/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import BrowserDatabase from 'Util/BrowserDatabase';
import history from 'Util/History';
import { appendWithStoreCode } from 'Util/Url';

import CheckoutFailure from './CheckoutFailure.component';

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

/** @namespace Seedsman/Route/CheckoutFailure/Container/mapStateToProps */
export const mapStateToProps = () => ({});

/** @namespace Seedsman/Route/CheckoutFailure/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    updateBreadcrumbs: (breadcrumbs) => BreadcrumbsDispatcher.then(
        ({ default: dispatcher }) => dispatcher.update(breadcrumbs, dispatch)
    )
});

/** @namespace Seedsman/Route/CheckoutFailure/Container */
export class CheckoutFailureContainer extends PureComponent {
    static propTypes = {
        updateBreadcrumbs: PropTypes.func.isRequired
    };

    componentDidMount() {
        const { updateBreadcrumbs } = this.props;

        this.getOrderedSummaryDetails();
        updateBreadcrumbs([{
            url: '',
            name: 'Order Failure'
        }]);
    }

    async getOrderedSummaryDetails() {
        const { order_int } = BrowserDatabase.getItem('LastOrderDetails') || {};

        if (!parseInt(order_int, 10)) {
            history.replace(appendWithStoreCode('/cart'));
        }

        BrowserDatabase.deleteItem('LastOrderDetails');
    }

    render() {
        return (
            <CheckoutFailure />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutFailureContainer);
