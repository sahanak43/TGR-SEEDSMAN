/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import { PureComponent } from 'react';

import Breeders from 'Component/Breeders';
import CategoryListWidget from 'Component/CategoryListWidget';
// import './CategoryListWidget.style';
/** @namespace Seedsman/Component/CategoryListWidgetFactory/Component */
export class CategoryListWidgetFactoryComponent extends PureComponent {
    render() {
        const categoryCount = this.props['data-categoryCount'];

        if (categoryCount === 0) {
            return (
                <div block="CategoryListWidget" elem="breeders">
                <Breeders dataContent={ this.props } />
                </div>
            );
        }

        return (
                <div block="CategoryListWidget" elem="CategoryListWidget">
                <CategoryListWidget dataContent={ this.props } />
                </div>
        );
    }
}

export default CategoryListWidgetFactoryComponent;
