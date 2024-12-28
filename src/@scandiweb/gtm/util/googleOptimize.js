/**
 * Google Tag Manager frontend compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import getStore from 'Util/Store';

/** @namespace Seedsman/@Scandiweb/Gtm/Util/GoogleOptimize/injectGoogleOptimize */
export const injectGoogleOptimize = () => {
    const {
        googleOptimizeEnabled,
        googleOptimizeId,
        googleOptimizeAsyncEnabled
    } = getStore().getState().ConfigReducer.gtm;

    if (!googleOptimizeEnabled) {
        // Google Optimize is disable, skip
        return;
    }

    const GoogleOptimizeAsync = googleOptimizeAsyncEnabled ? 'async' : '';
    // vvv GoogleOptimize script : https://support.google.com/optimize/answer/9692472
    const script = `<script ${GoogleOptimizeAsync} src="https://www.googleoptimize.com/optimize.js?id=${googleOptimizeId}"></script>`;

    document.head.insertAdjacentHTML('afterbegin', script);
};

/** @namespace Seedsman/@Scandiweb/Gtm/Util/GoogleOptimize/injectAntiFlicker */
export const injectAntiFlicker = () => {
    const {
        antiFlickerEnabled,
        enabled: isGTMEnabled,
        gtm_id: gtmId,
        googleOptimizeId

    } = getStore().getState().ConfigReducer.gtm;

    if (!antiFlickerEnabled) {
        // anti-flicker is disable, skip
        return;
    }

    const containerId = isGTMEnabled ? gtmId : googleOptimizeId;

    // vvv anti-flicker script : https://developers.google.com/optimize/
    const script = `
        <style>.async-hide { opacity: 0 !important} </style>
        <script>(function(a,s,y,n,c,h,i,d,e){s.className+=' '+y;h.start=1*new Date;
        h.end=i=function(){s.className=s.className.replace(RegExp(' ?'+y),'')};
        (a[n]=a[n]||[]).hide=h;setTimeout(function(){i();h.end=null},c);h.timeout=c;
        })(window,document.documentElement,'async-hide','dataLayer',4000,
        {'${containerId}':true});</script>
    `;

    document.head.insertAdjacentHTML('afterbegin', script);
};
