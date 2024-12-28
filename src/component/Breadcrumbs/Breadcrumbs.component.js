/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
import ContentWrapper from 'Component/ContentWrapper';
import { Breadcrumbs as SourceBreadcrumbs } from 'SourceComponent/Breadcrumbs/Breadcrumbs.component';
import { Cookies } from 'Util/Cookies';
import { appendWithStoreCode, isHomePageUrl } from 'Util/Url';

import './Breadcrumbs.style';

/**
 * Breadcrumbs
 * @class Breadcrumbs
 * @namespace Seedsman/Component/Breadcrumbs/Component */
export class BreadcrumbsComponent extends SourceBreadcrumbs {
    render() {
        const { breadcrumbs, areBreadcrumbsVisible } = this.props;
        const { pathname = appendWithStoreCode('/') } = location;
        const isFirstTimeCustomer = Cookies.get('isFirstTimeCustomer');

        if (
            !areBreadcrumbsVisible
            || isHomePageUrl(pathname)
            || pathname.match(appendWithStoreCode('/cart'))
            || pathname.match(appendWithStoreCode('/order'))
            || pathname.match(appendWithStoreCode('/wishlist'))
            || pathname.match(appendWithStoreCode('/newsletter'))
             || pathname.match(appendWithStoreCode('/account'))
              || pathname.match(appendWithStoreCode('/customer'))
              || (isFirstTimeCustomer && isFirstTimeCustomer?.value === 'true')
        ) {
            return null;
        }

        return (
            <ContentWrapper mix={ { block: 'Breadcrumbs' } } label="Breadcrumbs (current location)...">
                <nav aria-label="Breadcrumbs navigation">
                    <ul
                      block="Breadcrumbs"
                      elem="List"
                      itemScope
                      itemType="http://schema.org/BreadcrumbList"
                    >
                        { (
                            breadcrumbs.length
                                ? this.renderBreadcrumbList(breadcrumbs)
                                : this.renderBreadcrumb({}, 0)
                        ) }
                    </ul>
                </nav>
            </ContentWrapper>
        );
    }
}

export default BreadcrumbsComponent;
