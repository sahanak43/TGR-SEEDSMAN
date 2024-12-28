/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import PropTypes from 'prop-types';

// import { PureComponent } from 'react';
import ContentWrapper from 'Component/ContentWrapper';
import Link from 'Component/Link';
import {
    NoMatch as sourceNoMatch
} from 'SourceRoute/NoMatch/NoMatch.component';
import { scrollToTop } from 'Util/Browser';

import './NoMatch.override.style';

/** @namespace Seedsman/Route/NoMatch/Component */
export class NoMatchComponent extends sourceNoMatch {
    static propTypes = {
        updateBreadcrumbs: PropTypes.func.isRequired,
        cleanUpTransition: PropTypes.func.isRequired,
        updateMetaTagFor404Page: PropTypes.func.isRequired

    };

    componentDidMount() {
        this.updateBreadcrumbs();
        this.cleanUpTransition();
        scrollToTop();
        this.updateMetaTagFor404Page();
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.updateMetaTagFor404Page();
        }
    }

    cleanUpTransition() {
        const { cleanUpTransition } = this.props;

        cleanUpTransition();
    }

    updateBreadcrumbs() {
        const { updateBreadcrumbs } = this.props;
        const breadcrumbs = [
            {
                url: '',
                name: __('Not Found')
            }
        ];

        updateBreadcrumbs(breadcrumbs);
    }

    updateMetaTagFor404Page() {
        const metaTag = document.querySelector('meta[name="robots"]');

        if (metaTag) {
            metaTag.setAttribute('content', 'NOINDEX,FOLLOW');
        }
    }

    render() {
        return (
            <main block="NoMatch" aria-label={ __('Page not found') }>
                <ContentWrapper
                  mix={ { block: 'NoMatch' } }
                  wrapperMix={ { block: 'NoMatch', elem: 'Wrapper' } }
                  label={ __('Page Not Found Content') }
                >
                    <h1>
                        Oops!
                    </h1>
                    <p block="NoMatch" elem="Subtitle">
                        We&apos;re sorry, we can&apos;t find the page you&apos;re looking for.
                    </p>
                    <p>
                        { /* eslint-disable-next-line max-len */ }
                        It&apos;s just a 404 error! However, we&apos;ve listed our trending products below. Or go back to shopping all cannabis seeds by category or breeder.
                    </p>
                    <div block="NoMatch" elem="NewLinks">
                        <Link
                          to="/cannabis-seed-breeders"
                          block="NoMatch"
                          elem="Button"
                          mix={ { block: 'Button' } }
                        >
                            { __('Breeders') }
                        </Link>
                        <Link
                          to="/cannabis-seeds"
                          block="NoMatch"
                          elem="Button"
                          mix={ { block: 'Button' } }
                        >
                            { __('Cannabis Seeds') }
                        </Link>
                    </div>
                    <Link
                      to="/"
                      block="NoMatch"
                      elem="Button"
                      mix={ { block: 'Button' } }
                    >
                        { __('Back to homepage') }
                    </Link>
                </ContentWrapper>
            </main>
        );
    }
}

export default NoMatchComponent;
