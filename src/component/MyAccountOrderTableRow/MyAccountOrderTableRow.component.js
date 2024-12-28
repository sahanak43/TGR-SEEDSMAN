/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-magic-numbers */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable max-len */
import Link from 'Component/Link';
import TextPlaceholder from 'Component/TextPlaceholder';
import { MyAccountOrderTableRow as SourceMyAccountOrderTableRow } from 'SourceComponent/MyAccountOrderTableRow/MyAccountOrderTableRow.component';
import { formatDateTime } from 'Util/DateTime';
import { formatPrice } from 'Util/Price';

import './MyAccountOrderTableRow.style';

/** @namespace Seedsman/Component/MyAccountOrderTableRow/Component */
export class MyAccountOrderTableRowComponent extends SourceMyAccountOrderTableRow {
    state = {
        itemsToShow: 2
    };

    renderTopBar() {
        const {
            device: { isMobile },
            order: { status, increment_id },
            onViewClick
        } = this.props;

        if (!increment_id) {
            return null;
        }

        return (
            <div
              block="MyAccountOrderTableRow"
              elem="TopBar"
              onClick={ onViewClick }
            >
                <div block="TopBar" elem="OrderNumber">
                    <label>Order ID: </label>
                    <span>
#
{ increment_id }
                    </span>
                    <div block="TopBar" elem="OrderCount">
                        { this.getItemsCount() }
                    </div>
                </div>
                { !isMobile ? (
                    <div block="MyAccountOrderTableRow" elem="HeadingBorder" />
                ) : null }
                <div block="TopBar" elem="OrderStatus">
                    <b block="MyAccountOrderTableRow" elem="StatusSymbol">
                        { ' ' }
                    </b>
                    <span>{ status }</span>
                </div>
            </div>
        );
    }

    getItemsCount() {
        const { order: { items = [] } = {} } = this.props;
        const count = items.length;

        if (count < 3) {
            return null;
        }

        return (
            <span block="MyAccountOrderTableRow" elem="ItemsCount">
                <TextPlaceholder content={ __('(%s items)', count) } />
            </span>
        );
    }

    renderDetails() {
        const { itemsToShow } = this.state;

        const {
            order: { created_at, total: { grand_total = {} } = {}, items }
        } = this.props;

        return (
            <div block="MyAccountOrderTableRow" elem="Details">
                <div block="MyAccountOrderTableRow" elem="ProductDetails">
                    { items?.slice(0, itemsToShow).map((product) => {
                        const {
                            small_image,
                            product_name,
                            url,
                            quantity_ordered,
                            row_subtotal: { value, currency } = {}
                        } = product;

                        return (
                            <div block="MyAccountOrderTableRow" elem="Product">
                                <Link
                                  to={ url }
                                  className="Image Image_ratio_square Image_imageStatus_1 Image_hasSrc "
                                >
                                    <img
                                      alt=""
                                      width="auto"
                                      height="auto"
                                      className="Image-Image"
                                      ll-loaded="true"
                                      src={ small_image }
                                    />
                                </Link>
                                <div className="Content">
                                    <div
                                      block="MyAccountOrderTableRow"
                                      elem="OrderTitle"
                                    >
                                        <Link to={ url }>
                                            <h4 bablic-exclude="true">
                                                { product_name }
                                            </h4>
                                        </Link>
                                        <div
                                          block="MyAccountOrderTableRow"
                                          elem="OrderDate"
                                        >
                                            <span>
                                                { formatDateTime(
                                                    created_at,
                                                    false
                                                ) }
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                      block="MyAccountOrderTableRow"
                                      elem="QuantityPrice"
                                    >
                                        <div
                                          block="MyAccountOrderTableRow"
                                          elem="QuantityPrice"
                                        >
                                            <label>Item: </label>
                                            <span className="quantity">
                                                { quantity_ordered }
                                            </span>
                                        </div>
                                        <div
                                          block="MyAccountOrderTableRow"
                                          elem="TotalPrice"
                                        >
                                            { formatPrice(value, currency) }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }) }
                    { this.renderAction(grand_total) }
                </div>
            </div>
        );
    }

    renderAction(grand_total) {
        const { onViewClick } = this.props;
        const { value, currency } = grand_total;

        return (
            <div block="MyAccountOrderTableRow" elem="Action">
                <button onClick={ onViewClick }>VIEW ORDER</button>
                <div block="MyAccountOrderTableRow" elem="OrderTotalExTax">
                    <label>Order Total</label>
                    <span className="OrderTotalTax">
                        { formatPrice(value, currency) }
                    </span>
                </div>
            </div>
        );
    }

    render() {
        const {
            order: { items }
        } = this.props;

        if (!items) {
            return null;
        }

        return (
            <div block="MyAccountOrderTableRow">
                <div block="MyAccountOrderTableRow" elem="OrderDetails">
                    { this.renderTopBar() }
                    { this.renderDetails() }
                </div>
            </div>
        );
    }
}

export default MyAccountOrderTableRowComponent;
