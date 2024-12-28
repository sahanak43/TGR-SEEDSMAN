/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-props-destruction */
/* eslint-disable max-len */
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

import { connect } from 'react-redux';

import { mapDispatchToProps, mapStateToProps, WishlistSharedPageContainer as SourceWishlistSharedPageContainer } from 'SourceRoute/WishlistSharedPage/WishlistSharedPage.container';

import WishlistShared from './WishlistSharedPage.component';

/** @namespace Seedsman/Route/WishlistSharedPage/Container */
export class WishlistSharedPageContainer extends SourceWishlistSharedPageContainer {
    render() {
        return (
             <WishlistShared
               { ...this.containerProps() }
               { ...this.containerFunctions }
               { ...this.state }
             />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WishlistSharedPageContainer);
