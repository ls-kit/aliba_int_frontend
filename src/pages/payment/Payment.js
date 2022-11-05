import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {confirmCustomerOrder} from "../../store/actions/CartAction";
import {Link, withRouter} from "react-router-dom";
import _ from "lodash";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import {getSetting, goPageTop} from "../../utils/Helpers";
import {
   CartProductSummary,
   cartCalculateNeedToPay,
   numberWithCommas,
   cartCheckedProductTotal,
   calculateAirShippingCharge
} from "../../utils/CartHelpers";
import swal from "sweetalert";
import ConfigItem from "./includes/ConfigItem";
import PlainItem from "./includes/PlainItem";

const Payment = props => {
   const {cartConfigured, shipping_address, general} = props;

   const [accept, setAccept] = useState('');
   const [paymentMethod, setPaymentMethod] = useState('');

   const currency = getSetting(general, "currency_icon");
   const ShippingCharges = getSetting(general, "air_shipping_charges");
   const summary = CartProductSummary(cartConfigured, ShippingCharges);
   const advanced = cartCalculateNeedToPay(summary.totalPrice);
   const dueAmount = advanced;

   useEffect(() => {
      goPageTop();
      if (_.isEmpty(shipping_address)) {
         props.history.push("/checkout");
      }
   }, []);


   const paymentConfirm = (e) => {
      e.preventDefault();

      let process = true;

      if (!paymentMethod) {
         swal({
            text: "Select your payment method",
            icon: "warning",
            buttons: "Ok, Understood"
         });
         process = false;
      }

      if (!accept && paymentMethod) {
         swal({
            text: "Please accept terms and conditions!",
            icon: "warning",
            buttons: "Ok, Understood"
         });
         process = false;
      }

      if (process) {
         let cartTotal = summary.totalPrice;
         if (!_.isEmpty(cartConfigured) && !_.isEmpty(shipping_address) && cartTotal && advanced && dueAmount) {
            props.confirmCustomerOrder({
               paymentMethod: paymentMethod,
               cart: JSON.stringify(cartConfigured),
               address: JSON.stringify(shipping_address),
               summary: JSON.stringify({cartTotal: cartTotal, advanced: advanced, dueAmount: dueAmount}),
            });
         } else {
            props.history.push('/checkout')
         }
      }
   };

   const checkedProductItem = (product) => {
      const hasConfigurators = product.hasConfigurators;
      if (hasConfigurators) {
         const ConfiguredItems = product.ConfiguredItems;
         if (_.isArray(ConfiguredItems)) {
            const filterConfig = ConfiguredItems.filter(filter => filter.isChecked === true);
            return filterConfig.length > 0;
         }
      }
      return product.isChecked;
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


   return (
      <main className="main">
         <Breadcrumb current="Payment" collections={[
            {'name': 'Checkout', url: 'checkout'}
         ]}/>

         <div className="page-content">
            <div className="cart">
               <div className="container">
                  <div className="row justify-content-center">
                     <div className="col-lg-9">
                        <div className="card">
                           <div className="card-body">
                              <table className="table table table-cart">
                                 <thead>
                                 <tr>
                                    <th colSpan={2}>
                                       <span>Product</span>
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
                                                   product.ConfiguredItems.map((config, index2) => {
                                                         return config.isChecked && <ConfigItem
                                                            currency={currency}
                                                            product={product}
                                                            config={config}/>
                                                      }
                                                   )
                                                   :
                                                   <PlainItem currency={currency} product={product}/>
                                             }
                                             {
                                                checkedProductItem(product) &&
                                                <tr key={index}>
                                                   <td colSpan={2} className="text-right">China to BD Shipping cost</td>
                                                   <td
                                                      className="text-center">{`${currency} ${numberWithCommas(totalShippingCost(product))}`}</td>
                                                </tr>
                                             }
                                             {
                                                checkedProductItem(product) &&
                                                <tr key={index + 1}>
                                                   <td colSpan={2} className="text-right">Sub Total</td>
                                                   <td
                                                      className="text-center">{`${currency} ${numberWithCommas(productTotalCost(product))}`}</td>
                                                </tr>
                                             }
                                          </>
                                       )
                                       :
                                       <tr>
                                          <td colSpan={3} className="text-center bg-lighter">You have no cart!</td>
                                       </tr>

                                 }

                                 </tbody>
                                 <tfoot>
                                 <tr>
                                    <td colSpan={3}>
                                       <h3 className="border-0 m-0 py-3 summary-title">Cart Total Summary</h3>
                                    </td>
                                 </tr>
                                 <tr className="summary-total">
                                    <td colSpan={2} className="text-right">Subtotal:</td>
                                    <td className="text-right">{`${currency} ${numberWithCommas(summary.totalPrice)}`}</td>
                                 </tr>
                                 <tr className="summary-total">
                                    <td colSpan={2} className="text-right">Need To Pay:</td>
                                    <td className="text-right">{`${currency} ${numberWithCommas(advanced)}`}</td>
                                 </tr>
                                 <tr className="summary-total">
                                    <td colSpan={2} className="text-right">Due Amount:</td>
                                    <td className="text-right">{`${currency} ${numberWithCommas(dueAmount)}`}</td>
                                 </tr>

                                 <tr>
                                    <td colSpan={3} className="border-0 p-0">
                                       <div className="card payment_card text-center">

                                          <div className="row">
                                             <div className="col-md-6">
                                                <div className="form-check form-check-inline">
                                                   <input
                                                      className="form-check-input mr-2"
                                                      type="radio"
                                                      name="payment_method"
                                                      onClick={e => setPaymentMethod(e.target.value)}
                                                      id="bkash_payment"
                                                      value="bkash_payment"/>
                                                   <label className="form-check-label" htmlFor="bkash_payment">
                                                      <img src={`/assets/img/payment/bkash.png`} alt="bkash"/>
                                                   </label>
                                                </div>
                                             </div>
                                             <div className="col-md-6">
                                                <div className="form-check form-check-inline">
                                                   <input
                                                      className="form-check-input mr-2 "
                                                      type="radio"
                                                      name="payment_method"
                                                      onClick={e => setPaymentMethod(e.target.value)}
                                                      id="nagad_payment"
                                                      value="nagad_payment"/>
                                                   <label className="form-check-label" htmlFor="nagad_payment">
                                                      <img src={`/assets/img/payment/nagod.png`} alt="bkash"/>
                                                   </label>
                                                </div>
                                             </div>
                                          </div>

                                       </div>
                                    </td>
                                 </tr>

                                 <tr>
                                    <td colSpan={3}>
                                       <div className="form-check form-check-inline">
                                          <input
                                             className="form-check-input"
                                             type="checkbox"
                                             id="accept"
                                             defaultChecked={accept}
                                             onChange={() => setAccept(!accept)}
                                          />
                                          <label className="form-check-label" htmlFor="accept">
                                             <p className="m-0">I have read and agree to the website
                                                <Link className="btn-link" to="/pages/privacy-policy">Terms and Conditions</Link>,
                                                <Link className="btn-link" to="/pages/privacy-policy">Prohibited Items</Link> and
                                                <Link className="btn-link" to="/pages/privacy-policy">Refund Policy</Link>
                                             </p>
                                          </label>
                                       </div>
                                    </td>
                                 </tr>

                                 <tr>
                                    <td colSpan={3}>
                                       <button
                                          type="button"
                                          onClick={e => paymentConfirm(e)}
                                          className="btn btn-block btn-default py-3 mt-3">Confirm Order
                                       </button>
                                    </td>
                                 </tr>

                                 </tfoot>
                              </table>
                           </div>
                        </div>
                     </div>
                     {/* End .col-lg-9 */}
                  </div>
                  {/* End .row */}
               </div>
               {/* End .container */}
            </div>
            {/* End .cart */}
         </div>
         {/* End .page-content */}
      </main>
   );
};

Payment.propTypes = {
   general: PropTypes.object.isRequired,
   user: PropTypes.object.isRequired,
   shipping_address: PropTypes.object.isRequired,
   cartConfigured: PropTypes.array.isRequired,
   confirmCustomerOrder: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   general: JSON.parse(state.INIT.general),
   user: state.AUTH.user,
   cartConfigured: state.CART.configured,
   shipping_address: state.CART.shipping_address
});

export default connect(mapStateToProps, {confirmCustomerOrder})(
   withRouter(Payment)
);