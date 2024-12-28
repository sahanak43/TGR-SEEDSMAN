import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import {
    CategoryFilterOverlayContainer as SourceCategoryFilterOverlayContainer,
    mapDispatchToProps as sourceMapDispatchToProps,
    mapStateToProps as sourceMapStateToProps
} from 'SourceComponent/CategoryFilterOverlay/CategoryFilterOverlay.container';
import { setQueryParams } from 'Util/Url';

/** @namespace Seedsman/Component/CategoryFilterOverlay/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    ...sourceMapStateToProps(state)
    // TODO extend mapStateToProps
});

/** @namespace Seedsman/Component/CategoryFilterOverlay/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    ...sourceMapDispatchToProps(dispatch)
    // TODO extend mapDispatchToProps
});

/** @namespace Seedsman/Component/CategoryFilterOverlay/Container */
export class CategoryFilterOverlayContainer extends SourceCategoryFilterOverlayContainer {
    containerFunctions = {
        onSeeResultsClick: this.onSeeResultsClick.bind(this),
        toggleCustomFilter: this.toggleCustomFilter.bind(this),
        getFilterUrl: this.getCustomFilterUrl.bind(this),
        onVisible: this.onVisible.bind(this),
        onHide: this.onHide.bind(this),
        onResetButtonClick: this.onResetButtonClick.bind(this)
    };

    onResetButtonClick() {
        const { location, history } = this.props;

        setQueryParams({
            customFilters: '',
            page: ''
        }, location, history);
    }

    containerProps() {
        const {
            availableFilters,
            customFiltersValues,
            isCategoryAnchor,
            isInfoLoading,
            isMatchingInfoFilter,
            isProductsLoading,
            isSearchPage,
            totalPages,
            categoryImage
        } = this.props;

        return {
            availableFilters,
            isCategoryAnchor,
            isInfoLoading,
            isProductsLoading,
            isMatchingInfoFilter,
            isSearchPage,
            totalPages,
            customFiltersValues,
            areFiltersEmpty: this.getAreFiltersEmpty(),
            isContentFiltered: this.isContentFiltered(),
            categoryImage
        };
    }
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(CategoryFilterOverlayContainer)
);
