/**
 * Mageplaza Product Label compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import { Field } from 'Util/Query';

/** @namespace Seedsman/@Scandiweb/MageplazaProductLabel/Query/MageplazaLabel/Query */
export class MageplazaLabelQuery {
    getQuery() {
        return new Field('mp_label_data')
            .addFieldList(this.getLabelFields());
    }

    getLabelFields() {
        return [
            'rule_id',
            'name',
            'enabled',
            'priority',
            'label_template',
            'label_image',
            'label',
            'label_color',
            'label_css',
            'label_font',
            'label_font_size',
            'label_position',
            'label_position_grid',
            'same',
            'limit',
            'list_template',
            'list_image',
            'list_label',
            'list_color',
            'list_css',
            'list_font',
            'list_font_size',
            'list_position',
            'list_position_grid',
            'product_tooltip',
            'list_product_tooltip'
        ];
    }
}

export default new MageplazaLabelQuery();
