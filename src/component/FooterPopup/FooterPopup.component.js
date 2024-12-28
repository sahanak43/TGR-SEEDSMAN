/* eslint-disable react/prop-types */
// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import './FooterPopup.style';

/** @namespace Seedsman/Component/FooterPopup/Component */
export class FooterPopupComponent extends PureComponent {
    static propTypes = {
        // TODO: implement prop-types
    };

    render() {
        const { children, fromFooter } = this.props;

        if (!fromFooter) {
            return null;
        }

        return (
            <div block="FooterPopup">
                { children }
            </div>
        );
    }
}

export default FooterPopupComponent;
