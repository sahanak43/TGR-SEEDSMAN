/* eslint-disable react/prop-types */
// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import SeedsFindercard from './SeedsFindercard.component';

/** @namespace Seedsman/Component/SeedsFindercard/Container */
export class SeedsFindercardContainer extends PureComponent {
    static propTypes = {
        // TODO: implement prop-types
    };

    containerFunctions = {
        // getData: this.getData.bind(this)
    };

    containerProps() {
        const { product } = this.props;
        return {
            product
        };
    }

    render() {
        return (
            <SeedsFindercard
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default SeedsFindercardContainer;
