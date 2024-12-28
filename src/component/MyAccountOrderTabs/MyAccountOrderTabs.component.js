import PropTypes from 'prop-types';

import MyAccountOrderTab from 'Component/MyAccountOrderTab';
import {
    MyAccountOrderTab as SourceMyAccountOrderTab
} from 'SourceComponent/MyAccountOrderTab/MyAccountOrderTab.component';

import './MyAccountOrderTabs.style';

/** @namespace Seedsman/Component/MyAccountOrderTabs/Component */
export class MyAccountOrderTabsComponent extends SourceMyAccountOrderTab {
    static propTypes = {
        tabs: PropTypes.arrayOf(PropTypes.shape({
            tabName: PropTypes.string.isRequired,
            render: PropTypes.func.isRequired,
            title: PropTypes.string.isRequired
        })).isRequired,
        handleChangeActiveTab: PropTypes.func.isRequired,
        activeTab: PropTypes.string.isRequired
    };

    renderActiveTab() {
        const { tabs, activeTab } = this.props;

        return tabs[activeTab].render();
    }

    renderTab(item, i) {
        const { handleChangeActiveTab, activeTab } = this.props;
        const { title, tabName } = item;

        return (
            <MyAccountOrderTab
              title={ title }
              tabName={ tabName }
              key={ i }
              onTabClick={ handleChangeActiveTab }
              isActive={ tabName === activeTab }
            />
        );
    }

    renderTabs() {
        const { tabs } = this.props;

        return (
            <ul block="MyAccountOrderTabs">
                    { tabs.map(this.renderTab.bind(this)) }
            </ul>
        );
    }

    render() {
        return (
            <div
              block="MyAccountOrderTabs"
              elem="Wrapper"
            >
                { this.renderTabs() }
            </div>
        );
    }
}

export default MyAccountOrderTabsComponent;
