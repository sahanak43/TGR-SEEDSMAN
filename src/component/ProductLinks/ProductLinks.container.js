import { connect } from 'react-redux';

import {
    mapDispatchToProps,
    mapStateToProps,
    ProductLinksContainer as SourceProductLinksContainer
} from 'SourceComponent/ProductLinks/ProductLinks.container';
import LinkedProductsReducer from 'Store/LinkedProducts/LinkedProducts.reducer';
import { withReducers } from 'Util/DynamicReducer';

/** @namespace Seedsman/Component/ProductLinks/Container */
export class ProductLinksContainer extends SourceProductLinksContainer {
    containerProps() {
        const {
            areDetailsLoaded,
            linkType,
            linkedProducts,
            numberOfProductsToDisplay,
            title,
            isPdp
        } = this.props;
        const {
            siblingsHaveBrands,
            siblingsHavePriceBadge,
            siblingsHaveTierPrice,
            siblingsHaveConfigurableOptions
        } = this.state;

        return {
            areDetailsLoaded,
            linkType,
            linkedProducts,
            numberOfProductsToDisplay,
            title,
            isPdp,
            productCardFunctions: {
                setSiblingsHaveBrands: () => this.setState({ siblingsHaveBrands: true }),
                setSiblingsHavePriceBadge: () => this.setState({ siblingsHavePriceBadge: true }),
                setSiblingsHaveTierPrice: () => this.setState({ siblingsHaveTierPrice: true }),
                setSiblingsHaveConfigurableOptions: () => this.setState({ siblingsHaveConfigurableOptions: true })
            },
            productCardProps: {
                siblingsHaveBrands,
                siblingsHavePriceBadge,
                siblingsHaveTierPrice,
                siblingsHaveConfigurableOptions
            }
        };
    }
}

export default withReducers({
    LinkedProductsReducer
})(connect(mapStateToProps, mapDispatchToProps)(ProductLinksContainer));
