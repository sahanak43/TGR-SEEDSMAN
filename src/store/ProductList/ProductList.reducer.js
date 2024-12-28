import {
    defaultConfig as sourceDefaultConfig,
    getInitialState as sourceGetInitialState
} from 'SourceStore/ProductList/ProductList.reducer';
import {
    APPEND_PAGE,
    UPDATE_LOAD_STATUS,
    UPDATE_PAGE_LOAD_STATUS,
    UPDATE_PRODUCT_LIST_ITEMS
} from 'Store/ProductList/ProductList.action';
import { getIndexedProducts } from 'Util/Product';

// TODO: implement getInitialState
export const getInitialState = sourceGetInitialState;

// TODO: implement defaultConfig
export const defaultConfig = sourceDefaultConfig;

/** @namespace Seedsman/Store/ProductList/Reducer/ProductListReducer */
export const ProductListReducer = (
    state = getInitialState(),
    action
) => {
    const {
        type,
        items: initialItems = [],
        total_pages: totalPages,
        total_count: totalItems,
        currentPage,
        isLoading,
        min_price = 0,
        max_price = 0,
        args: currentArgs
    } = action;

    switch (type) {
    case APPEND_PAGE:
        return {
            ...state,
            isPageLoading: false,
            pages: {
                ...state.pages,
                [currentPage]: getIndexedProducts(initialItems)
            }
        };

    case UPDATE_PRODUCT_LIST_ITEMS:
        return {
            ...state,
            currentArgs,
            isLoading: false,
            totalItems,
            totalPages,
            min_price,
            max_price,
            pages: { [currentPage]: getIndexedProducts(initialItems) }
        };

    case UPDATE_PAGE_LOAD_STATUS:
        return {
            ...state,
            isPageLoading: true
        };

    case UPDATE_LOAD_STATUS:
        return {
            ...state,
            isLoading
        };

    default:
        return state;
    }
};

export default ProductListReducer;
