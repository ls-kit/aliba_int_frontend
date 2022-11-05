import React, {useEffect, useState} from 'react'
import Breadcrumb from "../breadcrumb/Breadcrumb";
import {connect} from "react-redux";
import {loadGeneral} from "../../store/actions/InitAction";
import {authLogout} from "../../store/actions/AuthAction";
import {withRouter, Link} from "react-router-dom";
import PropTypes from "prop-types";
import {getSetting, goPageTop} from "../../utils/Helpers";
import {
   numberWithCommas,
   cartCheckedProductTotal,
   calculateAirShippingCharge
} from "../../utils/CartHelpers";
import {configAttrToConfigured} from "../../utils/GlobalStateControl";
import CheckoutSidebar from "./includes/CheckoutSidebar";

import swal from 'sweetalert'
import TableConfigItems from "./includes/TableConfigItems";
import TablePlainItem from "./includes/TablePlainItem";


const Checkout = (props) => {
   const {cartConfigured, general} = props;
   const [allCheck, setAllCheck] = useState(false);

   const currency = getSetting(general, "currency_icon");
   const ShippingCharges = getSetting(general, "air_shipping_charges");

   useEffect(() => {
      goPageTop();
   }, []);


   const removeItemFromCart = (e) => {
      e.preventDefault();
      swal({
         title: "Are you want to remove?",
         icon: "warning",
         buttons: true,
         dangerMode: true,
      })
         .then((willDelete) => {
            if (willDelete) {
               let modified = cartConfigured.map(mapItem => {
                  let ConfiguredItems = mapItem.ConfiguredItems.map(mapConfig => !mapConfig.isChecked ? mapConfig : {notFound: true});
                  ConfiguredItems = ConfiguredItems.filter(filter => filter.notFound !== true);
                  if (ConfiguredItems.length > 0) {
                     return {...mapItem, ConfiguredItems: ConfiguredItems}
                  }
                  return {notFound: true}
               });
               modified = modified.filter(filter => filter.notFound !== true);
               configAttrToConfigured(modified);
            }
         });
   };

   const totalShippingCost = (product) => {
      const checkItemSubTotal = cartCheckedProductTotal(product);
      const totalPrice = checkItemSubTotal.totalPrice;
      const totalWeight = checkItemSubTotal.totalWeight;
      const DeliveryCost = product.DeliveryCost;
      const ShippingRate = calculateAirShippingCharge(totalPrice, ShippingCharges);
      let weightCost = Number(totalWeight) * Number(ShippingRate);
      weightCost = weightCost < 100 ? 100 : weightCost;
      return Number(DeliveryCost) + Number(weightCost);
   };

   const productTotalCost = (product) => {
      const checkItemSubTotal = cartCheckedProductTotal(product);
      const totalPrice = checkItemSubTotal.totalPrice;
      const ShippingCost = totalShippingCost(product);
      return Number(totalPrice) + Number(ShippingCost);
   };


   const checkedAllItem = () => {
      const checking = !allCheck;
      setAllCheck(checking);
      let modified = cartConfigured.map(product => {
         let ConfiguredItems = product.ConfiguredItems.map(configMap => {
            return {...configMap, isChecked: checking};
         });
         return {...product, ConfiguredItems: ConfiguredItems, isChecked: checking};
      });
      configAttrToConfigured(modified);
   };


   return (
      <main className="main">
         <Breadcrumb current="Checkout"/>

         <div className="page-content">
            <div className="cart">
               <div className="container">
                  <div className="row">
                     <div className="col-lg-9">
                        <div className="card py-3">
                           <div className="card-body table-responsive-sm">
                              <table className="table table table-cart">
                                 <thead>
                                 <tr>
                                    <th className="text-center">
                                       <input
                                          type="checkbox"
                                          checked={allCheck}
                                          onChange={e => checkedAllItem()}
                                          name="checked_all"
                                       />
                                    </th>
                                    <th colSpan={2}>
                                       <span>Product</span>
                                       <a
                                          href="/remove"
                                          onClick={e => removeItemFromCart(e)}
                                          title="Remove"
                                          className="cart-remove">
                                          Remove
                                       </a>
                                    </th>
                                    <th className="text-center" style={{width: "10rem"}}>Total</th>
                                 </tr>
                                 </thead>
                                 <tbody>
                                 {
                                    cartConfigured.length > 0 ?
                                       cartConfigured.map((product, index) =>
                                          <>
                                             {
                                                product.hasConfigurators ?
                                                   product.ConfiguredItems.map((config, index2) =>
                                                      <TableConfigItems
                                                         key={index2}
                                                         currency={currency}
                                                         product={product}
                                                         config={config}
                                                         cartConfigured={cartConfigured}
                                                         ShippingCharges={ShippingCharges}/>
                                                   )
                                                   :
                                                   <TablePlainItem
                                                      currency={currency}
                                                      product={product}
                                                      cartConfigured={cartConfigured}
                                                      ShippingCharges={ShippingCharges}/>

                                             }
                                             <tr key={index}>
                                                <td colSpan={3} className="text-right">China to BD Shipping cost:</td>
                                                <td
                                                   className="text-center">{`${currency} ${numberWithCommas(totalShippingCost(product))}`}</td>
                                             </tr>
                                             <tr key={index + 1}>
                                                <td colSpan={3} className="text-right">Sub Total:</td>
                                                <td
                                                   className="text-center">{`${currency} ${numberWithCommas(productTotalCost(product))}`}</td>
                                             </tr>
                                          </>
                                       )
                                       :
                                       <tr>
                                          <td colSpan={4} className="text-center bg-lighter">You have no cart!</td>
                                       </tr>
                                 }

                                 </tbody>
                              </table>
                           </div>
                        </div>
                     </div>
                     {/* End .col-lg-9 */}

                     <CheckoutSidebar currency={currency} ShippingCharges={ShippingCharges}/>

                     {/* End .col-lg-3 */}
                  </div>
                  {/* End .row */}
               </div>
               {/* End .container */}
            </div>
            {/* End .cart */}
         </div>
         {/* End .page-content */}
      </main>
   )
};

Checkout.propTypes = {
   general: PropTypes.object.isRequired,
   user: PropTypes.object.isRequired,
   cartConfigured: PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
   general: JSON.parse(state.INIT.general),
   user: state.AUTH.user,
   cartConfigured: state.CART.configured
});

export default connect(mapStateToProps, {loadGeneral, authLogout})(
   withRouter(Checkout)
);

