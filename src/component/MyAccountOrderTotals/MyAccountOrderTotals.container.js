import { connect } from 'react-redux';

import {
    MyAccountOrderTotalsContainer as SourceMyAccountOrderTotalsContainer
} from 'SourceComponent/MyAccountOrderTotals/MyAccountOrderTotals.container';

/** @namespace Seedsman/Component/MyAccountOrderTotals/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    isMobile: state.ConfigReducer.device.isMobile
});

/** @namespace Seedsman/Component/MyAccountOrderTotals/Container/mapDispatchToProps */
export const mapDispatchToProps = () => ({});

/** @namespace Seedsman/Component/MyAccountOrderTotals/Container */
export class MyAccountOrderTotalsContainer extends SourceMyAccountOrderTotalsContainer {
    containerProps() {
        const { total, activeTab, storeCredit } = this.props;
        const { colSpanPriceCount, colSpanLabelCount } = this.state;

        return {
            total,
            activeTab,
            colSpanPriceCount,
            colSpanLabelCount,
            storeCredit
        };
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountOrderTotalsContainer);
