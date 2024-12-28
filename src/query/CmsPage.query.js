import { CmsPageQuery as SourceCmsPageQuery } from 'SourceQuery/CmsPage.query';
import { Field } from 'Util/Query';

/**
  * CMS Page Query
  * @class CmsPageQuery
  * @namespace Seedsman/Query/CmsPage/Query */
export class CmsPageQuery extends SourceCmsPageQuery {
    /**
      * get CMS Page query
      * @param  {{url_key: String, title: Int, content: String, content_heading: String, page_layout: String, meta_title: String, meta_description: String, meta_keywords, string}} options A object containing different aspects of query, each item can be omitted
      * @return {Query} CMS Page query
      * @memberof CmsPageQuery
      */
    getQuery({ id, url_key, identifier }) {
        if (!id && !url_key && !identifier) {
            throw new Error('Missing argument `id` or `url_key`!');
        }

        const cmsPage = new Field('cmsPage')
            .addFieldList(this._getPageFields())
            .addField(this._getOGData());

        if (identifier) {
            cmsPage.addArgument('identifier', 'String!', identifier);
        } else if (id) {
            cmsPage.addArgument('id', 'Int!', id);
        }

        return cmsPage;
    }

    _getOGData() {
        return new Field('open_graph_tags')
            .addFieldList(this._getOGMetaData());
    }

    _getOGMetaData() {
        return [
            'og_description',
            'og_site_name',
            'og_title',
            'og_url'
        ];
    }
}

export default new CmsPageQuery();
