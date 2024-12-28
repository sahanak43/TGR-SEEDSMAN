import { PureComponent } from 'react';

import AffiliateQuery from 'Query/Affiliate.query';
import { fetchQuery } from 'Util/Request';

/** @namespace Seedsman/Component/Affiliate/Config */
export class AffiliateConfig extends PureComponent {
    componentDidMount() {
        this.getAffiliateSetQuery();
    }

    async getAffiliateSetQuery() {
        await fetchQuery(AffiliateQuery.getAffiliateCookies()).then(
            /** @namespace Seedsman/Component/Affiliate/Config/AffiliateConfig/getAffiliateSetQuery/fetchQuery/then */
            (response) => {
                const cjaffiliate = response.set_cookie ? response.set_cookie : null;
                this.getAffiliateScript(cjaffiliate);
            }
        );
    }

    getAffiliateScript(cjaffiliate) {
        if (cjaffiliate) {
            const scriptCode = `
                (function(a,b,c,d){
                    a='https://www.mczbf.com/tags/${cjaffiliate.tag_id}/tag.js?cookieUrl=${cjaffiliate.url}';
                    b=document;c='script';d=b.createElement(c);d.src=a;
                    d.type='text/java'+c;d.async=true;
                    d.id='cjapitag';
                    a=b.getElementsByTagName(c)[0];a.parentNode.insertBefore(d,a)
                })();
              `;

            const script = document.createElement('script');
            script.innerHTML = scriptCode;
            document.head.appendChild(script);
        }
    }

    render() {
        return (
            <div />
        );
    }
}
export default AffiliateConfig;
