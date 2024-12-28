import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import Footer from 'Component/Footer';
import InstallPrompt from 'Component/InstallPrompt';
import { DEFAULT_STATE_NAME } from 'Component/NavigationAbstract/NavigationAbstract.config';
import CmsPage from 'Route/CmsPage';
import { CUSTOMER } from 'SourceStore/MyAccount/MyAccount.dispatcher';
import { changeNavigationState } from 'Store/Navigation/Navigation.action';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { LocationType, MatchType } from 'Type/Router.type';
import BrowserDatabase from 'Util/BrowserDatabase';
import { fireInsiderEvent } from 'Util/Insider';

import './HomePage.style';

/** @namespace Seedsman/Route/HomePage/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    pageIdentifiers: state.ConfigReducer.cms_home_page
});

/** @namespace Seedsman/Route/HomePage/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    changeHeaderState: (state) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state))
});

/** @namespace Seedsman/Route/HomePage/Container */
export class HomePageContainer extends PureComponent {
     static propTypes = {
         changeHeaderState: PropTypes.func.isRequired,
         pageIdentifiers: PropTypes.string.isRequired,
         location: LocationType.isRequired,
         match: MatchType.isRequired
     };

     componentDidMount() {
         const { changeHeaderState } = this.props;

         const customer = BrowserDatabase.getItem(CUSTOMER);

         changeHeaderState({
             name: DEFAULT_STATE_NAME,
             isHiddenOnMobile: false
         });

         if (customer) {
             fireInsiderEvent('user', customer);
         }
     }

     containerProps() {
         const {
             changeHeaderState,
             location,
             match,
             pageIdentifiers
         } = this.props;

         return {
             changeHeaderState,
             location,
             match,
             pageIdentifiers
         };
     }

     render() {
         return (
             <div block="HomePage">
                 <InstallPrompt />
                 <CmsPage { ...this.containerProps() } />
                 <Footer isVisibleOnMobile />
             </div>
         );
     }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePageContainer);
