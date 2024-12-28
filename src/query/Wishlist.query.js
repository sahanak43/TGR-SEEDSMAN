import { WishlistQuery as SourceWishlistQuery } from 'SourceQuery/Wishlist.query';

/** @namespace Seedsman/Query/Wishlist/Query */
export class WishlistQuery extends SourceWishlistQuery {
    _getWishlistFields() {
        const fields = super._getWishlistFields();
        fields.push('sharing_code');

        return fields;
    }
}

export default new WishlistQuery();
