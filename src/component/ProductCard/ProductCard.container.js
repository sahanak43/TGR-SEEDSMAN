import { connect } from 'react-redux';

import {
    mapDispatchToProps,
    mapStateToProps as sourceMapStateToProps, ProductCardContainer as ParentProductCardContainer
} from 'SourceComponent/ProductCard/ProductCard.container';
import { getSmallImage } from 'Util/Product/Extract';

/** @namespace Seedsman/Component/ProductCard/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    ...sourceMapStateToProps(state),
    baseLinkUrl: state.ConfigReducer.base_link_url || '',
    productUsesCategories: state.ConfigReducer.product_use_categories || false,
    categoryUrlSuffix: state.ConfigReducer.category_url_suffix,
    enableRatings: state.ConfigReducer.plp_enable,
    ratingWidgetUrl: state.ConfigReducer.reviews_url
});

/** @namespace Seedsman/Component/ProductCard/Container */
export class ProductCardContainer extends ParentProductCardContainer {
    containerProps() {
        const {
            children,
            mix,
            layout,
            hideCompareButton,
            hideWishlistButton,
            isLoading,
            renderContent,
            product,
            enableRatings,
            ratingWidgetUrl
        } = this.props;

        return {
            ...super.containerProps(),
            children,
            hideCompareButton,
            hideWishlistButton,
            isLoading,
            layout,
            mix,
            renderContent,
            enableRatings,
            ratingWidgetUrl,
            thumbnail: getSmallImage(product),
            linkTo: this.getLinkTo()
        };
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductCardContainer);
