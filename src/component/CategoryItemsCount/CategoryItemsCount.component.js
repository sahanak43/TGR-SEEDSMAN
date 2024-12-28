import TextPlaceholder from 'Component/TextPlaceholder';
import {
    CategoryItemsCount as SourceCategoryItemsCount
} from 'SourceComponent/CategoryItemsCount/CategoryItemsCount.component';
/** @namespace Seedsman/Component/CategoryItemsCount/Component */
export class CategoryItemsCountComponent extends SourceCategoryItemsCount {
    render() {
        const {
            totalItems,
            isMatchingListFilter
        } = this.props;

        return (
            <p block="CategoryPage" elem="ItemsCount">
                <TextPlaceholder
                  content={ (!isMatchingListFilter
                      ? 'Products are loading...'
                      : __('%s %s', totalItems, totalItems > 1 ? 'Results Found' : 'Result Found')
                  ) }
                />
            </p>
        );
    }
}

export default CategoryItemsCountComponent;
