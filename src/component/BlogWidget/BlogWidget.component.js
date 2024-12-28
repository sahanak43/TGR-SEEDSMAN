/* eslint-disable react/prop-types */
// import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { Grid, Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import Link from 'Component/Link';

import { formatDateTime } from '../../util/DateTime';

import './BlogWidget.style';

/** @namespace Seedsman/Component/BlogWidget/Component */
export class BlogWidgetComponent extends PureComponent {
    static propTypes = {
        // TODO: implement prop-types
    };

    renderHeadersection() {
        const { heading, link } = this.props;

        if (!heading) {
            return null;
        }

        return (
            <div block="homepage-heading">
                <h2 block="heading">{ heading }</h2>
                { link && (
                    <Link block="viewall-button" to={ link }>
                        view all
                    </Link>
                ) }
            </div>
        );
    }

    renderMainContent() {
        const {
            blogCategories: { mpBlogPosts: { items = [] } = {} } = {},
            isMobile
        } = this.props;
        const row = isMobile ? 0 : 1;
        return (
            <Swiper
              slidesPerView={ 2 }
              grid={ {
                  rows: row
              } }
              scrollbar
              breakpoints={ {
                  320: {
                      slidesPerView: 1.2,
                      scrollbar: true
                  },
                  640: {
                      slidesPerView: 2.5,
                      scrollbar: true
                  },
                  1200: {
                      slidesPerView: 3,
                      scrollbar: false
                  }
              } }
              pagination={ { type: 'progressbar' } }
              spaceBetween={ 20 }
              modules={ [Grid, Navigation, Pagination] }
              className="mySwiper2 brands HideProgressBar"
            >
                { items.map((value) => {
                    const Date = formatDateTime(value.created_at, false);
                    return (
                        <SwiperSlide>
                            <div block="WholeData">
                                <div block="whole_section">
                                    <div block="dataname">
                                        <Link
                                          to={ `blog/${value.url_key}` }
                                          block="BlogWidget"
                                          elem="Link"
                                        >
                                            <img src={ value.image } alt="blog_images" />
                                        </Link>
                                    </div>
                                    <div block="Created_date">
                                        <button>{ Date }</button>
                                    </div>
                                </div>
                                <div block="last-section">
                                    <Link
                                      to={ `blog/${value.url_key}` }
                                      block="BlogWidget"
                                      elem="Link"
                                    >
                                        { value.name }
                                    </Link>
                                </div>
                                <div block="Dscription">
                                    <p>{ value.short_description }</p>
                                </div>
                            </div>
                        </SwiperSlide>
                    );
                }) }
            </Swiper>
        );
    }

    render() {
        return (
            <div block="BlogWidget">
                { this.renderHeadersection() }
                { this.renderMainContent() }
            </div>
        );
    }
}

export default BlogWidgetComponent;
