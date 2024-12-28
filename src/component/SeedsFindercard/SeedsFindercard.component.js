/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Link from 'Component/Link';
import ProductPrice from 'Component/ProductPrice';
import { getPrice } from 'Util/Product/Extract';

import './SeedsFindercard.style';

/** @namespace Seedsman/Component/SeedsFindercard/Component */
export class SeedsFindercardComponent extends PureComponent {
    static propTypes = {
        // TODO: implement prop-types
    };

    renderProductPrice() {
        const { product } = this.props;

        // if (!isInStock(product)) {
        //     return (
        //         <div block="ProductCompareAttributeRow" elem="OutOfStock">Out of stock</div>
        //     );
        // }

        const {
            price_range, dynamic_price, type_id, id
        } = product;

        const price = getPrice(price_range, dynamic_price, {}, type_id);

        return (
            <ProductPrice
              price={ price }
              key={ id }
              priceType={ type_id }
              isPreview
            />
        );
    }

    renderImage() {
        const { product } = this.props;
        const { small_image } = product;
        return (
            <div block="image-wrapper">
                <div block="product-image">
                    <img src={ small_image.url } alt="img" />
                </div>
            </div>
        );
    }

    renderAttributes(seedsfinder_attribute_status) {
        if (seedsfinder_attribute_status === null) {
            return null;
        }

        return (
            <ul block="product-properties">
                { Object.keys(seedsfinder_attribute_status).length
                    && Object.values(seedsfinder_attribute_status).map((attribute) => {
                        const { attribute_label, attribute_status } = attribute;
                        return (
                            <li
                              block="product-properties"
                              elem="property"
                            >
                              <span
                                block="attribut-status property"
                                elem={ attribute_status
                                    ? 'positive'
                                    : 'negative' }
                              >
                                  { attribute_status ? (
                                      <svg
                                        clipRule="evenodd"
                                        fillRule="evenodd"
                                        fill="white"
                                        strokeLinejoin="round"
                                        strokeMiterlimit="2"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                          <path
                                            d="m2.25 12.321 7.27 6.491c.143.127.321.19.499.19.206 0 .41-.084.559-.249l11.23-12.501c.129-.143.192-.321.192-.5 0-.419-.338-.75-.749-.75-.206 0-.411.084-.559.249l-10.731 11.945-6.711-5.994c-.144-.127-.322-.19-.5-.19-.417 0-.75.336-.75.749 0 .206.084.412.25.56"
                                            fillRule="nonzero"
                                          />
                                      </svg>
                                  ) : (
                                      <svg
                                        clipRule="evenodd"
                                        fillRule="evenodd"
                                        strokeLinejoin="round"
                                        fill="#ffffff"
                                        strokeMiterlimit="2"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                          <path
                                            d="m21 11.75c0-.414-.336-.75-.75-.75h-16.5c-.414 0-.75.336-.75.75s.336.75.75.75h16.5c.414 0 .75-.336.75-.75z"
                                            fillRule="nonzero"
                                          />
                                      </svg>
                                  ) }
                              </span>
                              <span block="attribute-name">{ attribute_label }</span>
                            </li>
                        );
                    }) }
            </ul>
        );
    }

    renderButtonWrapper() {
        const { product } = this.props;

        const { url } = product;
        return (
            <div block="button-wrapper">
                <div block="product-price">
                    <span block="price-complementary-column-value">From</span>

                    <span block="price-regular price">
                        { this.renderProductPrice() }
                    </span>

                    <span block="price-complementary-column-value">
                        per seed
                    </span>
                </div>
                    <Link
                      to={ url }
                      target="_blank"
                      block="go-to-product-button"
                      rel="noreferrer"
                    >
                        Go to product
                    </Link>
            </div>
        );
    }

    renderContent() {
        const { product } = this.props;
        const { name, seedsfinder_attribute_status } = product;

        return (
            <div block="product-container">
                <div block="product">
                    { this.renderImage() }
                    <div block="info-details">
                        <div block="product-details">
                            <div
                              block="product-name"
                            >
                                { name }
                            </div>

                            <p block="properties-title">
                                Attributes according to your choices:
                            </p>

                            { this.renderAttributes(seedsfinder_attribute_status) }
                        </div>

                        { this.renderButtonWrapper() }
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return <div block="SeedsFindercard">{ this.renderContent() }</div>;
    }
}

export default SeedsFindercardComponent;
