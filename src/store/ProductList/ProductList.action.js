import {
    APPEND_PAGE as SOURCE_APPEND_PAGE,
    appendPage as sourceAppendPage,
    UPDATE_LOAD_STATUS as SOURCE_UPDATE_LOAD_STATUS,
    UPDATE_PAGE_LOAD_STATUS as SOURCE_UPDATE_PAGE_LOAD_STATUS,
    UPDATE_PRODUCT_LIST_ITEMS as SOURCE_UPDATE_PRODUCT_LIST_ITEMS,
    updateLoadStatus as sourceUpdateLoadStatus,
    updatePageLoadingStatus as sourceUpdatePageLoadingStatus
} from 'SourceStore/ProductList/ProductList.action';

// TODO: implement APPEND_PAGE
export const APPEND_PAGE = SOURCE_APPEND_PAGE;

// TODO: implement UPDATE_PRODUCT_LIST_ITEMS
export const UPDATE_PRODUCT_LIST_ITEMS = SOURCE_UPDATE_PRODUCT_LIST_ITEMS;

// TODO: implement UPDATE_LOAD_STATUS
export const UPDATE_LOAD_STATUS = SOURCE_UPDATE_LOAD_STATUS;

// TODO: implement UPDATE_PAGE_LOAD_STATUS
export const UPDATE_PAGE_LOAD_STATUS = SOURCE_UPDATE_PAGE_LOAD_STATUS;

// TODO: implement appendPage
export const appendPage = sourceAppendPage;

/**
 * Update product list with new list (rewrite if already exists).
 * @param {Array<Object>} items List of products returned from fetch
 * @param {Number} currentPage Number of requested page
 * @param {Number} total_count Number of requested page
 * @return {void}
 * @namespace Seedsman/Store/ProductList/Action/updateProductListItems */
export const updateProductListItems = (
    items,
    currentPage,
    total_count,
    total_pages,
    args,
    min_price,
    max_price
) => ({
    type: UPDATE_PRODUCT_LIST_ITEMS,
    items,
    currentPage,
    total_pages,
    total_count,
    args,
    min_price,
    max_price
});
// TODO: implement updateLoadStatus
export const updateLoadStatus = sourceUpdateLoadStatus;

// TODO: implement updatePageLoadingStatus
export const updatePageLoadingStatus = sourceUpdatePageLoadingStatus;
