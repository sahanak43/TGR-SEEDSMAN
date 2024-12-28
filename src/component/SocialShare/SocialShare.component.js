/* eslint-disable no-unused-vars */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
/* eslint-disable max-lines */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/forbid-elements */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import ChevronIcon from 'Component/ChevronIcon';
import SideOverlay from 'Component/SideOverlay';

import { fireShareEvent } from '../../@scandiweb/gtm/event/share';
import { SOCIAL_SHARE_MOBILE } from './SocialShare.config';

import './SocialShare.style';

/** @namespace Seedsman/Component/SocialShare/Component */
export class SocialShareComponent extends PureComponent {
    /**
     * Render Facebook share link
     * @param { String } canonicalUrl
     * @return { Object }
     */

    handleShareClicks = this.handleShareClicks.bind(this);

    // eslint-disable-next-line @scandipwa/scandipwa-guidelines/only-render-in-component
    handleShareClicks(e, { canonicalUrl, productId, contentType }, type) {
        const { openNewWindow, clickToCopyLink } = this.props;

        const relAttribute = 'noopener noreferrer nofollow'; // Add the rel attribute here

        switch (type) {
        case 'facebook':
            fireShareEvent(type, contentType, productId);
            openNewWindow(e,
                `https://www.facebook.com/sharer/sharer.php?u=${canonicalUrl}`,
                relAttribute);
            break;
        case 'twitter':
            fireShareEvent(type, contentType, productId);
            openNewWindow(e,
                `https://twitter.com/intent/tweet?text=Check ${canonicalUrl}`,
                relAttribute);
            break;
        case 'clipboard':
            fireShareEvent(type, contentType, productId);
            // Assuming clickToCopyLink already adds the rel attribute
            clickToCopyLink(e, canonicalUrl, relAttribute);
            break;
        default:
            // eslint-disable-next-line no-unused-expressions
            null;
        }
    }

    renderFacebookShare(data) {
        return (
            <span
              title="Share on Facebook!"
              onClick={ (e) => this.handleShareClicks(e, data, 'facebook') }
            >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="7.756"
                  height="15.512"
                  viewBox="0 0 7.756 15.512"
                >
                    <path
                      id="layer"
                      d="M7.333,2.744a5.021,5.021,0,0,0-1.356-.206c-.551,0-1.738.351-1.738,1.031V5.2H7.057V7.942H4.239v7.57H1.4V7.942H0V5.2H1.4V3.816C1.4,1.733,2.374,0,4.726,0A11.553,11.553,0,0,1,7.756.309Z"
                    />
                </svg>
            </span>
        );
    }

    renderFacebookShareMobile(canonicalUrl) {
        const { openNewWindow } = this.props;
        return (
            <button
              title="Share on Facebook!"
              className="ShareCopyLinkConatiner"
              onClick={ (e) => openNewWindow(
                  e,
                  `https://www.facebook.com/sharer/sharer.php?u= ${canonicalUrl}`,
                  'noopener noreferrer nofollow'
              ) }
            >
                <div className="ShareSocial">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="7.756"
                  height="15.512"
                  viewBox="0 0 7.756 15.512"
                  className="ShareSocialLink"
                >
                    <path
                      id="layer"
                      d="M7.333,2.744a5.021,5.021,0,0,0-1.356-.206c-.551,0-1.738.351-1.738,1.031V5.2H7.057V7.942H4.239v7.57H1.4V7.942H0V5.2H1.4V3.816C1.4,1.733,2.374,0,4.726,0A11.553,11.553,0,0,1,7.756.309Z"
                    />
                </svg>
                <div className="ShareSocialText">
                <span>Facebook</span>
                <ChevronIcon />
                </div>
                </div>
            </button>
        );
    }

    /**
     * Render twitter share link
     * @param { String } canonicalUrl
     * @return { Object }
     */
    renderTwitterShare(data) {
        return (
            <span
              title="Share on Twitter!"
              onClick={ (e) => this.handleShareClicks(e, data, 'twitter') }
            >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16.968"
                  height="14.219"
                  viewBox="0 0 16.968 14.219"
                >
                    <path
                      id="layer"
                      d="M14.288,1.133A3.425,3.425,0,0,0,11.747,0a3.537,3.537,0,0,0-3.48,3.59,3.676,3.676,0,0,0,.09.817A9.783,9.783,0,0,1,1.181.655,3.671,3.671,0,0,0,.71,2.462,3.617,3.617,0,0,0,2.259,5.449,3.4,3.4,0,0,1,.681,5v.044a3.564,3.564,0,0,0,2.794,3.52,3.3,3.3,0,0,1-.917.127A3.374,3.374,0,0,1,1.9,8.628,3.5,3.5,0,0,0,5.154,11.12,6.851,6.851,0,0,1,.83,12.657,6.938,6.938,0,0,1,0,12.608a9.652,9.652,0,0,0,5.336,1.611c6.4,0,9.9-5.469,9.9-10.213,0-.156,0-.312-.009-.465a7.165,7.165,0,0,0,1.736-1.858,6.789,6.789,0,0,1-2,.565A3.58,3.58,0,0,0,16.5.263,6.822,6.822,0,0,1,14.288,1.133Z"
                    />
                </svg>
            </span>
        );
    }

    renderTwitterShareMobile(canonicalUrl) {
        const { openNewWindow } = this.props;
        return (
            <button
              title="Share on Twitter!"
              className="ShareCopyLinkConatiner"
              onClick={ (e) => openNewWindow(
                  e,
                  `https://twitter.com/intent/tweet?text=Check ${canonicalUrl}`,
                  'noopener noreferrer nofollow'
              ) }
            >
                <div className="ShareSocial">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16.968"
                  height="14.219"
                  viewBox="0 0 16.968 14.219"
                  className="ShareSocialLink"
                >
                    <path
                      id="layer"
                      d="M14.288,1.133A3.425,3.425,0,0,0,11.747,0a3.537,3.537,0,0,0-3.48,3.59,3.676,3.676,0,0,0,.09.817A9.783,9.783,0,0,1,1.181.655,3.671,3.671,0,0,0,.71,2.462,3.617,3.617,0,0,0,2.259,5.449,3.4,3.4,0,0,1,.681,5v.044a3.564,3.564,0,0,0,2.794,3.52,3.3,3.3,0,0,1-.917.127A3.374,3.374,0,0,1,1.9,8.628,3.5,3.5,0,0,0,5.154,11.12,6.851,6.851,0,0,1,.83,12.657,6.938,6.938,0,0,1,0,12.608a9.652,9.652,0,0,0,5.336,1.611c6.4,0,9.9-5.469,9.9-10.213,0-.156,0-.312-.009-.465a7.165,7.165,0,0,0,1.736-1.858,6.789,6.789,0,0,1-2,.565A3.58,3.58,0,0,0,16.5.263,6.822,6.822,0,0,1,14.288,1.133Z"
                    />
                </svg>
                <div className="ShareSocialText">
                <span>Twitter</span>
                <ChevronIcon />
                </div>
                </div>
            </button>
        );
    }

    /**
     * Render pintrest share link
     * @param {*} canonicalUrl
     * @return { Object }
     */
    renderPintrestShare(canonicalUrl) {
        const { openNewWindow } = this.props;
        return (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <span
              title="Share on Pintrest!"
              onClick={ (e) => openNewWindow(
                  e,
                  `http://www.pinterest.com/pin/create/button/?url= ${canonicalUrl}`,
                  'noopener noreferrer nofollow'
              ) }
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12.14.5C5.86.5 2.7 5 2.7 8.75c0 2.27.86 4.3 2.7 5.05.3.12.57 0 .66-.33l.27-1.06c.1-.32.06-.44-.2-.73-.52-.62-.86-1.44-.86-2.6 0-3.33 2.5-6.32 6.5-6.32 3.55 0 5.5 2.17 5.5 5.07 0 3.8-1.7 7.02-4.2 7.02-1.37 0-2.4-1.14-2.07-2.54.4-1.68 1.16-3.48 1.16-4.7 0-1.07-.58-1.98-1.78-1.98-1.4 0-2.55 1.47-2.55 3.42 0 1.25.43 2.1.43 2.1l-1.7 7.2c-.5 2.13-.08 4.75-.04 5 .02.17.22.2.3.1.14-.18 1.82-2.26 2.4-4.33.16-.58.93-3.63.93-3.63.45.88 1.8 1.65 3.22 1.65 4.25 0 7.13-3.87 7.13-9.05C20.5 4.15 17.18.5 12.14.5z" />
                </svg>
            </span>
        );
    }

    renderInstagramShare(canonicalUrl) {
        const { openNewWindow } = this.props;
        return (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <span
              title="Share on Instagram!"
              onClick={ (e) => openNewWindow(
                  e,
                  `https://www.instagram.com/sharer/sharer.php?u= ${canonicalUrl}`,
                  'noopener noreferrer nofollow'
              ) }
            >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15.513"
                  height="15.512"
                  viewBox="0 0 15.513 15.512"
                >
                    <path
                      id="instagram-logo-fill-svgrepo-com"
                      d="M38.239,35.756a2.482,2.482,0,1,1-2.482-2.482A2.482,2.482,0,0,1,38.239,35.756Zm5.274-3.413v6.825a4.349,4.349,0,0,1-4.344,4.343H32.344A4.349,4.349,0,0,1,28,39.169V32.343A4.349,4.349,0,0,1,32.344,28H39.17A4.349,4.349,0,0,1,43.513,32.343ZM39.48,35.756a3.723,3.723,0,1,0-3.723,3.723A3.723,3.723,0,0,0,39.48,35.756Zm1.241-4.033a.931.931,0,1,0-.931.931A.931.931,0,0,0,40.721,31.723Z"
                      transform="translate(-28 -28)"
                    />
                </svg>
            </span>
        );
    }

    renderLinkShare(data) {
        return (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <span
              title="Copy Link!"
              onClick={ (e) => this.handleShareClicks(e, data, 'clipboard') }
            >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                >
                    <path d="M6.188 8.719c.439-.439.926-.801 1.444-1.087 2.887-1.591 6.589-.745 8.445 2.069l-2.246 2.245c-.644-1.469-2.243-2.305-3.834-1.949-.599.134-1.168.433-1.633.898l-4.304 4.306c-1.307 1.307-1.307 3.433 0 4.74 1.307 1.307 3.433 1.307 4.74 0l1.327-1.327c1.207.479 2.501.67 3.779.575l-2.929 2.929c-2.511 2.511-6.582 2.511-9.093 0s-2.511-6.582 0-9.093l4.304-4.306zm6.836-6.836l-2.929 2.929c1.277-.096 2.572.096 3.779.574l1.326-1.326c1.307-1.307 3.433-1.307 4.74 0 1.307 1.307 1.307 3.433 0 4.74l-4.305 4.305c-1.311 1.311-3.44 1.3-4.74 0-.303-.303-.564-.68-.727-1.051l-2.246 2.245c.236.358.481.667.796.982.812.812 1.846 1.417 3.036 1.704 1.542.371 3.194.166 4.613-.617.518-.286 1.005-.648 1.444-1.087l4.304-4.305c2.512-2.511 2.512-6.582.001-9.093-2.511-2.51-6.581-2.51-9.092 0z" />
                </svg>
            </span>
        );
    }

    renderLinkShareMobile(canonicalUrl) {
        const { copyClipBoardLink, isClicked } = this.props;

        return (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <button
              className="ShareCopyLinkConatiner"
              title="Copy Link!"
              onClick={ (e) => copyClipBoardLink(e, canonicalUrl) }
            >
                { !isClicked ? (
                    <div className="ShareCopy">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          className="ShareCopyLink"
                        >
                            <path d="M6.188 8.719c.439-.439.926-.801 1.444-1.087 2.887-1.591 6.589-.745 8.445 2.069l-2.246 2.245c-.644-1.469-2.243-2.305-3.834-1.949-.599.134-1.168.433-1.633.898l-4.304 4.306c-1.307 1.307-1.307 3.433 0 4.74 1.307 1.307 3.433 1.307 4.74 0l1.327-1.327c1.207.479 2.501.67 3.779.575l-2.929 2.929c-2.511 2.511-6.582 2.511-9.093 0s-2.511-6.582 0-9.093l4.304-4.306zm6.836-6.836l-2.929 2.929c1.277-.096 2.572.096 3.779.574l1.326-1.326c1.307-1.307 3.433-1.307 4.74 0 1.307 1.307 1.307 3.433 0 4.74l-4.305 4.305c-1.311 1.311-3.44 1.3-4.74 0-.303-.303-.564-.68-.727-1.051l-2.246 2.245c.236.358.481.667.796.982.812.812 1.846 1.417 3.036 1.704 1.542.371 3.194.166 4.613-.617.518-.286 1.005-.648 1.444-1.087l4.304-4.305c2.512-2.511 2.512-6.582.001-9.093-2.511-2.51-6.581-2.51-9.092 0z" />
                        </svg>
                        <div className="ShareSocialText">
                        <span>Copy Link</span>
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="ShareCopyLink"
                        >
                            <path
                              d="M7.25781 14.7361C6.97448 14.7361 6.73715 14.6401 6.54581 14.4481C6.35381 14.2568 6.25781 14.0194 6.25781 13.7361V8.73608H1.25781C0.974479 8.73608 0.736813 8.64008 0.544813 8.44808C0.353479 8.25675 0.257812 8.01942 0.257812 7.73608C0.257812 7.45275 0.353479 7.21508 0.544813 7.02308C0.736813 6.83175 0.974479 6.73608 1.25781 6.73608H6.25781V1.73608C6.25781 1.45275 6.35381 1.21508 6.54581 1.02308C6.73715 0.831751 6.97448 0.736084 7.25781 0.736084C7.54115 0.736084 7.77881 0.831751 7.97081 1.02308C8.16215 1.21508 8.25781 1.45275 8.25781 1.73608V6.73608H13.2578C13.5411 6.73608 13.7785 6.83175 13.9698 7.02308C14.1618 7.21508 14.2578 7.45275 14.2578 7.73608C14.2578 8.01942 14.1618 8.25675 13.9698 8.44808C13.7785 8.64008 13.5411 8.73608 13.2578 8.73608H8.25781V13.7361C8.25781 14.0194 8.16215 14.2568 7.97081 14.4481C7.77881 14.6401 7.54115 14.7361 7.25781 14.7361Z"
                              fill="black"
                            />
                        </svg>
                        </div>
                    </div>
                ) : (
                    <div className="ShareCopyCLicked">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          className="ShareCopyLink"
                        >
                            <path d="M6.188 8.719c.439-.439.926-.801 1.444-1.087 2.887-1.591 6.589-.745 8.445 2.069l-2.246 2.245c-.644-1.469-2.243-2.305-3.834-1.949-.599.134-1.168.433-1.633.898l-4.304 4.306c-1.307 1.307-1.307 3.433 0 4.74 1.307 1.307 3.433 1.307 4.74 0l1.327-1.327c1.207.479 2.501.67 3.779.575l-2.929 2.929c-2.511 2.511-6.582 2.511-9.093 0s-2.511-6.582 0-9.093l4.304-4.306zm6.836-6.836l-2.929 2.929c1.277-.096 2.572.096 3.779.574l1.326-1.326c1.307-1.307 3.433-1.307 4.74 0 1.307 1.307 1.307 3.433 0 4.74l-4.305 4.305c-1.311 1.311-3.44 1.3-4.74 0-.303-.303-.564-.68-.727-1.051l-2.246 2.245c.236.358.481.667.796.982.812.812 1.846 1.417 3.036 1.704 1.542.371 3.194.166 4.613-.617.518-.286 1.005-.648 1.444-1.087l4.304-4.305c2.512-2.511 2.512-6.582.001-9.093-2.511-2.51-6.581-2.51-9.092 0z" />
                        </svg>
                        <div className="ShareSocialText">
                        <span>Copied to pasteboard</span>
                        <svg
                          width="16"
                          height="12"
                          viewBox="0 0 16 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="ShareCopyLink"
                        >
                            <path
                              d="M5.56013 11.3236C5.4268 11.3236 5.3018 11.3026 5.18513 11.2606C5.06847 11.2192 4.96013 11.1486 4.86013 11.0486L0.560133 6.74856C0.376799 6.56523 0.289133 6.32756 0.297133 6.03556C0.305799 5.74423 0.401799 5.50689 0.585132 5.32356C0.768466 5.14023 1.0018 5.04856 1.28513 5.04856C1.56847 5.04856 1.8018 5.14023 1.98513 5.32356L5.56013 8.89856L14.0351 0.42356C14.2185 0.240226 14.4561 0.14856 14.7481 0.14856C15.0395 0.14856 15.2768 0.240226 15.4601 0.42356C15.6435 0.606893 15.7351 0.844226 15.7351 1.13556C15.7351 1.42756 15.6435 1.66523 15.4601 1.84856L6.26013 11.0486C6.16013 11.1486 6.0518 11.2192 5.93513 11.2606C5.81847 11.3026 5.69347 11.3236 5.56013 11.3236Z"
                              fill="black"
                            />
                        </svg>
                        </div>
                    </div>
                ) }
            </button>
        );
    }

    /**
     * Render share icon
     * @return { Object }
     */
    renderShareIcon() {
        return (
            <svg
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
                <path
                  d="M18.5 22C17.6667 22 16.9583 21.7083 16.375 21.125C15.7917 20.5417 15.5 19.8333 15.5 19C15.5 18.8833 15.5083 18.7623 15.525 18.637C15.5417 18.5123 15.5667 18.4 15.6 18.3L8.55 14.2C8.26667 14.45 7.95 14.6457 7.6 14.787C7.25 14.929 6.88333 15 6.5 15C5.66667 15 4.95833 14.7083 4.375 14.125C3.79167 13.5417 3.5 12.8333 3.5 12C3.5 11.1667 3.79167 10.4583 4.375 9.875C4.95833 9.29167 5.66667 9 6.5 9C6.88333 9 7.25 9.07067 7.6 9.212C7.95 9.354 8.26667 9.55 8.55 9.8L15.6 5.7C15.5667 5.6 15.5417 5.48767 15.525 5.363C15.5083 5.23767 15.5 5.11667 15.5 5C15.5 4.16667 15.7917 3.45833 16.375 2.875C16.9583 2.29167 17.6667 2 18.5 2C19.3333 2 20.0417 2.29167 20.625 2.875C21.2083 3.45833 21.5 4.16667 21.5 5C21.5 5.83333 21.2083 6.54167 20.625 7.125C20.0417 7.70833 19.3333 8 18.5 8C18.1167 8 17.75 7.929 17.4 7.787C17.05 7.64567 16.7333 7.45 16.45 7.2L9.4 11.3C9.43333 11.4 9.45833 11.5123 9.475 11.637C9.49167 11.7623 9.5 11.8833 9.5 12C9.5 12.1167 9.49167 12.2373 9.475 12.362C9.45833 12.4873 9.43333 12.6 9.4 12.7L16.45 16.8C16.7333 16.55 17.05 16.354 17.4 16.212C17.75 16.0707 18.1167 16 18.5 16C19.3333 16 20.0417 16.2917 20.625 16.875C21.2083 17.4583 21.5 18.1667 21.5 19C21.5 19.8333 21.2083 20.5417 20.625 21.125C20.0417 21.7083 19.3333 22 18.5 22ZM18.5 6C18.7833 6 19.0207 5.90433 19.212 5.713C19.404 5.521 19.5 5.28333 19.5 5C19.5 4.71667 19.404 4.479 19.212 4.287C19.0207 4.09567 18.7833 4 18.5 4C18.2167 4 17.9793 4.09567 17.788 4.287C17.596 4.479 17.5 4.71667 17.5 5C17.5 5.28333 17.596 5.521 17.788 5.713C17.9793 5.90433 18.2167 6 18.5 6ZM6.5 13C6.78333 13 7.021 12.904 7.213 12.712C7.40433 12.5207 7.5 12.2833 7.5 12C7.5 11.7167 7.40433 11.479 7.213 11.287C7.021 11.0957 6.78333 11 6.5 11C6.21667 11 5.979 11.0957 5.787 11.287C5.59567 11.479 5.5 11.7167 5.5 12C5.5 12.2833 5.59567 12.5207 5.787 12.712C5.979 12.904 6.21667 13 6.5 13ZM18.5 20C18.7833 20 19.0207 19.904 19.212 19.712C19.404 19.5207 19.5 19.2833 19.5 19C19.5 18.7167 19.404 18.4793 19.212 18.288C19.0207 18.096 18.7833 18 18.5 18C18.2167 18 17.9793 18.096 17.788 18.288C17.596 18.4793 17.5 18.7167 17.5 19C17.5 19.2833 17.596 19.5207 17.788 19.712C17.9793 19.904 18.2167 20 18.5 20Z"
                  fill="black"
                />
            </svg>
        );
    }

    handleShareDefaultClick(event) {
        event.preventDefault();
    }

    /**
     * Renders native share button
     * @return { Object }
     */
    renderNativeShare() {
        const { triggerShare } = this.props;

        return (
            <div block="navtive-icon">
                <div block="shareIcon">
                    <button
                      mix={ { block: 'SocialShare', elem: 'Native' } }
                      onClick={ triggerShare }
                    >
                        { this.renderShareIcon() }
                    </button>
                </div>
                { this.renderShareButtonsMobile() }
            </div>
        );
    }

    /**
     * Renders social share button
     * @return { Object }
     */
    renderShare() {
        return (
            <div block="navtive-icon">
                <div block="shareIcon">
                    <button
                      mix={ { block: 'SocialShare', elem: 'Native' } }
                      // eslint-disable-next-line no-undef
                      onClick={ this.handleShareDefaultClick }
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path d="M21 9c-1.656 0-3 1.343-3 3s1.344 3 3 3 3-1.343 3-3-1.344-3-3-3zm-15 9c-1.657 0-3 1.343-3 3s1.343 3 3 3c1.656 0 3-1.343 3-3s-1.344-3-3-3zm3-15c0 1.657-1.344 3-3 3s-3-1.343-3-3 1.344-3 3-3 3 1.343 3 3zm1.588-1.979l.412-.021c4.281 0 7.981 2.45 9.8 6.021-.717.029-1.39.21-1.998.511-1.555-2.703-4.466-4.532-7.802-4.532 0-.703-.149-1.372-.412-1.979zm10.212 15.958c-1.819 3.571-5.519 6.021-9.8 6.021l-.412-.021c.263-.607.412-1.276.412-1.979 3.336 0 6.247-1.829 7.802-4.532.608.302 1.281.483 1.998.511zm-18.91 1.186c-1.193-1.759-1.89-3.88-1.89-6.165s.697-4.406 1.89-6.165c.392.566.901 1.039 1.487 1.403-.867 1.383-1.377 3.012-1.377 4.762s.51 3.379 1.377 4.762c-.586.364-1.096.837-1.487 1.403z" />
                        </svg>
                    </button>
                </div>
                <div mix={ { block: 'hover-content' } }>
                    { this.renderShareButtons() }
                </div>
            </div>
        );
    }

    /**
     * Renders al social share links
     * @return { Object }
     */
    renderShareButtons() {
        const {
            description,
            productId,
            contentType
        } = this.props;

        if (!description) {
            return null;
        }

        const data = {
            canonicalUrl: description,
            productId,
            contentType
        };

        return (
            <>
                <span block="Local-Share" elem="Icons">
                    { this.renderFacebookShare(data) }
                </span>
                <span block="Local-Share" elem="Icons">
                    { this.renderTwitterShare(data) }
                </span>
                <span block="Local-Share" elem="Icons">
                    { this.renderLinkShare(data) }
                </span>
            </>
        );
    }

    renderShareButtonsMobile() {
        const {
            description
        } = this.props;

        if (!description) {
            return null;
        }

        return (
            <SideOverlay
              title="Share"
              id={ SOCIAL_SHARE_MOBILE }
              isSelectButtonRequired={ false }
            >
                <div block="ShareIconMobile" elem="ShareIconContainer">
                    <div block="ShareIconMobile" elem="ShareIconTitle">
                        Share via text
                    </div>
                    <div block="ShareIconMobile" elem="LinkShareMobile">
                        { this.renderLinkShareMobile(description) }
                    </div>
                    <div block="ShareIconMobile" elem="IconShareSocial">
                        Share to your social
                    </div>

                    <div block="ShareIconMobile" elem="IconShare">
                        { this.renderFacebookShareMobile(description) }
                    </div>
                    <div block="ShareIconMobile" elem="IconShare">
                        { this.renderTwitterShareMobile(description) }
                    </div>
                </div>
            </SideOverlay>
        );
    }

    render() {
        const { native } = this.props;
        return (
            <div
              mix={ { block: 'SocialShare', elem: 'Block' } }
              className={ native ? 'native' : 'local' }
            >
                { native ? this.renderShare() : this.renderNativeShare() }
            </div>
        );
    }
}

export default SocialShareComponent;
