/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
// import { getPriceFilterLabel } from 'Util/Category';
import ExpandableContent from 'Component/ExpandableContent';
import RangeSelector from 'Component/RangeSelector';
import {
    CategoryConfigurableAttributes as SourceCategoryConfigurableAttributes
} from 'SourceComponent/CategoryConfigurableAttributes/CategoryConfigurableAttributes.component';
import { getPriceFilterLabel } from 'Util/Category';

/** @namespace Seedsman/Component/CategoryConfigurableAttributes/Component */
export class CategoryConfigurableAttributesComponent extends SourceCategoryConfigurableAttributes {
    urlStringToObject() {
        const { location: { search = '' } } = this.props;

        return search.substr(1).split('&').reduce((acc, part) => {
            const [key, value] = part.split('=');

            return { ...acc, [key]: value };
        }, {});
    }

    renderDropdownOrSwatch(option) {
        const {
            getSubHeading
        } = this.props;

        const {
            attribute_label,
            attribute_code,
            attribute_options
        } = option;

        const [{ swatch_data }] = attribute_options ? Object.values(attribute_options) : [{}];
        const isSwatch = !!swatch_data;

        const {
            customFilters
        } = this.urlStringToObject();

        // eslint-disable-next-line fp/no-let
        let isExpandable = [];

        if (typeof customFilters !== 'undefined') {
            isExpandable = customFilters.match(attribute_code);
        }

        return (
            <ExpandableContent
            //   key={ attribute_code }
              heading={ attribute_label }
              subHeading={ getSubHeading(option) }
              mix={ {
                  block: 'ProductConfigurableAttributes',
                  elem: 'Expandable'
              } }
              isContentExpanded={ isExpandable ? isExpandable.length > 0 : false }
            >
                { isSwatch ? this.renderSwatch(option) : this.renderDropdown(option) }
            </ExpandableContent>
        );
    }

    renderPriceSwatch(option) {
        const { currencyCode } = this.props;
        const { attribute_options, ...priceOption } = option;

        const {
            getSubHeading,
            handleOptionClick,
            location
        } = this.props;

        const {
            attribute_label,
            attribute_code
        } = priceOption;

        const {
            customFilters
        } = this.urlStringToObject();

        // eslint-disable-next-line fp/no-let
        let isExpandable = [];

        if (typeof customFilters !== 'undefined') {
            isExpandable = customFilters.match(attribute_code);
        }

        if (attribute_options) {
            // do not render price filter if it includes "*_*" aggregation
            if (attribute_options['*_*']) {
                return null;
            }

            priceOption.attribute_options = Object.entries(
                attribute_options
            ).reduce((acc, [key, option]) => {
                const { label: oldLabel } = option;
                const [from, to] = oldLabel.split('~');
                const label = getPriceFilterLabel(from, to, currencyCode);
                acc[key] = { ...option, label };

                return acc;
            }, {});
        }

        return (
            <ExpandableContent
              key={ attribute_code }
              heading={ attribute_label }
              subHeading={ getSubHeading(option) }
              mix={ {
                  block: 'ProductConfigurableAttributes',
                  elem: 'Expandable'
              } }
              isContentExpanded={ isExpandable ? isExpandable.length > 0 : false }
            >
               <RangeSelector
                 location={ location }
                 currencyCode={ currencyCode }
                 attribute={ attribute_code }
                 handleOptionClick={ handleOptionClick }
               />
            </ExpandableContent>
        );

        // return this.renderDropdownOrSwatch(priceOption);
    }
}

export default CategoryConfigurableAttributesComponent;
