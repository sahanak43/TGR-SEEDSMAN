/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
/* eslint-disable max-len */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
import CmsBlock from 'Component/CmsBlock';
import Field from 'Component/Field';
import FIELD_TYPE from 'Component/Field/Field.config';
import Link from 'Component/Link';
import {
    CheckoutPayment as SourceCheckoutPayment
} from 'SourceComponent/CheckoutPayment/CheckoutPayment.component';
// import { fetchCmsBlock } from 'Util/PaymentCmsBlock';
import { formatPrice } from 'Util/Price';

import './CheckoutPayment.override.style';

/** @namespace Seedsman/Component/CheckoutPayment/Component */
export class CheckoutPaymentComponent extends SourceCheckoutPayment {
    // eslint-disable-next-line no-unused-vars
    renderPaymentField(options) {
        return null;
    }

    renderPaymentTextField() {
        const { method: { payment_instructions } } = this.props;

        if (!payment_instructions) {
            return null;
        }

        return (
            <div block="CheckoutPayment" elem="paymentInfo">
                <p>
                    { payment_instructions }
                </p>
            </div>
        );
    }

    renderOrderTotal() {
        const { totals: { grand_total: total, quote_currency_code: currency } = {} } = this.props;

        return (
            <div block="CheckoutPayment" elem="orderTotal">
                <p>Order total</p>
                <p>
                    { formatPrice(total, currency) }
                </p>
            </div>
        );
    }

    renderPlaceOrderButton() {
        const {
            paymentMethods,
            isCheckedTerms
        } = this.props;

        return (
            <div block="CheckoutPayment" elem="StickyButtonWrapper">
                { paymentMethods.length && (
                    <button
                      type="submit"
                      block="Button"
                      disabled={ isCheckedTerms }
                      mix={ { block: 'CheckoutPayment', elem: 'Button' } }
                    >
                        Accept & Pay
                    </button>
                ) }
            </div>
        );
    }

    renderPaymentInfoVideo() {
        const { method: { code } } = this.props;

        return (
            <div block="CheckoutPayment" elem="paymentInfoVideo">
                <CmsBlock identifier={ `${code}_payment_checkout_cms` } key={ `${code}_payment_checkout_cms` } />
            </div>
        );
    }

    renderPaymentCardFooter() {
        return (
            <div block="CheckoutPayment" elem="paymentCardFooter">
                <span>
                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.409 12.6625L10.034 11.2625C9.83398 11.0625 9.59665 10.9625 9.32198 10.9625C9.04665 10.9625 8.80898 11.0625 8.60898 11.2625C8.40898 11.4625 8.30498 11.6998 8.29698 11.9745C8.28832 12.2498 8.38398 12.4875 8.58398 12.6875L10.709 14.8125C10.909 15.0125 11.1423 15.1125 11.409 15.1125C11.6757 15.1125 11.909 15.0125 12.109 14.8125L16.359 10.5625C16.559 10.3625 16.659 10.1248 16.659 9.84949C16.659 9.57482 16.559 9.33749 16.359 9.13749C16.159 8.93749 15.9217 8.83749 15.647 8.83749C15.3717 8.83749 15.134 8.93749 14.934 9.13749L11.409 12.6625ZM12.459 21.8875H12.209C12.1257 21.8875 12.0507 21.8708 11.984 21.8375C9.80065 21.1542 8.00065 19.7998 6.58398 17.7745C5.16732 15.7498 4.45898 13.5125 4.45898 11.0625V6.33749C4.45898 5.92082 4.57998 5.54582 4.82198 5.21249C5.06332 4.87915 5.37565 4.63749 5.75898 4.48749L11.759 2.23749C11.9923 2.15415 12.2257 2.11249 12.459 2.11249C12.6923 2.11249 12.9257 2.15415 13.159 2.23749L19.159 4.48749C19.5423 4.63749 19.855 4.87915 20.097 5.21249C20.3383 5.54582 20.459 5.92082 20.459 6.33749V11.0625C20.459 13.5125 19.7507 15.7498 18.334 17.7745C16.9173 19.7998 15.1173 21.1542 12.934 21.8375C12.8507 21.8708 12.6923 21.8875 12.459 21.8875ZM12.459 19.8625C14.1923 19.3125 15.6257 18.2125 16.759 16.5625C17.8923 14.9125 18.459 13.0792 18.459 11.0625V6.33749L12.459 4.08749L6.45898 6.33749V11.0625C6.45898 13.0792 7.02565 14.9125 8.15898 16.5625C9.29232 18.2125 10.7257 19.3125 12.459 19.8625Z" fill="black" />
                    </svg>
                </span>
                <p>100% Safe and Secure Payments. Easy Returns.</p>
                <p>100% Authentic Products</p>
            </div>
        );
    }

    renderPlaceOrderBlock() {
        const { onClickCheckedBox, isCheckedTerms } = this.props;
        return (
            <div block="CheckoutPayment" elem="PlaceOrderBlock">
                <h4>Accept & Pay</h4>
                <div block="CheckoutPayment" elem="checkBoxLink">
                    <Field
                      type={ FIELD_TYPE.checkbox }
                      label={ (
                            <p>I accept the</p>
                    ) }
                      attr={ {
                          id: 'confirm_payment',
                          name: 'confirm_payment',
                          checked: !isCheckedTerms
                      } }
                      events={ {
                          onClick: onClickCheckedBox
                      } }
                      addRequiredTag
                      mix={ { block: 'CheckoutPayment', elem: 'AgreeCheckBox' } }
                    />
                    <Link to="/terms-and-conditions" isOpenInNewTab>Terms & Conditions</Link>
                </div>
                { this.renderOrderTotal() }
                { this.renderPlaceOrderButton() }
                { this.renderPaymentCardFooter() }
            </div>
        );
    }

    render() {
        const {
            isSelected,
            method: { title, code },
            method,
            isValidCardDetails
        } = this.props;

        const options = {
            method,
            isSelected,
            isValidCardDetails
        };

        // disable checkbox in order to skip direct clicks on checkbox and handle clicks on entire button instead
        return (
            <li block="CheckoutPayment" mods={ { isSelected } }>
                <div block="CheckoutPayment" elem="cardBlock">
                    <button
                      block="CheckoutPayment"
                      mods={ { isSelected } }
                      elem="Button"
                      type="button"
                      onClick={ this.onClick }
                    >
                        <Field
                          type={ FIELD_TYPE.radio }
                          attr={ {
                              id: `option-${title}`,
                              name: 'option-paymentMethod',
                              checked: !!isSelected,
                              defaultValue: code
                          } }
                          label={ title }
                          isDisabled={ false }
                        />
                    </button>
                    { isSelected && this.renderPaymentTextField() }
                    { this.renderPaymentField(options) }
                    { isSelected && this.renderPaymentInfoVideo() }
                    { isSelected && this.renderPlaceOrderBlock() }
                </div>
            </li>
        );
    }
}

export default CheckoutPaymentComponent;
