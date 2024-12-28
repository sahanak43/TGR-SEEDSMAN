/* eslint-disable no-magic-numbers */
/* eslint-disable default-case */
import { Field } from 'Util/Query';

/**
 * @class Affiliate
 * @namespace Seedsman/Query/Affiliate/Query */
export class AffiliateQuery {
    getAffiliateCookies() {
        return new Field('set_cookie')
            .addFieldList(this.getAffiliateCookiesList());
    }

    /**
     * @returns { Object } items fields
     */

    getAffiliateCookiesList() {
        return [
            'tag_id',
            'url'
        ];
    }
}
export default new AffiliateQuery();
