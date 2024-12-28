/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-props-destruction */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */ import parser from 'html-react-parser';
import attributesToProps from 'html-react-parser/lib/attributes-to-props';
import domToReact from 'html-react-parser/lib/dom-to-react';
import { lazy } from 'react';

import ExpandableContent from 'Component/ExpandableContent';
import {
    Html as SourceHtml,
    WidgetFactory as SourceWidgetFactory
} from 'SourceComponent/Html/Html.component';
import { hash } from 'Util/Request/Hash';

export const SwiperSliderWidget = lazy(() => import(
    /* webpackMode: "lazy", webpackChunkName: "widget-seeds-finder" */
    'Component/SwiperSlider'
));
export const SwiperSlideWidget = lazy(() => import(
    /* webpackMode: "lazy", webpackChunkName: "widget-seeds-finder" */
    'Component/SwiperSlide'
));

export const Blogwidget = lazy(() => import(
    /* webpackMode: "lazy", webpackChunkName: "widget-seeds-finder" */
    'Component/BlogWidget'
));

export const StoreSwitcherV2 = lazy(() => import(
    /* webpackMode: "lazy", webpackChunkName: "widget-seeds-finder" */
    'Component/StoreSwitcherV2'
));

export const WidgetFactory = SourceWidgetFactory;

/** @namespace Seedsman/Component/Html/Component */
export class HtmlComponent extends SourceHtml {
    rules = [
        {
            query: { name: ['widget'] },
            replace: this.replaceWidget
        },
        {
            query: { name: ['a'] },
            replace: this.replaceLinks
        },
        {
            query: { name: ['img'] },
            replace: this.replaceImages
        },
        {
            query: { name: ['input'] },
            replace: this.replaceInput
        },
        {
            query: { name: ['script'] },
            replace: this.replaceScript
        },
        {
            query: { name: ['style'] },
            replace: this.replaceStyle
        },
        {
            query: { name: ['table'] },
            replace: this.wrapTable
        },
        {
            query: { name: ['swiper'] },
            replace: this.replaceSlider
        },
        {
            query: { name: ['swiperslide'] },
            replace: this.replaceSlide
        },
        {
            query: { name: ['accordian'] },
            replace: this.replaceAccordian
        },
        {
            query: { name: ['blogwidget'] },
            replace: this.replaceBlogwidget
        },
        {
            query: { name: ['storeswitcher'] },
            replace: this.replaceStoreSwitcher
        }
    ];

    /**
     *
     *
     * @param attribs
     * @param children
     * @returns {*}
     */
    replaceAccordian({ attribs, children }) {
        const { className } = attributesToProps(attribs);
        return (
            <ExpandableContent
              mix={ {
                  block: className
              } }
              { ...attributesToProps(attribs) }
            >
                { domToReact(children, this.parserOptions) }
            </ExpandableContent>
        );
    }

    replaceBlogwidget({ attribs }) {
        return <Blogwidget { ...attributesToProps(attribs) } />;
    }

    replaceStoreSwitcher({ attribs }) {
        return <StoreSwitcherV2 { ...attributesToProps(attribs) } />;
    }

    /**
     * Wrap table in container
     *
     * @param attribs
     * @param children
     * @returns {*}
     */
    replaceSlide({ attribs, children }) {
        return (
            <SwiperSlideWidget { ...attributesToProps(attribs) }>
                { domToReact(children, this.parserOptions) }
            </SwiperSlideWidget>
        );
    }

    /**
     * Wrap table in container
     *
     * @param attribs
     * @param children
     * @returns {*}
     */
    replaceSlider({ attribs, children }) {
        return (
            <SwiperSliderWidget { ...attributesToProps(attribs) }>
                { domToReact(children, this.parserOptions) }
            </SwiperSliderWidget>
        );
    }

    replaceScript(elem) {
        const { attribs, children } = elem;
        const { src = '' } = attribs;
        const scriptContent = children[0] ? children[0].data : '';
        const elemHash = hash(src + scriptContent);

        if (this.createdOutsideElements[elemHash]) {
            return <></>;
        }

        const script = document.createElement('script');

        Object.entries(attribs).forEach(([attr, value]) => script.setAttribute(attr, value));

        if (children && children[0]) {
            script.appendChild(document.createTextNode(children[0].data));
        }

        if (Number.isNaN(Number(script))) {
            document.head.appendChild(script);
        }

        this.createdOutsideElements[elemHash] = true;

        return <></>;
    }

    render() {
        const { content } = this.props;
        if (!content) {
            return null;
        }
        const parsedContent = content
            .replaceAll('&lt;', '<')
            .replaceAll('&gt;', '>');

        return parser(parsedContent, this.parserOptions);
    }
}

export default HtmlComponent;
