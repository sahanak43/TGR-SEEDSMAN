/* eslint-disable no-magic-numbers */
/* eslint-disable max-len */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

/** @namespace Seedsman/Component/Affiliate/AffiliateSuccess/Config */
export class AffiliateSuccessConfig extends PureComponent {
    static propTypes = {
        OrderDetails: PropTypes.isRequired
    };

    componentDidMount() {
        const { OrderDetails } = this.props;
        this.getAffiliateScript(OrderDetails);
    }

    // async sha256(message) {
    //     // encode as UTF-8
    //     const msgBuffer = new TextEncoder('utf-8').encode(message);

    //     // hash the message
    //     const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);

    //     // convert ArrayBuffer to Array
    //     const hashArray = Array.from(new Uint8Array(hashBuffer));

    //     // convert bytes to hex string
    //     const hashHex = hashArray.map((b) => (`00${ b.toString(16)}`).slice(-2)).join('');
    //     console.log(hashHex);
    //     return hashHex;
    // }

    getAffiliateScript(OrderDetails) {
        const lineItems = [];
        const quantities = [];
        const prices = [];
        const discounts = [];

        // const hashedPassword = btoa(OrderDetails.email);
        OrderDetails.items[0].items.forEach((data) => {
            lineItems.push(data.product_sku);
            quantities.push(data.quantity_ordered);
            prices.push(data.row_subtotal.value);
            discounts.push(data.discounts[0].amount.value);
        });

        const cjOrder = {

            getEnterpriseId: () => OrderDetails.items[0].cj_enterprise_id,
            getOrderId: () => OrderDetails.items[0].id,
            getActionTrackerId: () => OrderDetails.items[0].cj_action_id,
            getCurrencyCode: () => OrderDetails.items[0].total.subtotal.currency,
            getSubTotal: () => OrderDetails.items[0].total.subtotal.value,
            getTaxAmount: () => OrderDetails.items[0].total.total_tax.value,
            getDiscountAmt: () => OrderDetails.items[0].total.discounts[0]?.amount?.value,
            getCouponCode: () => OrderDetails.items[0].coupon_code,
            getCountryCode: () => OrderDetails.items[0].shipping_address.country_code,
            getCustomerId: () => OrderDetails.items[0].customer_id,
            getEmailHash: () => OrderDetails.items[0].customer_email,
            getExtensionVersion: () => OrderDetails.items[0].cj_extension_version,
            getCustomerStatus: () => OrderDetails.items[0].cj_customer_status
        };

        const helper = {
            getExtensionVersion: () => OrderDetails.items[0].cj_extension_version
        };

        const scriptCode = `
  var lineItems = ${JSON.stringify(lineItems)};
  var quantities = ${JSON.stringify(quantities)};
  var prices = ${JSON.stringify(prices)};
  var discounts = ${JSON.stringify(discounts)};

  if (!window.cj) window.cj = {};
  cj.order = {};
  cj.sitePage = {};

  cj.order.enterpriseId = "${cjOrder.getEnterpriseId()}";
  cj.order.orderId = "${cjOrder.getOrderId()}";
  cj.order.actionTrackerId = "${cjOrder.getActionTrackerId()}";
  cj.order.currency = "${cjOrder.getCurrencyCode()}";
  cj.order.amount = "${cjOrder.getSubTotal()}";
  cj.order.taxAmount = "${cjOrder.getTaxAmount()}";
  cj.order.discount = "${cjOrder.getDiscountAmt()}";
  cj.order.coupon = "${cjOrder.getCouponCode()}";
  cj.order.customerCountry = "${cjOrder.getCountryCode()}";


  cj.order.items = [];
  cj.order.customerstatus = "${cjOrder.getCustomerStatus() === '1' ? 'New' : ''}";
  cj.order.pageType = 'conversionConfirmation';
  cj.order.userId = "${cjOrder.getCustomerId()}";
  cj.order.emailHash = "${cjOrder.getEmailHash()}";

  for (var i = 0; i < lineItems.length; i++) {
    var anItemObj = {};
    anItemObj['unitPrice'] = prices[i];
    anItemObj['itemId'] = lineItems[i].replace(/ /g, "_");
    anItemObj['quantity'] = quantities[i];


    if (discounts[i] !== null && discounts[i] !== 0) {
      anItemObj['discount'] = discounts[i];
    }

    cj.order.items.push(anItemObj);
  }

  cj.order.cjPlugin = "Magento_${helper.getExtensionVersion()}";

  cj.sitePage.enterpriseId = "${cjOrder.getEnterpriseId()}";
  cj.sitePage.pageType = 'conversionConfirmation';
  cj.sitePage.userId = "${cjOrder.getCustomerId()}";
  cj.sitePage.emailHash = "${cjOrder.getEmailHash()}";
  cj.sitePage.cartSubtotal = "${cjOrder.getSubTotal()}";
  cj.sitePage.items = [];

  for (var i = 0; i < lineItems.length; i++) {
    var anItemObj = {};
    anItemObj['unitPrice'] = prices[i];
    anItemObj['itemId'] = lineItems[i].replace(/ /g, "_");
    anItemObj['quantity'] = quantities[i];
    

    if (discounts[i] !== null && discounts[i] !== 0) {
      anItemObj['discount'] = discounts[i];
    }

    cj.sitePage.items.push(anItemObj);
  }

  if (cj.order.customerstatus === '') delete cj.order.customerstatus;
  if (cj.order.coupon === '') delete cj.order.coupon;
  if (cj.order.userId === '') delete cj.order.userId;
  if (cj.sitePage.userId === '') delete cj.sitePage.userId;
  if (cj.order.customerCountry === '') delete cj.order.customerCountry;
`;

        // Create a script element
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.text = scriptCode;

        // Append the script to the document body to execute it
        document.body.appendChild(script);
    }

    render() {
        return (
            <div />
        );
    }
}
export default AffiliateSuccessConfig;
