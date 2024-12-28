import { CONFIGURABLE_OPTIONS_OVERLAY_ID } from
'Component/SideOverlay/SideOverlay.config';
import {
    ProductConfigurableAttributesContainer as SourceProductConfigurableAttributesContainer
} from 'SourceComponent/ProductConfigurableAttributes/ProductConfigurableAttributes.container';
import { publishEvent } from 'Util/Script';

/** @namespace Seedsman/Component/ProductAttributeValue/ProductAtrributeValue/Container */
export class ProductAtrributeValueContainer extends SourceProductConfigurableAttributesContainer {
    state = {
        selectedVariant: null
    };

    containerFunctions = {
        handleOptionClick: this.handleOptionClick.bind(this),
        getSubHeading: this.getSubHeading.bind(this),
        isSelected: this.isSelected.bind(this),
        getLink: this.getLink.bind(this),
        getIsConfigurableAttributeAvailable: this.getIsConfigurableAttributeAvailable.bind(this),
        handleShakeAnimationEnd: this.handleShakeAnimationEnd.bind(this),
        handlePackClick: this.handlePackClick.bind(this)
    };

    containerProps() {
        const {
            configurable_options,
            isExpandable,
            isReady,
            mix,
            numberOfPlaceholders,
            parameters,
            showProductAttributeAsLink,
            updateConfigurableVariant,
            inStock,
            variants,
            addToCartTriggeredWithError,
            updateAddToCartTriggeredWithError,
            isPdp,
            renderPriceWithGlobalSchema,
            getActiveProduct
        } = this.props;
        const { selectedVariant } = this.state;

        return {
            configurable_options,
            isExpandable,
            isReady,
            mix,
            numberOfPlaceholders,
            parameters,
            showProductAttributeAsLink,
            updateConfigurableVariant,
            inStock,
            variants,
            addToCartTriggeredWithError,
            updateAddToCartTriggeredWithError,
            selectedVariant,
            isPdp,
            renderPriceWithGlobalSchema,
            getActiveProduct
        };
    }

    handlePackClick() {
        const { showOverlay, isPdp } = this.props;

        if (isPdp) {
            showOverlay(CONFIGURABLE_OPTIONS_OVERLAY_ID);
        }
    }

    handleOptionClick({ attribute_code, attribute_value }) {
        const { updateConfigurableVariant } = this.props;
        const variant = updateConfigurableVariant(attribute_code, attribute_value);
        publishEvent('insiderIntegration', {
            type: 'SELECTED_VARIANT',
            data: variant
        });

        this.setState({
            selectedVariant: variant
        });
    }
}

export default ProductAtrributeValueContainer;
