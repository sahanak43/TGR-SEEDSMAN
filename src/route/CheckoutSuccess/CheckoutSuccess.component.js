/* eslint-disable react/forbid-elements */
/* eslint-disable max-lines */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable max-len */
import PropTypes from 'prop-types';

import AffiliateSuccessConfig from 'Component/Affiliate/AffiliateSuccess.config';
import ContentWrapper from 'Component/ContentWrapper';
import Link from 'Component/Link';
import { CheckoutOrderSummary, CmsBlock } from 'Route/Checkout/Checkout.component';
import { DETAILS_STEP } from 'Route/Checkout/Checkout.config';
import { ACCOUNT_URL } from 'Route/MyAccount/MyAccount.config';
import { CheckoutSuccess as SourceCheckoutSuccess } from 'SourceComponent/CheckoutSuccess/CheckoutSuccess.component';
import orderSuccess from 'Util/images/orderSuccess.svg';

import './CheckoutSuccess.override.style';

/** @namespace Seedsman/Route/CheckoutSuccess/Component */
export class CheckoutSuccessComponent extends SourceCheckoutSuccess {
    static propTypes = {
        orderID: PropTypes.string.isRequired,
        isEmailAvailable: PropTypes.bool.isRequired
    };

    renderButtons() {
        const {
            OrderDetails: {
                items: [{
                    payment_methods
                }]
            } = {}
        } = this.props;

        console.log(this.props, '??');
        if (!payment_methods) {
            return null;
        }

        const [{ type }] = payment_methods;

        return (
            <div block="CheckoutSuccess" elem="ButtonWrapper">
                <CmsBlock identifier={ `${type}_payment_checkoutsuccess_cms` } block="CmsBlock-Wrapper" />
                <Link
                  block="Button"
                  mix={ { block: 'CheckoutSuccess', elem: 'ContinueButton' } }
                  to={ ACCOUNT_URL }
                >
                    Go To Account
                </Link>
            </div>
        );
    }

    render() {
        const {
            OrderDetails: {
                email,
                items: [{
                    increment_id, total, payment_methods = [],
                    store_credit_used, items
                }]
            } = {}, isMobile, OrderDetails
        } = this.props;

        const [type] = payment_methods;
        const ProductName = items.map((item) => item.product_name).join(', ');
        const ProductSku = items.map((item) => item.product_sku).join(', ');
        const ProductPrice = items.map((item) => item.product_price).join(', ');
        const ProductId = items.map((item) => item.product_id).join(', ');
        const GroupItemId = items.map((item) => item.product_parent_sku).join(', ');

        return (
            <ContentWrapper
              wrapperMix={ { block: 'Checkout', elem: 'SuccessWrapper' } }
              label="CheckoutSuccess page"
            >
                <AffiliateSuccessConfig OrderDetails={ OrderDetails } />
                    <div block="CheckoutSuccess">
                        <div block="CheckoutSuccess" elem="ContentWrapper">
                            <div block="CheckoutSuccess" elem="SuccessMessage">
                                <img
                                  block="CheckoutSuccess"
                                  elem="Icon"
                                  src={ orderSuccess }
                                  alt="orderSuccessIcon"
                                />
                                <h3 block="CheckoutSuccess" elem="Heading" data-productName={ ProductName } data-productSku={ ProductSku } data-productPrice={ ProductPrice } data-productId={ ProductId } data-groupItemId={ GroupItemId }>
                                    Thanks for your order
                                </h3>
                            </div>
                            <div block="CheckoutSuccess" elem="OrderNumberWrapper">
                                <span className="OrderNumber">
                                    Order Number:
                                    { ' ' }
                                    <span>{ increment_id }</span>
                                </span>
                                <span className="CustomerEmail">
                                    We’ve sent an order confirmation to:
                                    { ' ' }
                                    <span>{ email }</span>
                                </span>
                            </div>
                            { this.renderButtons() }
                        </div>
                        { !isMobile ? (
                            <CheckoutOrderSummary
                              checkoutStep={ DETAILS_STEP }
                              totals={ total }
                              store_credit={ store_credit_used }
                              paymentTotals={ total }
                              showItems
                              payment_method={ type }
                            />
                        ) : null }
                    </div>
            </ContentWrapper>
        );
    }
}

export default CheckoutSuccessComponent;
