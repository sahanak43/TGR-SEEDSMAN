/* eslint-disable react/no-array-index-key */
/* eslint-disable max-lines */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable max-len */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable new-cap */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
// import PropTypes from 'prop-types';

import { PureComponent } from 'react';

import Image from 'SourceComponent/Image';
import {
    PLACEHOLDER_TYPE
} from 'SourceComponent/ProductGallery/ProductGallery.config';
import { DeviceType } from 'Type/Device.type';
import nextArrow from 'Util/images/Path 76407 (1).svg';
import preArrow from 'Util/images/Path 76407.svg';

import ProductLabel from '../../../node_modules/@scandiweb/mageplaza-product-label/src/component/ProductLabel/ProductLabel.component';

import './SeedsmanProductGallery.style';

/** @namespace Seedsman/Component/SeedsmanProductGallery/Component */
export class SeedsmanProductGalleryComponent extends PureComponent {
    static propTypes = {
        device: DeviceType.isRequired
    };

    renderProductGellaryImages() {
        const {
            gallery,
            OpenSlider,
            showLoader,
            currentSlide
        } = this.props;

        if (gallery[0].media_type === PLACEHOLDER_TYPE) {
            return null;
        }

        return (
            <div block="SeedsmanProductGallery" elem="ProductImages">
                { gallery?.map((val, i) => {
                    const {
                        base: { url } = {}, disabled
                    } = val;

                    if (disabled) {
                        return null;
                    }

                    return (
                        <div
                          block="SeedsmanProductGallery"
                          elem={ i === currentSlide
                              ? 'Image-coloum-isActive'
                              : 'Image-coloum' }
                          onClick={ () => {
                              OpenSlider(false, i);
                          } }
                        >
                            <Image
                              key={ i }
                              src={ url }
                              ratio="square"
                              mix={ {
                                  block: 'ProductGallery',
                                  elem: 'SliderImage',
                                  mods: { isPlaceholder: !url }
                              } }
                              isPlaceholder={ !url }
                              showIsLoading={ showLoader }
                            />
                        </div>
                    );
                }) }
            </div>
        );
    }

    renderMainProductImage(url, index) {
        const { currentSlide, OpenSlider, showLoader } = this.props;
        return (
            <div
              block="SeedsmanProductGallery"
              elem={ index === currentSlide ? 'slides-active' : 'slides' }
              onClick={ () => {
                  OpenSlider(true, index);
              } }
            >
                <Image
                  key={ index }
                  src={ url }
                  ratio="custom"
                  mix={ {
                      block: 'ProductGallery',
                      elem: 'SliderImage',
                      mods: { isPlaceholder: !url }
                  } }
                  isPlaceholder={ !url }
                  showIsLoading={ showLoader }
                />
            </div>
        );
    }

    renderProductSlider() {
        const {
            product: {
                thumbnail: { url: thumbnailUrl } = {}
            },
            gallery
        } = this.props;

        if (!gallery.length && !thumbnailUrl) {
            return (
                <Image
                  ratio="custom"
                  mix={ {
                      block: 'SeedsmanProductGallery',
                      elem: 'SliderImage',
                      mods: { isPlaceholder: true }
                  } }
                  isPlaceholder
                />
            );
        }

        if (!gallery.length) {
            return (
                <div block="SeedsmanProductGallery" elem="ThumbnailImg">
                    <img src={ thumbnailUrl } alt="img" />
                </div>
            );
        }

        return (
            <div block="SeedsmanProductGallery" elem="slider">
                <div block="SeedsmanProductGallery" elem="ProductSlider">
                    <div block="SeedsmanProductGallery" elem="Content">
                        { gallery?.map((val, i) => {
                            const {
                                base: { url } = {}, disabled
                            } = val;

                            if (disabled) {
                                return null;
                            }

                            return this.renderMainProductImage(url, i);
                        }) }
                        { this.renderLabels() }
                    </div>
                </div>
            </div>
        );
    }

    renderProductPopUpSlider() {
        const {
            gallery,
            PrevSlides,
            NextSlides,
            OpenSlider,
            currentSlide,
            visible
        } = this.props;

        return (
            <div
              block="SeedsmanProductGallery"
              elem={ visible ? 'PopUp-slider' : 'PopUp-slider-Hide' }
            >
                <div block="SeedsmanProductGallery" elem="PopUp-ProductSlider">
                    <div block="SeedsmanProductGallery" elem="PopUp-Content">
                        <span
                          block="SeedsmanProductGallery"
                          elem="close-cursor"
                          onClick={ () => {
                              OpenSlider(false, currentSlide);
                          } }
                        >
                            <span block="close-img">
                                <svg
                                  clipRule="evenodd"
                                  fillRule="evenodd"
                                  fill="black"
                                  strokeLinejoin="round"
                                  strokeMiterlimit="2"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="m12 10.93 5.719-5.72c.146-.146.339-.219.531-.219.404 0 .75.324.75.749 0 .193-.073.385-.219.532l-5.72 5.719 5.719 5.719c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-5.719-5.719-5.719 5.719c-.146.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l5.719-5.719-5.72-5.719c-.146-.147-.219-.339-.219-.532 0-.425.346-.749.75-.749.192 0 .385.073.531.219z" />
                                </svg>
                            </span>
                        </span>
                        { gallery?.map((val, i) => {
                            const {
                                base: { url } = {}, disabled
                            } = val;

                            if (disabled) {
                                return null;
                            }

                            return (
                                    <div
                                      block="SeedsmanProductGallery"
                                      elem={ i === currentSlide
                                          ? 'slides-active'
                                          : 'slides' }
                                    >
                                        <img src={ url } alt="img" />
                                    </div>
                            );
                        }) }
                    </div>
                    <span
                      block="SeedsmanProductGallery"
                      elem="prev"
                      onClick={ PrevSlides }
                    >
                        <img src={ preArrow } alt="img" />
                    </span>
                    <span
                      block="SeedsmanProductGallery"
                      elem="next"
                      onClick={ NextSlides }
                    >
                        <img src={ nextArrow } alt="img" />
                    </span>
                </div>
            </div>
        );
    }

    renderLabel = (labelData) => {
        const {
            ruleId,
            productId,
            positionStyle,
            textStyle,
            customCss,
            imageSrc,
            label,
            tooltipLabel,
            fontUrl
        } = labelData;

        return (
          <ProductLabel
            key={ `${productId}_${ruleId}` }
            ruleId={ ruleId }
            productId={ productId }
            positionStyle={ positionStyle }
            textStyle={ textStyle }
            customCss={ customCss }
            imageSrc={ imageSrc }
            label={ label }
            fontUrl={ fontUrl }
            tooltipLabel={ tooltipLabel }
          />
        );
    };

    renderLabels() {
        const { labels } = this.props;
        return labels.map(this.renderLabel);
    }

    render() {
        return (
            <div block="SeedsmanProductGallery">
                { this.renderProductGellaryImages() }
                { this.renderProductSlider() }
                { this.renderProductPopUpSlider() }
            </div>
        );
    }
}

export default SeedsmanProductGalleryComponent;
