import { createElement, lazy } from 'react';

import PageBuilderProducts from 'Component/PageBuilderProducts';

export const WidgetFactory = lazy(() => import(
    /* webpackMode: "lazy", webpackChunkName: "widget" */
    'Component/WidgetFactory'
));

export const addReplacementRule = (originalMember, instance) => ([
    ...originalMember,
    {
        query: { dataContentType: 'products' },
        replace: (domNode) => createElement(PageBuilderProducts, {
            elements: instance.toReactElements(
                [domNode],
                [{
                    name: 'PageBuilderProducts',
                    type: 'tag',
                    children: [
                        { name: 'CatalogProductWidget', type: 'tag' }
                    ]
                }]
            )
        })
    }
]);
export default {
    'Component/Html/Component': {
        'member-property': {
            rules: addReplacementRule
        }
    }
};
