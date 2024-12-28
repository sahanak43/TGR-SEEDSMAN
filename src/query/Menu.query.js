import { MenuQuery as SourceMenuQuery } from 'SourceQuery/Menu.query';

/**
 * Menu Query
 * @class MenuQuery
 * @namespace Seedsman/Query/Menu/Query */
export class MenuQuery extends SourceMenuQuery {
    _getMenuItemFields() {
        const fields = super._getMenuItemFields();
        fields.push('cms_block_identifier');

        return fields;
    }
}
export default new MenuQuery();
