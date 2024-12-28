import ProductListQuery from 'Query/ProductList.query';
import { Field } from 'Util/Query';
/** @namespace Seedsman/Query/SeedsFinder/Query */
export class SeedsFinderQuery {
    getSeedsQuestions() {
        return new Field('seeds')
            .addFieldList([
                'attribute_code',
                'sequence',
                'title',
                'sub_title'
            ])
            .addField(this.getOptionFields());
    }

    getOptionFields() {
        return new Field('options')
            .addFieldList([
                'attribute_code',
                'attribute_label',
                'attribute_option',
                'attribute_option_label',
                'description',
                'image',
                'image_url',
                'seeds_id',
                'status'
            ]);
    }

    /**
     *
     * @param {sequence, attributeId, attributeCode}
     * @returns
     */
    getNextStepDetails({ sequence, attributeId, attributeCode }) {
        return new Field('seedsFinderOptionData')
            .addArgument('sequence', 'String', sequence)
            .addArgument('attributeId', 'String', attributeId)
            .addArgument('attributeCode', 'String', attributeCode)
            .addField(this.getOptionFields());
    }

    /**
     *
     * @param {attributeId, attributeCode}
     * @returns
     */
    getProductListQuery({ attributeId, attributeCode }) {
        return new Field('seedsFinderProductList')
            .addArgument('attributeId', 'String', attributeId)
            .addArgument('attributeCode', 'String', attributeCode)
            .addField(this.getItemsField());
    }

    getPartialProductList({ attributeId, attributeCode }) {
        return new Field('seedsFinderPartialProductList')
            .addArgument('attributeId', 'String', attributeId)
            .addArgument('attributeCode', 'String', attributeCode)
            .addField(this.getItemsField());
    }

    getItemsField() {
        return new Field('items')
            .addFieldList(
                ProductListQuery._getProductInterfaceFields(false, false, true, true),
            );
    }
}
export default new SeedsFinderQuery();
