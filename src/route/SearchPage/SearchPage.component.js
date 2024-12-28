/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
import CategoryPage from 'Route/CategoryPage/CategoryPage.component';
import { isCrawler, isSSR } from 'Util/Browser';
import { decodeString } from 'Util/Common';

/** @namespace Seedsman/Route/SearchPage/Component */
export class SearchPageComponent extends CategoryPage {
    renderCmsBlock() {
        return null;
    }

    renderSearchHeading() {
        const { search } = this.props;

        return (
            <h1
              block="CategoryDetails"
              elem="Heading"
              mix={ {
                  block: 'SearchPage',
                  elem: 'Heading'
              } }
            >
                Search results for:
                <span>{ decodeString(search) }</span>
            </h1>
        );
    }

    renderSort(mods) {
        const { isMobile } = this.props;
        const isLandingPage = mods;

        return (
            <div block="CategoryPage" elem="MiscellaneousLayoutWrapper" mods={ { isLandingPage } }>
                <div
                  block="CategoryPage"
                  elem="LayoutWrapper"
                  mods={ { isPrerendered: isSSR() || isCrawler() } }
                >
                    { this.renderLayoutButtons() }
                    { !isMobile ? this.renderCategorySort() : null }
                </div>
            </div>
        );
    }

    renderCategoryDetails() {
        return (
            <article block="CategoryDetails">
                <div block="CategoryDetails" elem="Description">
                    { this.renderSearchHeading() }
                    { this.renderItemsCount(true) }
                </div>
                { this.renderSort() }
            </article>
        );
    }
}

export default SearchPageComponent;
