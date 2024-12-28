import CmsBlockQuery from 'Query/CmsBlock.query';
import {
    CmsBlockContainer as SourceCmsBlockContainer
} from 'SourceComponent/CmsBlock/CmsBlock.container';
import { fetchQuery } from 'Util/Request';

/** @namespace Seedsman/Component/CmsBlock/Container */
export class CmsBlockContainer extends SourceCmsBlockContainer {
    async _getCmsBlock() {
        const { identifier } = this.props;
        if (!identifier) {
            return;
        }
        const { cmsBlocks: { items } } = await fetchQuery(
            [CmsBlockQuery.getQuery({ identifiers: [identifier] })]
        );

        if (!items.length) {
            return;
        }

        this.setState({ cmsBlock: items[0] });
    }
}

export default CmsBlockContainer;
