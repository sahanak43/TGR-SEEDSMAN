/* eslint-disable max-lines */
/* eslint-disable no-magic-numbers */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable max-len */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import CmsBlock from 'Component/CmsBlock';
import Link from 'Component/Link';
import MenuItem from 'Component/MenuItem';
import { CUSTOMER_ACCOUNT_OVERLAY_KEY } from 'Component/MyAccountOverlay/MyAccountOverlay.config';
import PopupSuspense from 'Component/PopupSuspense';
import {
    Menu as SourceMenu
} from 'SourceComponent/Menu/Menu.component';
import { isSignedIn } from 'Util/Auth';
import { getSortedItems } from 'Util/Menu';

import './Menu.override.style';

/** @namespace Seedsman/Component/Menu/Component */
export class MenuComponent extends SourceMenu {
    renderFirstLevel(item) {
        const { item_id } = item;
        const { onMenuCloseClick, device: { isMobile } } = this.props;

        return (
            <>
            <li
              block="Menu"
              elem="Item"
              key={ item_id }
              onClick={ isMobile && onMenuCloseClick }
            >
                { this.renderFirstLevelItems.call(this, item) }
            </li>
            </>
        );
    }

    renderSubMenuDesktopItems(item) {
        const { item_id, children, cms_block_identifier } = item;

        if (!Object.keys(children).length) {
            return null;
        }
        const { activeMenuItemsStack, closeMenu } = this.props;
        const isVisible = activeMenuItemsStack.includes(item_id);

        if (!isVisible) {
            return null;
        }

        return (
            <div
              block="Menu"
              elem="SubCategoriesWrapper"
              mods={ { isVisible } }
              key={ item_id }
            >
                <div
                  block="Menu"
                  elem="SubCategoriesWrapperInner"
                  mods={ { isVisible } }
                >
                    <div
                      block="Menu"
                      elem="SubCategories"
                    >
                        { this.renderSubLevel(item) }
                    </div>
                    <CmsBlock key={ cms_block_identifier } identifier={ cms_block_identifier } />
                    { this.renderAdditionalInformation() }
                </div>
                <div
                  block="Menu"
                  elem="Overlay"
                  mods={ { isVisible } }
                  onMouseEnter={ closeMenu }
                />
            </div>
        );
    }

    renderSubLevel(category, isSecondLevel = false) {
        const { activeMenuItemsStack } = this.props;
        const { item_id } = category;
        const isVisible = activeMenuItemsStack.includes(item_id);
        const subcategoryMods = { type: 'subcategory' };

        return (
            <div
              block="Menu"
              elem="SubMenu"
              mods={ { isVisible } }
              key={ item_id }
            >
                <div
                  block="Menu"
                  elem="ItemList"
                  mods={ { ...subcategoryMods } }
                >  { this.renderMenuItems(category, isSecondLevel) }
                </div>

            </div>
        );
    }

    renderMenuItems(category, isSecondLevel = false) {
        const { activeMenuItemsStack, device, onMenuCloseClick } = this.props;
        const { children, title } = category;
        const childrenArray = getSortedItems(Object.values(children));
        const subcategoryMods = { type: 'subcategory' };

        return (
            <>
            { device.isMobile && (
                <MenuItem
                  activeMenuItemsStack={ activeMenuItemsStack }
                  item={ { ...category, title: __('All %s', title) } }
                  itemMods={ { ...subcategoryMods, isSecondLevel } }
                  isLink
                  onMenuCloseClick={ onMenuCloseClick }
                />
            ) }
            { childrenArray.map((item) => this.renderSubLevelItems(item, isSecondLevel)) }
            </>
        );
    }

    renderSubLevelItems(item, isSecondLevel) {
        const {
            handleSubcategoryClick,
            activeMenuItemsStack,
            onCategoryHover,
            closeMenu,
            onMenuCloseClick,
            device
        } = this.props;

        const { item_id, children } = item;

        const childrenArray = Object.values(children);
        const subcategoryMods = { type: 'subcategory', isSecondLevel };

        if (childrenArray.length && device.isMobile) {
            return (
                <div
                  key={ item_id }
                  // TODO: split into smaller components
                  // eslint-disable-next-line react/jsx-no-bind
                  onClick={ (e) => handleSubcategoryClick(e, item) }
                  tabIndex="0"
                  role="button"
                >
                    <MenuItem
                      activeMenuItemsStack={ activeMenuItemsStack }
                      item={ item }
                      itemMods={ { ...subcategoryMods, isExpanded: activeMenuItemsStack.includes(item_id) } }
                      onCategoryHover={ onCategoryHover }
                      closeMenu={ closeMenu }
                      isExpandable
                    />
                    { this.renderSubLevel(item) }
                </div>
            );
        }

        return (

             <div
               block="Menu"
               elem="SubItemWrapper"
               key={ item_id }
               onClick={ this.stopPropagation }
               role="button"
               tabIndex="-1"
             >
               <MenuItem
                 activeMenuItemsStack={ activeMenuItemsStack }
                 item={ item }
                 itemMods={ subcategoryMods }
                 onMenuCloseClick={ onMenuCloseClick }
                 isLink
               />

                { this.renderDesktopSubLevel(item) }
             </div>

        );
    }

    renderTopLevel() {
        const { menu, device: { isMobile } } = this.props;
        const categoryArray = Object.values(menu);

        if (!categoryArray.length) {
            return null;
        }

        const [{ children, title: mainCategoriesTitle }] = categoryArray;
        const childrenArray = getSortedItems(Object.values(children));

        return (
            <>
                <div block="Menu" elem="MainCategories">
                    { !isMobile && this.renderAdditionalInformation(true) }
                    <ul
                      block="Menu"
                      elem="ItemList"
                      mods={ { type: 'main' } }
                      aria-label={ mainCategoriesTitle }
                    >
                        { childrenArray.map(this.renderFirstLevel.bind(this)) }

                    </ul>
                </div>
                { this.renderSubMenuDesktop(children) }
            </>
        );
    }

    renderAccountOverlayFallback() {
        return (
            <PopupSuspense
              actualOverlayKey={ CUSTOMER_ACCOUNT_OVERLAY_KEY }
            />
        );
    }

    renderHeaderSection() {
        const { device: { isMobile }, customer: { firstname, lastname }, onMenuCloseClick } = this.props;

        if (!isMobile) {
            return null;
        }

        return (
            <div block="Menu" elem="ProfileSection">
                <div block="Profile">{ isSignedIn() ? (<>{ firstname } { lastname }</>) : (<>Welcome</>) }</div>
                <div block="LoginSection">
                    { isSignedIn() ? '' : (<Link to="/customer/account/login" onClick={ onMenuCloseClick }>Login or SignUp</Link>) }
                </div>
            </div>
        );
    }

    render() {
        const {
            closeMenu, renderIcons, isCheckout, device: { isMobile }
        } = this.props;

        if (isCheckout && !isMobile) {
            return null;
        }

        return (
            <div
              block="Menu"
              elem="MenuWrapper"
              onMouseLeave={ closeMenu }
            >
                { this.renderHeaderSection() }
                { this.renderTopLevel() }
                { renderIcons }
            </div>
        );
    }
}

export default MenuComponent;
