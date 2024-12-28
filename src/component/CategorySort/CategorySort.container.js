/* eslint-disable max-len */
import { CategorySortContainer as SourceCategorySortContainer } from 'SourceComponent/CategorySort/CategorySort.container';

/** @namespace Seedsman/Component/CategorySort/Container */
export class CategorySortContainer extends SourceCategorySortContainer {
    _getLabel(option) {
        const { id, label: pureLabel } = option;

        // eslint-disable-next-line fp/no-let
        let [label] = pureLabel.split(' ');
        label = label.charAt(0).toUpperCase() + label.slice(1);

        switch (id) {
        case 'name':
            return {
                asc: __('Name: A to Z', label),
                desc: __('Name: Z to A', label)
            };
        case 'position':
            return {
                asc: __('Position')
            };
        case 'price':
            return {
                asc: __('%s: Low to High', label),
                desc: __('%s: High to Low', label)
            };
        case 'none':
            return {
                asc: __('Position')
            };
        default:
            return {
                asc: __('%s: Ascending', label),
                desc: __('%s: Descending', label)
            };
        }
    }
}

export default CategorySortContainer;
