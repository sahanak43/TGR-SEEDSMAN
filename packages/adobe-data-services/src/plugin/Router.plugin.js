/**
 * Adobe Data Services compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { AFTER_ITEMS_TYPE } from 'SourceComponent/Router/Router.config';

import { initContext, updateContextPage } from '../util/context';

const DATA_SERVICES_CONFIG = 'data-services';

function DataServicesContext() {
    const { pathname } = useLocation();

    useEffect(() => {
        // vvv Update page context on page change
        updateContextPage();
    }, [pathname]);

    useEffect(() => {
        // vvv Init context on mount
        initContext();
    }, []);

    return null;
}

// eslint-disable-next-line @scandipwa/scandipwa-guidelines/no-jsx-variables
const addComponentToUpdateContext = (member) => ([
    ...member,
    {
        component: <DataServicesContext />,
        position: 60,
        name: DATA_SERVICES_CONFIG
    }
]);

export default {
    'Component/Router/Component': {
        'member-property': {
            [AFTER_ITEMS_TYPE]: addComponentToUpdateContext
        }
    }
};
