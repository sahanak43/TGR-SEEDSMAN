/* eslint-disable fp/no-let */
/* eslint-disable max-len */
/* eslint-disable consistent-return */
/* eslint-disable max-lines */
import { connect } from 'react-redux';

import { CMS_PAGE } from 'Component/Header/Header.config';
import CmsPageQuery from 'Query/CmsPage.query';
import { LOADING_TIME } from 'SourceRoute/CmsPage/CmsPage.config';
import { CmsPageContainer as SourceCmsPageContainer, mapDispatchToProps, mapStateToProps } from 'SourceRoute/CmsPage/CmsPage.container';
import { debounce } from 'Util/Request';
import { getCanonicalUrl, getCountryAndLanguageCode, isHomePageUrl } from 'Util/Url';
import { cannabisSeedsSchema } from 'Util/Widget';

import CmsPage from './CmsPage.component';

export const BreadcrumbsDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Breadcrumbs/Breadcrumbs.dispatcher'
);

/** @namespace Seedsman/Route/CmsPage/Container */
export class CmsPageContainer extends SourceCmsPageContainer {
    onPageLoad({ cmsPage: page }) {
        const {
            location: { pathname },
            updateMeta,
            setHeaderState,
            updateBreadcrumbs
        } = this.props;

        const {
            content_heading,
            meta_title,
            title,
            meta_description,
            meta_keywords,
            open_graph_tags: {
                og_description,
                og_title,
                og_url,
                og_site_name
            } = {}
        } = page;

        debounce(this.setOfflineNoticeSize, LOADING_TIME)();

        updateBreadcrumbs(page);
        updateMeta({
            title: meta_title || title,
            description: meta_description,
            keywords: meta_keywords,
            canonical_url: getCanonicalUrl(),
            OgDescription: og_description,
            OgTitle: og_title,
            OgUrl: og_url,
            OgSiteName: og_site_name
        });
        if (!isHomePageUrl(pathname)) {
            setHeaderState({
                name: CMS_PAGE,
                title: content_heading,
                onBackClick: () => history.goBack()
            });
        }

        this.setState({ page, isLoading: false, isPageLoaded: true });
    }

    requestPage() {
        const {
            isOffline, location: {
                pathname
            } = {}
        } = this.props;
        const params = this.getRequestQueryParams();
        if (pathname === '/uk-en/cannabis-seeds') {
            const tag = document.getElementById('cannabis-schema');
            if (tag) {
                document.head.removeChild(tag);
            }
            const script = document.createElement('script');
            script.textContent = cannabisSeedsSchema();
            script.type = 'application/ld+json';
            script.id = 'cannabis-schema';
            script.defer = true;
            document.head.appendChild(script);
        } else {
            const tag = document.getElementById('cannabis-schema');
            if (tag) {
                document.head.removeChild(tag);
            }
        }

        // eslint-disable-next-line prefer-const
        let { id, identifier } = params;

        const { languageCode } = getCountryAndLanguageCode();
        const lang = `-${languageCode}/home`;

        if (identifier && identifier === lang) {
            identifier = 'home';
        }

        if ((identifier && identifier !== 'home') && !id) {
            return null;
        }

        if (!id && !identifier) {
            return null;
        }

        this.setState({ isLoading: true });

        this.fetchData(
            [CmsPageQuery.getQuery(params)],
            this.onPageLoad.bind(this),
            () => this.setState({ isLoading: false }),
            isOffline
        );
    }

    render() {
        return (
            <CmsPage
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CmsPageContainer);
