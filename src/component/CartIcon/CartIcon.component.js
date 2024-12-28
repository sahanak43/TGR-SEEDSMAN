import { CartIcon as SourceCartIcon } from 'SourceComponent/CartIcon/CartIcon.component';

import './CartIcon.style';

/** @namespace Seedsman/Component/CartIcon/Component */
export class CartIconComponent extends SourceCartIcon {
    renderMobCartIcon() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="28.403" height="26.742" viewBox="0 0 28.403 26.742">
            <g id="Group_68559" data-name="Group 68559" transform="translate(1.004 4.463)">
                <g id="Group_59165" data-name="Group 59165" transform="translate(-0.254 1.559)">
                <path
                  id="Path_65"
                  data-name="Path 65"
                  d="M378.836,33.913a4.418,4.418,0,0,0-4.5-4.334h0a4.418,4.418,0,0,0-4.5,4.334"
                  transform="translate(-364.743 -29.579)"
                  fill="none"
                  stroke="#000"
                  strokeLinecap="round"
                  strokeWidth="1.5"
                />
                <rect
                  id="Rectangle_119"
                  data-name="Rectangle 119"
                  width="18.402"
                  height="14.021"
                  rx="1.088"
                  transform="translate(0 5.949)"
                  fill="none"
                  stroke="#000"
                  strokeLinecap="round"
                  strokeWidth="1.5"
                />
                </g>
            </g>
            </svg>
        );
    }

    render() {
        const { isActive, isMobile } = this.props;

        if (isMobile) {
            return this.renderMobCartIcon();
        }

        return (
            <svg xmlns="http://www.w3.org/2000/svg" mods={ { isActive } } block="CartIcon" width="24.804" height="23.612" viewBox="0 0 24.804 23.612">
                <g id="Group_68559" data-name="Group 68559" transform="translate(0.75 4.358)">
                    <g id="Group_59165" data-name="Group 59165" transform="translate(0 3.196)">
                        <path
                          id="Path_65"
                          data-name="Path 65"
                          d="M376.737,32.9a3.387,3.387,0,0,0-3.447-3.323h0a3.387,3.387,0,0,0-3.447,3.323"
                          transform="translate(-365.934 -29.579)"
                          fill="none"
                          stroke="#000"
                          strokeLinecap="round"
                          strokeWidth="1.5"
                        />
                        <rect
                          id="Rectangle_119"
                          data-name="Rectangle 119"
                          width="14.107"
                          height="10.748"
                          rx="1.088"
                          transform="translate(0 4.56)"
                          fill="none"
                          stroke="#000"
                          strokeLinecap="round"
                          strokeWidth="1.5"
                        />
                    </g>
                </g>
            </svg>
        );
    }
}

export default CartIconComponent;
