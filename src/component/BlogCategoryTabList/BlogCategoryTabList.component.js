/* eslint-disable react/prop-types */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */

import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import BlogPageTabListItem from 'Component/BlogPageTabListItem';
// import ChevronIcon from 'Component/ChevronIcon';
import ExpandableContent from 'Component/ExpandableContent';
import { TabMapType } from 'Type/Account.type';

import './BlogCategoryTabList.style';

/** @namespace Seedsman/Component/BlogCategoryTabList/Component */
export class BlogCategoryTabListComponent extends PureComponent {
     static propTypes = {
         CategoryName: TabMapType.isRequired,
         handleLogout: PropTypes.func.isRequired,
         onTabClick: PropTypes.func.isRequired,
         isContentExpanded: PropTypes.bool.isRequired,
         toggleExpandableContent: PropTypes.func.isRequired
     };

     renderTabListItem() {
         const {
             CategoryName, activeTab, tabUrl, onTabClick, tabArray, isLoading, isEnabled
         } = this.props;

         return (
             <BlogPageTabListItem
               key={ tabUrl }
               CategoryName={ CategoryName }
               isActive={ activeTab === tabUrl }
               changeActiveTab={ onTabClick }
               tabArray={ tabArray }
               tabMap={ tabUrl }
               isLoading={ isLoading }
               isEnabled={ isEnabled }
             />
         );
     }

     renderLine() {
         return (
             <div block="BlogCategoryTabList" elem="Separator" />
         );
     }

     render() {
         const {
             CategoryName,
             isContentExpanded,
             toggleExpandableContent,
             device: { isMobile }
         } = this.props;

         if (isMobile) {
             return (
                 this.renderTabListItem()
             );
         }

         return (
             <ExpandableContent
               heading={ CategoryName }
               isContentExpanded={ isContentExpanded }
               mix={ { block: 'BlogCategoryTabList' } }
               onClick={ toggleExpandableContent }
               mods={ { isWithoutBorder: true } }
             >
                 <ul>

                  { this.renderTabListItem() }

                 </ul>
             </ExpandableContent>
         );
     }
}

export default BlogCategoryTabListComponent;
