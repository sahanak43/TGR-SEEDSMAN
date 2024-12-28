import { Field } from 'Util/Query';

/** @namespace Seedsman/Query/PostAffiliatePro/Query */
export class PostAffiliateProQuery {
    getQuery() {
        return new Field('getPostAffiliate')
            .addFieldList([
                'application_url',
                'account_id',
                'track_click'
            ]);
    }
}

export default new PostAffiliateProQuery();
