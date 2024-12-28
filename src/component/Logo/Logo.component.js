import Image from 'Component/Image/Image.component';
import {
    Logo as SourceLogo
} from 'SourceComponent/Logo/Logo.component';
import logo from 'Util/images/seedsman-logo.webp';

/** @namespace Seedsman/Component/Logo/Component */
export class LogoComponent extends SourceLogo {
    renderPlaceholderLogo() {
        const { onImageLoad } = this.props;

        return (
            <div
              block="Logo"
              elem="Placeholder"
            >
                <Image
                  src={ logo }
                  alt="LogoPlaceholder"
                  ratio="custom"
                  onImageLoad={ onImageLoad }
                />
            </div>
        );
    }
}

export default LogoComponent;
