import { HeartIcon as SourceHeartIcon } from 'SourceComponent/HeartIcon/HeartIcon.component';

/** @namespace Seedsman/Component/HeartIcon/Component */
export class HeartIconComponent extends SourceHeartIcon {
    render() {
        const { isActive } = this.props;

        return (
            <svg xmlns="http://www.w3.org/2000/svg" mods={ { isActive } } width="19.423" height="16.96" viewBox="0 0 19.423 16.96">
                <path
                  id="Path_86866"
                  data-name="Path 86866"
                  d="M67.448,75.4a4.867,4.867,0,0,0-8.962-2.633A4.867,4.867,0,0,0,
                  49.525,75.4c0,3.99,4.418,7.261,9.048,10.441C67.392,80.116,67.448,76.563,67.448,75.4Z"
                  transform="translate(-48.775 -69.778)"
                  fill="none"
                  stroke="#000"
                  strokeLinecap="round"
                  strokeWidth="1.5"
                />
            </svg>
        );
    }
}

export default HeartIconComponent;
