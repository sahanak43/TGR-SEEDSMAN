/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
import ChevronIcon from 'Component/ChevronIcon';
import Link from 'Component/Link';
import TextPlaceholder from 'Component/TextPlaceholder';
import {
    Breadcrumb as SourceBreadcrumb
} from 'SourceComponent/Breadcrumb/Breadcrumb.component';
import { appendWithStoreCode } from 'Util/Url';

import './Breadcrumb.override.style';

/** @namespace Seedsman/Component/Breadcrumb/Component */
export class BreadcrumbComponent extends SourceBreadcrumb {
    renderLink() {
        const { pathname = appendWithStoreCode('/') } = location;
        const {
            index,
            isDisabled,
            name
        } = this.props;

        const getCustomUrl = { Breeders: '/cannabis-seed-breeders', 'Cannabis Seeds': '/cannabis-seeds' };

        const url = getCustomUrl[name] ? getCustomUrl[name] : this.getLinkUrl() || {};
        const isSearchPage = pathname === pathname.match(appendWithStoreCode('/search'))?.input;
        const isHomePage = url.pathname === appendWithStoreCode('/');

        const nameToString = String(name);

        return (
            <Link
              block="Breadcrumb"
              elem="Link"
              to={ url }
              tabIndex={ isDisabled ? '-1' : '0' }
            >
                <meta itemProp="item" content={ window.location.origin + url.pathname } />
                    { !isHomePage && isSearchPage && (nameToString !== 'Home')
                        ? (
                        <span block="Breadcrumb" elem="Link-Name" itemProp="name">
                            <TextPlaceholder content={ `Results For: '${nameToString}'` } />
                        </span>
                        ) : (
                        <span block="Breadcrumb" elem="Link-Name" itemProp="name">
                            <TextPlaceholder content={ nameToString } />
                        </span>
                        ) }
                <ChevronIcon />
                <meta itemProp="position" content={ index } />
            </Link>
        );
    }
}

export default BreadcrumbComponent;
