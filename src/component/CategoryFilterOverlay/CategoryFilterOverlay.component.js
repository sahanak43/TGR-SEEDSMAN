/* eslint-disable max-len */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-undef */
import BackIcon from 'Component/BackIcon';
import Image from 'Component/Image';
import Overlay from 'Component/Overlay';
import {
    CategoryFilterOverlay as SourceCategoryFilterOverlay
} from 'SourceComponent/CategoryFilterOverlay/CategoryFilterOverlay.component';

import { CATEGORY_FILTER_OVERLAY_ID } from './CategoryFilterOverlay.config';

import './CategoryFilterOverlay.override.style.scss';

/** @namespace Seedsman/Component/CategoryFilterOverlay/Component */
export class CategoryFilterOverlayComponent extends SourceCategoryFilterOverlay {
    renderDefaultFilters() {
        return (
            <>
               <div block="CategoryFilterOverlay" elem="MainHeading">
               { this.renderHeading() }
                <div block="CategoryFilterOverlay" elem="ResetSection">
                    { this.renderResetButton() }
                </div>
               </div>
                { this.renderFilters() }
            </>
        );
    }

    renderContent() {
        const { totalPages, areFiltersEmpty, isProductsLoading } = this.props;

        if (!isProductsLoading && totalPages === 0) {
            return this.renderEmptyFilters();
        }

        if (areFiltersEmpty) {
            return this.renderMinimalFilters();
        }

        return (
            <>
                { this.renderFilterImg() }
                { /* { this.renderReview() } */ }
                { this.renderDefaultFilters() }
                { this.renderSeeResults() }
            </>
        );
    }

    renderHeading() {
        return (
            <h3
              block="CategoryFilterOverlay"
              elem="Heading"
            >
                Filters
            </h3>
        );
    }

    renderSeeResults() {
        const { onSeeResultsClick } = this.props;

        return (
            <div
              block="CategoryFilterOverlay"
              elem="SeeResults"
            >
                <button
                  block="CategoryFilterOverlay"
                  elem="Button"
                  mix={ { block: 'Button' } }
                  onClick={ onSeeResultsClick }
                >
                    APPLY
                </button>
            </div>
        );
    }

    renderFilterImg() {
        const { categoryImage, isSearchPage } = this.props;

        if (!categoryImage || isSearchPage) {
            return null;
        }

        return (
            <div block="CategoryFilterOverlay" elem="CategoryImage">
                    <Image
                      mix={ {
                          block: 'CategoryFilterOverlay',
                          elem: 'Picture'
                      } }
                      src={ categoryImage || '' }
                      ratio="custom"
                      objectFit="cover"
                    />
            </div>
        );
    }

    render() {
        const {
            onVisible,
            onHide,
            totalPages,
            isProductsLoading,
            isContentFiltered,
            isCategoryAnchor,
            isSearchPage,
            onSeeResultsClick,
            onResetButtonClick
        } = this.props;

        // show CategoryFilterOverlay for 1. categories marked as `anchor` in Magento admin 2. Search page
        if ((!isProductsLoading && totalPages === 0 && !isContentFiltered) || (!isCategoryAnchor && !isSearchPage)) {
            return (
                    <Overlay
                      onVisible={ onVisible }
                      onHide={ onHide }
                      mix={ { block: 'CategoryFilterOverlay' } }
                      id={ CATEGORY_FILTER_OVERLAY_ID }
                      isRenderInPortal={ false }
                    >
                        <div block="CategoryFilterOverlay" elem="Wrapper">
                            { this.renderFilterImg() }
                        </div>
                    </Overlay>
            );
        }

        return (
            <Overlay
              onVisible={ onVisible }
              onHide={ onHide }
              mix={ { block: 'CategoryFilterOverlay' } }
              id={ CATEGORY_FILTER_OVERLAY_ID }
              isRenderInPortal={ false }
            >
                <div block="CategoryFilterOverlay" elem="Wrapper">
                    <header block="CategoryFilterOverlay" elem="FilterHeader">
                            <div className="action-icons">
                                <button
                                  block="CategoryFilterOverlay"
                                  elem="BackButton"
                                  onClick={ onSeeResultsClick }
                                >
                                    <BackIcon />
                                </button>
                                <span>Filters</span>
                            </div>
                            <button onClick={ onResetButtonClick }>
                                Clear All
                            </button>
                    </header>
                    { this.renderContent() }
                    { this.renderLoader() }
                </div>
            </Overlay>
        );
    }
}

export default CategoryFilterOverlayComponent;
