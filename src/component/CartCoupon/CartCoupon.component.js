/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
import Field from 'Component/Field';
import FIELD_TYPE from 'Component/Field/Field.config';
import Form from 'Component/Form';
import Loader from 'Component/Loader';
import { CartCoupon as sourceCartCoupon } from 'SourceComponent/CartCoupon/CartCoupon.component';

import './CartCoupon.style';

/** @namespace Seedsman/Component/CartCoupon/Component */
export class CartCouponComponent extends sourceCartCoupon {
    renderApplyCoupon() {
        const { enteredCouponCode, isFieldWithError } = this.state;

        return (
            <>
        <div block="CartCoupon" elem="Input">
          <Field
            type={ FIELD_TYPE.text }
            attr={ {
                id: 'couponCode',
                name: 'couponCode',
                defaultValue: enteredCouponCode,
                placeholder: 'Enter promo code here',
                'aria-label': 'Enter promo code here'
            } }
            events={ {
                onChange: this.handleCouponCodeChange
            } }
            validationRule={ {
                isRequired: true
            } }
            validateOn={ ['onChange'] }
            mix={ { mods: { hasError: isFieldWithError }, block: 'Field' } }
          />
        </div>
        <button
          block="CartCoupon"
          elem="Button"
          type={ FIELD_TYPE.button }
          mods={ { isHollow: true } }
          disabled={ !enteredCouponCode }
          onClick={ this.handleApplyCoupon }
        >
          Apply
        </button>
            </>
        );
    }

    renderRemoveCoupon() {
        const { couponCode } = this.props;

        return (
            <>
        <div block="CartCoupon" elem="Input">
          <Field
            type={ FIELD_TYPE.text }
            attr={ {
                id: 'couponCode',
                name: 'couponCode',
                defaultValue: couponCode
            } }
            validationRule={ {
                isRequired: true
            } }
            isDisabled
            validateOn={ ['onChange'] }
            mix={ { block: 'Field' } }
          />
        </div>
              <button
                block="CartCoupon"
                elem="Button"
                type={ FIELD_TYPE.button }
                mods={ { isHollow: true } }
                onClick={ this.handleRemoveCoupon }
              >
                Remove
              </button>
            </>
        );
    }

    render() {
        const { isLoading, couponCode, mix } = this.props;

        return (
          <div
            block={ couponCode ? 'CartCoupon CartCoupon_remove' : 'CartCoupon' }
            mix={ mix }
          >
              <Form
                onSubmit={ this.handleFormSubmit }
                block={ couponCode ? 'CartCoupon removeCartCoupon' : 'CartCoupon' }
                returnAsObject
              >
                  <Loader isLoading={ isLoading } />
                  { this.renderTitle() }
                  { (couponCode
                      ? this.renderRemoveCoupon()
                      : this.renderApplyCoupon()
                  ) }
              </Form>
          </div>
        );
    }
}

export default CartCouponComponent;
