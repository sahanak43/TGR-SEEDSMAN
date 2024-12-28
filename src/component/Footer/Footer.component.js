/* eslint-disable max-len */
/* eslint-disable max-lines */
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

import CmsBlock from 'Component/CmsBlock';
import ContentWrapper from 'Component/ContentWrapper';
import Image from 'Component/Image';
import Link from 'Component/Link';
import NewsletterSubscription from 'Component/NewsletterSubscription';
import { Footer as ParentFooter } from 'SourceComponent/Footer/Footer.component';
import { DeviceType } from 'Type/Device.type';
import { noopFn } from 'Util/Common';

import { COLUMN_MAP, RENDER_NEWSLETTER } from './Footer.config';

import './Footer.style';

/**
 * Page footer
 * @class Footer
 * @namespace Seedsman/Component/Footer/Component */
export class FooterComponent extends ParentFooter {
    static propTypes = {
        copyright: PropTypes.string,
        isVisibleOnMobile: PropTypes.bool,
        isVisible: PropTypes.bool,
        device: DeviceType.isRequired,
        newsletterActive: PropTypes.bool.isRequired,
        onItemClick: PropTypes.func
    };

    static defaultProps = {
        copyright: '',
        isVisibleOnMobile: false,
        isVisible: true,
        onItemClick: noopFn
    };

    renderMap = {
        [RENDER_NEWSLETTER]: {
            render: this.renderNewsletterSubscriptionBlock.bind(this)
        }
    };

    shouldComponentUpdate(nextProps) {
        const {
            device: {
                isMobile
            },
            isVisibleOnMobile,
            copyright,
            newsletterActive,
            isCheckout
        } = this.props;

        const {
            device: {
                isMobile: nextIsMobile
            },
            isCheckout: nextIsCheckout,
            isVisibleOnMobile: nextIsVisibleOnMobile,
            copyright: nextCopyright,
            newsletterActive: nextNewsletterActive
        } = nextProps;

        return isMobile !== nextIsMobile
            || isVisibleOnMobile !== nextIsVisibleOnMobile
            || isCheckout !== nextIsCheckout
            || copyright !== nextCopyright
            || newsletterActive !== nextNewsletterActive;
    }

    renderColumnItemContent(src, title) {
        if (!src) {
            return title;
        }

        return (
            <Image
              mix={ { block: 'Footer', elem: 'ColumnItemImage' } }
              src={ src }
            />
        );
    }

    renderColumnItemLink({ href = '/', title, src }, i) {
        const mods = src ? { type: 'image' } : {};
        const { onItemClick } = this.props;

        return (
            <Link
              block="Footer"
              elem="ColumnItem"
              to={ href }
              mods={ mods }
              key={ i }
              aria-label={ title }
              onClick={ onItemClick }
            >
                { this.renderColumnItemContent(src, title) }
            </Link>
        );
    }

    renderColumnItem(item, i) {
        const { render } = item;

        if (render) {
            return this.renderMap[render].render(item, i);
        }

        return this.renderColumnItemLink(item, i);
    }

    renderColumn(column, i) {
        const {
            title,
            columnActiveKey,
            items,
            isItemsHorizontal,
            mods = {}
        } = column;

        const contentMods = isItemsHorizontal ? { direction: 'horizontal' } : {};

        const { [columnActiveKey]: isColumnActive } = this.props;

        if (columnActiveKey && !isColumnActive === true) {
            return null;
        }

        return (
            <div block="Footer" elem="Column" mods={ mods } key={ i }>
                <h3 block="Footer" elem="ColumnTitle">
                    { title }
                </h3>
                <div
                  block="Footer"
                  elem="ColumnContent"
                  mods={ contentMods }
                >
                    { items.map(this.renderColumnItem.bind(this)) }
                </div>
            </div>
        );
    }

    renderColumns() {
        return (
            <ContentWrapper
              isNotSection
              wrapperMix={ { block: 'Footer', elem: 'Columns' } }
              label=""
            >
                { COLUMN_MAP.map(this.renderColumn.bind(this)) }
            </ContentWrapper>
        );
    }

    renderNewsletterSubscriptionBlock() {
        return <NewsletterSubscription key="NewsletterSubscription" />;
    }

    renderTopContent() {
        return <CmsBlock key="footerTop_cms" identifier="newsletter-subscription" />;
    }

    renderContent() {
        return <CmsBlock key="footer_cms" identifier="footer_cms" />;
    }

    renderCopyrightContent() {
        const { copyright } = this.props;

        return (
            <ContentWrapper
              mix={ { block: 'Footer', elem: 'CopyrightContentWrapper' } }
              wrapperMix={ { block: 'Footer', elem: 'CopyrightContent' } }
              label=""
            >
                <span block="Footer" elem="Copyright">
                    { copyright }
                    { ' Powered by ' }
                    { /* eslint-disable-next-line react/forbid-elements */ }
                    <a href="https://scandipwa.com">
                        ScandiPWA
                    </a>
                </span>
            </ContentWrapper>
        );
    }

    render() {
        const {
            isVisibleOnMobile, device, isVisible, isCheckout
        } = this.props;

        if (!isVisible || isCheckout) {
            return null;
        }

        if ((isVisibleOnMobile && !device.isMobile)
            || (isVisibleOnMobile && device.isMobile)) {
            return null;
        }

        return (
            <footer block="Footer" aria-label="Footer">
                { this.renderTopContent() }
                { this.renderContent() }
            </footer>
        );
    }
}

export default FooterComponent;
