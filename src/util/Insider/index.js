import { getCountryAndLanguageCode } from 'Util/Url';

export const INTERVAL = 3000;

/** @namespace Seedsman/Util/Insider/Index/fireInsiderEvent */
export const fireInsiderEvent = (eventType, customerData = {}, isPersistent = true) => {
    if (!customerData) {
        window.insider_object = {};
        return;
    }

    const {
        id, email, date_of_birth, is_subscribed, firstname, lastname
    } = customerData;

    const { countryCode, languageCode } = getCountryAndLanguageCode();

    const eventData = {
        uuid: `${id}`,
        birthday: date_of_birth,
        gdpr_optin: true,
        name: firstname,
        surname: lastname,
        email,
        email_optin: is_subscribed,
        language: `${languageCode}-${countryCode !== 'uk' ? countryCode : 'gb'}`,
        custom: {
            outdoor_grow_guide: '',
            new_release_sign_up_email: '',
            new_release_sign_up: ''
        }
    };

    if (window.Insider && typeof window.Insider === 'object') {
        window.insider_object = { [eventType]: eventData };
    } else if (isPersistent) {
        setTimeout(() => {
            fireInsiderEvent(eventType, customerData, false);
        }, INTERVAL); // try again in 3 seconds
    }
};

/** @namespace Seedsman/Util/Insider/Index/fireInsiderPageEvent */
export const fireInsiderPageEvent = (pageType) => {
    if (window.Insider && typeof window.Insider === 'object') {
        window.insider_object = {
            page: {
                type: pageType
            }
        };
    }
};

/** @namespace Seedsman/Util/Insider/Index/fireSdktracker */
export const fireSdktracker = (data) => {
    console.log(data, 'fireSdktracker');
    const {
        order_id, unique_id, sale_amount, tax_amount, shipping_amount,
        type, currency
    } = data;

    if (window.trackerApplet && typeof window.trackerApplet === 'object') {
        // eslint-disable-next-line max-len
        console.log(window.trackerApplet.makeRequest(order_id, unique_id, sale_amount, tax_amount, shipping_amount, type, currency, 'fireSdktracker'));
    } else {
        console.log('not triggering');
    }
};
