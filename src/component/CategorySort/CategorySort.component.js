/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
import { connect } from 'react-redux';

import Field from 'Component/Field';
import FIELD_TYPE from 'Component/Field/Field.config';
import { CategorySort as SourceCategorySort } from 'SourceComponent/CategorySort/CategorySort.component';

import './CategorySort.style';

/** @namespace Seedsman/Component/CategorySort/Component/mapStateToProps */
export const mapStateToProps = (state) => ({
    device: state.ConfigReducer.device
});

/** @namespace Seedsman/Component/CategorySort/Component/mapDispatchToProps */
export const mapDispatchToProps = () => ({});

/**
 * Product Sort
 * @class ProductSort
 * @namespace Seedsman/Component/CategorySort/Component */
export class CategorySortComponent extends SourceCategorySort {
    renderSortField() {
        const {
            sortKey,
            sortDirection,
            isMatchingInfoFilter,
            device,
            selectOptions
        } = this.props;

        const sortingIndex = `${sortDirection} ${sortKey}`;

        if (!isMatchingInfoFilter) {
            return this.renderPlaceholder();
        }

        if (device.isMobile) {
            return (
                <div block="CategorySort" elem="MobileWrapper">
                    { selectOptions.map((option) => (
                        <Field
                          type={ FIELD_TYPE.radio }
                          attr={ {
                              id: 'category-sort',
                              name: 'category-sort',
                              defaultValue: option.value,
                              noPlaceholder: true,
                              defaultChecked: sortingIndex === option.id
                          } }
                          label={ option.label }
                          events={ {
                              onChange: () => this.onChange(option.value)
                          } }
                          isSortSelect
                          options={ selectOptions }
                        />
                    )) }
                </div>
            );
        }

        return (
            <Field
              type={ FIELD_TYPE.select }
              attr={ {
                  id: 'category-sort',
                  name: 'category-sort',
                  defaultValue: `${sortDirection} ${sortKey}`,
                  noPlaceholder: true
              } }
              events={ {
                  onChange: this.onChange
              } }
              isSortSelect
              options={ selectOptions }
              mix={ { block: 'CategorySort', elem: 'Select' } }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategorySortComponent);
