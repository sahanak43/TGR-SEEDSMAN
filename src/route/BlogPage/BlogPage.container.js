/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react/no-did-update-set-state */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import BlogPostsQuery from 'Query/BlogPosts.query';
import CategoryReducer from 'Store/Category/Category.reducer';
import { updateMeta } from 'Store/Meta/Meta.action';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { showNotification } from 'Store/Notification/Notification.action';
import { toggleOverlayByKey } from 'Store/Overlay/Overlay.action';
import { DeviceType } from 'Type/Device.type';
import { HistoryType } from 'Type/Router.type';
import { withReducers } from 'Util/DynamicReducer';
import transformToNameValuePair from 'Util/Form/Transform';
import history from 'Util/History';
import { debounce, fetchQuery, getErrorMessage } from 'Util/Request';
import { appendWithStoreCode, getCanonicalUrl, getQueryParam } from 'Util/Url';

import BlogPage from './BlogPage.component';
import { BLOG_URL, SEARCH_TIMEOUT } from './BlogPage.config';

export const BreadcrumbsDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Breadcrumbs/Breadcrumbs.dispatcher'
);

/** @namespace Seedsman/Route/BlogPage/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    headerState: state.NavigationReducer[TOP_NAVIGATION_TYPE].navigationState,
    guest_checkout: state.ConfigReducer.guest_checkout,
    device: state.ConfigReducer.device
});

/** @namespace Seedsman/Route/BlogPage/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    changeHeaderState: (state) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state)),
    updateBreadcrumbs: (breadcrumbs) => BreadcrumbsDispatcher.then(
        ({ default: dispatcher }) => dispatcher.update(breadcrumbs, dispatch)
    ),
    showOverlay: (overlayKey) => dispatch(toggleOverlayByKey(overlayKey)),
    showNotification: (type, message) => dispatch(showNotification(type, message)),
    updateMeta: (meta) => dispatch(updateMeta(meta)),
    showErrorNotification: (error) => dispatch(showNotification(
        'error',
        typeof error === 'string' ? error : getErrorMessage(error)
    ))
});

/** @namespace Seedsman/Route/BlogPage/Container */
export class BlogPageContainer extends PureComponent {
     static propTypes = {
         updateBreadcrumbs: PropTypes.func.isRequired,
         changeHeaderState: PropTypes.func.isRequired,
         showOverlay: PropTypes.func.isRequired,
         showNotification: PropTypes.func.isRequired,
         updateMeta: PropTypes.func.isRequired,
         history: HistoryType.isRequired,

         device: DeviceType.isRequired
     };

     static navigateToSelectedTab(props, state = {}) {
         const {
             match: { params: { tab: historyActiveTab } = {} } = {}
         } = props;
         const { activeTab } = state;

         if (activeTab !== historyActiveTab) {
             return { activeTab: historyActiveTab };
         }

         return null;
     }

     state = {
         isLoading: true,
         isPlaceholder: true,
         hasError: false,
         blogCategories: [],
         currentPage: 1,
         activeTab: '',
         blogPost: [],
         tabArray: {},
         catId: 0,
         searchCriteria: ''
     };

     containerFunctions = {
         changeTabName: this.changeTabName.bind(this),
         changeActiveTab: this.changeActiveTab.bind(this),
         onSearchBarChange: this.onSearchBarChange.bind(this),
         handleChange: this.handleChange.bind(this),
         onSearch: this.onSearch.bind(this)
     };

     static getDerivedStateFromProps(props, state) {
         return BlogPageContainer.navigateToSelectedTab(props, state);
     }

     getSearchData = debounce(async (searchValue) => {
         const currentPage = this._getPageFromUrl();
         const { activeTab } = this.state;

         this.setState({ isLoading: true, isPlaceholder: true });

         try {
             if (searchValue === '' && activeTab !== '') {
                 this.getBlogPostData(currentPage, activeTab);
             } else {
                 const { mpBlogPosts: { items, pageInfo, total_count } } = await
                 fetchQuery(BlogPostsQuery.getSearchPost(searchValue, currentPage));

                 this.setState({
                     isLoading: false, isPlaceholder: false, blogPost: items, pageInfo, total_count
                 });
             }
         } catch (e) {
             this.setState({ isLoading: false, isPlaceholder: false });
             showErrorNotification(getErrorMessage(e));
         }
     }, SEARCH_TIMEOUT);

     componentDidMount() {
         const { updateMeta } = this.props;

         this.getBlogCategoryData();
         const {
             match: { params: { tab } = {} } = {}
         } = this.props;
         const currentPage = this._getPageFromUrl();
         this.getBlogPostData(currentPage, tab);

         updateMeta({
             title: __('Blog'),
             canonical_url: getCanonicalUrl()
         });

         const currentLocation = window.location.pathname.trim().toLowerCase();

         if (currentLocation.startsWith('/us-en') || currentLocation.startsWith('/uk-en')) {
             this.gtmBlogContainerBodyScript();
         }
     }

     componentDidUpdate(prevProps, prevState) {
         const {
             currentPage: prevCurrentPage,
             searchCriteria: prevSearchCriteria
         } = prevState;
         const { searchCriteria, hasError } = this.state;
         const currentPage = this._getPageFromUrl();

         const {
             match: { params: { tab: prevTab } = {} } = {}
         } = prevProps;

         const {
             match: { params: { tab } = {} } = {}, updateMeta
         } = this.props;

         if (prevCurrentPage !== currentPage) {
             this.setState({ currentPage });

             if (tab) {
                 this.getBlogPostData(currentPage, tab);
             } else {
                 this.getBlogPostData(currentPage);
             }

             updateMeta({
                 title: __('Blog'),
                 canonical_url: getCanonicalUrl()
             });
         }

         if (
             (searchCriteria !== prevSearchCriteria && searchCriteria.length > 3)
         || (!searchCriteria && prevSearchCriteria)) {
             this.getSearchData(searchCriteria);
         }

         if (prevTab !== tab && !tab) {
             this.getBlogPostData(currentPage);
         }

         if (prevState !== this.state) {
             this._updateBreadcrumbs();

             updateMeta({
                 title: __('Blog'),
                 canonical_url: !hasError ? getCanonicalUrl() : `${origin}${window.location.pathname}`
             });
         }
     }

     async getBlogCategoryData() {
         const { showErrorNotification } = this.props;
         this.setState({ isLoading: true });
         try {
             const { mpBlogCategories: { items } } = await
             fetchQuery(BlogPostsQuery.getMpBlogCategories());

             this.setState({
                 isLoading: false, blogCategories: items, activeTab: items[0].name, catId: items[0].category_id
             });
         } catch (e) {
             showErrorNotification(getErrorMessage(e));
         }
     }

     async getBlogPostData(currentPage, activeTab = '') {
         const { showErrorNotification } = this.props;

         this.setState({ isLoading: true, isPlaceholder: true });

         try {
             if (activeTab) {
                 const { mpBlogPosts: { items, pageInfo, total_count } } = await
                 fetchQuery(BlogPostsQuery.getMpBlogPosts(activeTab, currentPage));

                 this.setState({
                     isLoading: false, isPlaceholder: false, hasError: false, blogPost: items, pageInfo, total_count
                 });
             } else {
                 const { mpBlogPosts: { items, pageInfo, total_count } } = await
                 fetchQuery(BlogPostsQuery.getMpPostList(currentPage));

                 this.setState({
                     isLoading: false, isPlaceholder: false, hasError: false, blogPost: items, pageInfo, total_count
                 });
             }
         } catch (e) {
             showErrorNotification(getErrorMessage(e));
             this.setState({
                 hasError: true
             });
         }
     }

     changeActiveTab(activeTab, tabArray) {
         const catId = tabArray.id;
         const url = `${BLOG_URL}${activeTab}`;
         history.push(appendWithStoreCode(url));
         this.setState({ activeTab, tabArray, catId });
         this._updateBreadcrumbs();
         this.getBlogPostData(1, activeTab);
     }

     gtmBlogContainerBodyScript() {
         const script = document.createElement('script');
         script.type = 'text/javascript';
         script.textContent = `
            (function() {
                var iframe = document.createElement('iframe');
                iframe.src = 'https://www.googletagmanager.com/ns.html?id=GTM-NKFSQD42';
                iframe.height = '0';
                iframe.width = '0';
                iframe.style.display = 'none';
                iframe.style.visibility = 'hidden';
    
                var scriptTag = document.getElementsByTagName('script')[0];
                scriptTag.parentNode.insertBefore(iframe, scriptTag);
            })();
        `;
         script.id = 'GtmBlogContainerBodyScript';
         document.body.appendChild(script);
     }

     _updateBreadcrumbs() {
         const { updateBreadcrumbs } = this.props;

         const {
             match: { params: { tab } = {} } = {}
         } = this.props;

         if (tab) {
             const breadcrumbs = [
                 { url: `'/${tab}/'`, name: tab },
                 { url: '/blog', name: 'Blog' }
             ];

             updateBreadcrumbs(breadcrumbs);
         } else {
             const breadcrumbs = [
                 { url: '/blog', name: 'Blog' }
             ];

             updateBreadcrumbs(breadcrumbs);
         }
     }

     changeTabName(newTabName) {
         this.setState({ tabName: newTabName });
     }

     _getPageFromUrl(url) {
         const { location: currentLocation } = this.props;
         const location = url || currentLocation;

         return +(getQueryParam('page', location) || 1);
     }

     onSearchBarChange(searchCriteria) {
         this.setState({ searchCriteria });
     }

     handleChange(e) {
         this.onSearchBarChange(e.target.value.trim());
     }

     onSearch(form, fields) {
         const {
             blogSearch
         } = transformToNameValuePair(fields);

         if (blogSearch === '' || !blogSearch.trim().length) {
             return null;
         }

         return this.getSearchData(blogSearch);
     }

     containerProps() {
         const {
             isLoading, isPlaceholder, blogCategories, activeTab, catId, blogPost, pageInfo, total_count
         } = this.state;
         const { device } = this.props;
         return {
             isLoading, isPlaceholder, blogCategories, activeTab, catId, blogPost, total_count, pageInfo, device
         };
     }

     render() {
         return (
             <BlogPage
               numberOfPlaceholders={ 4 }
               numberOfCatPlaceholders={ 6 }
               { ...this.containerFunctions }
               { ...this.containerProps() }
             />
         );
     }
}

export default withRouter(withReducers({
    CategoryReducer
})(connect(mapStateToProps, mapDispatchToProps)(BlogPageContainer)));
