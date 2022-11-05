import React, {useState} from 'react';
import PropTypes from 'prop-types';
import _ from "lodash";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {
   cartCalculateNeedToPay,
   CartProductSummary,
   numberWithCommas
} from "../../../utils/CartHelpers";
import ShippingAddress from "./ShippingAddress";
import swal from "sweetalert";

const CheckoutSidebar = props => {
   const {currency, ShippingCharges, shipping_address, cartConfigured} = props;
   const summary = CartProductSummary(cartConfigured, ShippingCharges);

   const [manageShipping, setManageShipping] = useState(false);

   const manageShippingAddress = (e) => {
      e.preventDefault();
      setManageShipping(true)
   };

   const ProcessToPaymentPage = () => {
      let proceed = true;
      if (_.isEmpty(shipping_address)) {
         proceed = false;
         swal({
            title: "Add your shipping  address first",
            icon: "warning",
            buttons: "Ok, Understood"
         });
      }
      if (!summary.totalPrice) {
         proceed = false;
         swal({
            title: "Please select your order Item",
            icon: "warning",
            buttons: "Ok, Understood"
         });
      }
      if (proceed) {
         props.history.push('/payment')
      }
   };

   const needToPay = () => {
      const price = cartCalculateNeedToPay(summary.totalPrice);
      return numberWithCommas(price);
   };

   return (
      <aside className="col-lg-3">
         {
            manageShipping &&
            <ShippingAddress
               currentAddress={shipping_address}
               manageShipping={manageShipping}
               setManageShipping={setManageShipping}/>
         }

         <div className="summary summary-cart">
            <h3 className="summary-title">Cart Total Summary</h3>
            <table className="table table-summary">
               <tbody>

               <tr className="summary-total">
                  <td>Subtotal:</td>
                  <td>{`${currency} ${numberWithCommas(summary.totalPrice)}`}</td>
               </tr>

               <tr className="summary-total">
                  <td>Need To Pay:</td>
                  <td>{`${currency} ${needToPay()}`}</td>
               </tr>

               <tr className="summary-total">
                  <td>Due Amount:</td>
                  <td>{`${currency} ${needToPay()}`}</td>
               </tr>

               <tr className="summary-shipping-estimate">
                  <td>
                     Shipping Address <a
                     href={'/shipping'}
                     onClick={e => manageShippingAddress(e)}
                     className="small">Choose</a>
                  </td>
                  <td>&nbsp;</td>
               </tr>
               <tr>
                  <td colSpan={2} className="text-left py-3">
                     <p className="mb-1">Name: {shipping_address.name || '...'}</p>
                     <p className="mb-1">Phone: {shipping_address.phone_one || '...'}</p>
                     <p className="mb-1">District: {shipping_address.phone_three || '...'}</p>
                     <p>{shipping_address.address || ''}</p>
                  </td>
               </tr>

               </tbody>
            </table>
            {/* End .table table-summary */}
            <button
               type="button"
               onClick={e => ProcessToPaymentPage()}
               className="btn btn-block btn-default"
            >
               PROCEED TO CHECKOUT
            </button>
         </div>
      </aside>
   );
};

CheckoutSidebar.propTypes = {
   history: PropTypes.object.isRequired,
   currency: PropTypes.string.isRequired,
   cartConfigured: PropTypes.array.isRequired,
   shipping_address: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
   cartConfigured: state.CART.configured,
   shipping_address: state.CART.shipping_address
});

export default connect(mapStateToProps, {})(
   withRouter(CheckoutSidebar)
);
