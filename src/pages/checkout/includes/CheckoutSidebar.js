import React, { useState } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  calculateDiscountAmount,
  cartCalculateDiscount,
  cartCalculateDueToPay,
  cartCalculateNeedToPay,
  CheckoutSummary,
  numberWithCommas,
  payableSubTotal,
} from "../../../utils/CartHelpers";
import ShippingAddress from "./ShippingAddress";
import swal from "sweetalert";
import { getSetting } from "../../../utils/Helpers";
import { addAdvancePaymentPercent, selectPaymentMethod } from "../../../utils/GlobalStateControl";
import bankImg from "../../../assets/images/bank.png";
import { useEffect } from "react";

const CheckoutSidebar = (props) => {
  const { general, currency, shipping_address, cartConfigured, advance_percent } = props;
  const chinaLocalShippingCharges = getSetting(general, "china_local_delivery_charge");
  const chinaLocalShippingChargeLimit = getSetting(general, "china_local_delivery_charge_limit");
  const summary = CheckoutSummary(cartConfigured, chinaLocalShippingCharges, chinaLocalShippingChargeLimit);
  const checkout_payment_first = getSetting(general, "checkout_payment_first");
  const checkout_payment_second = getSetting(general, "checkout_payment_second");
  const checkout_payment_third = getSetting(general, "checkout_payment_third");

  const [manageShipping, setManageShipping] = useState(false);
  const [paymentOption, setPaymentOption] = useState(Number(checkout_payment_first));
  const [paymentMethod, setPaymentMethod] = useState("");

  const manageShippingAddress = (e) => {
    e.preventDefault();
    setManageShipping(true);
  };

  const ProcessToPaymentPage = () => {
    let proceed = true;
    if (!paymentMethod) {
      proceed = false;
      swal({
        title: "Please Select Your Payment Method",
        icon: "warning",
        buttons: "Ok, Understood",
      });
    }
    if (_.isEmpty(shipping_address)) {
      proceed = false;
      swal({
        title: "Add your shipping  address first",
        icon: "warning",
        buttons: "Ok, Understood",
      });
    }
    if (!summary.totalPrice) {
      proceed = false;
      swal({
        title: "Please select your order Item",
        icon: "warning",
        buttons: "Ok, Understood",
      });
    }
    if (proceed) {
      props.history.push("/payment");
    }
  };

  const needToPay = () => {
    const price = cartCalculateNeedToPay(summary.totalPrice, paymentOption);
    return numberWithCommas(price);
  };

  const handlePaymentChange = (e) => {
    let percent = e.target.value;
    setPaymentOption(percent);
    addAdvancePaymentPercent(percent);
  };
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    selectPaymentMethod(method);
  };

  const getDiscount = () => {
    let discount = 0;
    if (paymentMethod && paymentOption) {
      if (paymentMethod == "bank_payment")
        discount = calculateDiscountAmount(paymentMethod, paymentOption, general, "bank");
      if (paymentMethod == "bkash_payment")
        discount = calculateDiscountAmount(paymentMethod, paymentOption, general, "bkash");
      if (paymentMethod == "nagad_payment")
        discount = calculateDiscountAmount(paymentMethod, paymentOption, general, "nagad");
    }
    return discount;
  };

  const discount = getDiscount();
  const payableTotal = payableSubTotal(summary.totalPrice, discount);
  const advanced = cartCalculateNeedToPay(payableTotal, Number(advance_percent));
  const dueAmount = cartCalculateDueToPay(payableTotal, Number(advance_percent));

  return (
    <aside className='col-lg-3'>
      {manageShipping && (
        <ShippingAddress
          currentAddress={shipping_address}
          manageShipping={manageShipping}
          setManageShipping={setManageShipping}
        />
      )}

      <div className='summary summary-cart'>
        <h3 className='summary-title'>Cart Total Summary</h3>
        <table className='table table-summary'>
          <tbody>
            <tr className='summary-total'>
              <td>Subtotal:</td>
              <td>{`${currency} ${numberWithCommas(summary.totalPrice)}`}</td>
            </tr>
            <tr className='summary-total'>
              <td>Select Payment Amount(%):</td>
              <div className='ml-2'>
                <select onChange={handlePaymentChange} className='form-control' name='' id='payment'>
                  <option value={checkout_payment_first}>{checkout_payment_first}%</option>
                  <option value={checkout_payment_second}>{checkout_payment_second}%</option>
                  <option value={checkout_payment_third}>{checkout_payment_third}%</option>
                </select>
              </div>
            </tr>
            <tr className='summary-total'>
              <td>Discount ({discount}%):</td>
              <td>{`${currency} ${numberWithCommas(
                cartCalculateDiscount(summary.totalPrice, discount)
              )}`}</td>
            </tr>
            <tr className='summary-total'>
              <td>Need To Pay:</td>
              <td>{`${currency} ${numberWithCommas(advanced)}`}</td>
            </tr>

            <tr className='summary-total'>
              <td>Due Amount:</td>
              <td>{`${currency} ${numberWithCommas(dueAmount)}`}</td>
            </tr>

            <tr className='summary-total '>
              <td colSpan={3} className='border-0 p-0'>
                <div className='card payment_card text-center'>
                  <div className='row'>
                    <div className='col-md-12 pay-box'>
                      <div className='form-check form-check-inline'>
                        <input
                          className='form-check-input mr-2'
                          type='radio'
                          name='payment_method'
                          onClick={(e) => handlePaymentMethodChange(e.target.value)}
                          id='bkash_payment'
                          value='bkash_payment'
                        />
                        <label className='form-check-label' htmlFor='bkash_payment'>
                          <img className='pay-img' src={`/assets/img/payment/bkash.png`} alt='bkash' />
                        </label>
                      </div>
                    </div>
                    <div className='col-md-12 pay-box'>
                      <div className='form-check form-check-inline'>
                        <input
                          className='form-check-input mr-2 '
                          type='radio'
                          name='payment_method'
                          onClick={(e) => handlePaymentMethodChange(e.target.value)}
                          id='nagad_payment'
                          value='nagad_payment'
                        />
                        <label className='form-check-label' htmlFor='nagad_payment'>
                          <img className='pay-img' src={`/assets/img/payment/nagod.png`} alt='Nagad' />
                        </label>
                      </div>
                    </div>
                    <div className='col-md-12 flex pay-box pb-3 '>
                      <div className='form-check form-check-inline'>
                        <input
                          className='form-check-input mr-2 '
                          type='radio'
                          name='payment_method'
                          onClick={(e) => handlePaymentMethodChange(e.target.value)}
                          id='bank_payment'
                          value='bank_payment'
                        />
                        <label className='form-check-label bankLabel' htmlFor='bank_payment'>
                          <img className='bankImg' src={bankImg} alt='Bank' />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            <tr className='summary-shipping-estimate'>
              <td>
                Shipping Address{" "}
                <a href={"/shipping"} onClick={(e) => manageShippingAddress(e)} className='small'>
                  Choose
                </a>
              </td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td colSpan={2} className='text-left py-3'>
                <p className='mb-1'>Name: {shipping_address.name || "..."}</p>
                <p className='mb-1'>Phone: {shipping_address.phone_one || "..."}</p>
                <p className='mb-1'>District: {shipping_address.phone_three || "..."}</p>
                <p>{shipping_address.address || ""}</p>
              </td>
            </tr>
          </tbody>
        </table>

        {/* End .table table-summary */}
        <div className='pt-2'>
          <button type='button' onClick={(e) => ProcessToPaymentPage()} className='btn btn-block btn-default'>
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </aside>
  );
};

CheckoutSidebar.propTypes = {
  history: PropTypes.object.isRequired,
  currency: PropTypes.string.isRequired,
  cartConfigured: PropTypes.array.isRequired,
  shipping_address: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  general: JSON.parse(state.INIT.general),
  cartConfigured: state.CART.configured,
  shipping_address: state.CART.shipping_address,
  advance_percent: state.CART.advance_percent.advance_percent,
});

export default connect(mapStateToProps, {})(withRouter(CheckoutSidebar));
