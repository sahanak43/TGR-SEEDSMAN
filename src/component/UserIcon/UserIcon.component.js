import { UserIcon as SourceUserIcon } from 'SourceComponent/UserIcon/UserIcon.component.js';

/** @namespace Seedsman/Component/UserIcon/Component */
export class UserIconComponent extends SourceUserIcon {
    renderMobileUserIcon() {
        return (
        <svg xmlns="http://www.w3.org/2000/svg" width="19.688" height="21.961" viewBox="0 0 19.688 21.961">
          <g id="user_2_" data-name="user (2)" transform="translate(0.75 0.75)">
            <path
              id="Path_76557"
              data-name="Path 76557"
              d="M22.188,21.82V19.547A4.547,4.547,0,0,0,17.641,15H8.547A4.547,4.547,0,0,0,4,19.547V21.82"
              transform="translate(-4 -1.359)"
              fill="none"
              stroke="#000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <ellipse
              id="Ellipse_37725"
              data-name="Ellipse 37725"
              cx="4.805"
              cy="4.484"
              rx="4.805"
              ry="4.484"
              transform="translate(4.484 0)"
              fill="none"
              stroke="#000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </g>
        </svg>

        );
    }

    render() {
        const { isActive, isMobile } = this.props;
        if (isMobile === true) {
            return this.renderMobileUserIcon();
        }

        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="15.144" height="16.85" mods={ { isActive } } viewBox="0 0 15.144 16.85">
            <g id="user_2_" data-name="user (2)" transform="translate(0.75 0.75)">
              <path
                id="Path_76557"
                data-name="Path 76557"
                d="M17.643,20.116V18.411A3.411,3.411,0,0,0,14.233,15H7.411A3.411,3.411,0,0,0,4,18.411v1.705"
                transform="translate(-4 -4.767)"
                fill="none"
                stroke="#000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
              <ellipse
                id="Ellipse_37725"
                data-name="Ellipse 37725"
                cx="3.604"
                cy="3.364"
                rx="3.604"
                ry="3.364"
                transform="translate(3.364 0)"
                fill="none"
                stroke="#000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </g>
            </svg>

        );
    }
}

export default UserIconComponent;
