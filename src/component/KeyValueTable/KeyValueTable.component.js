import RadioButton from 'Component/RadioButtonIcon';
import { KeyValueTable as SourceKeyValueTable } from 'SourceComponent/KeyValueTable/KeyValueTable.component';

import './KeyValueTable.style';

/** @namespace Seedsman/Component/KeyValueTable/Component */
export class KeyValueTableComponent extends SourceKeyValueTable {
    renderTableRow(data) {
        const { key } = data;
        const value = this.getValueFromSource(data);

        if (!value) {
            return null;
        }

        return (
             <tr key={ key }>
                 <td>{ value }</td>
             </tr>
        );
    }

    renderHeading() {
        const { title, isSelected } = this.props;

        if (!title) {
            return null;
        }

        return (
             <tr>
                 <th
                   block="KeyValueTable"
                   elem="Heading"
                   colSpan={ 2 }
                 >
                     <RadioButton isActive={ isSelected } />
                 </th>
             </tr>
        );
    }
}

export default KeyValueTableComponent;
