import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { changeNavigationState, goToPreviousNavigationState } from 'Store/Navigation/Navigation.action';
import { BOTTOM_NAVIGATION_TYPE, TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { hideActiveOverlay } from 'Store/Overlay/Overlay.action';
import { ChildrenType } from 'Type/Common.type';

import SideOverlay from './SideOverlay.component';

import './SideOverlay.style';

/** @namespace Seedsman/Component/SideOverlay/Container/mapStateToProps */
export const mapStateToProps = () => ({});

/** @namespace Seedsman/Component/SideOverlay/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    hideActiveOverlay: () => dispatch(hideActiveOverlay()),
    goToPreviousHeaderState: () => dispatch(goToPreviousNavigationState(TOP_NAVIGATION_TYPE)),
    goToPreviousNavigationState: () => dispatch(goToPreviousNavigationState(BOTTOM_NAVIGATION_TYPE)),
    changeHeaderState: (state) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state)),
    changeNavigationState: (state) => dispatch(changeNavigationState(BOTTOM_NAVIGATION_TYPE, state))
});

/** @namespace Seedsman/Component/SideOverlay/Container */
export class SideOverlayContainer extends PureComponent {
    static propTypes = {
        children: ChildrenType,
        attribute_label: PropTypes.string.isRequired,
        hideActiveOverlay: PropTypes.func.isRequired,
        goToPreviousHeaderState: PropTypes.func.isRequired,
        goToPreviousNavigationState: PropTypes.func.isRequired,
        title: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        isSelectButtonRequired: PropTypes.bool,
        selectedVariant: PropTypes.objectOf.isRequired
    };

    static defaultProps = {
        children: [],
        isSelectButtonRequired: true
    };

    containerFunctions = {
        handleClose: this.handleClose.bind(this),
        onClickOutside: this.onClickOutside.bind(this)
    };

    handleClose(e) {
        const {
            hideActiveOverlay,
            goToPreviousHeaderState,
            goToPreviousNavigationState
        } = this.props;

        e.stopPropagation();

        hideActiveOverlay();
        goToPreviousHeaderState();
        goToPreviousNavigationState();
    }

    onClickOutside(event) {
        const {
            hideActiveOverlay,
            goToPreviousHeaderState,
            goToPreviousNavigationState
        } = this.props;

        if (event.target.className.includes('SideOverlay_isVisible')) {
            hideActiveOverlay();
            goToPreviousHeaderState();
            goToPreviousNavigationState();
        }
    }

    containerProps() {
        const {
            children, title, id, isSelectButtonRequired,
            selectedVariant
        } = this.props;

        return {
            children,
            title,
            id,
            isSelectButtonRequired,
            selectedVariant
        };
    }

    render() {
        return (
            <SideOverlay
              { ...this.containerProps() }
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideOverlayContainer);
