import {
    UrlRewritesDispatcher as SourceUrlRewritesDispatcher
} from 'SourceStore/UrlRewrites/UrlRewrites.dispatcher';

/** @namespace Seedsman/Store/UrlRewrites/Dispatcher */
export class UrlRewritesDispatcher extends SourceUrlRewritesDispatcher {
    processUrlOptions(options) {
        const { urlParam } = options;

        // FAILSAFE: Trim index.php if someone forgot to set "Use Web Server Rewrites" to "Yes"
        // eslint-disable-next-line fp/no-let
        const trimmedParam = urlParam.replace('index.php/', '');
        return {
            ...options,
            urlParam: trimmedParam.replace(new RegExp(window.newStoreRegax), '')
        };
    }
}

export default new UrlRewritesDispatcher();
