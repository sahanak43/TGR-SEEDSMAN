/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
/* eslint-disable react/no-unused-state */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { createPortal } from 'react-dom';

import { MetaTitleType } from 'Type/Common.type';

/**
 * Page Meta data
 * @class Meta
 * @namespace Seedsman/Component/Meta/Component */
export class MetaComponent extends PureComponent {
    static propTypes = {
        metadata: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string,
                property: PropTypes.string,
                content: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.number
                ])
            })
        ).isRequired,
        canonical_url: PropTypes.string,
        default_title: PropTypes.string.isRequired,
        title_prefix: PropTypes.string.isRequired,
        title_suffix: PropTypes.string.isRequired,
        OgTitle: PropTypes.string,
        OgDescription: PropTypes.string,
        OgUrl: PropTypes.string,
        title: MetaTitleType
    };

    static defaultProps = {
        title: '',
        canonical_url: '',
        OgTitle: '',
        OgDescription: '',
        OgUrl: ''
    };

    componentDidMount() {
        Array.prototype.slice.call(
            document.head.querySelectorAll('title[data-prerendered], meta[data-prerendered]')
        ).forEach((tag) => {
            document.head.removeChild(tag);
        });
        this.setState({
            canonical_url: this.pageNumberFromUrl()
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            this.setState({
                canonical_url: this.pageNumberFromUrl()
            });
        }
    }

    pageNumberFromUrl() {
        const { canonical_url } = this.props;
        const urlParams = new URLSearchParams(window.location.search);
        const pageNumber = urlParams.get('page');

        if (pageNumber && parseInt(pageNumber, 10) > 1) {
            return pageNumber ? `${window.location.origin}${window.location.pathname}?page=${pageNumber}` : '';
        }

        return canonical_url;
    }

    renderTitle() {
        const {
            default_title,
            title_prefix,
            title_suffix,
            title,
            OgTitle,
            OgUrl,
            OgDescription
        } = this.props;

        const titlePrefix = title_prefix ? `${ title_prefix } | ` : '';
        const titleSuffix = title_suffix ? ` | ${ title_suffix }` : '';

        return (
            <>
            <title>
                { `${ titlePrefix }${ title || default_title }${ titleSuffix }` }
            </title>
            { (OgTitle && OgUrl && OgDescription) && (
                    <ogdata>
                        { `${ OgDescription }${ OgTitle }${OgUrl}` }
                    </ogdata>
            ) }
            </>
        );
    }

    renderCanonical() {
        const { canonical_url } = this.state || this.props;

        if (!canonical_url) {
            return null;
        }

        return (
            <link rel="canonical" href={ canonical_url } />
        );
    }

    renderMeta() {
        const { metadata } = this.props;

        return (
            <>
                { this.renderTitle() }
                { this.renderCanonical() }
                { metadata.map((tag) => {
                    const {
                        name = null,
                        property = null,
                        content = null
                    } = tag;

                    return (
                        <meta
                          key={ name || property }
                          name={ name }
                          content={ content }
                        />
                    );
                }) }
            </>
        );
    }

    render() {
        return createPortal(
            { ...this.renderMeta() },
            document.head
        );
    }
}

export default MetaComponent;
