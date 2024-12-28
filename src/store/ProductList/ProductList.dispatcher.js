import {
    ProductListDispatcher as SourceProductListDispatcher
} from 'SourceStore/ProductList/ProductList.dispatcher';
import { updateNoMatch } from 'Store/NoMatch/NoMatch.action';
import { showNotification } from 'Store/Notification/Notification.action';
import { updateLoadStatus } from 'Store/ProductList/ProductList.action';

// eslint-disable-next-line new-cap
export const original = new SourceProductListDispatcher().onSuccess;
/** @namespace Seedsman/Store/ProductList/Dispatcher */
export class ProductListDispatcher extends SourceProductListDispatcher {
    // Overided in extension at
    /** @namespace Scandiweb/Gtm/Event/General/fireNotFoundEvent for onSucesss */

    onError(error, dispatch) {
        dispatch(showNotification('error', __('Error fetching Product List!'), error));
        dispatch(updateNoMatch(true));
        dispatch(updateLoadStatus(false));
    }
}

export default new ProductListDispatcher();
