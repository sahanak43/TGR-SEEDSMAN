/* eslint-disable consistent-return */
import parser from 'html-react-parser';

export const options = {
    replace: ({ attribs, children }) => {
        if (attribs && children) {
            const { href, target, title } = attribs;
            const [{ data }] = children;
            return {
                href,
                data,
                title,
                target
            };
        }
    }
};

/** @namespace Seedsman/Util/HtmlParser/Index/htmlParse */
export const htmlParse = (content) => parser(content, options);
