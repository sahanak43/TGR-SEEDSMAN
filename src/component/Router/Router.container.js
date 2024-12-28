import { connect } from 'react-redux';

import {
    mapDispatchToProps as sourceMapDispatchToProps,
    mapStateToProps as sourceMapStateToProps,
    RouterContainer as SourceRouterContainer
} from 'SourceComponent/Router/Router.container';

/** @namespace Seedsman/Component/Router/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    ...sourceMapStateToProps(state)
    // TODO extend mapStateToProps
});

/** @namespace Seedsman/Component/Router/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    ...sourceMapDispatchToProps(dispatch)
    // TODO extend mapDispatchToProps
});

/** @namespace Seedsman/Component/Router/Container */
export class RouterContainer extends SourceRouterContainer {
    // TODO implement logic
}

export default connect(mapStateToProps, mapDispatchToProps)(RouterContainer);
