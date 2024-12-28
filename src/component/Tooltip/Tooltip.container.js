/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-props-destruction */
/* eslint-disable react/require-default-props */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Tooltip from './Tooltip.component';

/** @namespace Seedsman/Component/Tooltip/Container */
export class TooltipContainer extends PureComponent {
    static propTypes = {
        content: PropTypes.func.isRequired,
        direction: PropTypes.string.isRequired
    };

    containerProps() {
        const { content, direction } = this.props;

        return {
            content,
            direction
        };
    }

    render() {
        return (
            <Tooltip
              { ...this.containerProps() }
            />
        );
    }
}

export default TooltipContainer;
