/* eslint-disable max-lines */
/* eslint-disable max-len */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import PropTypes from 'prop-types';

import MyAccountAddressPopup from 'Component/MyAccountAddressPopup';
import MyAccountAddressTable from 'Component/MyAccountAddressTable';
import { MyAccountAddressBook as SourceMyAccountAddressBook } from 'SourceComponent/MyAccountAddressBook/MyAccountAddressBook.component';
import { CustomerType } from 'Type/Account.type';
import { getDefaultAddressLabel } from 'Util/Address';

import './MyAccountAddressBook.style';

/** @namespace Seedsman/Component/MyAccountAddressBook/Component */
export class MyAccountAddressBookComponent extends SourceMyAccountAddressBook {
    static propTypes = {
        customer: CustomerType.isRequired,
        showCreateNewPopup: PropTypes.func.isRequired
    };

    shouldComponentUpdate(nextProps) {
        const { customer } = this.props;
        const { customer: nextCustomer } = nextProps;

        return customer !== nextCustomer;
    }

    renderPopup() {
        return <MyAccountAddressPopup />;
    }

    renderAddress(address, index) {
        const { default_billing } = address;
        const addressNumber = index + 1;
        const postfix = getDefaultAddressLabel(address);

        return (
            <MyAccountAddressTable
              title={ __('Address #%s%s', addressNumber, postfix) }
              showActions
              address={ address }
              key={ addressNumber }
              isBilling={ default_billing }
            />
        );
    }

    renderNoAddresses() {
        return (
            <div block="MyAccountAddressBook" elem="Address_Empty">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="67.386"
                  height="104.396"
                  viewBox="0 0 67.386 104.396"
                >
                    <g
                      id="Group_69705"
                      data-name="Group 69705"
                      transform="translate(8422.681 6476.033)"
                    >
                        <g
                          id="Path_87430"
                          data-name="Path 87430"
                          transform="translate(-8405.89 -6462.198)"
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
                          id="Path_87464"
                          data-name="Path 87464"
                          d="M187.363,110.968a5.787,5.787,0,0,1-4.454-2.088c-6.233-7.474-17.606-21.929-23.75-34.759a31.713,31.713,0,0,1-3.571-9.845A19.916,19.916,0,0,1,155,59.628V58.175a32.762,32.762,0,0,1,1.621-10.22,1.452,1.452,0,1,1,2.759.9,29.914,29.914,0,0,0-1.476,9.317c0,.322.026.629.053.943l.137,1.968h-.112a18.989,18.989,0,0,0,.45,2.586,29.221,29.221,0,0,0,3.306,9.109c6.053,12.635,17.259,26.869,23.407,34.238a2.982,2.982,0,0,0,4.448,0c.816-.978,1.754-2.119,2.782-3.393h0a1.452,1.452,0,0,1,2.256,1.821c-1.037,1.288-1.987,2.441-2.813,3.432a5.79,5.79,0,0,1-4.448,2.088Zm10.622-10.693a1.452,1.452,0,0,1-1.151-2.334,153.26,153.26,0,0,0,16.121-25.075,29.3,29.3,0,0,0,3.34-9.113,20.114,20.114,0,0,0,.466-2.667h-.029l.054-1.952c.026-.32.053-.63.053-.958-.013-16-12.6-29.017-28.066-29.017-.453,0-.861,0-1.307.03h-.206c-.443-.03-.856-.03-1.3-.03A27.741,27.741,0,0,0,162.281,42.6a1.452,1.452,0,1,1-2.469-1.524,30.625,30.625,0,0,1,26.142-14.819c.482,0,.931,0,1.409.03.478-.03.926-.03,1.409-.03,17.07,0,30.959,14.318,30.959,31.921,0,.29-.016.581-.036.857l.036.6a20.23,20.23,0,0,1-.608,4.721,31.833,31.833,0,0,1-3.6,9.851,153.349,153.349,0,0,1-16.383,25.5,1.452,1.452,0,0,1-1.156.571Z"
                          transform="translate(-8575.676 -6501.637)"
                          stroke="#000"
                          strokeWidth="1.3"
                        />
                        <g
                          id="Group_69609"
                          data-name="Group 69609"
                          transform="translate(-18508.945 13061.597)"
                        >
                            <path
                              id="Path_87435"
                              data-name="Path 87435"
                              d="M10112.777-19508.186l11.709,11.709"
                              transform="translate(2 -4)"
                              fill="none"
                              stroke="#fff"
                              strokeLinecap="round"
                              strokeWidth="3"
                            />
                            <path
                              id="Path_87436"
                              data-name="Path 87436"
                              d="M10124.486-19508.186l-11.709,11.709"
                              transform="translate(2 -4)"
                              fill="none"
                              stroke="#fff"
                              strokeLinecap="round"
                              strokeWidth="3"
                            />
                        </g>
                        <path
                          id="Path_87465"
                          data-name="Path 87465"
                          d="M37.107,268.264h0c.338.05-8,.369-11.174.369-13.494,0-24.433-4.229-24.433-9.446,0-3.059,3.76-5.778,9.871-7.586"
                          transform="translate(-8422.181 -6642.271)"
                          fill="none"
                          stroke="#111"
                          strokeLinecap="round"
                          strokeWidth="4"
                        />
                    </g>
                </svg>
                <h2>Your Address Is Empty</h2>
                <p>There are no recent address to show</p>
                { this.renderActions_Empty() }
            </div>
        );
    }

    renderActions() {
        const { showCreateNewPopup } = this.props;
        // const {
        //     customer: { addresses = [] }
        // } = this.props;

        // if (!addresses.length) {
        //     return null;
        // }

        return (
            <div block="MyAccountAddressBook" elem="action-section">
                <h3 block="heading">Address Book</h3>
                <button
                  block="Button"
                  mix={ {
                      block: 'MyAccountAddressBook',
                      elem: 'Button_NewAddress'
                  } }
                  mods={ { isHollow: true } }
                  onClick={ showCreateNewPopup }
                >
                + ADD NEW ADDRESS
                </button>
            </div>
        );
    }

    renderActions_Empty() {
        const { showCreateNewPopup } = this.props;

        return (
            <button
              block="Button"
              mix={ {
                  block: 'MyAccountAddressBook',
                  elem: 'Button_EmptyAddress'
              } }
              mods={ { isHollow: false } }
              onClick={ showCreateNewPopup }
            >
                ADD ADDRESS
            </button>
        );
    }

    renderAddressList() {
        const {
            customer: { addresses = [] }
        } = this.props;

        if (!addresses.length) {
            return null;
        }

        return (
            <div className="OtherAddress">
                <div className="Address-list BillingAddress">
                    { addresses.map((val, index) => (
                        <>
                            { this.renderAddress(val, index) }
                        </>
                    )) }
                </div>
            </div>
        );
    }

    renderAddressSection() {
        const {
            customer: { addresses = [] }
        } = this.props;

        if (!addresses.length) {
            return this.renderNoAddresses();
        }

        return (
            <>
                { this.renderAddressList() }
            </>
        );
    }

    render() {
        return (
            <div block="MyAccountAddressBook">
                { this.renderActions() }
                { this.renderAddressSection() }
                { this.renderPopup() }
            </div>
        );
    }
}

export default MyAccountAddressBookComponent;
