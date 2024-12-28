/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { ActiveTabType, TabMapType } from 'Type/Account.type';
import { DeviceType } from 'Type/Device.type';
import { noopFn } from 'Util/Common';

import BlogCategoryTabList from './BlogCategoryTabList.component';

/** @namespace Seedsman/Component/BlogCategoryTabList/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    device: state.ConfigReducer.device
});

/** @namespace Seedsman/Component/BlogCategoryTabList/Container/mapDispatchToProps */
export const mapDispatchToProps = () => ({});

/** @namespace Seedsman/Component/BlogCategoryTabList/Container */
export class BlogCategoryTabListContainer extends PureComponent {
     static propTypes = {
         onSignOut: PropTypes.func,
         logout: PropTypes.func.isRequired,
         tabArray: TabMapType.isRequired,
         activeTab: ActiveTabType.isRequired,
         device: DeviceType.isRequired,
         CategoryName: PropTypes.string,
         changeActiveTab: PropTypes.func.isRequired
     };

     static defaultProps = {
         onSignOut: noopFn,
         CategoryName: {}
     };

     state = {
         isContentExpanded: false
     };

     containerFunctions = {
         handleLogout: this.handleLogout.bind(this),
         onTabClick: this.onTabClick.bind(this),
         toggleExpandableContent: this.toggleExpandableContent.bind(this)
     };

     containerProps() {
         const {
             tabArray,
             activeTab, CategoryName, tabUrl, device, isEnabled
         } = this.props;
         const { isContentExpanded } = this.state;

         return {
             tabArray,
             activeTab,
             CategoryName,
             tabUrl,
             device,
             isEnabled,
             isContentExpanded
         };
     }

     handleLogout() {
         const { onSignOut, logout } = this.props;

         logout();
         onSignOut();
     }

     onTabClick(key) {
         const { changeActiveTab, tabArray } = this.props;

         this.toggleExpandableContent();
         changeActiveTab(key, tabArray);
     }

     toggleExpandableContent() {
         this.setState(({ isContentExpanded }) => ({ isContentExpanded: !isContentExpanded }));
     }

     render() {
         return (
             <BlogCategoryTabList
               { ...this.containerProps() }
               { ...this.containerFunctions }
             />
         );
     }
}

export default connect(mapStateToProps, mapDispatchToProps)(BlogCategoryTabListContainer);
