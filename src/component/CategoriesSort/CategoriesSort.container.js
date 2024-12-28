import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { SortDirectionType } from 'Type/Direction.type';

import CategoriesSort from './CategoriesSort.component';

/** @namespace Seedsman/Component/CategoriesSort/Container */
export class CategoriesSortContainer extends PureComponent {
     static propTypes = {
         sortFields: PropTypes.oneOfType([
             PropTypes.bool,
             PropTypes.arrayOf(PropTypes.shape({
                 id: PropTypes.string,
                 label: PropTypes.string
             }))
         ]),
         isMatchingInfoFilter: PropTypes.bool,
         onSortChange: PropTypes.func.isRequired,
         sortKey: PropTypes.string.isRequired,
         selectedSortVal: PropTypes.string.isRequired,
         sortDirection: SortDirectionType.isRequired
     };

     static defaultProps = {
         sortFields: [],
         isMatchingInfoFilter: false
     };

     containerProps() {
         const {
             isMatchingInfoFilter,
             onSortChange,
             sortDirection,
             sortKey,
             selectedSortVal,
             sortFields
         } = this.props;

         return {
             isMatchingInfoFilter,
             onSortChange,
             sortDirection,
             sortKey,
             selectedSortVal,
             sortFields
         };
     }

     render() {
         return (
             <CategoriesSort
               { ...this.containerProps() }
             />
         );
     }
}

export default CategoriesSortContainer;
