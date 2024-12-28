import Image from 'Component/Image';
import { THUMBNAIL_KEY } from 'SourceComponent/ProductGallery/ProductGallery.config';
// eslint-disable-next-line max-len
import { ProductGalleryThumbnailImage as BaseProductGalleryThumbnailImage } from 'SourceComponent/ProductGalleryThumbnailImage/ProductGalleryThumbnailImage.component';
import media, { PRODUCT_MEDIA } from 'Util/Media';

/** @namespace Seedsman/Component/ProductGalleryThumbnailImage/Component */
export class ProductGalleryThumbnailImageComponent extends BaseProductGalleryThumbnailImage {
    renderImage() {
        const {
            media: {
                label: alt,
                file,
                thumbnail: { url: thumbnailUrl } = {},
                id
            },
            altText
        } = this.props;

        if (id === THUMBNAIL_KEY) {
            return this.renderPlaceholder();
        }

        const src = thumbnailUrl || media(file, PRODUCT_MEDIA);
        return (
            <Image
              src={ src }
              alt={ alt || altText }
              ratio="custom"
              mix={ { block: 'ProductGalleryThumbnailImage' } }
            />
        );
    }
}

export default ProductGalleryThumbnailImageComponent;
