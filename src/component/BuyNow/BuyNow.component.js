/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
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
import { PureComponent } from 'react';

import CartIcon from 'Component/CartIcon';
import { MixType } from 'Type/Common.type';
import { LayoutType } from 'Type/Layout.type';

import './BuyNow.style';

/**
 * Button for adding product to Cart
 * @class BuyNow
 * @namespace Seedsman/Component/BuyNow/Component */
export class BuyNowComponent extends PureComponent {
    static propTypes = {
        addProductToCart: PropTypes.func.isRequired,
        isDisabled: PropTypes.bool.isRequired,
        isAdding: PropTypes.bool.isRequired,

        // Customization
        isIconEnabled: PropTypes.bool.isRequired,
        mix: MixType.isRequired,
        layout: LayoutType.isRequired
    };

    renderCartIcon() {
        const { isIconEnabled } = this.props;

        if (!isIconEnabled) {
            return null;
        }

        return <CartIcon />;
    }

    render() {
        const {
            mix,
            addProductToCart,
            layout,
            isDisabled,
            isAdding
        } = this.props;

        return (
            <button
              onClick={ addProductToCart }
              block="Button BuyNow"
              mix={ mix }
              mods={ { layout } }
              disabled={ isDisabled || isAdding }
            >
                { this.renderCartIcon() }
                <span>{ isAdding ? 'Adding...' : 'Buy Now' }</span>
            </button>
        );
    }
}

export default BuyNowComponent;
