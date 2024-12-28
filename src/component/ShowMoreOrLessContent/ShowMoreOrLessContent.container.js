import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { isCrawler, isSSR } from 'Util/Browser';

import ShowMoreOrLessContent from './ShowMoreOrLessContent.component';

/** @namespace Seedsman/Component/ShowMoreOrLessContent/Container */
export class ShowMoreOrLessContentContainer extends PureComponent {
    static propTypes = {
        description: PropTypes.string.isRequired,
        isPdpPage: PropTypes.string.isRequired
    };

    containerFunctions = {
        expandButtonClick: this.expandButtonClick.bind(this)
    };

    __construct(props) {
        super.__construct(props);

        const isForceExpanded = isSSR() || isCrawler();

        this.state = {
            buttonClick: isForceExpanded || false
        };
    }

    containerProps() {
        const {
            description,
            isPdpPage
        } = this.props;

        const {
            buttonClick
        } = this.state;

        return {
            description,
            buttonClick,
            isPdpPage
        };
    }

    expandButtonClick() {
        const { buttonClick } = this.state;

        this.setState({
            buttonClick: !buttonClick
        });
    }

    render() {
        return (
           <ShowMoreOrLessContent
             { ...this.containerProps() }
             { ...this.containerFunctions }
           />
        );
    }
}

export default ShowMoreOrLessContentContainer;
