/* eslint-disable consistent-return */
/* eslint-disable max-len */
import { connect } from 'react-redux';

import { mapDispatchToProps, MenuContainer as SourceMenuContainer } from 'SourceComponent/Menu/Menu.container';
import history from 'SourceUtil/History';

export const MyAccountDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/MyAccount/MyAccount.dispatcher'
);

/** @namespace Seedsman/Component/Menu/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    device: state.ConfigReducer.device,
    compareTotals: state.ProductCompareReducer.count,
    customer: state.MyAccountReducer.customer
});

/** @namespace Seedsman/Component/Menu/Container */

export class MenuContainer extends SourceMenuContainer {
    __construct(props) {
        super.__construct(props, 'MenuContainer');

        const {
            stack: activeMenuItemsStack = []
        } = history.location.state || {};

        this.state = {
            activeMenuItemsStack,
            menu: {},
            secondLevelData: null
        };
    }

    containerProps() {
        const {
            device,
            compareTotals,
            customer,
            isCheckout,
            showMyAccountLogin,
            onSignIn,
            renderIcons,
            onMenuCloseClick
        } = this.props;
        const { activeMenuItemsStack, menu, secondLevelData } = this.state;

        return {
            activeMenuItemsStack,
            menu,
            device,
            compareTotals,
            secondLevelData,
            customer,
            isCheckout,
            showMyAccountLogin,
            onSignIn,
            renderIcons,
            onMenuCloseClick
        };
    }

    _getMenuOptions() {
        const { header_content: { header_menu } = {} } = window.contentConfiguration;

        return {
            identifier: header_menu || 'mega_menu_seedsman'
        };
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MenuContainer);
