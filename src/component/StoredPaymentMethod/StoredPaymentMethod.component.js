/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-bind */
// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import './StoredPaymentMethod.style';

/** @namespace Seedsman/Component/StoredPaymentMethod/Component */
export class StoredPaymentMethodComponent extends PureComponent {
    static propTypes = {
        // TODO: implement prop-types
    };

    renderNoPaymentMethod() {
        return (
            <div block="StoredPaymentMethod" elem="Method_Empty">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="106.818"
                  height="100.149"
                  viewBox="0 0 106.818 100.149"
                >
                    <g
                      id="Group_71521"
                      data-name="Group 71521"
                      transform="translate(-1073.209 -324)"
                    >
                        <g
                          id="Path_87490"
                          data-name="Path 87490"
                          transform="translate(1140.072 324)"
                          fill="#739536"
                        >
                            <path
                              d="M 17.46367645263672 32.9273567199707 C 13.333176612854 32.9273567199707 9.449906349182129 31.31885719299316 6.529206275939941 28.39814567565918 C 3.608496427536011 25.47744560241699 1.999996423721313 21.59417724609375 1.999996423721313 17.46367645263672 C 1.999996423721313 13.333176612854 3.608496427536011 9.449906349182129 6.529206275939941 6.529206275939941 C 9.449906349182129 3.608496427536011 13.333176612854 1.999996423721313 17.46367645263672 1.999996423721313 C 21.59417724609375 1.999996423721313 25.47744560241699 3.608496427536011 28.39814567565918 6.529206275939941 C 31.31885719299316 9.449906349182129 32.9273567199707 13.333176612854 32.9273567199707 17.46367645263672 C 32.9273567199707 21.59417724609375 31.31885719299316 25.47744560241699 28.39814567565918 28.39814567565918 C 25.47744560241699 31.31885719299316 21.59417724609375 32.9273567199707 17.46367645263672 32.9273567199707 Z"
                              stroke="none"
                            />
                            <path
                              d="M 17.46367645263672 3.999996185302734 C 13.86739730834961 3.999996185302734 10.48637580871582 5.400466918945312 7.943416595458984 7.943416595458984 C 5.400466918945312 10.48637580871582 3.999996185302734 13.86739730834961 3.999996185302734 17.46367645263672 C 3.999996185302734 21.05995559692383 5.400466918945312 24.44097518920898 7.943416595458984 26.98393630981445 C 10.48637580871582 29.52688598632812 13.86739730834961 30.9273567199707 17.46367645263672 30.9273567199707 C 21.05995559692383 30.9273567199707 24.44097518920898 29.52688598632812 26.98393630981445 26.98393630981445 C 29.52688598632812 24.44097518920898 30.9273567199707 21.05995559692383 30.9273567199707 17.46367645263672 C 30.9273567199707 13.86739730834961 29.52688598632812 10.48637580871582 26.98393630981445 7.943416595458984 C 24.44097518920898 5.400466918945312 21.05995559692383 3.999996185302734 17.46367645263672 3.999996185302734 M 17.46367645263672 -3.814697265625e-06 C 27.10859680175781 -3.814697265625e-06 34.9273567199707 7.818756103515625 34.9273567199707 17.46367645263672 C 34.9273567199707 27.10859680175781 27.10859680175781 34.9273567199707 17.46367645263672 34.9273567199707 C 7.818756103515625 34.9273567199707 -3.814697265625e-06 27.10859680175781 -3.814697265625e-06 17.46367645263672 C -3.814697265625e-06 7.818756103515625 7.818756103515625 -3.814697265625e-06 17.46367645263672 -3.814697265625e-06 Z"
                              stroke="none"
                              fill="#000"
                            />
                        </g>
                        <path
                          id="Path_87436"
                          data-name="Path 87436"
                          d="M10120.818-19508.187l-8.041,8.043"
                          transform="translate(-19787.707 6979.685) rotate(45)"
                          fill="none"
                          stroke="#fff"
                          strokeLinecap="round"
                          strokeWidth="3"
                        />
                        <rect
                          id="Rectangle_18002"
                          data-name="Rectangle 18002"
                          width="105"
                          height="72"
                          rx="9"
                          transform="translate(1074 351)"
                          fill="#fff"
                        />
                        <g
                          id="Group_71520"
                          data-name="Group 71520"
                          transform="translate(138.496 20.515)"
                        >
                            <path
                              id="Path_88235"
                              data-name="Path 88235"
                              d="M190.4,111.808H87.228a1.074,1.074,0,0,1-1.074-1.074V100.546A5.649,5.649,0,0,1,91.8,94.9h94.033a5.649,5.649,0,0,1,5.642,5.642v10.186a1.074,1.074,0,0,1-1.074,1.075ZM88.3,109.658H189.32v-9.112a3.5,3.5,0,0,0-3.493-3.493H91.794a3.5,3.5,0,0,0-3.493,3.493Z"
                              transform="translate(849.31 234.096)"
                              stroke="#000"
                              strokeWidth="1.5"
                            />
                            <path
                              id="Path_88236"
                              data-name="Path 88236"
                              d="M185.827,294.857H91.792a5.649,5.649,0,0,1-5.642-5.642V253.482a1.074,1.074,0,0,1,1.074-1.074H190.392a1.074,1.074,0,0,1,1.074,1.074v35.733a5.647,5.647,0,0,1-5.641,5.642ZM88.3,254.555v34.657a3.5,3.5,0,0,0,3.493,3.493h94.033a3.5,3.5,0,0,0,3.493-3.493V254.555Z"
                              transform="translate(849.313 108.027)"
                              stroke="#000"
                              strokeWidth="1.5"
                            />
                            <path
                              id="Path_88237"
                              data-name="Path 88237"
                              d="M190.4,187.656H87.232a1.074,1.074,0,0,1-1.074-1.074V169.9a1.074,1.074,0,0,1,1.074-1.074H190.4a1.074,1.074,0,0,1,1.074,1.074v16.681A1.074,1.074,0,0,1,190.4,187.656ZM88.305,185.506H189.323V170.975H88.305Z"
                              transform="translate(849.307 174.927)"
                              stroke="#000"
                              strokeWidth="1.5"
                            />
                            <path
                              id="Path_88238"
                              data-name="Path 88238"
                              d="M172.8,381.663H151.841a1.074,1.074,0,0,1,0-2.149H172.8a1.074,1.074,0,0,1,0,2.149Z"
                              transform="translate(797.592 6.288)"
                              stroke="#000"
                              strokeWidth="1.5"
                            />
                            <path
                              id="Path_88239"
                              data-name="Path 88239"
                              d="M172.8,329.373H151.841a1.074,1.074,0,0,1,0-2.149H172.8a1.074,1.074,0,0,1,0,2.149Z"
                              transform="translate(797.592 48.142)"
                              stroke="#000"
                              strokeWidth="1.5"
                            />
                            <path
                              id="Path_88240"
                              data-name="Path 88240"
                              d="M481.043,335.1a7.655,7.655,0,0,1-4.815-1.652,7.867,7.867,0,0,1,0-12.413,7.661,7.661,0,0,1,4.811-1.647,7.856,7.856,0,1,1,0,15.712Zm0-13.563a5.531,5.531,0,0,0-3.48,1.186,5.719,5.719,0,0,0-.012,9.032,5.535,5.535,0,0,0,3.493,1.2,5.707,5.707,0,1,0,0-11.414Z"
                              transform="translate(539.513 54.418)"
                              stroke="#000"
                              strokeWidth="1.5"
                            />
                            <path
                              id="Path_88241"
                              data-name="Path 88241"
                              d="M439.473,335.093a7.857,7.857,0,0,1,0-15.713,7.672,7.672,0,0,1,4.817,1.652,1.074,1.074,0,0,1,0,1.687,5.717,5.717,0,0,0-.009,9.027,1.075,1.075,0,0,1,.013,1.694,7.664,7.664,0,0,1-4.816,1.653Zm0-13.563a5.707,5.707,0,1,0,2.4,10.893,7.869,7.869,0,0,1,0-10.373,5.658,5.658,0,0,0-2.4-.521Z"
                              transform="translate(572.785 54.421)"
                              stroke="#000"
                              strokeWidth="1.5"
                            />
                        </g>
                    </g>
                </svg>
                <h2>No Stored Payment Methods</h2>
                <p>There are no payment methods added</p>
            </div>
        );
    }

    renderMobileContent() {
        const { PaymentMethod: { items = [] } = {}, removePaymentMethod } = this.props;
        if (!items.length) {
            return this.renderNoPaymentMethod();
        }

        return (
            <div block="StoredPaymentMethod" elem="Mobile-Section">
            { items.map((value) => {
                const { details } = value;
                return (
                <div block="StoredPaymentMethod" elem="mob-content">
               <div block="mob-content-inner">
                <h4>Card Number</h4>
                <span>{ details.maskedCC }</span>

               </div>
                <div block="mob-content-inner">
                <h4>Expiry Date</h4>
                <span>{ details.expirationDate }</span>
                </div>
                <div block="mob-content-inner">
                <h4>Type</h4>
                <span>{ details.type }</span>
                </div>
                <button
                  block="Delete mob-content-inner"
                  onClick={ () => {
                      removePaymentMethod(value.public_hash);
                  } }
                >
                Delete
                </button>

                </div>

                );
            }) }
            </div>

        );
    }

    renderDesktopContent() {
        const { PaymentMethod: { items = [] } = {}, removePaymentMethod } = this.props;
        if (!items.length) {
            return this.renderNoPaymentMethod();
        }

        return (
            <div block="StoredPaymentMethod" elem="method_content">
                <table>
                    <tbody>
                        <tr block="table-Heading">
                            <th>Card Number</th>
                            <th>Expiry Date</th>
                            <th>Type</th>
                            <th>Action</th>
                        </tr>
                        { items.map((value) => {
                            const { details } = value;
                            return (
                                <tr>
                                    <th>{ details.maskedCC }</th>
                                    <th>{ details.expirationDate }</th>
                                    <th>{ details.type }</th>
                                    <td>
                                    <button
                                      block="Delete"
                                      onClick={ () => {
                                          removePaymentMethod(value.public_hash);
                                      } }
                                    >
                                    Delete
                                    </button>
                                    </td>

                                </tr>
                            );
                        }) }
                    </tbody>
                </table>
            </div>
        );
    }

    renderContent() {
        const { isMobile } = this.props;
        if (isMobile) {
            return this.renderMobileContent();
        }

        return this.renderDesktopContent();
    }

    render() {
        return (
            <div block="StoredPaymentMethod">
                { this.renderContent() }
            </div>
        );
    }
}

export default StoredPaymentMethodComponent;
