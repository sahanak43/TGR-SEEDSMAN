/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
// import ProductCard from 'Component/ProductCard';
import { Subscribe } from 'unstated';

import SearchOverlayProductCard from 'Component/SearchOverlayProductCard';
import SharedTransitionContainer from 'Component/SharedTransition/SharedTransition.unstated';
import TextPlaceholder from 'Component/TextPlaceholder';
import Link from 'SourceComponent/Link';
import {
    SearchOverlay as SourceSearchOverlay
} from 'SourceComponent/SearchOverlay/SearchOverlay.component';
import { scrollToTop } from 'Util/Browser';
import history from 'Util/History';
import { appendWithStoreCode } from 'Util/Url';

import {
    AMOUNT_OF_PLACEHOLDERS,
    SEARCH_TIMEOUT
} from './SearchOverlay.config';

import './SearchOverlay.override.style';
import './XsearchOverlay.style';

/** @namespace Seedsman/Component/SearchOverlay/Component */
export class SearchOverlayComponent extends SourceSearchOverlay {
    state = {
        itemsToShow: 3
    };

    handleViewAll = this.handleViewAll.bind(this);

    // eslint-disable-next-line @scandipwa/scandipwa-guidelines/only-render-in-component
    componentDidUpdate(prevProps) {
        const { searchCriteria: prevSearchCriteria } = prevProps;
        const {
            searchCriteria, clearSearchResults, makeSearchRequest
        } = this.props;

        if (searchCriteria !== prevSearchCriteria) {
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
            clearSearchResults();
            this.timeout = setTimeout(() => {
                this.timeout = null;
                makeSearchRequest();
            }, SEARCH_TIMEOUT);
        }
    }

    // eslint-disable-next-line @scandipwa/scandipwa-guidelines/only-render-in-component
    handleViewAll() {
        const { searchCriteria, hideActiveOverlay } = this.props;
        const search = encodeURIComponent(searchCriteria.trim().replace(/%/g, '%25'));
        const trimmedSearch = searchCriteria.trim();
        if (trimmedSearch !== '') {
            history.push(appendWithStoreCode(`/search/${ search }`));
            hideActiveOverlay();
            scrollToTop();
        }
    }

    renderSearchResults() {
        const { searchResults, isLoading } = this.props;

        if (!searchResults.length && !isLoading && !this.timeout) {
            return this.renderNoResults();
        }

        const resultsToRender = (isLoading || this.timeout) ? Array(AMOUNT_OF_PLACEHOLDERS).fill({}) : searchResults;

        return this.renderSearchOverlayContainer(resultsToRender);
    }

    renderSearchOverlayContainer(resultsToRender) {
        return (
            <div block="Xsearch" elem="Container">
                { this.renderXsearchTabDetails() }
                { this.renderXsearchProductCards(resultsToRender) }
            </div>
        );
    }

    renderXsearchProductCards(resultsToRender) {
        const { itemsToShow } = this.state;

        if (!resultsToRender) {
            return null;
        }

        return (
            <div block="Xsearch" elem="Container-products">
                <div block="Xsearch" elem="Container-products-heading">Product Suggestions</div>
                <ul block="Xsearch" elem="Container-products-container">
                    { resultsToRender.slice(0, itemsToShow).map((item, i) => this.renderSearchCard(item, i)) }
                </ul>
                <button block="Xsearch" elem="Container-products-viewAll" onClick={ this.handleViewAll }>
                    <p>
                    View All
                    </p>
                </button>
            </div>
        );
    }

    renderSearchCard(product, i) {
        const { isLoading } = this.props;

        return (
            <Subscribe to={ [SharedTransitionContainer] }>
            { ({ registerSharedElement }) => (
                <SearchOverlayProductCard
                  product={ product }
                  key={ i }
                  imageShow
                  isSearchPageCard
                  isLoading={ isLoading }
                  registerSharedElement={ registerSharedElement }
                />
            ) }
            </Subscribe>
        );
    }

    renderXsearchCategories(data) {
        return (
            <div block="Xsearch" elem="Container-details-tab search-categories">
                <Link className="Xsearch-Container-details-tab-block" to={ `/${data.url}` }>
                    { this.renderXsearchNames(data.name) }
                    { this.renderXsearchCount(data.product_count) }
                </Link>
            </div>
        );
    }

    renderXsearchRecentItems(data) {
        const { isLoading } = this.props;

        if (isLoading) {
            return <TextPlaceholder />;
        }

        return (
            <div block="Xsearch" elem="Container-details-tab-recent-items">
                <Link className="Xsearch-Container-details-tab-block-recent-items" to={ `/search/${data.name}` }>
                    { data.name }
                </Link>
            </div>
        );
    }

    renderXsearchTabDetails() {
        const { xSearchRelatedTerms, XSearchRecentSearch, XSearchCategories } = this.props;

        return (
            <div block="Xsearch" elem="Container-details">
                { xSearchRelatedTerms?.length > 0
                    ? (
                        <>
                        <div block="Xsearch" elem="Container-details-block-heading">Top Suggestions</div>
                        <div block="Xsearch" elem="Container-details-block related-terms-block">
                            { xSearchRelatedTerms.map((item) => this.renderXsearchRelatedTerms(item)) }
                        </div>
                        </>
                    )
                    : null }

                { XSearchRecentSearch.length > 0
                    ? (
                <div block="Xsearch" elem="Container-details-block recent-items-block">
                    <div block="Xsearch" elem="Container-details-block-heading">Recent Searches</div>
                    <div block="Xsearch" elem="Container-details-block-content">
                        { XSearchRecentSearch.map((item) => this.renderXsearchRecentItems(item)) }
                    </div>
                </div>
                    )
                    : null }
                { XSearchCategories.length > 0
                    ? (
                        <div block="Xsearch" elem="Container-details-block search-categories-block">
                            <div block="Xsearch" elem="Container-details-block-heading">Categories</div>
                            { XSearchCategories.map((item) => this.renderXsearchCategories(item)) }
                        </div>
                    )
                    : null }
            </div>
        );
    }

    renderXsearchRelatedTerms(data) {
        return (
            <div block="Xsearch" elem="Container-details-tab related-terms">
                <Link className="Xsearch-Container-details-tab-block" to={ `/search/${data.name}` }>
                    { this.renderXsearchNames(data.name) }
                    { this.renderXsearchCount(data.count) }
                </Link>
            </div>
        );
    }

    renderXsearchNames(name) {
        const { isLoading } = this.props;

        if (isLoading) {
            return <TextPlaceholder />;
        }

        return (
            <div block="Xsearch" elem="Container-details-name">
                { name }
            </div>
        );
    }

    renderXsearchCount(count) {
        const { isLoading } = this.props;

        if (isLoading) {
            return <TextPlaceholder />;
        }

        return (
            <div block="Xsearch" elem="Container-details-count">
                { count }
            </div>
        );
    }
}

export default SearchOverlayComponent;
