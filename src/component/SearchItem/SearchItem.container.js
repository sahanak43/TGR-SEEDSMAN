import { connect } from 'react-redux';

import {
    mapDispatchToProps as sourceMapDispatchToProps,
    mapStateToProps as sourceMapStateToProps,
    SearchItemContainer as SourceSearchItemContainer
} from 'SourceComponent/SearchItem/SearchItem.container';
import { goToPreviousNavigationState } from 'SourceStore/Navigation/Navigation.action';
import { TOP_NAVIGATION_TYPE } from 'SourceStore/Navigation/Navigation.reducer';

import SearchItem from './SearchItem.component';

/** @namespace Seedsman/Component/SearchItem/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    ...sourceMapDispatchToProps(dispatch),
    goToPreviousNavigationState: () => dispatch(goToPreviousNavigationState(TOP_NAVIGATION_TYPE))
});

/** @namespace Seedsman/Component/SearchItem/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    ...sourceMapStateToProps(state),
    activeOverlay: state.OverlayReducer.activeOverlay,
    navigationState: state.NavigationReducer[TOP_NAVIGATION_TYPE].navigationState
});

/** @namespace Seedsman/Component/SearchItem/Container */
export class SearchItemContainer extends SourceSearchItemContainer {
    containerProps() {
        const {
            product, dataInXSearchRelatedTerms,
            dataInXSearchRecentSearch, dataInXSearchCategories
        } = this.props;

        return {
            product,
            linkTo: this.getLinkTo(),
            imgSrc: this.getImgSrc(),
            customAttribute: this.getCustomAttribute(),
            dataInXSearchRelatedTerms,
            dataInXSearchRecentSearch,
            dataInXSearchCategories
        };
    }

    getImgSrc() {
        const {
            product: {
                thumbnail: { url } = {},
                image: { url: imgUrl } = {}
            }
        } = this.props;

        return url || imgUrl;
    }

    render() {
        return (
            <SearchItem
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchItemContainer);
