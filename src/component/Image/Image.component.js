import {
    Image as SourceImage
} from 'SourceComponent/Image/Image.component';
import { isCrawler } from 'Util/Browser';

import './Image.override.style.scss';

/** @namespace Seedsman/Component/Image/Component */
export class ImageComponent extends SourceImage {
    renderDefaultImage() {
        const {
            src,
            alt,
            title,
            wrapperSize,
            ratio,
            mix,
            imageRef,
            className
        } = this.props;

        return (
            <div
              block="Image"
              elem="Default Image"
              ref={ imageRef }
              mods={ {
                  ratio
              } }
              mix={ mix }
              style={ wrapperSize }
              className={ className }
            >
                <img
                  style={ wrapperSize }
                  src={ src || '' }
                  alt={ alt }
                  title={ title }
                />
            </div>
        );
    }

    render() {
        const {
            ratio,
            mix,
            isPlaceholder,
            wrapperSize,
            src,
            imageRef,
            className,
            isPlain
        } = this.props;

        const { imageStatus } = this.state;

        if (isCrawler()) {
            return this.renderDefaultImage();
        }

        // render image as is: without additional container and additional styles
        if (isPlain) {
            return this.renderImage();
        }

        return (
            <div
              block="Image"
              ref={ imageRef }
              mods={ {
                  ratio,
                  imageStatus: imageStatus.toLowerCase(),
                  isPlaceholder,
                  hasSrc: !!src
              } }
              mix={ mix }
              style={ wrapperSize }
              // eslint-disable-next-line react/forbid-dom-props
              className={ className }
            >
                { this.renderImage() }
                { this.renderLoader() }
            </div>
        );
    }
}

export default ImageComponent;
