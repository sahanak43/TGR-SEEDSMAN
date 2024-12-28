import { SHOW_POPUP } from 'SourceStore/Popup/Popup.action';
import { getInitialState as sourceGetInitialState } from 'SourceStore/Popup/Popup.reducer';
import { HIDE_ACTIVE_OVERLAY, HIDE_ACTIVE_POPUP } from 'Store/Overlay/Overlay.action';

/** @namespace Seedsman/Store/Popup/Reducer/getInitialState */
export const getInitialState = () => ({
    ...sourceGetInitialState(),
    itemId: 0
});

/** @namespace Seedsman/Store/Popup/Reducer/PopupReducer */
export const PopupReducer = (
    state = getInitialState(),
    action
) => {
    const { payload, type } = action;

    switch (type) {
    case SHOW_POPUP:
        return { ...state, popupPayload: payload, itemId: payload?.itemId };
    case HIDE_ACTIVE_OVERLAY:
        return { ...state, popupPayload: {} };
    case HIDE_ACTIVE_POPUP:
        return { ...state, shouldPopupClose: payload };
    default:
        return state;
    }
};

export default PopupReducer;
