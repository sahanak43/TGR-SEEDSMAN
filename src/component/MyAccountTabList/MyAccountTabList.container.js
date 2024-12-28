/* eslint-disable no-debugger */
/* eslint-disable consistent-return */
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { LOGOUT_POPUP } from 'Component/LogoutPopup/LogoutPopup.config';
import {
    MyAccountTabListContainer as SourceMyAccountTabList
} from 'SourceComponent/MyAccountTabList/MyAccountTabList.container';
import { showPopup } from 'Store/Popup/Popup.action';
import { ActiveTabType, TabMapType } from 'Type/Account.type';
import { isSignedIn } from 'Util/Auth';

import MyAccountTabList from './MyAccountTabList.component';

export const MyAccountDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/MyAccount/MyAccount.dispatcher'
);

/** @namespace Seedsman/Component/MyAccountTabList/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    device: state.ConfigReducer.device,
    customer: state.MyAccountReducer.customer
});

/** @namespace Seedsman/Component/MyAccountTabList/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    showPopup: (payload) => dispatch(showPopup(LOGOUT_POPUP, payload))

});

/** @namespace Seedsman/Component/MyAccountTabList/Container */
export class MyAccountTabListContainer extends SourceMyAccountTabList {
    static propTypes = {
        logout: PropTypes.func.isRequired,
        tabMap: TabMapType.isRequired,
        activeTab: ActiveTabType.isRequired,
        changeActiveTab: PropTypes.func.isRequired
    };

    state = {
        isContentExpanded: false,
        state: false
    };

    containerFunctions = {
        handleLogout: this.handleLogout.bind(this),
        onTabClick: this.onTabClick.bind(this),
        toggleExpandableContent: this.toggleExpandableContent.bind(this)
    };

    containerProps() {
        const {
            tabMap,
            device,
            activeTab,
            customer
        } = this.props;
        const { isContentExpanded, state } = this.state;

        return {
            tabMap,
            device,
            activeTab,
            customer,
            isContentExpanded,
            state
        };
    }

    handleLogout() {
        const { showPopup } = this.props;

        showPopup({
            action: LOGOUT_POPUP
        });
    }

    onTabClick(key) {
        const { changeActiveTab } = this.props;
        if (!isSignedIn()) {
            return;
        }

        this.toggleExpandableContent();
        changeActiveTab(key);
    }

    toggleExpandableContent() {
        this.setState(({ isContentExpanded }) => ({ isContentExpanded: !isContentExpanded }));
    }

    render() {
        return (
            <MyAccountTabList
              { ...this.containerProps() }
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountTabListContainer);
