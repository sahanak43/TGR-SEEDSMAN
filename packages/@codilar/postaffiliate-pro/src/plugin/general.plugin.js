import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import RedirectStoreQuery from 'Query/RedirectStore.query';
import { fetchQuery } from 'Util/Request';
import { importLink } from 'Util/Script';
import { getPathnameFromURL } from 'Util/Url';

function PostAffiliateClickTracker() {
    const location = useLocation();

    useEffect(() => {
        if (window.coPostAffiliateTrackClick && typeof PostAffTracker === 'object') {
            // eslint-disable-next-line no-undef
            PostAffTracker.track();
        }

        const language_codes = ['fr', 'de', 'es', 'nl', 'it'];
        const removeLinks = () => document.querySelectorAll('.bablic_links').forEach((el) => el.remove());

        const fetchUrl = async () => {
            try {
                const url = getPathnameFromURL();
                const { geturlrewrites } = await fetchQuery(RedirectStoreQuery.getCustomUrlRewrites(decodeURI(url)));
                removeLinks();

                Object.entries(geturlrewrites).forEach(([key, value]) => {
                    const [store, lang] = key.split('_');
                    const finalLink = `${origin}/${store}-${lang}/${value}`;
                    const hreflang = language_codes.includes(lang)
                        ? `${lang}-${lang}` : `en-${store !== 'uk' ? store : 'gb'}`;

                    importLink('alternate', finalLink, key, hreflang, 'bablic_links');
                });

                const defaultUrl = `${origin}/us-en/${geturlrewrites.us_en}`;
                importLink('alternate', defaultUrl, 'default-lng', 'en', 'bablic_links');
                importLink('alternate', defaultUrl, 'x-default', 'x-default', 'bablic_links');
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
            }
        };

        fetchUrl();
    }, [location.pathname]);

    return null;
}

const addPostAffiliaiteTracker = (args, callback) => (
    <>
        { callback(args) }
        <PostAffiliateClickTracker />
    </>
);

export default {
    'Component/Router/Component': {
        'member-function': {
            renderRouterContent: addPostAffiliaiteTracker
        }
    }
};
