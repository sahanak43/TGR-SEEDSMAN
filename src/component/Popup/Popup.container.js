import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    mapDispatchToProps as sourceMapDispatchToProps,
    mapStateToProps as sourceMapStateToProps,
    PopupContainer as SourcePopupContainer
} from 'SourceComponent/Popup/Popup.container';
import { ChildrenType, MixType } from 'SourceType/Common.type';
import { noopFn } from 'SourceUtil/Common';

/** @namespace Seedsman/Component/Popup/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    ...sourceMapStateToProps(state)
    // TODO extend mapStateToProps
});

/** @namespace Seedsman/Component/Popup/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    ...sourceMapDispatchToProps(dispatch)
    // TODO extend mapDispatchToProps
});

/** @namespace Seedsman/Component/Popup/Container */
export class PopupContainer extends SourcePopupContainer {
    // TODO implement logic
    static propTypes = {
        mix: MixType,
        contentMix: MixType,
        payload: PropTypes.objectOf(
            PropTypes.shape({
                title: PropTypes.string
            })
        ).isRequired,
        activeOverlay: PropTypes.string.isRequired,
        goToPreviousNavigationState: PropTypes.func.isRequired,
        areOtherOverlaysOpen: PropTypes.bool.isRequired,
        changeHeaderState: PropTypes.func.isRequired,
        onVisible: PropTypes.func,
        onClose: PropTypes.func,
        onHide: PropTypes.func,
        isStatic: PropTypes.bool,
        children: ChildrenType,
        id: PropTypes.string.isRequired,
        shouldPopupClose: PropTypes.bool.isRequired,
        isMobile: PropTypes.bool.isRequired,
        hideActiveOverlay: PropTypes.func.isRequired,
        resetHideActivePopup: PropTypes.func.isRequired,
        isClickOutside: PropTypes.bool.isRequired
    };

    static defaultProps = {
        onVisible: noopFn,
        onClose: noopFn,
        onHide: noopFn,
        mix: {},
        contentMix: {},
        children: [],
        isStatic: false,
        isClickOutside: false
    };

    containerProps() {
        const {
            activeOverlay,
            areOtherOverlaysOpen,
            changeHeaderState,
            children,
            id,
            isMobile,
            isStatic,
            mix,
            contentMix,
            onClose,
            onHide,
            onVisible,
            shouldPopupClose,
            hideActiveOverlay,
            resetHideActivePopup,
            goToPreviousNavigationState,
            isClickOutside
        } = this.props;

        return {
            activeOverlay,
            areOtherOverlaysOpen,
            changeHeaderState,
            children,
            id,
            isMobile,
            isStatic,
            mix,
            contentMix,
            shouldPopupClose,
            onClose,
            onHide,
            onVisible,
            hideActiveOverlay,
            resetHideActivePopup,
            goToPreviousNavigationState,
            title: this._getPopupTitle(),
            isClickOutside
        };
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupContainer);
