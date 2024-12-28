/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/forbid-elements */
/* eslint-disable max-lines */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable max-len */
/* eslint-disable react/jsx-no-bind */
// import PropTypes from 'prop-types';
import { PureComponent } from 'react';
// import required modules
import { Navigation, Thumbs } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import Html from 'Component/Html';
import Link from 'Component/Link';
import TopBrand1 from 'Util/images/topbrandimg1.png';
import TopBrand2 from 'Util/images/topbrandimg2.png';
import TopBrand3 from 'Util/images/topbrandimg3.png';
import TopBrand4 from 'Util/images/topbrandimg4.png';

// Import Swiper styles
// import 'swiper/css';
// import 'swiper/css/free-mode';
// import 'swiper/css/navigation';
// import 'swiper/css/thumbs';
import './TopBrands.style';

/** @namespace Seedsman/Component/TopBrands/Component */
export class TopBrandsComponent extends PureComponent {
    static propTypes = {
        // TODO: implement prop-types
    };

    state = {
        thumbsSwiper: null
    };

    renderTopbrandSlider() {
        const { thumbsSwiper } = this.state;
        const { items = [] } = this.props;

        if (!items.length) {
            return null;
        }

        return (
            <div block="TopBrands" elem="Slider">
                <div className="Biggest-Deals">
                    <div className="Biggest-Deals-Title">
                        <p className="Biggest-Topbrands">
                            Biggest Deals On Top Brands
                        </p>
                        <a
                          className="Biggest-Deal-View-All"
                          href="/cannabis-seed-breeders"
                        >
                            VIEW ALL
                        </a>
                    </div>
                    <div className="Lables">
                        <div className="Slider-Lable">
                            <Swiper
                              onSwiper={ (swiper) => {
                                  this.setState({ thumbsSwiper: swiper });
                              } }
                              spaceBetween={ 10 }
                              slidesPerView={ 6 }
                              navigation
                              watchSlidesProgress
                              modules={ [Navigation, Thumbs] }
                              breakpoints={ {
                                  320: {
                                      slidesPerView: 2,
                                      scrollbar: true
                                  },
                                  640: {
                                      slidesPerView: 2,
                                      scrollbar: true
                                  },
                                  1200: {
                                      slidesPerView: 6
                                  }
                              } }
                              className="mySwiper"
                            >
                                { items?.map((brand) => {
                                    const { category_icon } = brand;

                                    return (
                                        <SwiperSlide>
                                            <span className="brands-cards">
                                                <img
                                                  width="100%"
                                                  height="auto"
                                                  src={ category_icon }
                                                  alt="img"
                                                  className={ category_icon ? 'Deal-Lable' : 'Deal-Lable img-notFound' }
                                                />
                                            </span>
                                        </SwiperSlide>
                                    );
                                }) }
                            </Swiper>
                        </div>
                    </div>
                </div>
                <Swiper
                  spaceBetween={ 10 }
                  thumbs={ { swiper: thumbsSwiper } }
                  modules={ [Navigation, Thumbs] }
                  allowTouchMove={ false }
                  className="mySwiper2 brands"
                >
                    { this.renderInfoSection() }
                </Swiper>
            </div>
        );
    }

    renderInfoSection() {
        const { items = [] } = this.props;
        return (
            <>
                { items?.map((brands) => (
                    <SwiperSlide>
                        <div className="Seeds-Products">
                            <div className="Seeds-Products">
                                <div className="Seeds-Products-Left">
                                    <p className="Seeds-Products-Left-Title">
                                        { brands.name }
                                    </p>
                                    <p className="Seeds-Product-Left-Description">
                                        <Html content={ brands.description } />
                                    </p>
                                    <div block="view-all-buttom">
                                        <Link
                                          to={ brands.url }
                                          className="Seeds-Products-Left-Btn"
                                        >
                                            VIEW ALL PRODUCTS
                                        </Link>
                                    </div>
                                </div>
                                <div className="Seeds-Products-Right">
                                    <div className="Seeds-Products-Right-Image">
                                        <div className="Image-Container">
                                            <div block="image-block"><img
                                              src={ TopBrand1 }
                                              alt="Topbrand1_img"
                                              className="Product-Image"
                                              width="100%"
                                              height="auto"
                                            />
                                            </div>
                                            <p className="Image-Title">
                                                Blueberry Auto Feminised Seeds
                                            </p>
                                        </div>
                                    </div>
                                    <div className="Seeds-Products-Right-Image">
                                        <div className="Image-Container">
                                        <div block="image-block"><img
                                          src={ TopBrand2 }
                                          alt="Topbrand2_img"
                                          className="Product-Image"
                                          width="100%"
                                          height="auto"
                                        />
                                        </div>
                                            <p className="Image-Title">
                                                Do-Si-Dos Cookies Auto Feminised
                                                Seeds
                                            </p>
                                        </div>
                                    </div>
                                    <div className="Seeds-Products-Right-Image">
                                        <div className="Image-Container">
                                        <div block="image-block"><img
                                          src={ TopBrand3 }
                                          alt="Topbrand3_img"
                                          className="Product-Image"
                                          width="100%"
                                          height="auto"
                                        />
                                        </div>
                                            <p className="Image-Title">
                                                Do-Si-Dos Cookies Feminised
                                                Seeds
                                            </p>
                                        </div>
                                    </div>
                                    <div className="Seeds-Products-Right-Image">
                                        <div className="Image-Container">
                                        <div block="image-block"><img
                                          src={ TopBrand4 }
                                          alt="Topbrand4_img"
                                          className="Product-Image"
                                          width="100%"
                                          height="auto"
                                        />
                                        </div>
                                            <p className="Image-Title">
                                                Gorilla Feminised Seeds
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                )) }
            </>
        );
    }

    render() {
        return <div block="TopBrands">{ this.renderTopbrandSlider() }</div>;
    }
}
export default TopBrandsComponent;
