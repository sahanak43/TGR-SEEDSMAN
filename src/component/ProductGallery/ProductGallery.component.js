/* eslint-disable no-magic-numbers */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable max-lines */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */

import PropTypes from 'prop-types';
import {
    createRef
} from 'react';
import { withRouter } from 'react-router';
import { TransformWrapper } from 'react-zoom-pan-pinch';

import {
    ARROW_SAFE_AREA,
    CAROUSEL_ITEM_GAP,
    CAROUSEL_ITEM_WIDTH
} from 'Component/CarouselScroll/CarouselScroll.config';
import Image from 'Component/Image';
import { Product } from 'Component/Product/Product.component';
import ProductGalleryBaseImage from 'Component/ProductGalleryBaseImage';
import ProductGalleryThumbnailImage from 'Component/ProductGalleryThumbnailImage';
import Slider from 'Component/Slider';
import VideoPopup from 'Component/VideoPopup';
import VideoThumbnail from 'Component/VideoThumbnail';
import { RefType } from 'Type/Common.type';
import { LocationType } from 'Type/Router.type';
import CSS from 'Util/CSS';
import nextArrow from 'Util/images/Path 76407 (1).svg';
import preArrow from 'Util/images/Path 76407.svg';

import ProductLabel from '../../@scandiweb/mageplaza-product-label/component/ProductLabel';
import {
    IMAGE_TYPE,
    MAX_ZOOM_SCALE,
    PLACEHOLDER_TYPE,
    VIDEO_TYPE
} from './ProductGallery.config';

import './ProductGallery.style';

/**
 * Product gallery
 * @class ProductGallery
 * @namespace Seedsman/Component/ProductGallery/Component */
export class ProductGalleryComponent extends Product {
    static propTypes = {
        gallery: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.oneOfType([
                    PropTypes.number,
                    PropTypes.string
                ]),
                image: PropTypes.string,
                isPlaceholder: PropTypes.bool,
                alt: PropTypes.string,
                type: PropTypes.string,
                media_type: PropTypes.string
            })
        ).isRequired,
        productId: PropTypes.number,
        isZoomEnabled: PropTypes.bool.isRequired,
        activeImage: PropTypes.number.isRequired,
        onActiveImageChange: PropTypes.func.isRequired,
        handleZoomChange: PropTypes.func.isRequired,
        registerSharedElementDestination: PropTypes.func.isRequired,
        disableZoom: PropTypes.func.isRequired,
        location: LocationType.isRequired,
        sliderRef: RefType.isRequired,
        handleImageZoomPopupActiveChange: PropTypes.func.isRequired,
        isMobile: PropTypes.bool.isRequired,
        isImageZoomPopupActive: PropTypes.bool.isRequired,
        isWithEmptySwitcher: PropTypes.bool.isRequired,
        showLoader: PropTypes.bool.isRequired
    };

    static defaultProps = {
        productId: 0
    };

    maxScale = MAX_ZOOM_SCALE;

    imageRef = createRef();

    galleryRef = createRef();

    state = {
        scrollEnabled: true,
        slidesCount: 2,
        prevZoom: false
    };

    handleSliderClick = this.handleSliderClick.bind(this);

    calculateGallerySize = this._calculateGallerySize.bind(this);

    onWheel = this.onWheel.bind(this);

    __construct(props, context) {
        super.__construct(props, context);
        this.renderSlide = this.renderSlide.bind(this);
    }

    componentDidMount() {
        this.updateSharedDestinationElement();
        window.addEventListener('resize', this.calculateGallerySize);
    }

    componentDidUpdate(prevProps) {
        const {
            productId,
            location: { pathname },
            sliderRef,
            isImageZoomPopupActive
        } = this.props;

        const {
            productId: prevProductId,
            location: { pathname: prevPathname }
        } = prevProps;

        const { prevZoom } = this.state;

        if (productId !== prevProductId) {
            this.updateSharedDestinationElement();
        }

        if (sliderRef?.current?.draggableRef && pathname !== prevPathname) {
            CSS.setVariable(
                sliderRef.current.draggableRef,
                'animation-speed',
                0
            );
        }

        if (isImageZoomPopupActive !== prevZoom) {
            this.handleZoomChange(isImageZoomPopupActive);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.calculateGallerySize);
    }

    handleZoomChange(prevZoom) {
        setTimeout(this.calculateGallerySize, 0);
        this.setState({ prevZoom });
    }

    _calculateGallerySize() {
        const { isMobile } = this.props;
        const ref = this.galleryRef.current;

        if (!ref || isMobile) {
            return;
        }
        const { width } = ref.getBoundingClientRect();

        const slidesCount = Math.floor((width - ARROW_SAFE_AREA * 2) / (CAROUSEL_ITEM_WIDTH + CAROUSEL_ITEM_GAP));
        this.setState({ slidesCount });
    }

    handleSliderClick(bool) {
        const {
            handleImageZoomPopupActiveChange,
            gallery,
            activeImage,
            openSlider,
            isMobile
        } = this.props;

        const { media_type } = gallery[activeImage];

        if (media_type === VIDEO_TYPE) {
            return;
        }

        if (isMobile) {
            handleImageZoomPopupActiveChange(true);
        } else {
            openSlider(bool, activeImage);
        }
    }

    updateSharedDestinationElement() {
        const { registerSharedElementDestination } = this.props;
        registerSharedElementDestination(this.imageRef);
    }

    renderAdditionalPicture(media, index = 0) {
        const {
            product: {
                alt_text = ''
            } = {}
        } = this.props;

        return (
            <ProductGalleryThumbnailImage
              key={ index }
              media={ media }
              altText={ alt_text }
            />
        );
    }

    /**
     * Renders a video thumbnail which opens popup player on click/tap
     * @param media
     * @param index
     * @returns {*}
     * @private
     */
    renderVideo(media, index) {
        const { isImageZoomPopupActive, handleImageZoomPopupActiveChange } = this.props;

        return (
            <VideoThumbnail
              key={ index }
              media={ media }
              isVideoZoomed={ isImageZoomPopupActive }
              onZoomedVideoClick={ handleImageZoomPopupActiveChange }
            />
        );
    }

    renderPlaceholder(index) {
        return (
            <Image
              key={ index }
              ratio="custom"
              mix={ {
                  block: 'ProductGallery',
                  elem: 'SliderImage',
                  mods: { isPlaceholder: true }
              } }
              isPlaceholder
            />
        );
    }

    stopScrolling() {
        this.setState({ scrollEnabled: false });
        this.timeout = setTimeout(() => {
            this.setState({ scrollEnabled: true });
            this.timeout = null;

            // 20 ms is time give to scroll down, usually that is enough
            // eslint-disable-next-line no-magic-numbers
        }, 20);
    }

    onWheel(zoomState) {
        const { scale } = zoomState;

        if (this.timeout) {
            return;
        }

        if (scale === 1 || scale === MAX_ZOOM_SCALE) {
            this.stopScrolling();
        }
    }

    /**
     * Renders a product image to be displayed in the gallery
     * @param mediaData
     * @param index
     * @returns {*}
     * @private
     */
    renderImage(mediaData, index) {
        const {
            isZoomEnabled,
            handleZoomChange,
            disableZoom,
            isMobile,
            isImageZoomPopupActive,
            showLoader,
            product: {
                alt_text = ''
            }
        } = this.props;
        const { scrollEnabled } = this.state;
        if (!isMobile) {
            const {
                base: { url: baseSrc } = {},
                large: { url: largeSrc } = {}
            } = mediaData;

            const style = isImageZoomPopupActive ? { height: 'auto' } : {};
            const src = isImageZoomPopupActive ? largeSrc : baseSrc;

            return (
                <Image
                  key={ index }
                  src={ src }
                  alt={ alt_text }
                  ratio="custom"
                  mix={ {
                      block: 'ProductGallery',
                      elem: 'SliderImage',
                      mods: { isPlaceholder: !src }
                  } }
                  isPlaceholder={ !src }
                  style={ style }
                  showIsLoading={ showLoader }
                />
            );
        }

        return (
            <TransformWrapper
              key={ index }
              onZoomChange={ handleZoomChange }
              onWheelStart={ this.onWheelStart }
              onWheel={ this.onWheel }
              wheel={ { limitsOnWheel: true, disabled: !scrollEnabled } }
            //   doubleClick={ { mode: 'reset' } }
              pan={ {
                  disabled: !isZoomEnabled,
                  limitToWrapperBounds: true,
                  velocity: false
              } }
              options={ {
                  limitToBounds: true,
                  minScale: 1
              } }
            >
                { ({
                    scale,
                    previousScale,
                    resetTransform,
                    setTransform
                }) => {
                    if (scale === 1 && previousScale !== 1) {
                        resetTransform();
                    }

                    return (
                        <ProductGalleryBaseImage
                          setTransform={ setTransform }
                          index={ index }
                          mediaData={ mediaData }
                          scale={ scale }
                          previousScale={ previousScale }
                          disableZoom={ disableZoom }
                          isZoomEnabled={ isZoomEnabled }
                        />
                    );
                } }
            </TransformWrapper>
        );
    }

    /**
     * Checks for the type of the slide and renders it accordingly
     * @param media
     * @param index
     * @returns {null|*}
     */
    renderSlide(media, index) {
        const { media_type } = media;

        switch (media_type) {
        case IMAGE_TYPE:
            return this.renderImage(media, index);
        case VIDEO_TYPE:
            return this.renderVideo(media, index);
        case PLACEHOLDER_TYPE:
            return this.renderPlaceholder(index);
        default:
            return null;
        }
    }

    renderAdditionalPictures() {
        const {
            gallery,
            isImageZoomPopupActive,
            isWithEmptySwitcher
        } = this.props;

        if (gallery.length === 1) {
            return <div block="ProductGallery" elem="Additional" mods={ { isWithEmptySwitcher } } />;
        }

        return (
            <div block="ProductGallery" elem="Additional" mods={ { isImageZoomPopupActive } }>
                { gallery.slice(0, 3).map(this.renderAdditionalPicture.bind(this)) }
            </div>
        );
    }

    getImageUrl() {
        const {
            gallery: [
                {
                    thumbnail: {
                        url = ''
                    } = {}
                } = {}
            ] = []
        } = this.props;

        return url;
    }

    renderOpenSliderPopupIcon() {
        const { isMobile } = this.props;

        if (isMobile) {
            return null;
        }

        return (
            <div
              block="ProductGallery"
              elem="openSliderPopupIcon"
              onClick={ () => this.handleSliderClick(true) }
            >
                <svg width="30" height="30" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.5 19V13H7.5V17H11.5V19H5.5ZM17.5 11V7H13.5V5H19.5V11H17.5Z" fill="black" />
                </svg>
            </div>
        );
    }

    renderSlider() {
        const {
            gallery,
            activeImage,
            isZoomEnabled,
            onActiveImageChange,
            isImageZoomPopupActive,
            sliderRef
            // isMobile
        } = this.props;

        const mods = {
            isImageZoomPopupActive,
            isZoomInCursor: !isImageZoomPopupActive
        };

        const isMoreThanOnePhoto = gallery.length > 1;

        return (
            <div
              ref={ this.imageRef }
              block="ProductGallery"
              elem="SliderWrapper"
            >
                <meta itemProp="image" content={ this.getImageUrl() } />
                <Slider
                  sliderRef={ sliderRef }
                  mix={ { block: 'ProductGallery', elem: 'Slider', mods } }
                  showCounter
                  showArrows={ isMoreThanOnePhoto }
                  activeImage={ activeImage }
                  onActiveImageChange={ onActiveImageChange }
                  isInteractionDisabled={ isZoomEnabled }
                  sliderHeight={ isImageZoomPopupActive ? '100%' : 0 }
                  isHeightTransitionDisabledOnMount
                  isPdp
                >
                    { gallery.map(this.renderSlide) }
                </Slider>
                { this.renderOpenSliderPopupIcon() }
                { this.renderLabels() }
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

    renderThumbnailImages() {
        const {
            gallery, currentSlide, onClickScrollSlider, product: { name, alt_text }
        } = this.props;

        return (
            <div
              block="ProductGallery"
              elem="PopUp-Thumbnailslider"
            >
                { gallery?.map((val, i) => {
                    const {
                        base: { url } = {},
                        label
                    } = val;

                    // if (disabled) {
                    //     return null;
                    // }
                    return (
                        <div
                          block="ProductGallery"
                          elem={ i === currentSlide
                              ? 'ThumbnailSlides-active'
                              : 'ThumbnailSlides' }
                          onClick={ () => onClickScrollSlider(i) }
                        >
                            <img src={ url } alt={ label || name || alt_text } />
                        </div>
                    );
                }) }
            </div>
        );
    }

    renderProductPopUpSlider() {
        const {
            gallery,
            prevSlides,
            nextSlides,
            openSlider,
            currentSlide,
            visible
        } = this.props;

        return (
            <div
              block="ProductGallery"
              elem={ visible ? 'PopUp-slider' : 'PopUp-slider-Hide' }
            >
                <div block="ProductGallery" elem="PopUp-ProductSlider">
                    <div block="ProductGallery" elem="PopUp-Content">
                        <span
                          block="ProductGallery"
                          elem="close-cursor"
                          onClick={ () => openSlider(false, currentSlide) }
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
                                base: { url } = {}
                            } = val;

                            // if (disabled) {
                            //     return null;
                            // }

                            return (
                                <div>
                                    <div
                                      block="ProductGallery"
                                      elem={ i === currentSlide
                                          ? 'slides-active'
                                          : 'slides' }
                                    >
                                        <img src={ url } alt="img" />
                                    </div>
                                </div>
                            );
                        }) }
                    </div>
                    <span
                      block="ProductGallery"
                      elem="prev"
                      onClick={ prevSlides }
                    >
                        <img src={ preArrow } alt="img" />
                    </span>
                    <span
                      block="ProductGallery"
                      elem="next"
                      onClick={ nextSlides }
                    >
                        <img src={ nextArrow } alt="img" />
                    </span>
                </div>
                { this.renderThumbnailImages() }
            </div>
        );
    }

    render() {
        return (
            <>
            <div block="ProductGallery" ref={ this.galleryRef }>
                { this.renderSlider() }
                { this.renderAdditionalPictures() }
                <VideoPopup />
            </div>
            { this.renderProductPopUpSlider() }
            </>
        );
    }
}

export default withRouter(ProductGalleryComponent);
