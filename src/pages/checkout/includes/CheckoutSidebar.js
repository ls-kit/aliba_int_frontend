import React, { useEffect, useLayoutEffect, useState } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  calculateDiscountAmount,
  cartCalculateCouponDiscount,
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
import {
  addAdvancePaymentPercent,
  addCouponDetails,
  selectPaymentMethod,
} from "../../../utils/GlobalStateControl";

import { getCouponDetails } from "../../../utils/Services";
import { confirmCustomerOrder } from "../../../store/actions/CartAction";

const CheckoutSidebar = (props) => {
  const { general, currency, shipping_address, cartConfigured, advance_percent } = props;
  const chinaLocalShippingCharges = getSetting(general, "china_local_delivery_charge");
  const chinaLocalShippingChargeLimit = getSetting(general, "china_local_delivery_charge_limit");
  const summary = CheckoutSummary(cartConfigured, chinaLocalShippingCharges, chinaLocalShippingChargeLimit);
  const checkout_payment_first = getSetting(general, "checkout_payment_first");
  const checkout_payment_second = getSetting(general, "checkout_payment_second");
  const checkout_payment_third = getSetting(general, "checkout_payment_third");

  const minOrderPrice = getSetting(general, "min_order_amount");
  const minOrderQuantity = getSetting(general, "min_order_quantity");

  const [manageShipping, setManageShipping] = useState(false);
  const [paymentOption, setPaymentOption] = useState(Number(checkout_payment_first));
  const [paymentMethod, setPaymentMethod] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponDetails, setCouponDetails] = useState({});
  const [refNumber, setRefNumber] = useState("");

  useEffect(() => {
    const uniqueRef = Date.now();
    setRefNumber(uniqueRef);
  }, []);

  const manageShippingAddress = (e) => {
    e.preventDefault();
    setManageShipping(true);
  };

  const handlePaymentChange = (e) => {
    let percent = e.target.value;
    setPaymentOption(percent);
    addAdvancePaymentPercent(percent);
  };
  const handlePaymentMethodChange = (e) => {
    let method = e.target.value;
    if (method) setPaymentMethod(method);
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

  const handleCouponApply = () => {
    if (!coupon) {
      swal({
        title: "Please Enter Your Coupon",
        icon: "warning",
        buttons: "Ok, Understood",
      });
      return;
    }
    getCouponDetails(coupon).then((response) => {
      if (!_.isEmpty(response)) {
        const resData = response.data;
        if (!_.isEmpty(resData)) {
          const coupon = resData.coupon;
          if (!_.isEmpty(coupon)) {
            setCouponDetails(coupon);
            addCouponDetails(coupon);
          }
        } else {
          const errorMessage = response.message ? response.message : "Invalid Coupon!";
          swal({
            title: `${errorMessage}`,
            icon: "warning",
            buttons: "Ok, Understood",
          });
        }
      }
    });
  };

  // console.log("coupon data", couponDetails);
  const couponDiscount = cartCalculateCouponDiscount(couponDetails);
  const discount = getDiscount();
  const payableTotal = payableSubTotal(summary.totalPrice, discount, couponDetails);
  const advanced = cartCalculateNeedToPay(payableTotal, Number(advance_percent));
  const dueAmount = cartCalculateDueToPay(payableTotal, Number(advance_percent));

  // const checkedProductItem = (product) => {
  //   const hasConfigurators = product.hasConfigurators;
  //   if (hasConfigurators) {
  //     const ConfiguredItems = product.ConfiguredItems;
  //     if (_.isArray(ConfiguredItems)) {
  //       const filterConfig = ConfiguredItems.filter((filter) => filter.isChecked === true);
  //       return filterConfig.length > 0;
  //     }
  //   }
  //   return product.isChecked;
  // };

  const checkedProductItem = (product) => {
    const hasConfigurators = product.hasConfigurators;
    if (hasConfigurators) {
      const ConfiguredItems = product.ConfiguredItems;
      if (_.isArray(ConfiguredItems)) {
        const filterConfig = ConfiguredItems.filter((filter) => filter.isChecked === true);
        return filterConfig.length > 0;
      }
    }
    return product.isChecked;
  };

  const reConfigCart = cartConfigured.filter((product) => product.isChecked);
  const finalCart = reConfigCart;

  const handlePlaceOrder = () => {
    let proceed = true;

    cartConfigured.map((item) => {
      if (item.totalPrice < minOrderPrice || item.totalQty < minOrderQuantity) {
        proceed = false;
        swal({
          title: `Dear customer, Every product should be ordered for a minimum of ${minOrderQuantity} pieces and ${minOrderPrice} taka!`,
          icon: "warning",
          buttons: "Ok, Understood",
        });
      }

      return false;
    });

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
      let cartTotal = payableTotal;
      if (!_.isEmpty(cartConfigured) && !_.isEmpty(shipping_address) && cartTotal && advanced && dueAmount) {
        props.confirmCustomerOrder({
          paymentMethod: paymentMethod,
          cart: JSON.stringify(finalCart),
          address: JSON.stringify(shipping_address),
          summary: JSON.stringify({
            cartTotal: cartTotal,
            advanced: advanced,
            dueAmount: dueAmount,
            trxId: null,
            couponCode: couponDetails?.coupon_code,
            couponDiscount: couponDiscount,
            refNumber: refNumber.toString(),
          }),
        });
      } else {
        return;
      }
    }
  };

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
              <td>Payment Amount(%):</td>
              <div className='ml-2'>
                <select onChange={handlePaymentChange} className='form-control' name='' id='payment'>
                  <option value={checkout_payment_first}>{checkout_payment_first}%</option>
                  <option value={checkout_payment_second}>{checkout_payment_second}%</option>
                  <option value={checkout_payment_third}>{checkout_payment_third}%</option>
                </select>
              </div>
            </tr>

            <tr className='summary-total'>
              <td>Payment Method:</td>
              <div className='ml-2'>
                <select onChange={handlePaymentMethodChange} className='form-control' name='' id='payment'>
                  <option value='0' defaultChecked>
                    Select
                  </option>
                  <option value='bkash_payment'>bKash</option>
                  <option value='nagad_payment'>Nagad</option>
                  <option value='bank_payment'>Bank</option>
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
              <td>Apply Coupon : </td>
              <td>
                <div className='d-inline-block manage-quantity'>
                  <div className='input-group input-group input-group-sm'>
                    <input
                      placeholder='Enter Coupon'
                      type='text'
                      className='form-control p-2 text-center addQ'
                      onChange={(e) => setCoupon(e.target.value)}
                    />
                    <div className='input-group-append'>
                      <button
                        onClick={() => handleCouponApply()}
                        type='button'
                        className='btn btn-default'
                        style={{ fontSize: "13.5px" }}
                        disabled={couponDiscount}
                      >
                        {couponDiscount ? "Applied" : "Apply"}
                      </button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <tr className='summary-total'>
              <td>Coupon Reword:</td>
              <td>{`${currency} ${numberWithCommas(couponDiscount)}`}</td>
            </tr>

            <tr className='summary-total'>
              <td>Due Amount:</td>
              <td>{`${currency} ${numberWithCommas(dueAmount)}`}</td>
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
        <div>
          <div className='pt-2'>
            <button
              type='button'
              onClick={(e) => handlePlaceOrder()}
              className='btn btn-block btn-check checkout-btn'
            >
              PLACE ORDER
            </button>
          </div>
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

export default connect(mapStateToProps, { confirmCustomerOrder })(withRouter(CheckoutSidebar));
