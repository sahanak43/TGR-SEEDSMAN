/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import { PureComponent } from 'react';

import ContentWrapper from 'Component/ContentWrapper';
import Html from 'Component/Html';
import Image from 'Component/Image';
import TextPlaceholder from 'Component/TextPlaceholder';
import NoMatch from 'Route/NoMatch';
import { formatDateTime } from 'Util/DateTime';

import './PostPage.style';
/** @namespace Seedsman/Route/PostPage/Component */
export class PostPageComponent extends PureComponent {
     static propTypes = {

     };

     static defaultProps = {

     };

     renderMainContent() {
         return (
            <div block="BlogPostPage">
                <div block="BlogPostPage" elem="Title">
                    { this.renderTitle() }
                </div>
                { this.renderPostAuthorDetails() }
                { this.renderContent() }
            </div>
         );
     }

     renderContent() {
         const { blogPost, isLoading } = this.props;
         return (
            <div block="BlogPostPage" elem="content">
                { isLoading ? <TextPlaceholder length="paragraph" />
                    : <Html content={ blogPost?.post_content } /> }
            </div>

         );
     }

     renderPostImage() {
         const { blogPost } = this.props;
         return (
            <div block="BlogPostPage" elem="Images">

                <Image
                  mix={ { block: 'BlogPage', elem: 'PostImage' } }
                  ratio="custom"
                  src={ blogPost?.image || '' }
                  isPlaceholder={ !blogPost?.image }
                  objectFit="cover"
                />
            </div>
         );
     }

     renderCatItem(item) {
         return (
             item?.map((val) => (
                <div block="BlogPostPage" elem="catItemName">{ val.name }</div>))
         );
     }

     renderPostAuthorDetails() {
         const { blogPost = {}, isLoading, isMobile } = this.props;

         if (isMobile) {
             return (
                 <>
                    <div block="BlogPostPage" elem="blogPostAuthorDetails">
                    { isLoading ? <TextPlaceholder medium="long" /> : (
                        <>
                            <div block="BlogPostPage" elem="authorNameDetails">
                                <div block="BlogPostPage" elem="authorNameIcon">
                                    { this.renderAuthorIcon() }
                                </div>
                                <div block="BlogPostPage" elem="authorName">
                                { blogPost?.author_name }
                                </div>
                            </div>
                            <div block="BlogPostPage" elem="BlogCategoryReadTime">
                                { this.renderTimeIcon() }
                                <div block="BlogPostPage" elem="readTime">7 min read</div>
                            </div>
                            <div block="BlogPostPage" elem="postCreatedDate">{ formatDateTime(blogPost?.created_at, false) }</div>
                        </>
                    ) }
                    </div>
                    <div block="BlogPostPage" elem="BlogPostCategory">{ this.renderCatItem(blogPost?.categories?.items) }</div>
                 </>
             );
         }

         return (
             <div block="BlogPostPage" elem="blogPostAuthorDetails">
                { isLoading ? <TextPlaceholder medium="long" /> : (
                    <>
                <div block="BlogPostPage" elem="authorNameDetails">
                    <div block="BlogPostPage" elem="authorNameIcon">
                        { this.renderAuthorIcon() }
                    </div>
                    <div block="BlogPostPage" elem="authorName">
                    { blogPost?.author_name }
                    </div>
                </div>
                <div block="BlogPostPage" elem="BlogCategoryReadTime">
                    { this.renderTimeIcon() }
                    <div block="BlogPostPage" elem="readTime">7 min read</div>
                </div>
                <div block="BlogPostPage" elem="postCreatedDate">{ formatDateTime(blogPost?.created_at, false) }</div>
                <div block="BlogPostPage" elem="BlogPostCategory">{ this.renderCatItem(blogPost?.categories?.items) }</div>
                    </>
                ) }
             </div>
         );
     }

     renderAuthorIcon() {
         return (
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
               <g id="Group_1034" data-name="Group 1034" transform="translate(4768.946 22981.947)">
                   <rect
                     id="Rectangle_401"
                     data-name="Rectangle 401"
                     width="24"
                     height="24"
                     transform="translate(-4768.946 -22981.947)"
                     fill="#0f0f0f"
                     opacity="0"
                   />
                   <path
                     id="Path_725"
                     data-name="Path 725"
                     d="M-362.223,120.37a8.772,8.772,0,0,0-8.762,8.763,8.772,8.772,0,0,0
                   ,8.762,8.763,8.774,8.774,0,0,0,8.764-8.763A8.793,8.793,0,0,0-362.223
                   ,120.37Zm.023,8.5a2.494,2.494,0,0,1-2.491-2.491,2.5,2.5,
                   0,0,1,2.491-2.491,2.493,2.493,0,0,1,2.49,2.491A2.494,2.494,0,
                   0,1-362.2,128.87Zm0-6.036Zm2.321,6.461a3.725,3.725,0,0,0
                   ,1.424-2.916,3.712,3.712,0,0,0-1.088-2.644,3.714,3.714,
                   0,0,0-2.64-1.1h-.017a3.749,3.749,0,0,0-3.745,3.745,3.722,
                   3.722,0,0,0,1.429,2.92,6.624,6.624,0,0,0-3.928,4.034,7.466,
                   7.466,0,0,1-1.287-4.2,7.532,7.532,0,0,1,7.508-7.51,7.517,
                   7.517,0,0,1,7.509,7.509,7.463,7.463,0,0,1-1.266,4.166A6.608,
                   6.608,0,0,0-359.879,129.295Zm-2.995.892a5.305,5.305,0,0,1,3.94,1.08,
                   5.281,5.281,0,0,1,1.951,3.234,7.476,7.476,0,0,1-5.24,2.141,7.475,
                   7.475,0,0,1-5.222-2.125A5.342,5.342,0,0,1-362.874,130.187Z"
                     transform="translate(-4394.724 -23099.08)"
                     fill="#0f0f0f"
                   />
               </g>
           </svg>

         );
     }

     renderTimeIcon() {
         return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <g id="Group_1050" data-name="Group 1050" transform="translate(3190 22992)">
                    <rect id="Rectangle_403" data-name="Rectangle 403" width="24" height="24" transform="translate(-3190 -22992)" fill="#0f0f0f" opacity="0" />
                    <g id="noun-rules-2560143" transform="translate(-3280.908 -23000.912)">
                    <path id="Path_711" data-name="Path 711" d="M349.36,135.343h3.36a.473.473,0,1,0,0-.945h-3.36a.484.484,0,0,0-.48.48A.472.472,0,0,0,349.36,135.343Z" transform="translate(-246 -117.275)" />
                    <path id="Path_712" data-name="Path 712" d="M186.548,107.352a.451.451,0,0,0,.349.145.508.508,0,0,0,.349-.145l1.4-1.513a.474.474,0,0,0-.7-.64l-1.047,1.134-.393-.422a.474.474,0,0,0-.7.64Z" transform="translate(-87.043 -88.687)" />
                    <path id="Path_713" data-name="Path 713" d="M349.36,262.48h3.36a.48.48,0,0,0,0-.96h-3.36a.48.48,0,0,0,0,.96Z" transform="translate(-246 -241.095)" />
                    <path id="Path_714" data-name="Path 714" d="M186.548,235.032a.451.451,0,0,0,.349.145.508.508,0,0,0,.349-.145l1.4-1.513a.474.474,0,0,0-.7-.64l-1.047,1.134-.393-.422a.474.474,0,1,0-.7.64Z" transform="translate(-87.043 -213.051)" />
                    <path id="Path_715" data-name="Path 715" d="M349.36,389.6h3.36a.48.48,0,0,0,0-.96h-3.36a.484.484,0,0,0-.48.48A.475.475,0,0,0,349.36,389.6Z" transform="translate(-246 -364.914)" />
                    <path id="Path_716" data-name="Path 716" d="M186.548,362.712a.451.451,0,0,0,.349.145.508.508,0,0,0,.349-.145l1.4-1.513a.474.474,0,1,0-.7-.64l-1.047,1.135-.393-.422a.474.474,0,0,0-.7.64Z" transform="translate(-87.043 -337.415)" />
                    <path id="Path_717" data-name="Path 717" d="M109.017,14H96.8a.484.484,0,0,0-.48.48V27.348a.484.484,0,0,0,.48.48h12.217a.484.484,0,0,0,.48-.48V14.476a.484.484,0,0,0-.48-.48Zm-.465,12.872H97.265V14.942h11.286Z" transform="translate(0)" />
                    </g>
                </g>
            </svg>
         );
     }

     renderTitle() {
         const { blogPost, isLoading } = this.props;

         if (!blogPost && !isLoading) {
             return null;
         }

         return (
              <div block="BlogPostPage" elem="Title">
                 <h1>
                    { isLoading ? (<TextPlaceholder length="medium" />) : blogPost.name }
                 </h1>
              </div>
         );
     }

     render() {
         const { blogPost } = this.props;

         if (!blogPost) {
             return <NoMatch />;
         }

         return (
            <main block="Blog" aria-label="Blog Page">

            <ContentWrapper
              wrapperMix={ { block: 'BlogPostPage', elem: 'Wrapper' } }
              label="Blog page details"
            >
                { this.renderPostImage() }
                { this.renderMainContent() }
            </ContentWrapper>

            </main>
         );
     }
}

export default PostPageComponent;
