/* eslint-disable fp/no-let */
export const defaults = {
    path: '/',
    expiryDays: 1
};

/** @namespace Seedsman/Util/Cookies/Index/setCookieExpiryDays */
export function setCookieExpiryDays(daysValue) {
    const days = daysValue || defaults.expiryDays;
    const date = new Date();
    const nextDay = date.setDate(date.getDate() + days);
    return new Date(nextDay).toUTCString();
}
export const Cookies = {
    set(key, value, isJson, expires) {
        let jsonValue = '';
        if (isJson === true) {
            jsonValue = JSON.stringify(value);
        } else {
            jsonValue = value;
        }
        try {
            // eslint-disable-next-line max-len
            document.cookie = `${key }=${ jsonValue }; expires=${ setCookieExpiryDays(expires) }; path=${ defaults.path}`;
            return true;
        } catch (e) {
            return false;
        }
    },
    get(cookieName) {
        let currentCookies;
        try {
            currentCookies = document ? document.cookie : '';
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
        }
        if (currentCookies) {
            let cookies = currentCookies.split(';');
            cookies = cookies.map((item) => {
                // eslint-disable-next-line no-param-reassign
                item = item.split('=');
                const cookieValuePair = {
                    name: item[0].trim(),
                    value: item[1].trim()
                };

                return cookieValuePair;
            });

            return cookies.find((item) => item.name === cookieName);
        }

        return false;
    },
    deleteCookie(name) {
        document.cookie = `${name }=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    }
};

export default Cookies;
