/**
 * Adobe Data Services compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import { Field } from 'Util/Query';

/** @namespace Scandiweb/AdobeDataServices/Query/DataServicesConfig/Query */
export class DataServicesConfigQuery {
    getDataServicesConfigField() {
        return new Field('dataServicesConfig')
            .addFieldList(this.getDataServicesConfigFields());
    }

    getDataServicesConfigFields() {
        return [
            'version',
            'storeUrl',
            'websiteId',
            'websiteCode',
            'storeId',
            'storeCode',
            'storeViewId',
            'storeViewCode',
            'websiteName',
            'storeName',
            'storeViewName',
            'baseCurrencyCode',
            'storeViewCurrencyCode',
            'catalogExtensionVersion',
            'environmentId',
            'environment'
        ];
    }
}

export default new DataServicesConfigQuery();
