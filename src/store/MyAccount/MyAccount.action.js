/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import {
    UPDATE_CUSTOMER_DETAILS as SOURCE_UPDATE_CUSTOMER_DETAILS,
    UPDATE_CUSTOMER_IS_LOADING as SOURCE_UPDATE_CUSTOMER_IS_LOADING,
    UPDATE_CUSTOMER_IS_LOCKED as SOURCE_UPDATE_CUSTOMER_IS_LOCKED,
    UPDATE_CUSTOMER_PASSWORD_FORGOT_EMAIL as SOURCE_UPDATE_CUSTOMER_PASSWORD_FORGOT_EMAIL,
    UPDATE_CUSTOMER_PASSWORD_FORGOT_STATUS as SOURCE_UPDATE_CUSTOMER_PASSWORD_FORGOT_STATUS,
    UPDATE_CUSTOMER_PASSWORD_RESET_STATUS as SOURCE_UPDATE_CUSTOMER_PASSWORD_RESET_STATUS,
    UPDATE_CUSTOMER_SIGN_IN_STATUS as SOURCE_UPDATE_CUSTOMER_SIGN_IN_STATUS,
    updateCustomerDetails as sourceUpdateCustomerDetails,
    updateCustomerPasswordForgotEmail as sourceUpdateCustomerPasswordForgotEmail,
    updateCustomerPasswordForgotStatus as sourceUpdateCustomerPasswordForgotStatus,
    updateCustomerPasswordResetStatus as sourceUpdateCustomerPasswordResetStatus,
    updateCustomerSignInStatus as sourceUpdateCustomerSignInStatus,
    updateIsLoading as sourceUpdateIsLoading,
    updateIsLocked as sourceUpdateIsLocked
} from 'SourceStore/MyAccount/MyAccount.action';

export const UPDATE_CUSTOMER_SIGN_IN_STATUS = SOURCE_UPDATE_CUSTOMER_SIGN_IN_STATUS;
export const UPDATE_CUSTOMER_DETAILS = SOURCE_UPDATE_CUSTOMER_DETAILS;
export const UPDATE_CUSTOMER_PASSWORD_RESET_STATUS = SOURCE_UPDATE_CUSTOMER_PASSWORD_RESET_STATUS;
export const UPDATE_CUSTOMER_PASSWORD_FORGOT_STATUS = SOURCE_UPDATE_CUSTOMER_PASSWORD_FORGOT_STATUS;
export const UPDATE_CUSTOMER_IS_LOADING = SOURCE_UPDATE_CUSTOMER_IS_LOADING;
export const UPDATE_CUSTOMER_PASSWORD_FORGOT_EMAIL = SOURCE_UPDATE_CUSTOMER_PASSWORD_FORGOT_EMAIL;
export const UPDATE_CUSTOMER_IS_LOCKED = SOURCE_UPDATE_CUSTOMER_IS_LOCKED;

export const updateCustomerSignInStatus = sourceUpdateCustomerSignInStatus;
export const updateCustomerDetails = sourceUpdateCustomerDetails;
export const updateCustomerPasswordResetStatus = sourceUpdateCustomerPasswordResetStatus;
export const updateCustomerPasswordForgotStatus = sourceUpdateCustomerPasswordForgotStatus;
export const updateIsLoading = sourceUpdateIsLoading;
export const updateCustomerPasswordForgotEmail = sourceUpdateCustomerPasswordForgotEmail;
export const updateIsLocked = sourceUpdateIsLocked;

export const GET_REWARDS_POINTS = 'GET_REWARDS_POINTS';

/** @namespace Seedsman/Store/MyAccount/Action/getRewardPoints */
export const getRewardPoints = (reward_points) => ({
    type: GET_REWARDS_POINTS,
    reward_points
});
