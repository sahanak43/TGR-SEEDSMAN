import { connect } from 'react-redux';

import { ORDER_REFUNDS, ORDER_SHIPMENTS } from 'Component/MyAccountOrder/MyAccountOrder.config';
import {
    MyAccountOrderItemsTableRowContainer as SourceMyAccountOrderItemsTableRowContainer
} from 'SourceComponent/MyAccountOrderItemsTableRow/MyAccountOrderItemsTableRow.container';

import MyAccountOrderItemsTableRow from './MyAccountOrderItemsTableRow.component';

/** @namespace Seedsman/Component/MyAccountOrderItemsTableRow/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    isMobile: state.ConfigReducer.device.isMobile
});

/** @namespace Seedsman/Component/MyAccountOrderItemsTableRow/Container/mapDispatchToProps */
export const mapDispatchToProps = () => ({});

/** @namespace Seedsman/Component/MyAccountOrderItemsTableRow/Container */
export class MyAccountOrderItemsTableRowContainer extends SourceMyAccountOrderItemsTableRowContainer {
    containerProps() {
        const {
            product,
            activeTab,
            small_image,
            enteredOptions,
            selectedOptions,
            isMobile,
            comments,
            createdAt
        } = this.props;

        return {
            product,
            activeTab,
            enteredOptions,
            selectedOptions,
            isMobile,
            small_image,
            comments,
            createdAt,
            colSpanCount: this.getOrderColumnSpanCount()
        };
    }

    getOrderColumnSpanCount() {
        const { activeTab } = this.props;

        switch (activeTab) {
        case ORDER_REFUNDS: {
            return '7';
        }
        case ORDER_SHIPMENTS: {
            return '3';
        }
        default: {
            return '5';
        }
        }
    }

    render() {
        return (
            <MyAccountOrderItemsTableRow
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountOrderItemsTableRowContainer);
