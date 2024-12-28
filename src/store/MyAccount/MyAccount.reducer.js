import {
    getInitialState as sourceGetInitialState,
    MyAccountReducer as sourceMyAccountReducer
} from 'SourceStore/MyAccount/MyAccount.reducer';

import {
    GET_REWARDS_POINTS
} from './MyAccount.action';

/** @namespace Seedsman/Store/MyAccount/Reducer/getInitialState */
export const getInitialState = () => ({
    ...sourceGetInitialState(),
    reward_points: null
});

/** @namespace Seedsman/Store/MyAccount/Reducer/MyAccountReducer */
export const MyAccountReducer = (
    state = getInitialState(),
    action
) => {
    const { reward_points } = action;

    if (action.type === GET_REWARDS_POINTS) {
        return {
            ...sourceMyAccountReducer(state, action),
            reward_points
        };
    }

    return sourceMyAccountReducer(state, action);
};

export default MyAccountReducer;
