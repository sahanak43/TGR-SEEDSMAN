import { connect } from 'react-redux';

import { goToPreviousNavigationState } from 'Store/Navigation/Navigation.action';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';

import SearchField from './SearchField.component';

/** @namespace Seedsman/Component/SearchField/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    device: state.ConfigReducer.device,
    navigationState: state.NavigationReducer[TOP_NAVIGATION_TYPE].navigationState
});

/** @namespace Seedsman/Component/SearchField/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    goToPreviousNavigationState: () => dispatch(goToPreviousNavigationState(TOP_NAVIGATION_TYPE))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchField);
