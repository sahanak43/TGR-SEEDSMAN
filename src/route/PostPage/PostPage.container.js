/* eslint-disable react/no-unused-state */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */

import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import BlogPostsQuery from 'Query/BlogPosts.query.js';
import { updateMeta } from 'Store/Meta/Meta.action';
import { showNotification } from 'Store/Notification/Notification.action';
import { scrollToTop } from 'Util/Browser';
import { fetchQuery, getErrorMessage } from 'Util/Request';
import { getCanonicalUrl } from 'Util/Url';

import PostPage from './PostPage.component';

export const BreadcrumbsDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Breadcrumbs/Breadcrumbs.dispatcher'
);

/** @namespace Seedsman/Route/PostPage/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    device: state.ConfigReducer.device
});

/** @namespace Seedsman/Route/PostPage/Container/mapDispatchToProps */
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

/** @namespace Seedsman/Route/PostPage/Container */
export class PostPageContainer extends PureComponent {
    state={
        blogPost: {},
        isPlaceholder: true,
        isLoading: true
    };

    componentDidMount() {
        const {
            match: { params: { tab } = {} } = {}
        } = this.props;

        this.getPostDetails(tab);
    }

    componentDidUpdate(_, prevState) {
        const { blogPost } = this.state;
        const { updateMeta } = this.props;
        const { blogPost: prevBlogPost } = prevState;

        if (!blogPost) {
            return;
        }

        const {
            meta_description, meta_keywords, meta_robots, meta_title, name
        } = blogPost;

        const Title = meta_title || name;

        if (prevBlogPost !== blogPost) {
            updateMeta({
                title: Title,
                description: meta_description,
                keywords: meta_keywords,
                robots: meta_robots,
                canonical_url: getCanonicalUrl()
            });
        }
    }

    async getPostDetails(url_key) {
        const { showErrorNotification } = this.props;

        try {
            const { mpBlogPosts: { items } } = await
            fetchQuery(BlogPostsQuery.getSinglePost(url_key, 1));

            this._updateBreadcrumbs(items);

            this.setState({
                isLoading: false, isPlaceholder: false, blogPost: items[0]
            });
            scrollToTop();
        } catch (e) {
            showErrorNotification(getErrorMessage(e));
        }
    }

    _updateBreadcrumbs(postDetails) {
        const { updateBreadcrumbs, match: { params: { tab } } } = this.props;
        const [{ name }] = postDetails;
        const breadcrumbs = [
            { url: `'/${tab}/'`, name: `${ name }` },
            { url: '/blog/', name: 'Blog' }

        ];

        updateBreadcrumbs(breadcrumbs);
    }

    containerProps() {
        const {
            blogPost, isLoading, isPlaceholder
        } = this.state;
        const { updateMeta, device: { isMobile } } = this.props;
        return {
            blogPost, isLoading, isPlaceholder, updateMeta, isMobile
        };
    }

    render() {
        return (
             <PostPage
               { ...this.containerProps() }
             />
        );
    }
}

export default withRouter((connect(mapStateToProps, mapDispatchToProps)(PostPageContainer)));
