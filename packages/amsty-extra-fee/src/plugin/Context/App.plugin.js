/**
 * Amasty Extra Fee compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import { AmastyExtraFeesProvider } from '../../context/AmastyExtraFees';

const addAmastyExtraFeesContextProvider = (member) => [
    (children) => (
         <AmastyExtraFeesProvider>
             { children }
         </AmastyExtraFeesProvider>
    ),
    ...member
];

export default {
    'Component/App/Component': {
        'member-property': {
            contextProviders: addAmastyExtraFeesContextProvider
        }
    }
};
