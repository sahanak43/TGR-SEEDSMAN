/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable max-lines */
/* eslint-disable no-undef */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
/* eslint-disable max-len */
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
import Link from 'Component/Link';
import SocialShare from 'Component/SocialShare';
import { MyAccountMyWishlist as SourceMyAccountMyWishlistComponent } from 'SourceComponent/MyAccountMyWishlist/MyAccountMyWishlist.component';

import './MyAccountMyWishlist.style';

/** @namespace Seedsman/Component/MyAccountMyWishlist/Component */
export class MyAccountMyWishlistComponent extends SourceMyAccountMyWishlistComponent {
    renderHeading() {
        const { wishlistItems = {} } = this.props;
        const NumberOfItems = Object.keys(wishlistItems).length;
        return (
            <div block="MyAccountMyWishlist" elem="Heading-section">
                <div block="Heading-inner">
                    <div block="Heading">
                        <h3>My Wishlist</h3>
                        <span block="SubHeading">
                            { NumberOfItems }
{ ' ' }
Result
                        </span>
                    </div>
                    { this.renderClearWishlist() }
                </div>
                { this.renderSocialShare() }
            </div>
        );
    }

    renderShareWishlistButton() {
        const { isWishlistLoading, shareWishlist, isWishlistEmpty } = this.props;

        const disabled = isWishlistLoading || isWishlistEmpty;
        if (isWishlistEmpty && !isWishlistLoading) {
            return null;
        }

        return (
            <button
              block="Button"
              mods={ { isHollow: true } }
              mix={ {
                  block: 'MyAccountMyWishlist',
                  elem: 'ShareWishlistButton'
              } }
              onClick={ shareWishlist }
              disabled={ disabled }
            >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                    <path d="M19 9.062s-5.188-.333-7 1.938c2-4.896 7-5.938 7-5.938v-2l5 4-5 4.019v-2.019zm-18.974 14.938h23.947l-11.973-11.607-11.974 11.607zm1.673-14l10.291-7.488 3.053 2.218c.712-.459 1.391-.805 1.953-1.054l-5.006-3.637-11.99 8.725v12.476l7.352-7.127-5.653-4.113zm15.753 4.892l6.548 6.348v-11.612l-6.548 5.264z" />
                </svg>
            </button>
        );
    }

    renderNoProductsFound() {
        return (
            <div block="MyAccountMyWishlist" elem="NoProducts">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="85.718"
                  height="83.399"
                  viewBox="0 0 85.718 83.399"
                >
                    <g
                      id="Group_69756"
                      data-name="Group 69756"
                      transform="translate(2812 9328.49)"
                    >
                        <g
                          id="Path_87490"
                          data-name="Path 87490"
                          transform="translate(-2761.209 -9328.49)"
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
                          transform="translate(-23688.988 -2671.805) rotate(45)"
                          fill="none"
                          stroke="#fff"
                          strokeLinecap="round"
                          strokeWidth="3"
                        />
                        <circle
                          id="Ellipse_91391"
                          data-name="Ellipse 91391"
                          cx="35"
                          cy="35"
                          r="35"
                          transform="translate(-2810 -9317)"
                          fill="#fff"
                        />
                        <path
                          id="Path_87467"
                          data-name="Path 87467"
                          d="M106.947,73.894A36.944,36.944,0,1,0,80.826,63.073,36.936,36.936,0,0,0,106.947,73.894Zm0-70a33.053,33.053,0,1,1-23.372,9.681A33.055,33.055,0,0,1,106.947,3.9Z"
                          transform="translate(-2882.005 -9318.985)"
                        />
                        <path
                          id="Path_87466"
                          data-name="Path 87466"
                          d="M140.079,130.062a1.947,1.947,0,0,0,1.788,0c1.05-.564,26.328-13.98,26.328-28.952a13.458,13.458,0,0,0-4.2-9.955,13.749,13.749,0,0,0-9.411-3.655,15.847,15.847,0,0,0-13.611,8.4,15.847,15.847,0,0,0-13.611-8.4,13.747,13.747,0,0,0-9.391,3.655,13.454,13.454,0,0,0-4.219,9.955c0,14.972,25.277,28.388,26.328,28.952Zm-19.444-36.05a9.935,9.935,0,0,1,6.727-2.625,12.618,12.618,0,0,1,11.666,10.189,1.945,1.945,0,0,0,3.772,0,12.618,12.618,0,0,1,11.783-10.189,9.937,9.937,0,0,1,6.747,2.625,9.372,9.372,0,0,1,2.975,7.1c0,11.219-18.939,22.515-23.332,25-4.394-2.489-23.332-13.785-23.332-25a9.37,9.37,0,0,1,2.956-7.1Z"
                          transform="translate(-2916.031 -9387.033)"
                        />
                    </g>
                </svg>

                <h2>Your Wishlist Is Empty</h2>
                <p>There are no recent wishlist to show</p>
                { this.renderActions_Empty() }
            </div>
        );
    }

    renderActions_Empty() {
        return (
            <Link
              to="/"
              block="Button"
              mix={ {
                  block: 'MyAccountWishlist',
                  elem: 'Button_EmptyWhishlist'
              } }
              mods={ { isHollow: false } }
            >
                CONTINUE SHOPPING
            </Link>
        );
    }

    renderSocialShare() {
        const { isWishlistLoading, isWishlistEmpty, sharingcode } = this.props;

        if (isWishlistEmpty && !isWishlistLoading) {
            return null;
        }
        const Domain = window.location.origin;
        const metaLink = `${Domain}${'/wishlist/shared/'}${sharingcode}`;
        return (
        <div block="MyAccountMyWishlist" elem="Sharing-section">
            <h3>Share Your Wishlist:</h3>
            <div block="sharing-icons">
            { /* { this.renderShareWishlistButton() } */ }
            <SocialShare description={ metaLink } />

            </div>
        </div>
        );
    }

    renderClearWishlist() {
        const {
            removeAll,
            isActionsDisabled,
            isLoading,
            isWishlistLoading,
            isWishlistEmpty
        } = this.props;

        if (isWishlistEmpty && !isWishlistLoading) {
            return null;
        }

        return (
            <button
              block="Button"
              mods={ { isHollow: true, isWithoutBorder: true } }
              mix={ {
                  block: 'MyAccountMyWishlist',
                  elem: 'ClearWishlistButton'
              } }
              onClick={ removeAll }
              disabled={ isActionsDisabled || isLoading }
            >
                CLEAR WISHLIST
            </button>
        );
    }

    render() {
        return (
            <div block="MyAccountMyWishlist">
                { this.renderHeading() }
                { this.renderShareWishlist() }
                { this.renderContent() }
                { /* { this.renderActionBar() } */ }
            </div>
        );
    }
}

export default MyAccountMyWishlistComponent;
