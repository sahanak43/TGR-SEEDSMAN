import {
    ProductAttributesContainer as SourceProductAttributesContainer
} from 'SourceComponent/ProductAttributes/ProductAttributes.container';
import { getAttributesWithValues } from 'Util/Product';
/** @namespace Seedsman/Component/ProductAttributes/Container */
export class ProductAttributesContainer extends SourceProductAttributesContainer {
    containerProps() {
        const { areDetailsLoaded, product } = this.props;

        return {
            areDetailsLoaded,
            attributesWithValues: getAttributesWithValues(product),
            product
        };
    }
}

export default ProductAttributesContainer;
