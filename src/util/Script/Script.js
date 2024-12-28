/* eslint-disable no-lone-blocks */
/* eslint-disable no-unused-expressions */
/** @namespace Seedsman/Util/Script/importScript */
export const importScript = (resourceUrl, scriptId, callback = null) => {
    const script = document.createElement('script');
    script.src = resourceUrl;
    script.id = scriptId;
    script.async = true;
    if (callback) {
        script.onload = callback;
    }
    document.head.appendChild(script);
};

/** @namespace Seedsman/Util/Script/removeScript */
export const removeScript = (scriptId) => {
    const s = document.getElementById(scriptId);
    if (s) {
        document.head.removeChild(s);
    }
};

/** @namespace Seedsman/Util/Script/importLink */
export const importLink = (rel, href, linkId, hrefLang = '', class_name) => {
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    link.id = linkId;
    { hrefLang && link.setAttribute('hrefLang', hrefLang); }
    if (class_name) {
        link.className = class_name;
        document.head.appendChild(link);
    } else {
        document.head.appendChild(link);
    }
};

/** @namespace Seedsman/Util/Script/publishEvent */
export const publishEvent = (eventName, { type, data }) => {
    const event = new CustomEvent(eventName, {
        detail: {
            type,
            data
        }
    });

    document.dispatchEvent(event);
};
