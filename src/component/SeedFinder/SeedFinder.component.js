/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable consistent-return */
/* eslint-disable max-lines */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Html from 'Component/Html';
import Link from 'Component/Link';
import Loader from 'Component/Loader';
import ProductPrice from 'Component/ProductPrice';
import SeedsFindercard from 'Component/SeedsFindercard';
import TextPlaceholder from 'Component/TextPlaceholder';
import checkIcon from 'Util/images/check.svg';
import { getPrice } from 'Util/Product/Extract';

import './SeedFinder.style';

/** @namespace Seedsman/Component/SeedFinder/Component */
export class SeedFinderComponent extends PureComponent {
    static propTypes = {
        handleClick: PropTypes.func.isRequired,
        handleClicked: PropTypes.func.isRequired,
        // availableProducts: PropTypes.objectOf.isRequired,
        handleOptionSelect: PropTypes.func.isRequired,
        index: PropTypes.objectOf.isRequired,
        // result: PropTypes.number.isRequired,
        data: PropTypes.objectOf.isRequired,
        questionId: PropTypes.objectOf.isRequired
    };

    renderSteps() {
        const {
            data: questions = [],
            questionId,
            index,
            handleClicked,
            isLoading
        } = this.props;

        const numberOfPlaceholders = 2;

        if (!questions.length) {
            return (
                <TextPlaceholder
                  isLoading={ isLoading }
                  mod="long"
                  length="medium"
                />
            );
        }

        return (
            <div block="Left-Container">
                <ol block="Short-Question1">
                    { !questions.length
                        ? Array.from(
                            { length: numberOfPlaceholders },
                            (_, i) => (
                                  <li>
                                      <TextPlaceholder
                                        key={ i }
                                        isLoading={ isLoading }
                                        mod="long"
                                        length="medium"
                                      />
                                  </li>
                            )
                        )
                        : questions.map((question, questionIndex) => {
                            const isDisabled = questionIndex === 0
                                ? true
                                : index[questionIndex - 1] && true;

                            return (
                                  <li block="QuestionName1 extra">
                                      <button
                                        block={ `QuestionName ${
                                            questionId === questionIndex
                                                ? 'QuestionName-active'
                                                : ''
                                        } ${
                                            Object.prototype.hasOwnProperty.call(
                                                index,
                                                questionIndex
                                            )
                                                ? 'spanChecked'
                                                : ''
                                        }` }
                                        disabled={ !isDisabled }
                                        onClick={ () => handleClicked(questionIndex) }
                                      >
                                          <div>{ questionIndex + 1 }</div>
                                          <p>{ question.title }</p>
                                      </button>
                                  </li>
                            );
                        }) }
                </ol>
            </div>
        );
    }

    renderOptions(options, questionId) {
        const { handleOptionSelect, index, isLoading } = this.props;
        if (!options.length) {
            return null;
        }

        return (
            <div block="OptionContainer">
                <Loader isLoading={ isLoading } />
                { options.map((option, optionID) => {
                    const { attribute_option, status } = option;
                    return (
                        // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
                        <button
                          data-attribute-option={ attribute_option }
                          onClick={ () => {
                              handleOptionSelect(
                                  option,
                                  questionId,
                                  optionID,
                                  attribute_option
                              );
                          } }
                          disabled={ status === 0 }
                          mix={ {
                              mods: { isDisabled: status === 0 },
                              block: 'item'
                          } }
                          key={ `${optionID}-${questionId}` }
                          block={ index[questionId] === attribute_option
                              ? `item ${'active'}`
                              : 'item' }
                        >
                            <div block="OptionImage_section">
                                <img
                                  block="OptionImage"
                                  src={ option.image_url }
                                  alt={ option.attribute_label }
                                />
                            </div>
                            <div block="OptionDetails">
                                <h3>{ option.attribute_option_label }</h3>
                                <div block="OptionDetails" elem="description">
                                    <Html content={ option.description } />
                                </div>
                            </div>
                            <div block="Icon">
                                <img
                                  block="checkIcon"
                                  src={ checkIcon }
                                  alt="checked"
                                />
                            </div>
                        </button>
                    );
                }) }
            </div>
        );
    }

    renderQuestionOptionsBlock() {
        const { data: questions = [], questionId, isLoading } = this.props;

        if (!questions.length) {
            return (
                <div block="SeedFinder">
                    <TextPlaceholder
                      isLoading={ isLoading }
                      mod="long"
                      length="medium"
                    />
                </div>
            );
        }

        if (questionId >= questions.length) {
            return this.renderResults();
        }

        const {
            title = '',
            sub_title = '',
            options = []
        } = questions[questionId];

        return (
            <div block="SeedFinder">
                <div block="Seedsman_block">
                    <h1 block="Questions">
                        { !title ? (
                            <TextPlaceholder isLoading={ isLoading } />
                        ) : (
                            <>{ title }</>
                        ) }
                    </h1>
                    <p block="message">{ sub_title }</p>
                    { this.renderOptions(options, questionId) }
                    { this.renderNextButton() }
                </div>
            </div>
        );
    }

    renderPlaceholders() {
        const numberOfPlaceholders = 9;

        return Array.from({ length: numberOfPlaceholders }, (_, i) => (
            <SeedsFindercard key={ i } product={ {} } />
        ));
    }

    renderProductPrice() {
        const { availableProducts = [] } = this.props;

        // if (!getProductInStock(product)) {
        //     return (
        //         <div block="ProductCompareAttributeRow" elem="OutOfStock">Out of stock</div>
        //     );
        // }

        const {
            price_range, dynamic_price, type_id, id
        } = availableProducts[0];

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

    renderAttributes() {
        const { availableProducts = [] } = this.props;

        const { seedsfinder_attribute_status = {} } = availableProducts[0];

        return (
            <>
                { Object.keys(seedsfinder_attribute_status).length
                    && Object.values(seedsfinder_attribute_status).map(
                        (attribute) => {
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
                        }
                    ) }
            </>
        );
    }

    renderTopProduct() {
        const { availableProducts = [] } = this.props;

        const { small_image, name, url } = availableProducts[0];

        return (
            <div block="top-product-container">
                <div block="top-product">
                    <div block="image-wrapper">
                        <div block="product-image">
                            <img src={ small_image.url } alt="img" />
                        </div>
                    </div>
                    <div block="info-details">
                        <div block="product-details">
                            <div block="product-name">{ name }</div>
                            <div block="product-attributes">
                                <div block="properties-title">
                                    <p>Attributes according to your choices:</p>

                                    <ul block="product-properties">
                                        { this.renderAttributes() }
                                    </ul>
                                </div>
                                <div block="button-wrapper">
                                    <div block="product-price">
                                        <span block="price-complementary-column-value">
                                            From
                                        </span>

                                        <span block="price-regular price">
                                            { this.renderProductPrice(
                                                availableProducts[0]
                                            ) }
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderPerfectProduct() {
        const { availableProducts = [] } = this.props;

        if (!availableProducts.length - 1) {
            return null;
        }

        return (
            <div block="Perfect-match-products  Product-list-container">
                <h3 block="SeedFinder-Subheading">
                    And these seeds also fully match your needs.
                </h3>
                <div block="Product-list">
                    { availableProducts.map((product, i) => {
                        if (i !== 0) {
                            return (
                                <SeedsFindercard
                                  product={ product }
                                    // eslint-disable-next-line react/no-array-index-key
                                  key={ i }
                                />
                            );
                        }

                        return null;
                    }) }
                </div>
            </div>
        );
    }

    renderPartialProducts() {
        const { partialProduct = [] } = this.props;

        if (!partialProduct.length) {
            return null;
        }

        return (
            <div block="Partial-Products Product-list-container">
                <h4 block="SeedFinder-Subheading">
                    These seeds mostly match your criteria.
                </h4>
                <div block="Product-list">
                    { partialProduct.map((product, i) => (
                        <SeedsFindercard
                          product={ product }
                            // eslint-disable-next-line react/no-array-index-key
                          key={ i }
                        />
                    )) }
                </div>
            </div>
        );
    }

    /**
     * TODO:: Display the products list
     * @returns
     */
    renderResults() {
        const { availableProducts = [] } = this.props;

        if (!availableProducts.length) {
            return null;
        }

        return (
            <div block="SeedFinder" elem="result_container">
                <h2 block="SeedFinder-heading">
                    We have found the perfect seeds for you!
                </h2>
                { this.renderTopProduct() }
                { this.renderPerfectProduct() }
                { this.renderPartialProducts() }
            </div>
        );
    }

    renderNextButton() {
        const {
            data: questions = [],
            handleClick,
            index = {},
            questionId,
            isLoading
        } = this.props;
        const isDisabled = !!(index[questionId] && !isLoading);

        return (
            <div block="btn_container">
                <button
                  onClick={ () => handleClick(questions) }
                  block={ !isDisabled ? 'btn isdisabled' : 'btn' }
                  type="button"
                  disabled={ !isDisabled }
                >
                    Next
                </button>
            </div>
        );
    }

    render() {
        return (
            <div block="SeedFinder" elem="TopContainer">
                <div block="TopContainer-inner">
                    { this.renderSteps() }
                    { this.renderQuestionOptionsBlock() }
                </div>
            </div>
        );
    }
}

export default SeedFinderComponent;
