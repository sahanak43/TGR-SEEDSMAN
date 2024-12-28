/* eslint-disable max-len */
import { PureComponent } from 'react';

import ContentWrapper from 'Component/ContentWrapper';
import Link from 'Component/Link';
import { ACCOUNT_URL } from 'Route/MyAccount/MyAccount.config';

import './CheckoutFailure.style';

/** @namespace Seedsman/Route/CheckoutFailure/Component */
export class CheckoutFailureComponent extends PureComponent {
    renderButtons() {
        return (
            <div block="CheckoutFailure" elem="ButtonWrapper">
                <Link
                  block="Button"
                  mix={ { block: 'CheckoutFailure', elem: 'ContinueButton' } }
                  to={ ACCOUNT_URL }
                >
                    Go To Account
                </Link>
            </div>
        );
    }

    render() {
        return (
            <ContentWrapper
              wrapperMix={ { block: 'Checkout', elem: 'SuccessWrapper' } }
              label="CheckoutSuccess page"
            >
                    <div block="CheckoutFailure">
                        <div block="CheckoutFailure" elem="ContentWrapper">
                            <div block="CheckoutFailure" elem="SuccessMessage">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 120 120">
                                    <g id="Group_2981" data-name="Group 2981" transform="translate(-2807 12246)">
                                        <rect id="Rectangle_2886" data-name="Rectangle 2886" width="120" height="120" transform="translate(2807 -12246)" fill="#f23944" opacity="0" />
                                        <path id="Path_1520" data-name="Path 1520" d="M77.7,19.5a58.2,58.2,0,1,0,58.2,58.2A58.286,58.286,0,0,0,77.7,19.5ZM99.765,93.945a4.175,4.175,0,0,1,0,5.685,3.686,3.686,0,0,1-2.842,1.218,3.9,3.9,0,0,1-2.842-1.218L77.838,83.387,61.6,99.629a3.686,3.686,0,0,1-2.842,1.218,3.988,3.988,0,0,1-4.061-4.061,3.9,3.9,0,0,1,1.218-2.842L72.153,77.7,55.91,61.46a3.925,3.925,0,0,1,.135-5.685,4.006,4.006,0,0,1,5.55,0L77.838,72.017,94.08,55.775a3.925,3.925,0,0,1,5.685.135,4.006,4.006,0,0,1,0,5.55L83.522,77.7Z" transform="translate(2789.298 -12263.702)" fill="#f23944" />
                                    </g>
                                </svg>
                                <h3 block="CheckoutFailure" elem="Heading">
                                    Sorry, The payment has failed.
                                </h3>
                            </div>
                            <div block="CheckoutFailure" elem="ContactLink">
                                <p>Please try again or</p>
                                { ' ' }
                                <Link to="https://support.seedsman.com/hc/en-us/requests/new">contact support</Link>
                            </div>
                            { this.renderButtons() }
                        </div>
                    </div>
            </ContentWrapper>
        );
    }
}

export default CheckoutFailureComponent;
