import { Component } from 'react';

import PostAffiliateProQuery from 'Query/PostAffiliatePro.query';
import { fetchQuery } from 'Util/Request';
import { importScript, removeScript } from 'Util/Script';

// eslint-disable-next-line @scandipwa/scandipwa-guidelines/create-config-files
export const SCRIPT_ID = 'pap_x2s6df8d';

/** @namespace Seedsman/Component/PostAffiliatePro/Container */
export class PostAffiliateProContainer extends Component {
    async componentDidMount() {
        const {
            getPostAffiliate: {
                application_url,
                track_click = true,
                account_id = ''
            }
        } = await fetchQuery(PostAffiliateProQuery.getQuery());

        window.coPostAffiliateAccount = account_id ?? '';
        window.coPostAffiliateTrackClick = track_click;
        importScript(application_url, SCRIPT_ID, track_click ? (() => {
            if (window.coPostAffiliateAccount) {
                // eslint-disable-next-line no-undef
                PostAffTracker.setAccountId(window.coPostAffiliateAccount);
            }
            // eslint-disable-next-line no-undef
            PostAffTracker.track();
        }) : null);
    }

    componentWillUnmount() {
        removeScript(SCRIPT_ID);
    }

    render() {
        return null;
    }
}
export default PostAffiliateProContainer;
