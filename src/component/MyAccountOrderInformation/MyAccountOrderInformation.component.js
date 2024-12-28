/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-no-comment-textnodes */
import {
    MyAccountOrderInformation as
    SourceMyAccountOrderInformation
} from 'SourceComponent/MyAccountOrderInformation/MyAccountOrderInformation.component';

// import { OrderType } from 'Type/Order.type';
import './MyAccountOrderInformation.style';

/** @namespace Seedsman/Component/MyAccountOrderInformation/Component */
export class MyAccountOrderInformationComponent extends SourceMyAccountOrderInformation {
    renderContent() {
        return (
            <div block="MyAccountOrderInformation" elem="Information">
                <div block="MyAccountOrderInformation" elem="InformationRow">
                    { this.renderShippingAddress() }
                    { this.renderShippingMethod() }
                </div>
                <div block="MyAccountOrderInformation" elem="InformationRow">
                    { this.renderBillingAddress() }
                    { this.renderPaymentMethods() }
                </div>
            </div>
        );
    }
}

export default MyAccountOrderInformationComponent;
