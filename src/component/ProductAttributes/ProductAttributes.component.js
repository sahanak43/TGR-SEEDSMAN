/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable max-len */
import ExpandableContent from 'Component/ExpandableContent';
import Html from 'Component/Html';
import {
    ProductAttributes as SourceProductAttributes
} from 'SourceComponent/ProductAttributes/ProductAttributes.component';
import { htmlParse } from 'Util/HtmlParser';

/** @namespace Seedsman/Component/ProductAttributes/Component */
export class ProductAttributesComponent extends SourceProductAttributes {
    renderContent() {
        const { attributesWithValues, product } = this.props;
        const { configurable_options = {}, exclude_in_characteristics = [] } = product;

        return (
            <div block="ProductActions" elem="characteristics">
                <ExpandableContent
                  isArrow
                  heading="Characteristics"
                  mix={ { block: 'ProductIn', elem: 'Content' } }
                  isHeadingRequired
                >
                    <div block="ProductActions" elem="table-characteristics">
                        <table
                          className="data table additional-attributes"
                          id="product-attribute-specs-table"
                        >
                            <tbody>
                                { attributesWithValues && Object.keys(attributesWithValues).map((val) => {
                                    const {
                                        attribute_label, attribute_value, attribute_type, attribute_code
                                    } = attributesWithValues[val];

                                    if (Object.hasOwn(configurable_options, attribute_code)) {
                                        return null;
                                    }

                                    if (exclude_in_characteristics.includes(attribute_code)) {
                                        return null;
                                    }
                                    if (attribute_type === 'select' || attribute_type === 'multiselect') {
                                        const { attribute_options } = attributesWithValues[val];

                                        if (Object.keys(attribute_options).length) {
                                            const values = Object.values(attribute_options);

                                            return (
                                                <tr>
                                                    <th className="col label" scope="row">
                                                        <h4>
                                                            { attribute_label }
                                                        </h4>
                                                    </th>
                                                    <td className="col data" data-th={ attribute_label }>
                                                        <h3>
                                                            { values.map((option, index) => (
                                                                // eslint-disable-next-line react/no-array-index-key
                                                                <span key={ index }>
                                                                    { attribute_type === 'multiselect' ? (
                                                                        <span>
                                                                            { index > 0 && ' | ' }
                                                                            { htmlParse(option.label) }
                                                                        </span>
                                                                    ) : (
                                                                        <Html content={ option.label } />
                                                                    ) }
                                                                </span>
                                                            )) }
                                                        </h3>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    }

                                    if (attribute_value) {
                                        return (
                                            <tr>
                                                <th className="col label" scope="row">
                                                    <h4>
                                                    { attribute_label }
                                                    </h4>
                                                </th>
                                                <td
                                                  className="col data"
                                                  data-th={ attribute_label }
                                                >
                                                    <h3>
                                                    { attribute_value }
                                                    </h3>
                                                </td>
                                            </tr>
                                        );
                                    }

                                    return null;
                                }) }

                            </tbody>
                        </table>
                    </div>
                </ExpandableContent>
            </div>
        );
    }
}

export default ProductAttributesComponent;
