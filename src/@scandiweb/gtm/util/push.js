/**
 * Google Tag Manager frontend compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import TagManager from 'react-gtm-module';

import getStore from 'Util/Store';

import { checkIsEventEnable } from './checkIsEventEnable';
import { injectAntiFlicker, injectGoogleOptimize } from './googleOptimize';
import { waitForCallback } from './wait';

// eslint-disable-next-line fp/no-let, @scandipwa/scandipwa-guidelines/export-level-one
let isGtmInitialized = false;

// eslint-disable-next-line @scandipwa/scandipwa-guidelines/export-level-one
const beforeInitQue = [];

/** @namespace Seedsman/@Scandiweb/Gtm/Util/Push/pushToDataLayer */
export const pushToDataLayer = async (data) => {
    await waitForCallback(() => getStore().getState().ConfigReducer?.gtm?.enabled);
    // TODO: ^^^ if connection is too poor it might change the behavior and delay the initialization until next event
    // vvv Push request must be queued
    beforeInitQue.push(data);
    // ^^^ This will be used for when configReducer is still loading or gtm is not initialized yet

    const {
        enabled: isEnabled,
        gtm_id: gtmId
        // vvv These values are injected using GTM
    } = getStore().getState().ConfigReducer.gtm;

    if (isEnabled === undefined) {
        // Config is not yet obtained
        return;
    }

    if (isEnabled === false) {
        // GTM is disabled, skip GTM
        injectGoogleOptimize();
        injectAntiFlicker();

        return;
    }

    const { event } = data;

    if (!checkIsEventEnable(event)) {
        return;
    }

    if (isGtmInitialized === false) {
        // GTM needs to be init before push
        // Que needs to be executed
        TagManager.initialize({ gtmId });

        beforeInitQue.forEach((qData) => {
            TagManager.dataLayer({
                dataLayer: qData
            });
        });

        // eslint-disable-next-line no-console
        console.log('GTM que was emptied');

        isGtmInitialized = true;

        injectGoogleOptimize();
        injectAntiFlicker();

        beforeInitQue.splice(0, beforeInitQue.length);
        // ^^^ Clear the beforeInitQue

        return;
    }

    // vvv We need to remove added data from array, to not make the app heavy
    beforeInitQue.pop();
    // ^^^ We don't need the items in queue anymore so we need to pop it (since our item is the last item)
    TagManager.dataLayer({
        dataLayer: data
    });
};
