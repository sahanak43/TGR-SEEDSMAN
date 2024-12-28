/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import BlogPostsQuery from 'Query/BlogPosts.query';
import { fetchQuery } from 'Util/Request';

import BlogWidget from './BlogWidget.component';

/** @namespace Seedsman/Component/BlogWidget/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    device: state.ConfigReducer.device
});
/** @namespace Seedsman/Component/BlogWidget/Container/mapDispatchToProps */
export const mapDispatchToProps = () => ({});
/** @namespace Seedsman/Component/BlogWidget/Container */
export class BlogWidgetContainer extends PureComponent {
    static propTypes = {
        type: PropTypes.string.isRequired
    };

    state = {
        isLoading: true,
        blogCategories: [],
        currentPage: 1,
        activeTab: '',
        blogPost: [],
        tabArray: {},
        catId: 0
    };

    componentDidMount() {
        this.getBlogCategoryData();
    }

    containerProps() {
        const {
            blogCategories,
            currentPage,
            isLoading,
            activeTab,
            blogPost,
            tabArray,
            catId
        } = this.state;

        const { heading, link, device: { isMobile } } = this.props;

        return {
            blogCategories,
            currentPage,
            isLoading,
            activeTab,
            blogPost,
            tabArray,
            catId,
            heading,
            link,
            isMobile
        };
    }

    async getBlogCategoryData() {
        const pageSize = 3;
        const result1 = await
        fetchQuery(BlogPostsQuery.getMpPostList(1, pageSize));

        this.setState({
            blogCategories: result1
        });
    }

    render() {
        return (
            <BlogWidget
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BlogWidgetContainer);
