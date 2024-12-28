/* eslint-disable max-lines */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable max-len */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import ChevronIcon from 'Component/ChevronIcon';
import ProductAttributeValue from 'Component/ProductAttributeValue';
import SideOverlay from 'Component/SideOverlay';
import {
    CONFIGURABLE_OPTIONS_OVERLAY_ID
} from 'Component/SideOverlay/SideOverlay.config';
import {
    ProductConfigurableAttributes as SourceProductConfigurableAttributes
} from 'SourceComponent/ProductConfigurableAttributes/ProductConfigurableAttributes.component';
import { showOfferSeeds } from 'Util/Product/Product';

/** @namespace Seedsman/Component/ProductConfigurableAttributes/Component */
export class ProductConfigurableAttributesComponent extends SourceProductConfigurableAttributes {
    renderSeedsOfferPercent(option) {
        const { variants = [] } = this.props;
        const {
            attribute_options
        } = option;

        const result = variants?.filter((product) => {
            const value = product.attributes?.save_x_percent?.attribute_value ?? '';
            if (value) {
                return value;
            }
        });

        if (!showOfferSeeds(result, attribute_options)) {
            return null;
        }

        return (
                <div block="ProductActions" elem="AttributesContainer">
                <div block="ProductActions" elem="DiscountMessage">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M10 15C10.2833 15 10.521 14.904 10.713 14.712C10.9043
                            14.5207 11 14.2833 11 14V9.975C11 9.69167 10.9043 9.45833
                            10.713 9.275C10.521 9.09167 10.2833 9 10 9C9.71667 9 9.47933
                            9.09567 9.288 9.287C9.096 9.479 9 9.71667 9 10V14.025C9
                            14.3083 9.096 14.5417 9.288 14.725C9.47933 14.9083 9.71667
                            15 10 15ZM10 7C10.2833 7 10.521 6.904 10.713 6.712C10.9043
                            6.52067 11 6.28333 11 6C11 5.71667 10.9043 5.479 10.713
                            5.287C10.521 5.09567 10.2833 5 10 5C9.71667 5 9.47933
                            5.09567 9.288 5.287C9.096 5.479 9 5.71667 9 6C9 6.28333
                            9.096 6.52067 9.288 6.712C9.47933 6.904 9.71667 7 10 7ZM10
                            20C8.61667 20 7.31667 19.7373 6.1 19.212C4.88333 18.6873
                            3.825 17.975 2.925 17.075C2.025 16.175 1.31267 15.1167
                            0.788 13.9C0.262667 12.6833 0 11.3833 0 10C0 8.61667 0.262667
                            7.31667 0.788 6.1C1.31267 4.88333 2.025 3.825 2.925 2.925C3.825
                            2.025 4.88333 1.31233 6.1 0.787C7.31667 0.262333 8.61667 0 10
                            0C11.3833 0 12.6833 0.262333 13.9 0.787C15.1167 1.31233 16.175 2.025 17.075
                            2.925C17.975 3.825 18.6873 4.88333 19.212 6.1C19.7373 7.31667 20
                            8.61667 20 10C20 11.3833 19.7373 12.6833 19.212 13.9C18.6873 15.1167
                            17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6873 13.9 19.212C12.6833
                            19.7373 11.3833 20 10 20ZM10 18C12.2167 18 14.1043 17.221 15.663
                            15.663C17.221 14.1043 18 12.2167 18 10C18 7.78333 17.221 5.89567
                            15.663 4.337C14.1043 2.779 12.2167 2 10 2C7.78333 2 5.896 2.779
                            4.338 4.337C2.77933 5.89567 2 7.78333 2 10C2 12.2167 2.77933
                            14.1043 4.338 15.663C5.896 17.221 7.78333 18 10 18Z"
                              fill="black"
                            />
                    </svg>
                    <div>
                        { showOfferSeeds(result, attribute_options) }
                    </div>
                </div>
                </div>
        );
    }

    renderConfigurableAttributes() {
        const {
            configurable_options,
            isExpandable,
            inStock,
            handleShakeAnimationEnd,
            addToCartTriggeredWithError,
            parameters
        } = this.props;

        return Object.values(configurable_options).map((option) => {
            const {
                attribute_code,
                attribute_label,
                attribute_options,
                attribute_id
            } = option;
            const isUnselected = addToCartTriggeredWithError ? !parameters[attribute_code] : null;
            const [{ swatch_data }] = attribute_options ? Object.values(attribute_options) : [{}];
            const isSwatch = !!swatch_data;

            // render content without heading and subheading
            if (!isExpandable) {
                return isSwatch ? this.renderSwatch(option) : this.renderDropdown(option);
            }

            if (!inStock && !isSwatch) {
                return null;
            }

            return (
                <>
                    { this.renderSeedsOfferPercent(option) }
                    <div key={ attribute_id }>
                        <p
                          block="ProductConfigurableAttributes"
                          elem="Title"
                          mods={ { isUnselected } }
                          onAnimationEnd={ handleShakeAnimationEnd }
                        >
                            { attribute_label }
                        </p>
                        { isSwatch ? this.renderSwatch(option, isUnselected) : this.renderDropdown(option, isUnselected) }
                    </div>
                </>
            );
        });
    }

    renderConfigurableAttributeValue(attribute) {
        const {
            getIsConfigurableAttributeAvailable,
            handleOptionClick,
            getLink,
            isSelected,
            showProductAttributeAsLink,
            inStock,
            variants,
            selectedVariant,
            isPdp,
            updateOfferSeeds,
            getActiveProduct
        } = this.props;

        const { attribute_value } = attribute;

        return (
            <ProductAttributeValue
              key={ attribute_value }
              attribute={ attribute }
              isSelected={ isSelected(attribute) }
              isAvailable={ getIsConfigurableAttributeAvailable(attribute) && inStock }
              onClick={ handleOptionClick }
              getLink={ getLink }
              selectedVariant={ selectedVariant }
              variants={ variants }
              showProductAttributeAsLink={ showProductAttributeAsLink }
              isPdp={ isPdp }
              updateOfferSeeds={ updateOfferSeeds }
              getActiveProduct={ getActiveProduct }
            />
        );
    }

    renderSwatch(option, isUnselected) {
        const {
            handleShakeAnimationEnd, isPdp, handlePackClick, parameters, renderPriceWithGlobalSchema
        } = this.props;
        const {
            attribute_values, attribute_code, attribute_options
        } = option;

        const selectedOption = parameters[attribute_code];
        const selectedOptionLabel = selectedOption ? attribute_options[selectedOption]?.label : 'Choose pack';

        return (
            <>
            <div
              block="ProductConfigurableAttributes"
              elem={ isPdp ? 'ChoiceWrapper' : 'SwatchList' }
              onClick={ handlePackClick }
              key={ attribute_code }
              onAnimationEnd={ handleShakeAnimationEnd }
            >
                { isPdp ? (
                    <div block="LabelWrapper">
                        <span block="label">{ selectedOptionLabel }</span>
                        <span block="price">{ renderPriceWithGlobalSchema() }</span>
                    </div>
                )
                    : (
                        <>
                        { attribute_values.map((attribute_value) => (
                            this.renderConfigurableAttributeValue({ ...option, attribute_value })
                        )) }
                        </>
                    ) }
                { isPdp ? <ChevronIcon /> : null }
            </div>
            { this.renderConfigurableOptionsOverlay(option, isUnselected) }
            </>
        );
    }

    renderConfigurableOptionsOverlay(option, isUnselected) {
        const { isPdp, selectedVariant } = this.props;

        const { attribute_values, attribute_code, attribute_label } = option;

        if (!isPdp) {
            return null;
        }

        return (
            <SideOverlay
              title={ attribute_label }
              id={ CONFIGURABLE_OPTIONS_OVERLAY_ID }
              IsSelectButtonRequired
              selectedVariant={ selectedVariant }
            >
                <div
                  block="ProductConfigurableAttributes"
                  elem="SwatchList"
                  mods={ { isUnselected } }
                  key={ attribute_code }
                >
                    { attribute_values.map((attribute_value) => (
                        this.renderConfigurableAttributeValue({ ...option, attribute_value })
                    )) }
                </div>
            </SideOverlay>
        );
    }

    render() {
        const { isReady, mix } = this.props;

        return (
            <div
              block="ProductConfigurableAttributes"
              mods={ { isLoading: !isReady } }
              mix={ mix }
            >
                { isReady ? this.renderConfigurableAttributes() : this.renderPlaceholders() }
            </div>
        );
    }
}

export default ProductConfigurableAttributesComponent;
