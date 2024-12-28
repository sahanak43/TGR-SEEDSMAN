import ConfigQuery from 'Query/Config.query';
import RegionQuery from 'Query/Region.query';
import {
    ConfigDispatcher as SourceConfigDispatcher
} from 'SourceStore/Config/Config.dispatcher';

/** @namespace Seedsman/Store/Config/Dispatcher */
export class ConfigDispatcher extends SourceConfigDispatcher {
    prepareRequest() {
        return [
            ...super.prepareRequest(),
            ConfigQuery.getAddressTypeOptions(),
            RegionQuery.getUpdatedCountriesQuery()
        ];
    }
}

export default new ConfigDispatcher();
