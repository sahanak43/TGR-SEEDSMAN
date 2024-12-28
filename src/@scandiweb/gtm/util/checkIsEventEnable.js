/**
 * Google Tag Manager frontend compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import getStore from 'Util/Store';

import {
    GTM_EVENT_KEY_ADD_TO_CART,
    GTM_EVENT_KEY_ADD_TO_CART_FROM_CATEGORY,
    GTM_EVENT_KEY_ADD_TO_WISHLIST,
    GTM_EVENT_KEY_ALL_FILTERS_REMOVED,
    GTM_EVENT_KEY_CART,
    GTM_EVENT_KEY_CHECKOUT,
    GTM_EVENT_KEY_CHECKOUT_OPTION,
    GTM_EVENT_KEY_ERROR_MESSAGE,
    GTM_EVENT_KEY_FILTER_APPLIED,
    GTM_EVENT_KEY_FILTER_REMOVED,
    GTM_EVENT_KEY_GENERAL,
    GTM_EVENT_KEY_IMPRESSIONS,
    GTM_EVENT_KEY_LOYALITY_POINTS,
    GTM_EVENT_KEY_NOT_FOUND,
    GTM_EVENT_KEY_PAGE_RELOAD,
    GTM_EVENT_KEY_PRODUCT_CLICK,
    GTM_EVENT_KEY_PRODUCT_DETAIL,
    GTM_EVENT_KEY_PROMOTION_CODE_FROM_CART_PAGE,
    GTM_EVENT_KEY_PROMOTION_PAGE,
    GTM_EVENT_KEY_PURCHASE,
    GTM_EVENT_KEY_REMOVE_ALL_ITEMS_FROM_WISHLIST,
    GTM_EVENT_KEY_REMOVE_FROM_CART,
    GTM_EVENT_KEY_REMOVE_FROM_WISHLIST,
    GTM_EVENT_KEY_SEARCH,
    GTM_EVENT_KEY_SEARCH_STARTED,
    GTM_EVENT_KEY_SEEDSMAN_ADD_TO_CART,
    GTM_EVENT_KEY_SEEDSMAN_PRODUCT,
    GTM_EVENT_KEY_SEEDSMAN_REMOVE_FROM_CART,
    GTM_EVENT_KEY_SHARE,
    GTM_EVENT_KEY_SORT,
    GTM_EVENT_KEY_USER_LOGIN,
    GTM_EVENT_KEY_USER_LOGIN_ATTEMPT,
    GTM_EVENT_KEY_USER_LOGOUT,
    GTM_EVENT_KEY_USER_REGISTER,
    GTM_EVENT_KEY_USER_REGISTER_ATTEMPT
} from './events';

/** @namespace Seedsman/@Scandiweb/Gtm/Util/CheckIsEventEnable/checkIsEventEnable */
export const checkIsEventEnable = (event) => {
    const {
        events: {
            gtm_general_init: isGeneralInitEnable,
            gtm_impressions: isImpressionsEnable,
            gtm_site_search: isSiteSearchEnable,
            gtm_product_click: isProductClickEnable,
            gtm_product_detail: isProductDetailEnable,
            gtm_site_search_started: isSiteSearchStartedEnable,
            gtm_product_add_to_cart: isProductAddToCartEnable,
            gtm_product_remove_from_cart: isProductRemoveFromCartEnable,
            gtm_purchase: isPurchaseEnable,
            gtm_checkout: isCheckoutEnable,
            gtm_checkout_option: isCheckoutOptionEnable,
            gtm_user_login: isUserLoginEnable,
            gtm_user_login_attempt: isUserLoginAttemptEnable,
            gtm_user_register: isUserRegisterEnable,
            gtm_user_register_attempt: isUserRegisterAttemptEnable,
            gtm_user_logout: isUserLogoutEnable,
            gtm_not_found: isNotFoundEnable,
            gtm_sort: isSortEnable,
            gtm_add_to_wishlist: isAddTo_wishlistEnable,
            gtm_remove_from_wishlist: isRemoveFrom_wishlistEnable,
            gtm_remove_all_items_from_wishlist: isRemoveAllItemsFrom_wishlistEnable,
            gtm_error_message: isError_messageEnable,
            gtm_page_reload: isPageReloadEnable,
            gtm_filter_applied: isFilterAppliedEnable,
            gtm_filter_removed: isFilterRemovedEnable,
            gtm_all_filters_removed: isAllFiltersRemovedEnable
        } = {}
        // vvv These values are injected using GTM
    } = getStore().getState().ConfigReducer.gtm;
    // * ^^^ It's only being used where ConfigReducer is updated, no need to wait for it
    const eventsMap = {
        [GTM_EVENT_KEY_GENERAL]: isGeneralInitEnable,
        [GTM_EVENT_KEY_IMPRESSIONS]: isImpressionsEnable,
        [GTM_EVENT_KEY_SEARCH]: isSiteSearchEnable,
        [GTM_EVENT_KEY_PRODUCT_CLICK]: isProductClickEnable,
        [GTM_EVENT_KEY_PRODUCT_DETAIL]: isProductDetailEnable,
        [GTM_EVENT_KEY_ADD_TO_CART]: isProductAddToCartEnable,
        [GTM_EVENT_KEY_REMOVE_FROM_CART]: isProductRemoveFromCartEnable,
        [GTM_EVENT_KEY_PURCHASE]: isPurchaseEnable,
        [GTM_EVENT_KEY_CHECKOUT]: isCheckoutEnable,
        [GTM_EVENT_KEY_CHECKOUT_OPTION]: isCheckoutOptionEnable,
        [GTM_EVENT_KEY_SEARCH_STARTED]: isSiteSearchStartedEnable,
        [GTM_EVENT_KEY_USER_LOGIN]: isUserLoginEnable,
        [GTM_EVENT_KEY_USER_LOGIN_ATTEMPT]: isUserLoginAttemptEnable,
        [GTM_EVENT_KEY_USER_REGISTER]: isUserRegisterEnable,
        [GTM_EVENT_KEY_USER_REGISTER_ATTEMPT]: isUserRegisterAttemptEnable,
        [GTM_EVENT_KEY_USER_LOGOUT]: isUserLogoutEnable,
        [GTM_EVENT_KEY_NOT_FOUND]: isNotFoundEnable,
        [GTM_EVENT_KEY_SORT]: isSortEnable,
        [GTM_EVENT_KEY_ADD_TO_WISHLIST]: isAddTo_wishlistEnable,
        [GTM_EVENT_KEY_REMOVE_FROM_WISHLIST]: isRemoveFrom_wishlistEnable,
        [GTM_EVENT_KEY_REMOVE_ALL_ITEMS_FROM_WISHLIST]: isRemoveAllItemsFrom_wishlistEnable,
        [GTM_EVENT_KEY_ERROR_MESSAGE]: isError_messageEnable,
        [GTM_EVENT_KEY_PAGE_RELOAD]: isPageReloadEnable,
        [GTM_EVENT_KEY_FILTER_APPLIED]: isFilterAppliedEnable,
        [GTM_EVENT_KEY_FILTER_REMOVED]: isFilterRemovedEnable,
        [GTM_EVENT_KEY_ALL_FILTERS_REMOVED]: isAllFiltersRemovedEnable,
        [GTM_EVENT_KEY_CART]: true,
        [GTM_EVENT_KEY_SHARE]: true,
        [GTM_EVENT_KEY_SEEDSMAN_PRODUCT]: true,
        [GTM_EVENT_KEY_SEEDSMAN_ADD_TO_CART]: true,
        [GTM_EVENT_KEY_SEEDSMAN_REMOVE_FROM_CART]: true,
        [GTM_EVENT_KEY_PROMOTION_PAGE]: true,
        [GTM_EVENT_KEY_ADD_TO_CART_FROM_CATEGORY]: true,
        [GTM_EVENT_KEY_PROMOTION_CODE_FROM_CART_PAGE]: true,
        [GTM_EVENT_KEY_LOYALITY_POINTS]: true
    };

    if (!eventsMap[event]) {
        return true;
    }
    // ^^^ In case the event is undefined we assume we need to push it.
    // e.g: gtm.js, gtm.load, gtm.dom

    return eventsMap[event];
};
