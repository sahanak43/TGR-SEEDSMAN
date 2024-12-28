/* eslint-disable max-len */
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { CHECKOUT_URL } from 'Route/Checkout/Checkout.config';
import { FooterContainer as SourceFooterContainer, mapDispatchToProps, mapStateToProps } from 'SourceComponent/Footer/Footer.container';
import history from 'Util/History';

/** @namespace Seedsman/Component/Footer/Container */
export class FooterContainer extends SourceFooterContainer {
    containerProps() {
        const { location: { pathname } } = history;

        const isCheckout = pathname.includes(CHECKOUT_URL);

        const {
            copyright,
            isVisibleOnMobile,
            device,
            newsletterActive
        } = this.props;

        return {
            copyright,
            isVisibleOnMobile,
            device,
            newsletterActive,
            isCheckout
        };
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FooterContainer));
