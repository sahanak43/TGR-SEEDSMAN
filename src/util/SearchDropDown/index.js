/** @namespace Seedsman/Util/SearchDropDown/Index/searchDropDownArray */
export const searchDropDownArray = (data) => data.map((country) => ({
    value: country.country_code,
    label: country.country_name
}));
