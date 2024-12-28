import Link from 'Component/Link';
import {
    PaginationLink as SourcePaginationLink
} from 'SourceComponent/PaginationLink/PaginationLink.component';

import './PaginationLink.override.style';

/** @namespace Seedsman/Component/PaginationLink/Component */
export class PaginationLinkComponent extends SourcePaginationLink {
    render() {
        const {
            label,
            url_path: pathname,
            isCurrent,
            children,
            isArrowInActive
        } = this.props;

        const search = this.getSearchQueryForPage();

        const { state = {} } = history.state || {};

        return (
             <Link
               to={ {
                   search,
                   pathname,
                   state
               } }
               aria-label={ label }
               block="PaginationLink"
               mods={ { isCurrent, isArrow: typeof children !== 'string', isArrowInActive } }
               aria-current={ isCurrent ? 'page' : 'false' }
             >
                 { children }
             </Link>
        );
    }
}

export default PaginationLinkComponent;
