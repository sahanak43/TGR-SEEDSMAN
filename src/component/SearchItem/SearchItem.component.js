import PropTypes from 'prop-types';

import Link from 'Component/Link';
import {
    SearchItem as SourceSearchItem
} from 'SourceComponent/SearchItem/SearchItem.component';
import { AttributeType, ProductType } from 'Type/ProductList.type';
import { LinkType } from 'Type/Router.type';

/** @namespace Seedsman/Component/SearchItem/Component */
export class SearchItemComponent extends SourceSearchItem {
    static propTypes = {
        linkTo: LinkType,
        imgSrc: PropTypes.string,
        customAttribute: AttributeType,
        product: ProductType,
        onClick: PropTypes.func.isRequired
    };

    static defaultProps = {
        linkTo: {},
        imgSrc: '',
        customAttribute: null,
        product: {}
    };

    renderLink() {
        const {
            linkTo, onClick
        } = this.props;

        return (
            <Link
              block="SearchItem"
              elem="Link"
              to={ linkTo }
              onClick={ onClick }
            >
                <figure
                  block="SearchItem"
                  elem="Wrapper"
                >
                    { this.renderImage() }
                    { this.renderContent() }
                </figure>
            </Link>
        );
    }
}

export default SearchItemComponent;
