import {
    ConfigReducer as sourceConfigReducer,
    DEFAULT_CATGORY_URL_SUFFIX,
    filterStoreConfig,
    getCheckoutAgreementData,
    getCountryData,
    getCurrencyData,
    getIndexedRatings,
    getInitialState as sourceGetInitialState,
    MAX_HEIGHT,
    MAX_WIDTH
} from 'SourceStore/Config/Config.reducer';
import { UPDATE_CONFIG } from 'Store/Config/Config.action';
import BrowserDatabase from 'Util/BrowserDatabase';
import { filterStoreCountries } from 'Util/StoreCountries';
import { getStoreCodes } from 'Util/Url';

export {
    MAX_WIDTH,
    MAX_HEIGHT,
    DEFAULT_CATGORY_URL_SUFFIX,
    filterStoreConfig,
    getIndexedRatings,
    getCurrencyData,
    getCountryData,
    getCheckoutAgreementData
};

export const {
    reviewRatings, storeConfig, currencyData, cartDisplayConfig, getAddressTypeOptions,
    countries_sort_order
} = BrowserDatabase.getItem('config') || {
    reviewRatings: [],
    storeConfig: {},
    currencyData: {},
    getAddressTypeOptions: [],
    cartDisplayConfig: {
        display_tax_in_price: '',
        display_tax_in_subtotal: '',
        display_tax_in_shipping_amount: '',
        include_tax_in_order_total: false,
        display_full_tax_summary: false,
        display_zero_tax_subtotal: false
    },
    countries_sort_order: []
};

/** @namespace Seedsman/Store/Config/Reducer/getAddressTypes */
export const getAddressTypes = (base, state) => (base || state.getAddressTypeOptions || []);

/** @namespace Seedsman/Store/Config/Reducer/getUpdatedCountries */
export const getUpdatedCountries = (base, state) => (base || state.countries_sort_order || {});

/** @namespace Seedsman/Store/Config/Reducer/getInitialState */
export const getInitialState = () => ({
    ...sourceGetInitialState(),
    getAddressTypeOptions,
    category_url_suffix: null,
    allCountries: [],
    updatedCountries: null
});

/** @namespace Seedsman/Store/Config/Reducer/ConfigReducer */
export const ConfigReducer = (
    state = getInitialState(),
    action
) => {
    const {
        type,
        config: {
            getAddressTypeOptions,
            countries,
            countries_sort_order
        } = {}
    } = action;

    if (type === UPDATE_CONFIG) {
        return {
            ...sourceConfigReducer(state, action),
            getAddressTypeOptions: getAddressTypes(getAddressTypeOptions, state),
            updatedCountries: getUpdatedCountries(countries_sort_order, state),
            allCountries: getCountryData(countries, state),
            countries: filterStoreCountries(countries, getStoreCodes())
        };
    }

    return sourceConfigReducer(state, action);
};

export default ConfigReducer;
