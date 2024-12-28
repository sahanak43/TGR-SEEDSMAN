/**
 * Google Tag Manager frontend compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 * @namespace Seedsman/@Scandiweb/Gtm/Data/Sort/capitalizeFirstLetter
 */

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/** @namespace Seedsman/@Scandiweb/Gtm/Data/Sort/getSortDetailsData */
export const getSortDetailsData = async (sort) => {
    const { sortDirection, sortKey } = sort;
    return {
        sortDirection: sortDirection.toUpperCase(),
        sortKey: capitalizeFirstLetter(sortKey)
    };
};
