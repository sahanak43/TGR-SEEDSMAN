import { connect } from 'react-redux';

import Slider from './Slider.component';

/** @namespace Component/Slider/Container/mapStateToProps */
// eslint-disable-next-line @scandipwa/scandipwa-guidelines/use-namespace
export const mapStateToProps = (state) => ({
    device: state.ConfigReducer.device
});

/** @namespace Component/Slider/Container/mapDispatchToProps */
// eslint-disable-next-line @scandipwa/scandipwa-guidelines/use-namespace
export const mapDispatchToProps = () => ({});

// eslint-disable-next-line @scandipwa/scandipwa-guidelines/always-both-mappings
export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(Slider);
