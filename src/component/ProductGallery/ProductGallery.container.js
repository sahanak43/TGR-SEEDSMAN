/* eslint-disable fp/no-let */
/* eslint-disable max-lines */
/* eslint-disable max-len */

import { connect } from 'react-redux';
import { Subscribe } from 'unstated';

import ImageZoomPopup from 'Component/ImageZoomPopup';
import SharedTransitionContainer from 'Component/SharedTransition/SharedTransition.unstated';
import { ProductGalleryContainer as SourceProductGalleryContainer } from 'SourceComponent/ProductGallery/ProductGallery.container';
import { ADD_TO_CART } from 'Util/Product';
import { magentoProductTransform, transformParameters } from 'Util/Product/Transform';

import {
    processLabel
} from '../../../node_modules/@scandiweb/mageplaza-product-label/src/util/ProductLabels';
import ProductGallery from './ProductGallery.component';
import {
    AMOUNT_OF_PLACEHOLDERS,
    IMAGE_TYPE,
    PRODUCT_GALERY_POPUP_ID,
    THUMBNAIL_KEY
} from './ProductGallery.config';

/** @namespace Seedsman/Component/ProductGallery/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    isMobile: state.ConfigReducer.device.isMobile,
    isWishlistEnabled: state.ConfigReducer.wishlist_general_active,
    product: state.ProductReducer.product,
    parameters: state.ProductReducer.parameters
});

/** @namespace Seedsman/Component/ProductGallery/Container/mapDispatchToProps */
export const mapDispatchToProps = () => ({});

/** @namespace Seedsman/Component/ProductGallery/Container */
export class ProductGalleryContainer extends SourceProductGalleryContainer {
    containerFunctions = {
        onActiveImageChange: this.onActiveImageChange.bind(this),
        handleZoomChange: this.handleZoomChange.bind(this),
        disableZoom: this.disableZoom.bind(this),
        handleImageZoomPopupActiveChange: this.handleImageZoomPopupActiveChange.bind(this),
        openSlider: this.openSlider.bind(this),
        prevSlides: this.PrevSlides.bind(this),
        nextSlides: this.NextSlides.bind(this),
        onClickScrollSlider: this.onClickScrollSlider.bind(this)
    };

    __construct(props) {
        super.__construct(props);

        const { product: { id } = {} } = props;

        this.state = {
            activeImage: this.getBaseImage(),
            isZoomEnabled: false,
            prevProdId: id,
            isImageZoomPopupActive: false,
            visible: false,
            currentSlide: 0,
            maxValue: 0
        };
    }

    openSlider(isVisible, slide) {
        this.setState({
            visible: isVisible,
            currentSlide: slide
        });
    }

    onClickScrollSlider(slide) {
        this.setState({
            currentSlide: slide
        });
    }

    PrevSlides() {
        const { currentSlide, maxValue } = this.state;

        if (currentSlide > 0) {
            this.setState({
                currentSlide: currentSlide - 1
            });
        } else {
            this.setState({
                currentSlide: maxValue - 1
            });
        }
    }

    NextSlides() {
        const { currentSlide, maxValue } = this.state;

        if (currentSlide < (maxValue - 1)) {
            this.setState({
                currentSlide: currentSlide + 1
            });
        } else {
            this.setState({
                currentSlide: 0
            });
        }
    }

    getMagentoProduct() {
        const { product, product: { attributes }, parameters = {} } = this.props;

        const configurableOptions = transformParameters(parameters, attributes);

        return magentoProductTransform(
            ADD_TO_CART,
            product,
            1,
            [],
            configurableOptions
        );
    }

    getGalleryPictures() {
        const {
            areDetailsLoaded,
            product: {
                media_gallery_entries: mediaGallery = [],
                [THUMBNAIL_KEY]: { url: thumbnailUrl } = {},
                [IMAGE_TYPE]: { url: imageTypeUrl } = {},
                name
            }
        } = this.props;

        const url = imageTypeUrl || thumbnailUrl;

        if (mediaGallery.length) {
            mediaGallery
                .sort((a, b) => a.position - b.position);

            if (mediaGallery.length > 1) { // skip if there are only 1 image and its disabled
                const filterHideImages = mediaGallery.filter(({ disabled }) => !disabled);
                const baseImage = filterHideImages.find((value) => value.types.includes(IMAGE_TYPE));

                const positionsArray = filterHideImages.reduce((acc, item) => {
                    const { position } = item;
                    const { position: baseImgPosition } = baseImage || {};

                    if (baseImgPosition === position) {
                        acc.unshift(item);
                    } else {
                        acc.push(item);
                    }

                    return acc;
                }, []);

                return positionsArray;
            }

            const baseImage = mediaGallery.find((value) => value.types.includes(IMAGE_TYPE));

            const positionsArray = mediaGallery.reduce((acc, item) => {
                const { position } = item;
                const { position: baseImgPosition } = baseImage;

                if (baseImgPosition === position) {
                    acc.unshift(item);
                } else {
                    acc.push(item);
                }

                return acc;
            }, []);

            return positionsArray;
        }

        if (!url) {
            return Array(AMOUNT_OF_PLACEHOLDERS + 1).fill({ media_type: 'placeholder' });
        }

        const placeholders = !areDetailsLoaded
            ? Array(AMOUNT_OF_PLACEHOLDERS).fill({ media_type: 'placeholder' }) : [];

        return [
            {
                thumbnail: { url },
                base: { url },
                id: THUMBNAIL_KEY,
                label: name,
                media_type: IMAGE_TYPE
            },
            ...placeholders
        ];
    }

    getBaseImage() {
        const {
            product: {
                media_gallery_entries: mediaGallery = []
            }
        } = this.props;

        const baseImage = mediaGallery.find((value) => value.types.includes(IMAGE_TYPE));
        const { position = 0 } = baseImage || {};

        if (!mediaGallery.length) {
            return 0;
        }

        const positionsArray = mediaGallery.reduce((acc, item) => {
            const { position } = item;
            const { position: baseImgPosition } = baseImage || {};

            if (baseImgPosition === position) {
                acc.unshift(position);
            } else {
                acc.push(position);
            }

            return acc;
        }, []);

        return positionsArray.findIndex((value) => value === position);
    }

    containerProps() {
        const {
            activeImage, isZoomEnabled, isImageZoomPopupActive, visible,
            currentSlide,
            maxValue
        } = this.state;
        const {
            product: { id },
            isMobile,
            isWithEmptySwitcher,
            showLoader
        } = this.props;
        const magentoProduct = this.getMagentoProduct();

        return {
            gallery: this.getGalleryPictures(),
            productName: this._getProductName(),
            activeImage,
            isZoomEnabled,
            productId: id,
            isMobile,
            isImageZoomPopupActive,
            sliderRef: this.sliderRef,
            isWithEmptySwitcher,
            showLoader,
            magentoProduct,
            labels: this.getLabels(),
            visible,
            currentSlide,
            maxValue
        };
    }

    getLabels() {
        const { product, product: { mp_label_data = [] } = {} } = this.props;

        return mp_label_data.map((labelData) => processLabel(
            labelData,
            product,
            true
        ));
    }

    render() {
        const { isImageZoomPopupActive, activeImage } = this.state;
        const {
            product: { media_gallery_entries }
        } = this.props;

        if (media_gallery_entries) {
            const len = media_gallery_entries.length;
            this.setState({
                maxValue: len
            });
        }

        return (
            <ImageZoomPopup
              isActive={ isImageZoomPopupActive }
              onClose={ this.handleImageZoomPopupClose }
              activeImageId={ activeImage }
              popupId={ PRODUCT_GALERY_POPUP_ID }
            >
                <Subscribe to={ [SharedTransitionContainer] }>
                    { ({ registerSharedElementDestination }) => (
                        <ProductGallery
                          registerSharedElementDestination={ registerSharedElementDestination }
                          { ...this.containerProps() }
                          { ...this.containerFunctions }
                        />
                    ) }
                </Subscribe>
            </ImageZoomPopup>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductGalleryContainer);
