/* eslint-disable @scandipwa/scandipwa-guidelines/always-both-mappings */
/* eslint-disable react/prop-types */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-props-destruction */
// import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import {
    AMOUNT_OF_PLACEHOLDERS,
    IMAGE_TYPE,
    THUMBNAIL_KEY
} from 'SourceComponent/ProductGallery/ProductGallery.config';
import { ADD_TO_CART } from 'Util/Product';
import { magentoProductTransform, transformParameters } from 'Util/Product/Transform';

import { processLabel } from '../../../node_modules/@scandiweb/mageplaza-product-label/src/util/ProductLabels';
import SeedsmanProductGallery from './SeedsmanProductGallery.component';

/** @namespace Seedsman/Component/SeedsmanProductGallery/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    device: state.ConfigReducer.device,
    isWishlistEnabled: state.ConfigReducer.wishlist_general_active,
    product: state.ProductReducer.product,
    parameters: state.ProductReducer.parameters
});

/** @namespace Seedsman/Component/SeedsmanProductGallery/Container */
export class SeedsmanProductGalleryContainer extends PureComponent {
  static propTypes = {
      // TODO: implement prop-types
  };

  state = {
      visible: false,
      currentSlide: 0,
      maxValue: 0
  };

  containerFunctions = {
      OpenSlider: this.OpenSlider.bind(this),
      PrevSlides: this.PrevSlides.bind(this),
      NextSlides: this.NextSlides.bind(this)
  };

  OpenSlider(isVisible, slide) {
      this.setState({
          visible: isVisible,
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
      if (currentSlide < maxValue - 1) {
          this.setState({
              currentSlide: currentSlide + 1
          });
      } else {
          this.setState({
              currentSlide: 0
          });
      }
  }

  /**
     * Returns magento graphql compatible product data
     * @returns {*[]}
     */
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
              mediaGallery.filter(({ disabled }) => !disabled);
          }

          const baseImage = mediaGallery.find((value) => value.types.includes(IMAGE_TYPE));

          const positionsArray = mediaGallery.reduce((acc, item) => {
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

  containerProps() {
      const {
          product,
          device,
          isWishlistEnabled,
          parameters,
          showLoader
      } = this.props;

      const { visible, currentSlide, maxValue } = this.state;

      return {
          product,
          device,
          isWishlistEnabled,
          parameters,
          visible,
          currentSlide,
          maxValue,
          showLoader,
          magentoProduct: this.getMagentoProduct(),
          gallery: this.getGalleryPictures(),
          labels: this.getLabels()
      };
  }

  getLabels() {
      const { product, product: { mp_label_data = [] } = {} } = this.props;

      return mp_label_data.map((labelData) => processLabel(
          labelData,
          product,
          false
      ));
  }

  render() {
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
        <SeedsmanProductGallery
          { ...this.containerFunctions }
          { ...this.containerProps() }
        />
      );
  }
}

export default connect(mapStateToProps)(SeedsmanProductGalleryContainer);
