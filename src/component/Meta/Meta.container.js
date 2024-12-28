/* eslint-disable max-len */
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { mapDispatchToProps, mapStateToProps as sourceMapStateToProps, MetaContainer as SourceMetaContainer } from 'SourceComponent/Meta/Meta.container';
import { MetaTitleType } from 'Type/Common.type';

/** @namespace Seedsman/Component/Meta/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    ...sourceMapStateToProps(state),
    og_title: state.MetaReducer.OgTitle,
    og_description: state.MetaReducer.OgDescription,
    og_url: state.MetaReducer.og_url,
    og_image: state.MetaReducer.OgImage,
    og_site_name: state.MetaReducer.OgSiteName
});

/** @namespace Seedsman/Component/Meta/Container */
export class MetaContainer extends SourceMetaContainer {
    static propTypes = {
        default_description: PropTypes.string,
        default_keywords: PropTypes.string,
        default_title: PropTypes.string,
        canonical_url: PropTypes.string,
        title_prefix: PropTypes.string,
        title_suffix: PropTypes.string,
        description: PropTypes.string,
        keywords: PropTypes.string,
        title: MetaTitleType,
        robots: PropTypes.string,
        status_code: PropTypes.string,
        og_title: PropTypes.string,
        og_description: PropTypes.string,
        og_url: PropTypes.string
    };

    static defaultProps = {
        default_description: '',
        default_keywords: '',
        default_title: '',
        canonical_url: '',
        title_prefix: '',
        title_suffix: '',
        description: '',
        keywords: '',
        title: '',
        robots: '',
        status_code: '',
        og_title: '',
        og_description: '',
        og_url: ''
    };

    containerProps() {
        const {
            canonical_url,
            default_title,
            title,
            title_prefix,
            title_suffix,
            og_description,
            og_title,
            og_url,
            og_image,
            og_site_name
        } = this.props;

        return {
            metadata: this._getMetadata(),
            canonical_url,
            default_title,
            title,
            title_prefix,
            title_suffix,
            og_title,
            og_description,
            og_url,
            og_image,
            og_site_name
        };
    }

    _generateMetaFromMetadata(metadata, param = 'name') {
        return Object.entries(metadata).reduce((acc, [key, value]) => (
            value
                ? [...acc, { [param]: key, content: `${value}` }]
                : acc
        ), []);
    }

    _getTitle() {
        const { title, default_title } = this.props;

        return String(title || default_title);
    }

    _get_ogtitle() {
        const { og_title, default_title } = this.props;

        return String(og_title || default_title);
    }

    _get_ogdescription() {
        const { og_description, default_description } = this.props;

        return String(og_description || default_description);
    }

    _getDescription() {
        const { description, default_description } = this.props;

        return description || default_description;
    }

    _getOgImage() {
        const { og_image } = this.props;

        if (og_image === null) {
            return null;
        }

        return String(og_image);
    }

    _getRobots() {
        const { robots } = this.props;

        return robots;
    }

    _getStatusCode() {
        const { status_code } = this.props;

        return status_code;
    }

    _getogUrl() {
        const { og_url } = this.props;

        return String(og_url);
    }

    _getOgSiteName() {
        const { og_site_name } = this.props;

        return String(og_site_name);
    }

    _getMetadata() {
        const meta = {
            title: this._getTitle(),
            'og:title': this._get_ogtitle(),
            'og:description': this._get_ogdescription(),
            'og:url': this._getogUrl(),
            'og:image': this._getOgImage(),
            'og:site_name': this._getOgSiteName(),
            description: this._getDescription(),
            keywords: this._getKeywords(),
            robots: this._getRobots(),
            'render:status_code': this._getStatusCode()
        };

        return this._generateMetaFromMetadata(meta);
    }

    _getKeywords() {
        const { keywords } = this.props;
        if (!keywords) {
            return null;
        }

        return keywords;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MetaContainer);
