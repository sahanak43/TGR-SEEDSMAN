/* eslint-disable max-lines */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
import PaginationLink from 'Component/PaginationLink';
import { Pagination as SourcePagination } from 'SourceComponent/Pagination/Pagination.component';

import './Pagination.override.style';

/** @namespace Seedsman/Component/Pagination/Component */
export class PaginationComponent extends SourcePagination {
    renderNextPageLink() {
        const {
            anchorTextNext,
            currentPage,
            totalPages
            // paginationFrame
        } = this.props;

        /*
        1. hide 'Next' button if current page is the last page
        2. hide 'Next' button if total number of pages doesn't exceed total number of pages to display
        (i.e. all pages are already shown)
         */
        if (currentPage > totalPages - 1) {
            return this.renderPageLink(
                currentPage + 1,
                'Next page',
                anchorTextNext || this.renderNextPageIcon(),
                false,
                true,
                'next'
            );
        }

        return this.renderPageLink(
            currentPage + 1,
            'Next page',
            anchorTextNext || this.renderNextPageIcon(true),
            false,
            false,
            'next'
        );
    }

    renderPrevPageIcon() {
        return (
            <div
              block="Pagination"
              elem="PreviousLink"
            >
                { this.renderPageIcon() }
                <div block="Pagination" elem="PreviousLinkText">
                    <span>Previous</span>
                </div>
            </div>
        );
    }

    renderNextPageIcon() {
        return (
            <div
              block="Pagination"
              elem="NextLink"
            >
                <div block="Pagination" elem="NextLinkText">
                    <span>Next</span>
                </div>
                { this.renderPageIcon(true) }
            </div>
        );
    }

    renderPageLink(
        pageNumber,
        label,
        children,
        isCurrent = false,
        isArrowInActive = false,
        Rel = ''
    ) {
        const {
            pathname,
            getSearchQuery
        } = this.props;

        return (
            <li
              key={ pageNumber }
              block="Pagination"
              elem="ListItem"
              rel={ Rel || 'nofollow' }
            >
                <PaginationLink
                  label={ label }
                  url_path={ pathname }
                  isCurrent={ isCurrent }
                  pageNumber={ pageNumber }
                  getSearchQueryForPage={ getSearchQuery }
                  isArrowInActive={ isArrowInActive }
                >
                    { children }
                </PaginationLink>
            </li>
        );
    }

    renderCurrentTotalPages() {
        const { currentPage, totalPages } = this.props;
        if (totalPages === 0) {
            return null;
        }

        return (
            <div block="Pagination" elem="totalPages">
                { `Page ${currentPage} of ${totalPages}` }
            </div>
        );
    }

    renderPreviousPageLink() {
        const {
            anchorTextPrevious,
            currentPage
            // paginationFrame,
            // totalPages
        } = this.props;

        /*
        1. hide 'Previous' button if current page is the first page
        2. hide 'Previous' button if total number of pages doesn't exceed total number of pages to display
        (i.e. all pages are already shown)
         */

        if (currentPage <= 1) {
            return this.renderPageLink(
                currentPage - 1,
                'Previous page',
                this.renderPrevPageIcon(true),
                false,
                true,
                'previous'
            );
        }

        return this.renderPageLink(
            currentPage - 1,
            'Previous page',
            anchorTextPrevious || this.renderPrevPageIcon(),
            false,
            false,
            'previous',
        );
    }

    render() {
        const {
            isLoading,
            totalPages,
            id,
            mix
        } = this.props;

        if (totalPages === 1) { // do not show pagination, if there are less then one page
            return <ul block="Pagination" />;
        }

        if (isLoading) {
            return this.renderPlaceholder();
        }

        return (
            <nav aria-label="List navigation">
                <div block="Pagination" elem="content">
                { this.renderCurrentTotalPages() }
                <div block="Pagination" elem="contentLink">
                    <ul block="Pagination" id={ id } mix={ mix }>
                        { this.renderPreviousPageLink() }
                        { this.renderFirstPageLink() }
                        { this.renderPreviousJump() }
                        { this.renderPageLinks() }
                        { this.renderNextJump() }
                        { this.renderLastPageLink() }
                        { this.renderNextPageLink() }
                    </ul>
                </div>
                </div>

            </nav>
        );
    }
}

export default PaginationComponent;
