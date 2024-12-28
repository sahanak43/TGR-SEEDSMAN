/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/prop-types */
/* eslint-disable no-magic-numbers */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { showNotification } from 'SourceStore/Notification/Notification.action';
import { goToPreviousNavigationState } from 'Store/Navigation/Navigation.action';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { hideActiveOverlay, toggleOverlayByKey } from 'Store/Overlay/Overlay.action';

import SocialShare from './SocialShare.component';
import { SOCIAL_SHARE_MOBILE } from './SocialShare.config';

/** @namespace Seedsman/Component/SocialShare/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    device: state.ConfigReducer.device
});

/** @namespace Seedsman/Component/SocialShare/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    showNotification: (type, message) => dispatch(showNotification(type, message)),
    showOverlay: (overlayKey) => dispatch(toggleOverlayByKey(overlayKey)),
    hideActiveOverlay: () => dispatch(hideActiveOverlay()),
    goToPreviousHeaderState: () => dispatch(goToPreviousNavigationState(TOP_NAVIGATION_TYPE))
});

/** @namespace Seedsman/Component/SocialShare/Container */
export class SocialShareContainer extends PureComponent {
    static propTypes = {
        showNotification: PropTypes.func.isRequired,
        showOverlay: PropTypes.func.isRequired,
        hideActiveOverlay: PropTypes.func.isRequired,
        goToPreviousHeaderState: PropTypes.func.isRequired
    };

    containerFunctions = {
        getSize: this.getSize.bind(this),
        openNewWindow: this.openNewWindow.bind(this),
        isNativeShare: this.isNativeShare.bind(this),
        triggerShare: this.triggerShare.bind(this),
        clickToCopyLink: this.clickToCopyLink.bind(this),
        copyClipBoardLink: this.copyClipBoardLink.bind(this)
    };

    state = {
        isClicked: false
    };

    containerProps = () => {
        const {
            description,
            native,
            device: { isMobile },
            isBoth,
            productId,
            contentType
        } = this.props;

        const { isClicked } = this.state;

        return {
            description,
            native,
            isMobile,
            isBoth,
            productId,
            contentType,
            isClicked
        };
    };

    copyClipBoardLink(e, canonicalUrl) {
        this.setState({ isClicked: true });
        this.clickToCopyLink(e, canonicalUrl);

        setTimeout(() => {
            this.setState({ isClicked: false });
        }, 5000);
    }

    /**
     * Returns 75% of the value
     * @param { int } value
     */
    getSize(value) {
        return (value / 100) * 75;
    }

    clickToCopyLink(e, url) {
        const { showNotification, device: { isMobile } } = this.props;
        e.stopPropagation();
        e.preventDefault();
        navigator.clipboard.writeText(url);

        if (!isMobile) {
            showNotification('success', 'Link Copied Successfully');
        }
    }

    /**
     * Opens link in new window
     * @param { String } link
     */
    openNewWindow(e, link) {
        e.stopPropagation();
        e.preventDefault();
        window.open(
            link,
            'name',
            `width=${this.getSize(
                window.screen.availWidth
            )},height=${this.getSize(window.screen.availHeight)}`
        );

        return false;
    }

    /**
     * If native share is enabled returns true
     * @return { Boolean }
     */
    isNativeShare() {
        if (navigator.share) {
            return true;
        }

        return false;
    }

    /**
     * Triggers native share
     * @return { Object } Notification
     */
    async triggerShare(e) {
        e.stopPropagation();
        const { showOverlay } = this.props;
        showOverlay(SOCIAL_SHARE_MOBILE);
    }

    render() {
        return (
            <SocialShare
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SocialShareContainer);
