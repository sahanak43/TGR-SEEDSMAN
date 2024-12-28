import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import './CountryPopup.style';

/** @namespace Seedsman/Component/CountryPopup/Component */
export class CountryPopupComponent extends PureComponent {
    static propTypes = {
        isPopupVisible: PropTypes.bool.isRequired,
        children: PropTypes.element
    };

    static defaultProps = {
        children: null
    };

    render() {
        const { children, isPopupVisible } = this.props;

        if (!isPopupVisible) {
            return null;
        }

        return (
            <div block={ isPopupVisible ? 'CountryPopup scrollHidden' : 'CountryPopup' }>
                { children }
            </div>
        );
    }
}

export default CountryPopupComponent;
