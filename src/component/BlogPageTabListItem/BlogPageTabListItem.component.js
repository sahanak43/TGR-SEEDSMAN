/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable react/prop-types */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import TextPlaceholder from 'Component/TextPlaceholder';
import { ChildrenType } from 'Type/Common.type';

import './BlogPageTabListItem.style';

/** @namespace Seedsman/Component/BlogPageTabListItem/Component */
export class BlogPageTabListItemComponent extends PureComponent {
    static propTypes = {
        children: ChildrenType,
        isActive: PropTypes.bool,
        changeActiveTab: PropTypes.func.isRequired
    };

    static defaultProps = {
        isActive: false,
        children: []
    };

    changeActiveTab = this.changeActiveTab.bind(this);

    changeActiveTab() {
        const { changeActiveTab, tabMap, tabArray } = this.props;
        changeActiveTab(tabMap, tabArray);
    }

    render() {
        const {
            children, isActive, CategoryName, isLoading, isEnabled, tabMap
        } = this.props;

        if (isEnabled === 0) {
            return null;
        }

        return (
            <li
              block="BlogCategoryTabListItem"
              mods={ { isActive } }
            >
                { CategoryName === 'Root' ? null
                    : (
                     <button
                       block="BlogCategoryTabListItem"
                       elem={ `Button ${tabMap}` }
                       onClick={ this.changeActiveTab }
                       role="link"
                     >
                        { isLoading ? <TextPlaceholder length="short" /> : CategoryName }
                     </button>
                    ) }
                { children }
            </li>
        );
    }
}

export default BlogPageTabListItemComponent;
