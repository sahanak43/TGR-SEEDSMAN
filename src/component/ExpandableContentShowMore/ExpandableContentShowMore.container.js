import { connect } from 'react-redux';

import {
    mapDispatchToProps as sourceMapDispatchToProps,
    mapStateToProps as sourceMapStateToProps
} from 'SourceComponent/ExpandableContentShowMore/ExpandableContentShowMore.container';

import ExpandableContentShowMore from './ExpandableContentShowMore.component';

/** @namespace Seedsman/Component/ExpandableContentShowMore/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    ...sourceMapStateToProps(state)
    // TODO extend mapStateToProps
});

/** @namespace Seedsman/Component/ExpandableContentShowMore/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    ...sourceMapDispatchToProps(dispatch)
    // TODO extend mapDispatchToProps
});

export default connect(mapStateToProps, mapDispatchToProps)(ExpandableContentShowMore);
