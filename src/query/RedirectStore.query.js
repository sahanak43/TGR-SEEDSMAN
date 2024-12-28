import { Field } from 'SourceUtil/Query';

/**
 * Ordered Summary Query
 * @class OrderedSummaryQuery
 * @namespace Seedsman/Query/RedirectStore/Query */
export class RedirectStoreQuery {
    getLanguageSwitchUrl(input) {
        return new Field('getLanguageSwitchUrl')
            .addArgument('input', 'langSwtichInput!', input)
            .addField('url');
    }

    getCustomUrlRewrites(url_key) {
        return new Field('geturlrewrites')
            .addArgument('url_key', 'String', url_key)
            .addFieldList([
                'eu_en',
                'eu_fr',
                'eu_es',
                'eu_it',
                'eu_de',
                'eu_nl',
                'uk_en',
                'us_en',
                'za_en'
            ]);
    }
}

export default new RedirectStoreQuery();
