/**
 * Adobe Recommendations compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { EVENT_CONTEXT_LOADED } from '../../../../adobe-data-services/src/util/context';
import { getReccomendationUnits } from '../../util/recommendations';
import Reccomendations from './Recommendations.component';

/** @namespace Scandiweb/AdobeRecommendations/Component/Recommendations/Container/mapStateToProps */
export const mapStateToProps = (_state) => ({
    // wishlistItems: state.WishlistReducer.productsInWishlist
});

/** @namespace Scandiweb/AdobeRecommendations/Component/Recommendations/Container/mapDispatchToProps */
export const mapDispatchToProps = (_dispatch) => ({
    // addProduct: options => CartDispatcher.addProductToCart(dispatch, options)
});

/** @namespace Scandiweb/AdobeRecommendations/Component/Recommendations/Container */
export class RecommendationsContainer extends PureComponent {
    static propTypes = {
        placementType: PropTypes.string.isRequired
    };

    state = {
        units: {}
    };

    containerFunctions = {
        // getData: this.getData.bind(this)
    };

    componentDidMount() {
        // vvv Listen for the event (we are sure it comes after, as determing type takes time)
        document.addEventListener(EVENT_CONTEXT_LOADED, this.onContextLoaded);
    }

    containerProps() {
        return { units: this.getFilteredUnits() };
    }

    getFilteredUnits() {
        const { units } = this.state;
        const { placementType } = this.props;

        return Object.entries(units).reduce((acc, [pagePlacement, unit]) => {
            if (pagePlacement !== placementType) {
                return acc;
            }

            return unit;
        }, []);
    }

    onContextLoaded = async () => {
        const units = await getReccomendationUnits();
        this.setState({ units });
    };

    render() {
        return (
            <Reccomendations
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecommendationsContainer);
