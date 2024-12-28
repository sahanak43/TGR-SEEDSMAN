import OrderQuery from 'Query/Order.query';
import {
    OrderDispatcher as SourceOrderDispatcher
} from 'SourceStore/Order/Order.dispatcher';
import { getOrderList, setLoadingStatus } from 'Store/Order/Order.action';
import { fetchQueryWithError } from 'Util/Request';

/** @namespace Seedsman/Store/Order/Dispatcher */
export class OrderDispatcher extends SourceOrderDispatcher {
    requestOrders(dispatch, page = 1, sortValue) {
        const query = OrderQuery.getOrderListQuery({ page, sortValue });
        dispatch(setLoadingStatus(true));

        return fetchQueryWithError(query).then(
            /** @namespace Seedsman/Store/Order/Dispatcher/OrderDispatcher/requestOrders/then/then/fetchQueryWithError/then */
            (response) => response.json()
        )
            .then(
            /** @namespace Seedsman/Store/Order/Dispatcher/OrderDispatcher/requestOrders/then/then */
                ({ data: { customer: { orders } } }) => {
                    dispatch(getOrderList(orders, false));
                }
            );
    }

    async getOrderById(dispatch, orderId) {
        const order = await fetchQueryWithError(OrderQuery.getOrderListQuery({ orderId })).then(
            /** @namespace Seedsman/Store/Order/Dispatcher/OrderDispatcher/getOrderById/order/then/then/fetchQueryWithError/then */
            (response) => response.json()
        )
            .then(
                /** @namespace Seedsman/Store/Order/Dispatcher/OrderDispatcher/getOrderById/order/then/then */
                ({ data: { customer: { email, orders: { items } } } }) => ({
                    email,
                    items
                })
            );

        return order;
    }
}

export default new OrderDispatcher();
