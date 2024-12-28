// eslint-disable-next-line max-len
import { ContentWrapper as SourceContentWrapperComponent } from 'SourceComponent/ContentWrapper/ContentWrapper.component';

import './ContentWrapper.style';
/** @namespace Seedsman/Component/ContentWrapper/Component */
export class ContentWrapperComponent extends SourceContentWrapperComponent {
    renderContentWrapper() {
        const {
            children, wrapperMix
        } = this.props;

        return (

                <div block="ContentWrapper" mix={ wrapperMix }>
                    { children }
                </div>

        );
    }

    render() {
        const {
            mix, label, isNotSection
        } = this.props;

        if (isNotSection) {
            return this.renderContentWrapper();
        }

        return (
            <section mix={ mix } aria-label={ label }>
                { this.renderContentWrapper() }
            </section>
        );
    }
}

export default ContentWrapperComponent;
