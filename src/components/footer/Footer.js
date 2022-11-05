import React from "react";
import {Link, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {loadCategories} from "../../store/actions/InitAction";
// import _ from "lodash";
import {loadAsset} from "../../utils/Helpers";
import CopyRight from "./includes/CopyRight";
import StickyFooter from "./includes/StickyFooter";
import StickyFooterManage from "./includes/StickyFooterManage";

const Footer = (props) => {
   const {general} = props;

   return (
      <footer
         className="footer footer-2 font-weight-normal second-primary-color"
         style={{backgroundColor: "#222"}}
      >
         <div className="container">
            <hr className="mt-0 mb-0" style={{borderColor: "#444"}}/>
         </div>
         <div className="footer-middle border-0">
            <div className="container">
               <div className="row">
                  <div className="col-6 col-lg-2-5cols">
                     <div className="widget widget-about mb-4">
                        <Link to="/">
                           <img
                              src={loadAsset(general.frontend_logo_footer)}
                              className="footer-logo"
                              alt={general.site_name}
                           />
                        </Link>
                        <div className="font-weight-normal second-primary-color">
                           {general.footer_description}
                           <br/>
                           <br/>
                           <ul className="contact-list">
                              <li>
                                 <i className="icon-map-marker"/>
                                 {general.office_address}
                              </li>
                              <li>
                                 <i className="icon-phone"/>
                                 <a href={`tel:${general.office_phone}`}>{general.office_phone}</a>
                              </li>
                              <li>
                                 <i className="icon-envelope"/>
                                 <a href={`mailto:${general.office_email}`}>{general.office_email}</a>
                              </li>
                           </ul>
                        </div>
                        {/* End .widget-about-info */}
                     </div>
                     {/* End .widget about-widget */}
                  </div>
                  {/* End .col-sm-12 col-lg-3 */}
                  <div className="col-6 col-lg-5cols">
                     <div className="widget mb-4">
                        <h4 className="widget-title text-white">About Us</h4>
                        {/* End .widget-title */}
                        <ul className="widget-list">
                           <li>
                              <Link to="/pages/about-us">
                                 About Us
                              </Link>
                           </li>
                           <li>
                              <Link to="/contact">Contact us</Link>
                           </li>
                           <li>
                              <Link to="/pages/privacy-policy">Privacy Policy</Link>
                           </li>
                           <li>
                              <Link to="/pages/terms-and-conditions">Terms and conditions</Link>
                           </li>
                           <li>
                              <Link to="/pages/return-and-refund-policy">
                                 Return and Refund Policy
                              </Link>
                           </li>
                           <li>
                              <Link to="/pages/secured-payment">
                                 Secured Payment
                              </Link>
                           </li>
                           <li>
                              <Link to="/pages/transparency">
                                 Transparency
                              </Link>
                           </li>
                        </ul>
                        {/* End .widget-list */}
                     </div>
                     {/* End .widget */}
                  </div>
                  {/* End .col-sm-4 col-lg-3 */}
                  <div className="col-6 col-lg-5cols">
                     <div className="widget mb-4">
                        <h4 className="widget-title text-white">Service Link</h4>
                        <ul className="widget-list">
                           <li>
                              <Link to="/pages/how-to-buy">How To Buy</Link>
                           </li>
                           <li>
                              <Link to="/pages/shipping-and-delivery">Shipping & Delivery</Link>
                           </li>
                           <li>
                              <Link to="/pages/custom-and-shipping-charge">Custom & Shipping Charge</Link>
                           </li>
                           <li>
                              <Link to="/pages/minimum-order-quantity">Minimum Order Quantity</Link>
                           </li>
                           <li>
                              <Link to="/pages/prohibited-items">Prohibited Items</Link>
                           </li>
                        </ul>
                        {/* End .widget-list */}
                     </div>
                     {/* End .widget */}
                  </div>
                  {/* End .col-sm-4 col-lg-3 */}
                  <div className="col-6 col-lg-5cols">
                     <div className="widget mb-4">
                        <h4 className="widget-title text-white">Customer</h4>
                        {/* End .widget-title */}
                        <ul className="widget-list">
                           <li>
                              <Link to="/login">Sign In</Link>
                           </li>
                           <li>
                              <Link to="/special-offer">Special Offer</Link>
                           </li>
                           <li>
                              <Link to="/checkout">View Cart</Link>
                           </li>
                           <li>
                              <Link to="/dashboard/orders">Track My Order</Link>
                           </li>
                           <li>
                              <Link to="/faq">Faq</Link>
                           </li>
                        </ul>
                        {/* End .widget-list */}
                     </div>
                     {/* End .widget */}
                  </div>
                  {/* End .col-sm-64 col-lg-3 */}
               </div>
               {/* End .row */}
            </div>
            {/* End .container */}
         </div>

         <StickyFooterManage general={general}/>

      </footer>
   );
};


const mapStateToProps = (state) => ({
   general: JSON.parse(state.INIT.general),
});

export default connect(mapStateToProps, {loadCategories})(
   withRouter(Footer)
);

