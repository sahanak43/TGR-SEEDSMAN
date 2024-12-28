/* eslint-disable jsx-a11y/no-redundant-roles */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
import { lazy } from 'react';

import ClickOutside from 'Component/ClickOutside';
import CloseIcon from 'Component/CloseIcon';
import SearchIcon from 'Component/SearchIcon';
import {
    SearchField as SourceSearchField
} from 'SourceComponent/SearchField/SearchField.component';
import { scrollToTop } from 'Util/Browser';
import history from 'Util/History';
import { appendWithStoreCode } from 'Util/Url';

import './SearchField.override.style';

export const SearchOverlay = lazy(
    () => import(
        /* webpackMode: "lazy", webpackChunkName: "overlay" */
        'Component/SearchOverlay'
    )
);
/** @namespace Seedsman/Component/SearchField/Component */
export class SearchFieldComponent extends SourceSearchField {
    closeBtn = this.closeBtn.bind(this);

    onSearchEnterPress = this.onSearchEnterPress.bind(this);

    renderSearch() {
        const {
            searchCriteria,
            onSearchBarFocus,
            isActive,
            onSearchBarChange,
            onSearchOutsideClick,
            hideActiveOverlay,
            device: {
                isMobile
            }
        } = this.props;

        return (
            <div
              block="SearchField"
              elem="SearchInnerWrapper"
            >
                    <input
                      id="search-field"
                      ref={ this.searchBarRef }
                      block="SearchField"
                      elem="Input"
                      onFocus={ onSearchBarFocus }
                      onChange={ this.handleChange }
                      onKeyDown={ this.onSearchEnterPress }
                      value={ searchCriteria }
                      mods={ { isActive } }
                      placeholder="What are you looking for?"
                      autoComplete="off"
                      aria-label="Search"
                    />
                    <SearchOverlay
                      isHideOverlay={ !isMobile }
                      clearSearch={ this.clearSearch }
                      onSearchBarChange={ onSearchBarChange }
                      searchCriteria={ searchCriteria }
                      onSearchOutsideClick={ onSearchOutsideClick }
                      hideActiveOverlay={ hideActiveOverlay }
                    />
                     { this.renderSearchIcon() }
            </div>
        );
    }

    componentDidUpdate(prevProps) {
        const { isActive, device } = this.props;

        if (prevProps.isActive !== isActive && device.isMobile) {
            this.onIconClick();
        }
    }

    onSearchEnterPress(e) {
        const { searchCriteria, hideActiveOverlay, onSearchBarChange } = this.props;
        const search = encodeURIComponent(searchCriteria.trim().replace(/%/g, '%25'));
        const trimmedSearch = searchCriteria.trim();

        if (e.key === 'Enter' && trimmedSearch !== '') {
            history.push(appendWithStoreCode(`/search/${ search }`));
            hideActiveOverlay();
            onSearchBarChange({ target: { value: '' } });
            this.searchBarRef.current.blur();
            this.closeSearch();
            scrollToTop();
        }
    }

    closeBtn() {
        const {
            hideActiveOverlay, navigationState: { name }, goToPreviousNavigationState
        } = this.props;

        if (name === 'search') {
            hideActiveOverlay();
            goToPreviousNavigationState();
        }
    }

    renderSearchIcon() {
        const {
            device,
            isActive,
            onSearchBarFocus
        } = this.props;

        if (isActive) {
            return (
                <div
                  block="SearchField"
                  elem="CloseIcon"
                  role="button"
                  tabIndex="0"
                  onClick={ this.closeBtn }
                  aria-label="Close"
                >
                    <CloseIcon />
                </div>
            );
        }

        return (
            <button
              block="SearchField"
              elem="SearchIcon"
              role="button"
              tabIndex="0"
              onClick={ onSearchBarFocus }
              aria-label="Search"
            >
                <SearchIcon deviceType={ device } />
            </button>
        );
    }

    render() {
        const {
            isVisible,
            isActive
        } = this.props;

        return (
            <div block="SearchField" mods={ { isVisible, isActive } }>
                <ClickOutside onClick={ this.closeSearch }>
                    <div block="SearchField" elem="Wrapper">
                        { this.renderSearch() }
                    </div>
                </ClickOutside>
            </div>
        );
    }
}

export default SearchFieldComponent;
