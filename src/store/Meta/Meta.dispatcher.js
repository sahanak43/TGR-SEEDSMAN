import {
    MetaDispatcher as SourceMetaDispatcher
} from 'SourceStore/Meta/Meta.dispatcher';
import { updateMeta } from 'Store/Meta/Meta.action';
import { appendWithStoreCode } from 'Util/Url';

/**
 * Meta Dispatcher
 * @class MetaDispatcher
 * @namespace Seedsman/Store/Meta/Dispatcher */
export class MetaDispatcher extends SourceMetaDispatcher {
    /**
     * Set meta for category
     * @param {Object} category
     * @param {Function} dispatch
     * @memberof MetaDispatcher
     */
    updateWithCategory(category, dispatch) {
        const meta = this._getCategoryMeta(category);
        dispatch(updateMeta(meta));
    }

    /**
     * Set meta for product
     * @param {Object} product
     * @param {Function} dispatch
     * @memberof MetaDispatcher
     */
    updateWithProduct(product, dispatch) {
        const meta = this._getProductMeta(product);
        dispatch(updateMeta(meta));
    }

    /**
     * Get meta for product
     * @param {Object} product
     * @return {Object} Meta object
     * @memberof MetaDispatcher
     */
    _getProductMeta(product) {
        const {
            name = '',
            meta_title = '',
            meta_keyword,
            canonical_url,
            meta_description,
            image: { url } = {},
            open_graph_tags: {
                og_description,
                og_title,
                og_url,
                og_site_name
            } = {}
        } = product;

        const hasTitle = meta_title || name;

        return {
            description: meta_description,
            keywords: meta_keyword,
            title: hasTitle ? `${hasTitle} | Seedsman since 2002` : hasTitle,
            canonical_url: `${window.location.origin}${appendWithStoreCode(canonical_url)}`,
            OgDescription: og_description,
            OgTitle: og_title,
            OgUrl: og_url,
            OgImage: url,
            OgSiteName: og_site_name
        };
    }

    /**
     * Get meta for category
     * @param {Object} category
     * @return {Object} Meta object
     * @memberof MetaDispatcher
     */
    _getCategoryMeta(category) {
        const {
            description, name, canonical_url,
            meta_title, meta_keywords, meta_description,
            meta_robots = 'follow, index',
            image,
            open_graph_tags: {
                og_description,
                og_title,
                og_url,
                og_site_name
            } = {}
        } = category;

        return {
            description: meta_description || description,
            title: meta_title || name,
            keywords: meta_keywords,
            canonical_url,
            robots: meta_robots,
            OgDescription: og_description,
            OgTitle: og_title,
            OgUrl: og_url,
            OgSiteName: og_site_name,
            OgImage: `${window.location.origin}${appendWithStoreCode(image)}`
        };
    }

    /**
     * Set meta for CmsPage
     * @param {Object} CmsPage
     * @param {Function} dispatch
     * @memberof MetaDispatcher
     */
    updateWithCmsPage(CmsPage, dispatch) {
        const meta = this._getCmsPageMeta(CmsPage);
        dispatch(updateMeta(meta));
    }

    /**
     * Get meta for CmsPage
     * @param {Object} CmsPage
     * @return {Object} Meta object
     * @memberof MetaDispatcher
     */
    _getCmsPageMeta(CmsPage) {
        const {
            description, name, canonical_url,
            meta_title, meta_keywords, meta_description,
            open_graph_tags: {
                og_description,
                og_title,
                og_url,
                og_site_name
            } = {}
        } = CmsPage;

        return {
            description: meta_description || description,
            title: meta_title || name,
            keywords: meta_keywords,
            canonical_url: `${window.location.origin}${appendWithStoreCode(canonical_url)}`,
            OgDescription: og_description,
            OgTitle: og_title,
            OgUrl: og_url,
            OgSiteName: og_site_name
        };
    }
}

export default new MetaDispatcher();
