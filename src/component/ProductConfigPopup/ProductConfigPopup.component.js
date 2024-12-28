/* eslint-disable react/prop-types */
// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import './ProductConfigPopup.style';

/** @namespace Seedsman/Component/ProductConfigPopup/Component */
export class ProductConfigPopupComponent extends PureComponent {
    static propTypes = {
        // TODO: implement prop-types
    };

    render() {
        const { children, fromProductCard } = this.props;

        if (!fromProductCard) {
            return null;
        }

        return (
            <div block="ProductConfigPopup">
                { children }
            </div>
        );
    }
}

export default ProductConfigPopupComponent;
