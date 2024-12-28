/* eslint-disable max-len */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
/* eslint-disable max-lines */
import { lazy, Suspense } from 'react';

import CloseIcon from 'Component/CloseIcon';
import ContentWrapper from 'Component/ContentWrapper';
import Loader from 'Component/Loader';
import MyAccountAddressPopup from 'Component/MyAccountAddressPopup';
import { Checkout as ParentCheckout } from 'SourceRoute/Checkout/Checkout.component';
import { CheckoutStepType } from 'Type/Checkout.type';
import { scrollToTop } from 'Util/Browser';
// import BrowserDatabase from 'Util/BrowserDatabase';
import { formatPrice } from 'Util/Price';
import { appendWithStoreCode } from 'Util/Url';

import {
    BILLING_STEP,
    CHECKOUT_URL, DEFAULT_CHECKOUT_CMS_BLOCK, SHIPPING_STEP
} from './Checkout.config';

import './Checkout.override.style';

export const CmsBlock = lazy(() => import(
    /* webpackMode: "lazy", webpackChunkName: "checkout-info" */
    'Component/CmsBlock'
));

// export const CheckoutSuccess = lazy(() => import(
//     /* webpackMode: "lazy", webpackChunkName: "checkout-success" */
//     'Component/CheckoutSuccess'
// ));

export const CheckoutBilling = lazy(() => import(
    /* webpackMode: "lazy", webpackChunkName: "checkout-billing" */
    'Component/CheckoutBilling'
));

export const CheckoutOrderSummary = lazy(() => import(
    /* webpackMode: "lazy", webpackChunkName: "checkout-info" */
    'Component/CheckoutOrderSummary'
));

export const CheckoutShipping = lazy(() => import(
    /* webpackMode: "lazy", webpackChunkName: "checkout-shipping" */
    'Component/CheckoutShipping'
));

/** @namespace Seedsman/Route/Checkout/Component */
export class CheckoutComponent extends ParentCheckout {
    static propTypes = {
        checkoutStep: CheckoutStepType.isRequired
    };

    stepMap = {
        [SHIPPING_STEP]: {
            number: 1,
            title: 'Checkout',
            url: '/shipping',
            render: this.renderShippingStep.bind(this),
            areTotalsVisible: true
        },
        [BILLING_STEP]: {
            number: 2,
            title: 'Checkout',
            url: '/billing',
            render: this.renderShippingStep.bind(this),
            areTotalsVisible: true
        }
        // [DETAILS_STEP]: {
        //     title: __('Thank you for your purchase!'),
        //     mobileTitle: __('Order details'),
        //     url: '/success',
        //     render: this.renderDetailsStep.bind(this),
        //     areTotalsVisible: false
        // }
    };

    updateStep() {
        const { checkoutStep, history } = this.props;
        const { url } = this.stepMap[checkoutStep];

        history.push(appendWithStoreCode(`${ CHECKOUT_URL }${ url }`));
        scrollToTop({ behavior: 'smooth' });
    }

    renderPopup() {
        return <MyAccountAddressPopup />;
    }

    renderOrderSummaryOverlay() {
        const {
            totals: { grand_total, quote_currency_code } = {},
            onClickSummaryOverlay,
            showOverlay
        } = this.props;

        return (
            <>
                <div
                  block="Checkout"
                  elem="SummaryOverlay"
                  onClick={ onClickSummaryOverlay }
                  onKeyDown={ onClickSummaryOverlay }
                  role="button"
                  tabIndex={ 0 }
                >
                    <div block="Checkout" elem="SummaryHeading">
                        <h3>Order Summary</h3>
                        <p>{ formatPrice(grand_total, quote_currency_code) }</p>
                    </div>
                    <div>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.99961 17.3C8.81628 17.1167 8.72461 16.8833 8.72461 16.6C8.72461 16.3167 8.81628 16.0833 8.99961 15.9L12.8996 12L8.99961 8.09999C8.81628 7.91665 8.72461 7.68332 8.72461 7.39999C8.72461 7.11665 8.81628 6.88332 8.99961 6.69999C9.18294 6.51665 9.41628 6.42499 9.69961 6.42499C9.98294 6.42499 10.2163 6.51665 10.3996 6.69999L14.9996 11.3C15.0996 11.4 15.1706 11.5083 15.2126 11.625C15.2539 11.7417 15.2746 11.8667 15.2746 12C15.2746 12.1333 15.2539 12.2583 15.2126 12.375C15.1706 12.4917 15.0996 12.6 14.9996 12.7L10.3996 17.3C10.2163 17.4833 9.98294 17.575 9.69961 17.575C9.41628 17.575 9.18294 17.4833 8.99961 17.3Z" fill="black" />
                        </svg>
                    </div>
                </div>
                <div
                  block="Checkout"
                  elem={ showOverlay ? 'checkoutOrderSummaryOverlay visible' : 'checkoutOrderSummaryOverlay hide' }
                >
                    { this.renderSummary(true) }
                    <button
                      key="Checkout"
                      block="Checkout"
                      elem="CloseButton"
                      onClick={ onClickSummaryOverlay }
                    >
                        <CloseIcon />
                    </button>
                </div>
            </>
        );
    }

    renderSummary(showOnMobile = false) {
        const {
            checkoutTotals,
            checkoutStep,
            paymentTotals,
            isMobile,
            onCouponCodeUpdate,
            isTotalsLoading,
            isContentExpanded,
            onClickExpandItems,
            saveAddressInformation
        } = this.props;
        const { areTotalsVisible } = this.stepMap[checkoutStep];
        const { renderPromo } = this.renderPromo(true) || {};

        if (!areTotalsVisible || (showOnMobile && !isMobile) || (!showOnMobile && isMobile)) {
            return null;
        }

        return (
            <>
            <Loader isLoading={ isTotalsLoading } />
            <CheckoutOrderSummary
              checkoutStep={ checkoutStep }
              totals={ checkoutTotals }
              paymentTotals={ paymentTotals }
              isExpandable={ isMobile }
              onCouponCodeUpdate={ onCouponCodeUpdate }
              renderCmsBlock={ renderPromo }
              showItems
              isContentExpanded={ isContentExpanded }
              onClickExpandItems={ onClickExpandItems }
              saveAddressInformation={ saveAddressInformation }
            />
            </>
        );
    }

    renderShippingStep() {
        const {
            shippingMethods,
            onShippingEstimationFieldsChange,
            saveAddressInformation,
            isDeliveryOptionsLoading,
            onPasswordChange,
            onCreateUserChange,
            onEmailChange,
            isCreateUser,
            estimateAddress,
            isPickInStoreMethodSelected,
            handleSelectDeliveryMethod,
            cartTotalSubPrice,
            onShippingMethodSelect,
            onStoreSelect,
            selectedStoreAddress,
            showError,
            setLoading,
            setDetailsStep,
            shippingAddress,
            paymentMethods = [],
            savePaymentInformation,
            selectedShippingMethod,
            handleApplyStoreCredit,
            useStoreCredit,
            setPaymentMethod,
            saveBillingAddress,
            checkoutStep,
            paymentMethod,
            removePaymentMethodCode
        } = this.props;

        const isBilling = checkoutStep === SHIPPING_STEP;

        return (
            <>
            <Suspense fallback={ <Loader /> }>
                <CheckoutShipping
                  isLoading={ isDeliveryOptionsLoading }
                  shippingMethods={ shippingMethods }
                  cartTotalSubPrice={ cartTotalSubPrice }
                  saveAddressInformation={ saveAddressInformation }
                  onShippingEstimationFieldsChange={ onShippingEstimationFieldsChange }
                  onShippingMethodSelect={ onShippingMethodSelect }
                  onPasswordChange={ onPasswordChange }
                  onCreateUserChange={ onCreateUserChange }
                  onEmailChange={ onEmailChange }
                  isCreateUser={ isCreateUser }
                  estimateAddress={ estimateAddress }
                  handleSelectDeliveryMethod={ handleSelectDeliveryMethod }
                  isPickInStoreMethodSelected={ isPickInStoreMethodSelected }
                  onStoreSelect={ onStoreSelect }
                  selectedStoreAddress={ selectedStoreAddress }
                  showError={ showError }
                  isBilling={ isBilling }
                  saveBillingAddress={ saveBillingAddress }
                  removePaymentMethodCode={ removePaymentMethodCode }
                //   rewards_points={ rewards_points }
                />
            </Suspense>
            <Suspense fallback={ <Loader /> }>
                <CheckoutBilling
                  saveAddressInformation={ saveAddressInformation }
                  setLoading={ setLoading }
                  paymentMethods={ paymentMethods }
                  setDetailsStep={ setDetailsStep }
                  shippingAddress={ shippingAddress }
                  savePaymentInformation={ savePaymentInformation }
                  selectedShippingMethod={ selectedShippingMethod }
                  handleApplyStoreCredit={ handleApplyStoreCredit }
                  useStoreCredit={ useStoreCredit }
                  setPaymentMethod={ setPaymentMethod }
                  saveBillingAddress={ saveBillingAddress }
                  isBilling={ isBilling }
                  selectedPaymentMethodCode={ paymentMethod }
                />
            </Suspense>
            </>
        );
    }

    // renderDetailsStep() {
    //     const {
    //         isEmailAvailable,
    //         email,
    //         billingAddress: {
    //             firstname,
    //             lastname
    //         }
    //     } = this.props;

    //     return (
    //         <Suspense fallback={ <Loader /> }>
    //             <CheckoutSuccess
    //               email={ email }
    //               firstName={ firstname }
    //               lastName={ lastname }
    //               isEmailAvailable={ isEmailAvailable }
    //             />
    //         </Suspense>
    //     );
    // }

    renderCmsBlock() {
        const { checkoutStep } = this.props;

        if (![BILLING_STEP, SHIPPING_STEP].includes(checkoutStep)) {
            return null;
        }

        return <CmsBlock identifier={ DEFAULT_CHECKOUT_CMS_BLOCK } />;
    }

    renderTitle() {
        return (
            <div block="Checkout" elem="Header">
                <div block="Checkout" elem="Title">Checkout</div>
            </div>
        );
    }

    render() {
        const { isMobile } = this.props;

        return (
            <main block="Checkout">
                { isMobile && this.renderOrderSummaryOverlay() }
                <ContentWrapper
                  wrapperMix={ { block: 'Checkout', elem: 'Wrapper' } }
                  label="Checkout page"
                >
                    { this.renderTitle() }
                    <div block="Checkout" elem="WrapperSteps">
                        <div>
                            <div block="Checkout" elem="Step">
                                { this.renderStoreInPickUpMethod() }
                                { this.renderGuestForm() }
                                { this.renderStep() }
                                { this.renderLoader() }
                            </div>
                        </div>
                        <div>
                            <Suspense fallback={ <Loader /> }>
                                { this.renderSummary() }
                                { this.renderPromo() }
                            </Suspense>
                        </div>
                    </div>
                </ContentWrapper>
                { this.renderCmsBlock() }
                { this.renderPopup() }
            </main>
        );
    }
}

export default CheckoutComponent;
