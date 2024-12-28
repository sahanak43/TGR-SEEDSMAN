import { TopBarContent as SourceTopBarContent } from 'SourceComponent/TopBarContent/TopBarContent.component';

/** @namespace Seedsman/Component/TopBarContent/Component */
export class TopBarContentComponent extends SourceTopBarContent {
    render() {
        return (
            <div>
            <div className="newtopBar-content">
   <div className="MyWishlist-Link">
      <a className="wishlist Mainmenu-links" href="/wishlist">My Wishlist</a>
   </div>
 <div className="Account&SignOut-Link">
      <a className="Account&Signout Mainmenu-links" href="/customer/account">My Account</a>
 </div>
  <div className="TrackOrder-Link">
     <a className="Mainmenu-links" href="/sales/order/history">Track Order</a>
  </div>
<div className="CustomerService-Link">
     <a className="Mainmenu-links" href="hc/en-us">Customer Service</a>
</div>
  <div className="Wholesale-Link">
     <a className="newtopBar-content-Wholesale Mainmenu-links" href="/wholesale-cannabis">
      Wholesale
     </a>
  </div>
            </div>
            </div>
        );
    }
}
export default TopBarContentComponent;
