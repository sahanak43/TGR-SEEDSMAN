/* eslint-disable no-magic-numbers */
/* eslint-disable default-case */
import { Field } from 'Util/Query';

/**
 * @class BlogPosts
 * @namespace Seedsman/Query/BlogPosts/Query */
export class BlogPostsQuery {
    getMpBlogCategories() {
        return new Field('mpBlogCategories')
            .addArgument('action', 'String!', 'get_category_list')
            .addArgument('filter', 'CategoriesFilterInput!', { level: { eq: '1' } })
            .addArgument('pageSize', 'Int!', 40)
            .addArgument('currentPage', 'Int!', 1)
            .addField(this.getItemsField());
    }

    /**
     * @returns { Object } items field
     */
    getItemsField() {
        return new Field('items')
            .addFieldList(this.getBlogItemsFields());
    }

    getBlogItemsCategoriesFields() {
        return new Field('categories')
            .addField(this.getCatBlogItemsFields());
    }

    getBlogItemspostNameFields() {
        return ['name'];
    }

    getCatBlogItemsFields() {
        return new Field('items')
            .addFieldList(this.getCatBlogItemFields());
    }

    getCatBlogItemFields() {
        return [
            'name'
        ];
    }

    /**
     * @returns { Object } items fields
     */
    getBlogItemsFields() {
        return [
            'category_id',
            'children_count',
            'created_at',
            'description',
            'enabled',
            'import_source',
            'level',
            'name',
            'parent_id',
            'path',
            'position',
            'store_ids',
            'updated_at',
            'url_key'
        ];
    }

    getItemsPostField() {
        return new Field('items')
            .addFieldList(this.getBlogPostItemsFields())
            .addField(this.getBlogItemsCategoriesFields())
            .addFieldList(this.getBlogItemspostNameFields());
    }

    getPageInfoField() {
        return new Field('pageInfo')
            .addFieldList(this.getPageInfoFields());
    }

    getPageInfoFields() {
        return [
            'currentPage',
            'endPage',
            'hasNextPage',
            'hasPreviousPage',
            'pageSize',
            'startPage'
        ];
    }

    getTotalCountFields() {
        return ['total_count'];
    }

    getBlogPostItemsFields() {
        return [
            'allow_comment',
            'author_id',
            'author_name',
            'author_url',
            'author_url_key',
            'post_content',
            'name',
            'short_description',
            'created_at',
            'updated_at',
            'url_key',
            'view_traffic',
            'image',
            'meta_description',
            'meta_keywords',
            'meta_title',
            'meta_robots'
        ];
    }

    getSinglePost(catUrl) {
        return new Field('mpBlogPosts')
            .addArgument('action', 'String!', 'get_post_list')
            .addArgument('filter', 'PostsFilterInput!', { url_key: { eq: catUrl } })
            .addField(this.getItemsPostField());
    }

    getSearchPost(catUrl, currentPage, pageSize = 6) {
        return new Field('mpBlogPosts')
            .addArgument('action', 'String!', 'get_post_list')
            .addArgument('filter', 'PostsFilterInput!', { name: { like: `%${catUrl}%` } })
            .addArgument('pageSize', 'Int!', pageSize)
            .addArgument('sortBy', 'String!', 'Latest')
            .addArgument('currentPage', 'Int!', currentPage)
            .addField(this.getItemsPostField())
            .addField(this.getPageInfoField())
            .addFieldList(this.getTotalCountFields());
    }

    getMpPostList(currPage = 1, pageSize = 6) {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const hours = currentDate.getHours().toString().padStart(2, '0');
        const minutes = currentDate.getMinutes().toString().padStart(2, '0');
        const seconds = currentDate.getSeconds().toString().padStart(2, '0');
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        return new Field('mpBlogPosts')
            .addArgument('action', 'String!', 'get_post_list')
            .addArgument('pageSize', 'Int!', pageSize)
            .addArgument('sortBy', 'String!', 'Latest')
            .addArgument('currentPage', 'Int!', currPage)
            .addArgument('filter', 'PostsFilterInput!', { publish_date: { lteq: formattedDate } })
            .addField(this.getItemsPostField())
            .addField(this.getPageInfoField())
            .addFieldList(this.getTotalCountFields());
    }

    getMpBlogPosts(catUrl = '', currPage = 1) {
        return new Field('mpBlogPosts')
            .addArgument('action', 'String!', 'get_post_by_categoryKey')
            .addArgument('categoryKey', 'String!', catUrl)
            .addArgument('pageSize', 'Int!', 6)
            .addArgument('sortBy', 'String!', 'Latest')
            .addArgument('currentPage', 'Int!', currPage)
            .addField(this.getItemsPostField())
            .addField(this.getPageInfoField())
            .addFieldList(this.getTotalCountFields());
    }
}

export default new BlogPostsQuery();
