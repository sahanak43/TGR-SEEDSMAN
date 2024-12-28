/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import CloseIcon from 'Component/CloseIcon';
import Overlay from 'Component/Overlay';
import { ChildrenType } from 'Type/Common.type';

import './SideOverlay.style';

/** @namespace Seedsman/Component/SideOverlay/Component */
export class SideOverlayComponent extends PureComponent {
    static propTypes = {
        children: ChildrenType,
        title: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        handleClose: PropTypes.func.isRequired,
        onClickOutside: PropTypes.func.isRequired,
        isSelectButtonRequired: PropTypes.bool.isRequired,
        selectedVariant: PropTypes.objectOf.isRequired
    };

    static defaultProps = {
        children: []
    };

    render() {
        const {
            children, handleClose, title, id,
            onClickOutside, isSelectButtonRequired, selectedVariant
        } = this.props;

        return (
            <div onClick={ onClickOutside }>
                <Overlay
                  mix={ { block: 'SideOverlay' } }
                  id={ id }
                  isRenderInPortal={ false }
                >
                    <div block="SideOverlay" elem="Wrapper">
                        <header block="SideOverlay" elem="Header">
                            <div className="action-icons">
                                <span>
                                    { title }
                                </span>
                                <button
                                  block="SideOverlay"
                                  elem="CloseButton"
                                  onClick={ handleClose }
                                >
                                    <CloseIcon />
                                </button>
                            </div>
                        </header>
                        <div block="SideOverlay" elem="WrapperContent">
                            { children }
                            { isSelectButtonRequired ? (
                            <div
                              block="SideOverlay"
                              elem="CloseButtonParent"
                            >
                                <button
                                  onClick={ handleClose }
                                  block="SideOverlay"
                                  elem="CloseButtonButton"
                                  disabled={ !selectedVariant }
                                >
                                    Complete Selection
                                </button>
                            </div>
                            ) : null }
                        </div>
                    </div>
                </Overlay>
            </div>
        );
    }
}

export default SideOverlayComponent;
