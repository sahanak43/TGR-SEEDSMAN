import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {
    CategoryConfigurableAttributesContainer as SourceCategoryConfigurableAttributesContainer,
    mapDispatchToProps as sourceMapDispatchToProps,
    mapStateToProps as sourceMapStateToProps
} from 'SourceComponent/CategoryConfigurableAttributes/CategoryConfigurableAttributes.container';

/** @namespace Seedsman/Component/CategoryConfigurableAttributes/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    ...sourceMapStateToProps(state)
});

/** @namespace Seedsman/Component/CategoryConfigurableAttributes/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    ...sourceMapDispatchToProps(dispatch)
    // TODO extend mapDispatchToProps
});

/** @namespace Seedsman/Component/CategoryConfigurableAttributes/Container */
export class CategoryConfigurableAttributesContainer extends SourceCategoryConfigurableAttributesContainer {
    containerProps() {
        const {
            currencyCode,
            showProductCount,
            childrenCategories,
            location
        } = this.props;

        return {
            currencyCode,
            showProductCount,
            childrenCategories,
            location,
            ...super.containerProps()
        };
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CategoryConfigurableAttributesContainer));
