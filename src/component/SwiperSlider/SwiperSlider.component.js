/* eslint-disable no-sequences */
/* eslint-disable no-magic-numbers */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
// import PropTypes from 'prop-types';
import { Children, PureComponent } from 'react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import './SwiperSlider.style';

/** @namespace Seedsman/Component/SwiperSlider/Component */
export class SwiperSliderComponent extends PureComponent {
    static propTypes = {
        // TODO: implement prop-types
    };

    render() {
        const {
            children,
            className,
            slidesperview = 1,
            tabletslidesperview = 1,
            mobileslidesperview = 1,
            spacebetween = 20,
            loop = false,
            autoPlay = false,
            progressbar,
            dynamicbullets
        } = this.props;

        return (
            <Swiper
              loop={ loop }
              spaceBetween={ spacebetween }
              modules={ [Autoplay, Navigation, Pagination] }
              autoplay={ autoPlay ? { delay: 2000 } : false }
              navigation
              scrollbar
              breakpoints={ {
                  320: {
                      slidesPerView: mobileslidesperview,
                      scrollbar: true
                  },
                  640: {
                      slidesPerView: tabletslidesperview,
                      scrollbar: true
                  },
                  1200: {
                      slidesPerView: slidesperview
                  }
              } }
              pagination={ dynamicbullets ? { clickable: true } : { type: progressbar } }
              className={ className }
            >
                { Children.map(children, (child, i) => {
                    if (Object.values(child?.props).length > 0) {
                        return <SwiperSlide key={ i }>{ child }</SwiperSlide>;
                    }

                    return null;
                }) }
            </Swiper>
        );
    }
}

export default SwiperSliderComponent;
