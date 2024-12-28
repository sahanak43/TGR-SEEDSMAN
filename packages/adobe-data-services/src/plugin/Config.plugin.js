/**
 * Adobe Data Services compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import { UPDATE_CONFIG } from 'SourceStore/Config/Config.action';

import DataServicesConfigQuery from '../query/DataServicesConfig.query';

const addStripeConfigtoRequest = (args, callback) => ([
    ...callback(...args),
    DataServicesConfigQuery.getDataServicesConfigField()
]);

const addStripeConfigToState = (args, callback) => ({
    ...callback(...args),
    dataServicesConfig: {}
});

const getStripeConfigFromAction = (args, callback) => {
    const [, action] = args;
    const { type, config: { dataServicesConfig } = {} } = action;

    if (type !== UPDATE_CONFIG) {
        return callback(...args);
    }

    return {
        ...callback(...args),
        dataServicesConfig
    };
};

export default {
    'Store/Config/Dispatcher': {
        'member-function': {
            prepareRequest: addStripeConfigtoRequest
        }
    },
    'Store/Config/Reducer/getInitialState': {
        function: addStripeConfigToState
    },
    'Store/Config/Reducer/ConfigReducer': {
        function: getStripeConfigFromAction
    }
};
