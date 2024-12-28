import {
    CategoryQuery as SourceCategoryQuery
} from 'SourceQuery/Category.query';
import { Field } from 'Util/Query';
/** @namespace Seedsman/Query/Category/Query */
export class CategoryQuery extends SourceCategoryQuery {
    getQuery(options = {}) {
        this.options = options;

        return new Field('category')
            .addArgument(...this._getConditionalArguments())
            .addFieldList(this._getDefaultFields())
            .addField(this._getChildrenFields())
            .addField(this._getOGData());
    }

    _getDefaultFields() {
        const fields = super._getDefaultFields();
        fields.push(
            'additional_description',
            'children_count',
            this._getBreadcrumbsField(),
            this._getSubChildrenField()
        );

        return fields;
    }

    _getSubChildrenField() {
        return new Field('children')
            .addFieldList(this._getSubChildrenFields());
    }

    _getSubChildrenFields() {
        return [
            'children_count',
            'name',
            // 'description',---commented to reduce the load time of Category list widget
            'category_icon',
            'show_in_widget',
            'url'
        ];
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

export default new CategoryQuery();
