import { UPDATE_META } from './Meta.action';

export const updateEveryTime = [
    'title',
    'description',
    'keywords',
    'canonical_url',
    'robots',
    'status_code',
    'OgDescription',
    'OgTitle',
    'OgUrl',
    'OgImage',
    'OgSiteName'
];

/** @namespace Seedsman/Store/Meta/Reducer/filterData */
export const filterData = (data) => {
    const updated = updateEveryTime.reduce((acc, key) => {
        acc[key] = data[key];

        return acc;
    }, {});

    return { ...data, ...updated };
};

/** @namespace Seedsman/Store/Meta/Reducer/getInitialState */
export const getInitialState = () => ({
    title: '',
    title_prefix: '',
    title_suffix: '',
    description: '',
    keywords: '',
    canonical_url: '',
    robots: '',
    status_code: '',
    OgDescription: '',
    OgTitle: '',
    OgUrl: '',
    OgImage: '',
    OgSiteName: ''
});

/** @namespace Seedsman/Store/Meta/Reducer/MetaReducer */
export const MetaReducer = (
    state = getInitialState(),
    action
) => {
    const { payload = {}, type } = action;

    switch (type) {
    case UPDATE_META:
        const filteredData = filterData(payload);

        return {
            ...state,
            ...filteredData
        };

    default:
        return state;
    }
};

export default MetaReducer;
