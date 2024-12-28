/* eslint-disable react/boolean-prop-naming */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import ChevronIcon from 'Component/ChevronIcon';
import { LEFT, RIGHT } from 'Component/ChevronIcon/ChevronIcon.config';
import { MixType } from 'Type/Common.type';
import { range } from 'Util/Manipulations';

import './ProductReviewPagination.style.scss';

/** @namespace Seedsman/Component/ProductReviewPagination/Component */
export class ProductReviewPaginationComponent extends PureComponent {
    static propTypes = {
        totalPages: PropTypes.number.isRequired,
        firstFramePage: PropTypes.func.isRequired,
        lastFramePage: PropTypes.func.isRequired,
        currentPage: PropTypes.number.isRequired,
        id: PropTypes.string.isRequired,
        mix: MixType.isRequired,
        getProductsData: PropTypes.func.isRequired
    };

    renderPageLink(pageNumber, label, children, isCurrent) {
        const { getProductsData } = this.props;

        return (
            <li
              elem=" PaginationLink Pagination-ListItem "
              block={ label }
              mods={ { isCurrent } }
              aria-label={ label }
              onClick={ () => getProductsData(pageNumber) }
              onKeyDown={ () => getProductsData(pageNumber) }

            >
                { pageNumber }
            </li>
        );
    }

    renderPageIcon(isNext = false) {
        return (
            <ChevronIcon direction={ isNext ? RIGHT : LEFT } />
        );
    }

    renderFirstPageLink() {
        const { firstFramePage } = this.props;

        if (firstFramePage === 1) {
            return null;
        }

        return this.renderPageLink(
            1,
            __('Page %s', 1),
            '1',
        );
    }

    // displayed as '...' by default
    renderNextJump() {
        const {
            lastFramePage, totalPages
        } = this.props;
        const nextPageJump = 'dots';
        if (lastFramePage === totalPages - 1 || lastFramePage === totalPages) {
            return null;
        }

        return this.renderPageLink(
            '...',
            __('Page %s', nextPageJump),
            '...',
        );
    }

    renderLastPageLink() {
        const { totalPages, lastFramePage } = this.props;
        if (lastFramePage === totalPages) {
            return null;
        }

        return this.renderPageLink(
            totalPages,
            __('Page %s', totalPages),
            totalPages.toString(),
        );
    } // displayed as '...' by default

    renderPreviousJump() {
        const { firstFramePage } = this.props;

        if ((firstFramePage - 1) === 1 || firstFramePage === 1) {
            return null;
        }

        const prevPageJump = 'dots';

        return this.renderPageLink(
            '...',
            __('Page %s', prevPageJump),
            '...',
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

    renderPageLinks() {
        const {
            currentPage,
            firstFramePage,
            lastFramePage
        } = this.props;

        return range(firstFramePage, lastFramePage).map((page) => this.renderPageLink(
            page,
            __('Page %s', page),
            page.toString(),
            page === currentPage
        ));
    }

    render() {
        const {
            id,
            mix,
            totalPages
        } = this.props;

        if (!totalPages) {
            return null;
        }

        return (

            <nav aria-label="List navigation">
            <div className="Pagination-content">
            { this.renderCurrentTotalPages() }
            <div className="Pagination-contentLink">
            <ul block="Pagination" id={ id } mix={ mix }>
                { this.renderFirstPageLink() }
                { this.renderPreviousJump() }
                { this.renderPageLinks() }
                { this.renderNextJump() }
                { this.renderLastPageLink() }
            </ul>
            </div>
            </div>
            </nav>

        );
    }
}

export default ProductReviewPaginationComponent;
