/**
 * Mageplaza Product Label compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import { Field } from 'Util/Query';

/** @namespace Seedsman/@Scandiweb/MageplazaProductLabel/Query/MageplazaConfig/Query */
export class MageplazaConfigQuery {
    getQuery() {
        return new Field('mpProductLabelsConfig')
            .addFieldList(this.getConfigFields());
    }

    getConfigFields() {
        return [
            'isShowLabelsRelatedProducts',
            'isShowLabelsUpsellProducts',
            'isShowLabelsCrossSellProducts'
        ];
    }
}

export default new MageplazaConfigQuery();
