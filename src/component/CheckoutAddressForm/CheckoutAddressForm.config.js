/* eslint-disable max-len */
export const ADDRESS_FIELDS = {
    firstname: true,
    lastname: true,
    telephone: true,
    street_0: true,
    country_id: true,
    region_id: true,
    postcode: true,
    city: true
};

/**
 * Check if an address object has all required fields.
 *
 * @param {Object} address - The address object to check.
 * @returns {boolean} Whether or not the address object contains all required fields.
 * @namespace Seedsman/Component/CheckoutAddressForm/Config/hasAllFieldsInAddress
 */
export const hasAllFieldsInAddress = (address) => Object.keys(ADDRESS_FIELDS).every((field) => address[field] !== '' && address[field] !== undefined);

/**
 * Check if an address object has a region field.
 *
 * @param {Object} address - The address object to check.
 * @returns {boolean} Whether or not the address object contains a region field.
 * @namespace Seedsman/Component/CheckoutAddressForm/Config/hasRegionInAddress
 */
export const hasRegionInAddress = (address) => !!address.region || !!address.region_id;

export const REQUEST_SHIPPING_METHODS_FREQUENCY = 1000; // (ms)
