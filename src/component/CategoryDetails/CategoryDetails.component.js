import {
    CategoryDetails as SourceCategoryDetails
} from 'SourceComponent/CategoryDetails/CategoryDetails.component';

import './CategoryDetails.override.style';

/** @namespace Seedsman/Component/CategoryDetails/Component */
export class CategoryDetailsComponent extends SourceCategoryDetails {
    renderCategoryName() {
        return null;
    }

    renderCategoryImage() {
        return null;
    }
}

export default CategoryDetailsComponent;
