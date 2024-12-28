/* eslint-disable max-len */
/* eslint-disable max-lines */
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

import { decodeString } from 'Util/Common';
import getStore from 'Util/Store';
import { getStoreAndLanguageCode } from 'Util/StoreAndLangaugeCodes';

/**
  * Update query params without adding to history
  * @param {String} name
  * @param {String} value
  * @namespace Seedsman/Util/Url/updateQueryParamWithoutHistory  */
export const updateQueryParamWithoutHistory = (name, value, history, location) => {
    const { search, pathname } = location;

    const params = new URLSearchParams(search);
    params.set(name, value);
    history.replace(decodeURIComponent(`${ pathname }?${ params }`));
};

/**
  * Remove query param without adding to history
  * @param {String} name
  * @namespace Seedsman/Util/Url/removeQueryParamWithoutHistory  */
export const removeQueryParamWithoutHistory = (name, history, location) => {
    const { search, pathname } = location;

    const params = new URLSearchParams(search);
    params.delete(name);
    history.replace(decodeURIComponent(`${ pathname }?${ params }`));
};

/**
  * Get query param from url
  * @param {Object} match match object from react-router
  * @param {Object} location location object from react-router
  * @namespace Seedsman/Util/Url/getUrlParam  */
export const getUrlParam = (match, location) => {
    const baseUrl = match.path.replace(window.storeRegexText, '').replace('/', '');
    const currentUrl = location.pathname.replace(new RegExp(`^${window.storeRegexText}`, 'i'), '');

    if (baseUrl === '/') {
        return currentUrl.replace(baseUrl, '');
    }

    return currentUrl.replace(baseUrl, '').replace(/^\/*/, '');
};

/** @namespace Seedsman/Util/Url/trimEndSlash */
export const trimEndSlash = (str) => (str && (str.endsWith('/') ? str.slice(0, -1) : str));

/**
  * Replaces section of URL with passed path value
  * @param {RegExp} regex replacement rule
  * @param {String} path replacement element
  * @returns {*}
  * @namespace Seedsman/Util/Url/replace  */
export const replace = (regex, path) => {
    const { pathname = '' } = new URL(window.location.href);
    return pathname.replace(regex, path);
};

/**
  * Append store code to URL
  * @param {String} pathname the URL to append store code to
  * @namespace Seedsman/Util/Url/appendWithStoreCode  */
export const appendWithStoreCode = (pathname) => {
    const { ConfigReducer: { base_link_url = window.location.href } = {} } = getStore().getState() || {};
    const { pathname: storePrefix } = new URL(base_link_url);

    if (!pathname) {
        return trimEndSlash(storePrefix);
    }

    // match URLs which have the store code in pathname
    if (new RegExp(`^/(${window.newStoreList.join('|')})/`, 'i').test(pathname)) {
        return pathname;
    }

    // trim the last slash from URL, and append it to pathname
    return trimEndSlash(storePrefix).concat(!pathname.startsWith('/') ? `/${ pathname }` : pathname);
};

/**
  * Get query variable value (from react router)
  * @param {String} variable Variable from URL
  * @param {Object} variable location object from react-router
  * @return {String|false} Variable value
  * @namespace Seedsman/Util/Url/getQueryParam  */
export const getQueryParam = (variable, location) => {
    const query = decodeString(location.search.substring(1));
    const vars = query.split('&');

    return vars.reduce((acc, item) => {
        const splitIdx = item.indexOf('=');
        const [k, v] = [item.slice(0, splitIdx), item.slice(splitIdx + 1)];

        return k === variable ? v.replace(/=/g, ':') : acc;
    }, false);
};

/**
  * Convert url params to object with key value pairs
  * @param {String} queryString url query string
  * @return {Object} Key-Value pairs
  * @namespace Seedsman/Util/Url/convertQueryStringToKeyValuePairs  */
export const convertQueryStringToKeyValuePairs = (queryString) => {
    const keyValuePairs = {};
    const params = queryString.substring(1).split('&');

    params.forEach((param) => {
        const pair = param.split('=');
        const [keyPair, valuePair = []] = pair;

        if (keyPair.length > 0 && valuePair.length > 0) {
            keyValuePairs[keyPair] = decodeURIComponent(valuePair);
        }
    });

    return keyValuePairs;
};

/**
  * Update existing key value pairs and return result
  * @param {Object} keyValuePairs current key value pairs
  * @param {String} currentKey key of the value to be updated
  * @param {String} currentValue value to be updated
  * @return {Object} Key-Value pairs
  * @namespace Seedsman/Util/Url/updateKeyValuePairs  */
export const updateKeyValuePairs = (keyValuePairs, currentKey, currentValue) => {
    const updatedKeyValuePairs = {};

    Object.entries(keyValuePairs).forEach((pair) => {
        const [key, value] = pair;

        if (currentKey === key) {
            updatedKeyValuePairs[key] = currentValue;
        } else {
            updatedKeyValuePairs[key] = value;
        }
    });

    return updatedKeyValuePairs;
};

/**
  * Convert object with key value pairs to url query string
  * @param {Object} keyValuePairs object with key value pairs
  * @return {String} Converted query string
  * @namespace Seedsman/Util/Url/convertKeyValuesToQueryString  */
export const convertKeyValuesToQueryString = (keyValuePairs) => Object.entries(keyValuePairs)
    .map((pair) => {
        const [key, value] = pair;
        const keyExists = key !== '';
        const valueExists = typeof value === 'object' ? value.length : value !== '';

        if (valueExists && keyExists) {
            return `${key}=${value}`;
        }

        return null;
    })
    .filter((x) => !!x)
    .join('&');

/** @namespace Seedsman/Util/Url/generateQuery */
export const generateQuery = (keyValueObject, location, history) => Object.entries(keyValueObject)
    .reduce((acc, pair) => {
        const [key, value] = pair;

        const keyAndValueExist = !!key && !!value;

        if (acc === '' && keyAndValueExist) {
            return `?${key}=${value}`;
        }

        if (getQueryParam(key, location) !== false) {
            const keyValuePairs = convertQueryStringToKeyValuePairs(acc);
            const updatedKeyValuePairs = updateKeyValuePairs(keyValuePairs, key, value);
            const updatedQuery = convertKeyValuesToQueryString(updatedKeyValuePairs);

            return updatedQuery.length ? `?${updatedQuery}` : '';
        }

        if (keyAndValueExist) {
            return `${acc}&${key}=${value}`;
        }

        return acc;
    }, history.location.search);

/**
  * Set add key value pairs to url
  * @param {Object} variable Object with key value pairs to be added to url
  * @param {Object} variable location object from react-router
  * @param {Object} variable react router history object
  * @param {Object} variable is url flush required
  * @namespace Seedsman/Util/Url/setQueryParams  */
export const setQueryParams = (keyValueObject, location, history) => {
    const { state } = location;
    const query = generateQuery(keyValueObject, location, history);

    history.push({ search: query, state });
};

/**
  * Remove all queries except default sort options from url
  * @param {Object} variable react router history object
  * @namespace Seedsman/Util/Url/clearQueriesFromUrl  */
export const clearQueriesFromUrl = (history) => {
    history.push({ search: '' });
};

/**
  * Convert object with key value pairs to url query string
  * @param {Object} keyValuePairs object with key value pairs
  * @return {String} Converted query string
  * @namespace Seedsman/Util/Url/objectToUri  */
export const objectToUri = (keyValueObject = {}) => {
    const paramString = Object.entries(keyValueObject).sort()
        .reduce((acc, [key, value]) => `${acc}&${key}=${value}`, '')
        .replace('&', '');

    return paramString.length > 0 ? `?${paramString}` : '';
};

/** @namespace Seedsman/Util/Url/trimStartSlash */
export const trimStartSlash = (str) => (str.startsWith('/') ? str.slice(1) : str);
/** @namespace Seedsman/Util/Url/trimLanguageCode */
export const trimLanguageCode = (str) => (str && str.slice(0, 2));

/** @namespace Seedsman/Util/Url/getCountryAndLanguageCode */
export const getCountryAndLanguageCode = () => {
    const { pathname: storePrefix } = new URL(window.location.href);
    const [countryCode, languageCode] = storePrefix.split('-');
    return {
        countryCode: countryCode.slice(1),
        languageCode: languageCode ? trimLanguageCode(languageCode) : 'en'
    };
};
/** @namespace Seedsman/Util/Url/isHomePageUrl */
export const isHomePageUrl = (pathname) => {
    const { LanguageCodes } = getStoreAndLanguageCode();
    const { countryCode } = getCountryAndLanguageCode();
    const UrlCombination = LanguageCodes.map((languageCode) => `/${countryCode }-${ languageCode}/`);

    const isHomePage = pathname === appendWithStoreCode('/')
         || pathname === '/'
         || pathname === appendWithStoreCode('')
         || pathname === ''
         || UrlCombination.includes(pathname);

    return isHomePage;
};

/** @namespace Seedsman/Util/Url/replaceStorePrefix */
export const replaceStorePrefix = (country, language) => {
    const { pathname } = new URL(window.location.href);
    // eslint-disable-next-line fp/no-let
    let newPath = trimStartSlash(pathname);
    newPath = newPath.split('/');
    newPath.shift();
    newPath.unshift(`/${country}-${language}`);
    return newPath.join('/');
};

/** @namespace Seedsman/Util/Url/getStoreCodes */
export const getStoreCodes = () => {
    const { pathname: storePrefix } = new URL(window.location.href);
    const [countryCode] = storePrefix.split('-');

    switch (countryCode) {
    case '/uk':
        return 'uk';
    case '/eu':
        return 'eu';
    case '/us':
        return 'us';
    case '/za':
        return 'za';
    default:
        return 'uk';
    }
};

/** @namespace Seedsman/Util/Url/getPathnameFromURL */
export const getPathnameFromURL = () => {
    const { pathname } = new URL(window.location.href);
    // eslint-disable-next-line fp/no-let
    let newPath = trimStartSlash(pathname);
    newPath = newPath.split('/');
    newPath.shift();
    return newPath.join('/');
};

/** @namespace Seedsman/Util/Url/getCanonicalUrl */
export const getCanonicalUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page');
    const newParams = page ? `?page=${page}` : '';
    return `${origin}${window.location.pathname}${newParams}`;
};
