/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable @scandipwa/scandipwa-guidelines/only-render-in-component */
import {
    ExpandableContentShowMore as SourceExpandableContentShowMore
} from 'SourceComponent/ExpandableContentShowMore/ExpandableContentShowMore.component';
import { isCrawler, isSSR } from 'Util/Browser';

/** @namespace Seedsman/Component/ExpandableContentShowMore/Component */
export class ExpandableContentShowMoreComponent extends SourceExpandableContentShowMore {
    static defaultProps = {
        showElemCount: 3,
        isCheckout: false
    };

    render() {
        const { children, isMobile, isCheckout } = this.props;
        const isForceExpanded = isSSR() || isCrawler();

        if ((isMobile && !isCheckout) || isForceExpanded) {
            return children;
        }

        return (
            <div block="ExpandableContentShowMore" ref={ this.ref }>
                { this.renderContent() }
            </div>
        );
    }
}

export default ExpandableContentShowMoreComponent;
