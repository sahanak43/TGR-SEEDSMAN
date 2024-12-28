/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import './SwiperSlide.style';

/** @namespace Seedsman/Component/SwiperSlide/Component */
export class SwiperSlideComponent extends PureComponent {
    static propTypes = {
        // TODO: implement prop-types
    };

    render() {
        // eslint-disable-next-line no-console
        const { children } = this.props;
        return children;
    }
}

export default SwiperSlideComponent;
