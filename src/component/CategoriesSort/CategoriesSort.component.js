/* eslint-disable no-undef */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
/* eslint-disable array-callback-return */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { PureComponent } from 'react';

import Field from 'Component/Field';
import FIELD_TYPE from 'Component/Field/Field.config';

import './CategoriesSort.style';
/** @namespace Seedsman/Component/CategoriesSort/Component */
export class CategoriesSortComponent extends PureComponent {
    handleSort = this.handleSort.bind(this);

    handleSort(value) {
        const { onSortChange } = this.props;
        const [direction, ...key] = value.split(' ');
        if (value !== 'name') {
            onSortChange(direction, key);
        }
    }

    render() {
        const { sortFields, selectedSortVal } = this.props;
        if (!sortFields) {
            return null;
        }

        return (
            <div block="CategoriesSort">
                <div block="CategorySort" elem="MobileWrapper">
                    { sortFields.map((sortLabel) => (
                            <Field
                              type={ FIELD_TYPE.radio }
                              attr={ {
                                  id: 'category-sort',
                                  name: 'category-sort',
                                  defaultValue: `${sortLabel.value} ${'name'}`,
                                  noPlaceholder: true,
                                  defaultChecked: selectedSortVal === sortLabel.value
                              } }
                              events={ { onChange: () => this.handleSort(`${sortLabel.value} ${'name'}`) } }
                              label={ sortLabel.label }
                              mix={ { block: 'CategoryListWidgetBreeders', elem: 'SortRadio' } }
                            />
                    )) }

                </div>
            </div>
        );
    }
}
export default CategoriesSortComponent;
