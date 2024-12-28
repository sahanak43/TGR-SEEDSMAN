/* eslint-disable no-param-reassign */
/* eslint-disable no-magic-numbers */
export const DAY_MAP = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

export const MONTH_MAP = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

/** @namespace Seedsman/Util/DateTime/Index/formatDateTime */
export const formatDateTime = (dateTimeString, showTime = true, isUTC = true, short = true) => {
    if (!dateTimeString || !dateTimeString.length) {
        return dateTimeString;
    }
    try {
        if (isUTC) {
            // eslint-disable-next-line no-param-reassign
            dateTimeString += ' UTC';
        }
        /* @FIX Change the date format from YYYY-MM-DD to YYYY/MM/DD */

        const dateFormat = dateTimeString.replace(/-/g, '/');

        const dateObj = new Date(dateFormat);

        const date = (
            `${short ? MONTH_MAP[dateObj.getMonth()].substring(0, 3) : MONTH_MAP[dateObj.getMonth()]
            } ${
                dateObj.getDate()
            }, ${
                dateObj.getFullYear()}`
        );

        if (showTime) {
            const time = (
                `${dateObj.getHours() % 12 < 10 ? `0${ dateObj.getHours() % 12}` : dateObj.getHours() % 12
                }:${
                    dateObj.getMinutes() < 10 ? `0${ dateObj.getMinutes()}` : dateObj.getMinutes()
                } ${
                    dateObj.getHours() < 12 ? 'AM' : 'PM'}`
            );

            return `${date }, ${ time}`;
        }

        return date;
    } catch (e) {
        return dateTimeString;
    }
};

/** @namespace Seedsman/Util/DateTime/Index/formatDate */
export const formatDate = (dateTimeString, isUTC = true) => {
    if (!dateTimeString || !dateTimeString.length) {
        return dateTimeString;
    }
    try {
        if (isUTC) {
            dateTimeString += ' UTC';
        }

        /* @FIX Change the date format from YYYY-MM-DD to YYYY/MM/DD */
        const dateFormat = dateTimeString.replace(/-/g, '/');
        const dateObj = new Date(dateFormat);

        const month = `${dateObj.getMonth() + 1}`.padStart(2, '0');

        const date = (
            `${dateObj.getDate()}/${month}/${dateObj.getFullYear()}`
        );

        return date;
    } catch (e) {
        return dateTimeString;
    }
};
