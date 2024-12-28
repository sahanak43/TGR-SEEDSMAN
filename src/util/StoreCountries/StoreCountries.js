/* eslint-disable consistent-return */

/* eslint-disable array-callback-return */
export const availableEUCountryCodes = [
    'AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK',
    'EE', 'ES', 'FI', 'FR', 'GI', 'GR', 'HR',
    'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT',
    'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK'
];

export const exceptionUKCountryCodes = [
    'AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK',
    'EE', 'ES', 'FI', 'FR', 'GI', 'GR', 'HR',
    'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT',
    'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK',
    'US', 'ZA'
];

/** @namespace Seedsman/Util/StoreCountries/getFilteredCountries */
export const getFilteredCountries = (baseCountryCode, countries) => {
    const country = countries.find((data) => data.id === baseCountryCode);
    return [country];
};

/** @namespace Seedsman/Util/StoreCountries/getFilteredEuCountries */
export const getFilteredEuCountries = (availableEUCountryCodes, countries) => {
    const countryAvailable = availableEUCountryCodes.map((data) => {
        const country = countries.find((res) => res.id === data);
        return country;
    });

    return countryAvailable;
};

/** @namespace Seedsman/Util/StoreCountries/getFilteredUkCountries */
export const getFilteredUkCountries = (exceptionUKCountryCodes, countries) => {
    const availableUkCountries = countries.filter((country) => !exceptionUKCountryCodes.includes(country.id));
    return availableUkCountries;
};

/** @namespace Seedsman/Util/StoreCountries/filterStoreCountries */
export const filterStoreCountries = (countries = [], code) => {
    switch (code) {
    case 'uk':
        return getFilteredUkCountries(exceptionUKCountryCodes, countries);
    case 'us':
        return getFilteredCountries('US', countries);
    case 'za':
        return getFilteredCountries('ZA', countries);
    case 'eu':
        return getFilteredEuCountries(availableEUCountryCodes, countries);
    default:
        return null;
    }
};
