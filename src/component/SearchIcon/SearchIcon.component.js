/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
import { SearchIcon as SourceSearchIcon } from 'SourceComponent/SearchIcon/SearchIcon.component';

/** @namespace Seedsman/Component/SearchIcon/Component */
export class SearchIconComponent extends SourceSearchIcon {
    renderMobileSearchIcon() {
        return (
        <svg xmlns="http://www.w3.org/2000/svg" width="19.019" height="22.049" viewBox="0 0 19.019 22.049">
          <g id="Group_70718" data-name="Group 70718" transform="translate(0 0)">
            <g
              id="Ellipse_17"
              data-name="Ellipse 17"
              transform="translate(0 0)"
              fill="none"
              stroke="#000"
              strokeLinecap="round"
              strokeWidth="1.5"
            >
              <ellipse cx="9.116" cy="9.116" rx="9.116" ry="9.116" stroke="none" />
              <ellipse cx="9.116" cy="9.116" rx="8.366" ry="8.366" fill="none" />
            </g>
            <path
              id="Path_42"
              data-name="Path 42"
              d="M-229.7-21459.43l3.746,4.715"
              transform="translate(243.918 21475.709)"
              fill="none"
              stroke="#000"
              strokeLinecap="round"
              strokeWidth="1.5"
            />
          </g>
        </svg>

        );
    }

    renderDesktopSearchIcon() {
        return (
          <svg id="Group_65187" data-name="Group 65187" xmlns="http://www.w3.org/2000/svg" width="22.129" height="23.221" viewBox="0 0 22.129 23.221">
          <g
            id="Ellipse_14752"
            data-name="Ellipse 14752"
            transform="translate(0)"
            fill="none"
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <ellipse cx="10.358" cy="10.358" rx="10.358" ry="10.358" stroke="none" />
            <ellipse cx="10.358" cy="10.358" rx="9.358" ry="9.358" fill="none" />
          </g>
          <path
            id="Path_43377"
            data-name="Path 43377"
            d="M.408.576l3.9,3.748"
            transform="translate(16.409 17.482)"
            fill="none"
            stroke="#fff"
            strokeLinecap="round"
            strokeWidth="2"
          />
          </svg>
        );
    }

    render() {
        const { deviceType: { isMobile } } = this.props;

        return (
            <div>
               { isMobile ? this.renderMobileSearchIcon() : this.renderDesktopSearchIcon() }
            </div>

        );
    }
}

export default SearchIconComponent;
