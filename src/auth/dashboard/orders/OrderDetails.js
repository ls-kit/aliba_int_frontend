import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { getSetting, goPageTop } from "../../../utils/Helpers";
import Breadcrumb from "../../../pages/breadcrumb/Breadcrumb";
import ConfigItem from "../../../pages/payment/includes/ConfigItem";
import PlainItem from "../../../pages/payment/includes/PlainItem";
import {
  calculateAirShippingCharge,
  cartCalculateNeedToPay,
  cartCheckedProductTotal,
  CartProductSummary,
  numberWithCommas,
} from "../../../utils/CartHelpers";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { confirmCustomerOrder } from "../../../store/actions/CartAction";
import { getOrderDetails } from "../../../utils/Services";

const OrderDetails = (props) => {
  const { cartConfigured, match, general } = props;
  const order_id = match.params.id;
  const [order, setOrder] = useState("");
  const bankId = getSetting(general, "payment_bank_details");

  const currency = getSetting(general, "currency_icon");
  const ShippingCharges = getSetting(general, "air_shipping_charges");
  const summary = CartProductSummary(cartConfigured, ShippingCharges);
  const advanced = cartCalculateNeedToPay(summary.totalPrice);
  const dueAmount = advanced;

  const address = !_.isEmpty(order) ? JSON.parse(order.address) : {};
  const orderItems = !_.isEmpty(order) ? order.order_items : [];

  useEffect(() => {
    goPageTop();
    getOrderDetails(order_id).then((response) => {
      setOrder(response.order);
    });
  }, [order_id]);

  console.log("order", order);

  const totalShippingCost = (product) => {
    const checkItemSubTotal = cartCheckedProductTotal(product);
    const totalPrice = checkItemSubTotal.totalPrice;
    const totalWeight = checkItemSubTotal.totalWeight;
    const DeliveryCost = product.DeliveryCost;
    const ShippingRate = calculateAirShippingCharge(totalPrice, ShippingCharges);
    return Number(DeliveryCost) + Number(totalWeight) * Number(ShippingRate);
  };

  const productTotalCost = (product) => {
    const checkItemSubTotal = cartCheckedProductTotal(product);
    const totalPrice = checkItemSubTotal.totalPrice;
    const ShippingCost = totalShippingCost(product);
    return Number(totalPrice) + Number(ShippingCost);
  };

  return (
    <main className='main bg-gray'>
      <Breadcrumb
        current='Order details'
        collections={[
          { name: "Dashboard", url: "dashboard" },
          { name: "Orders", url: "dashboard/orders" },
        ]}
      />

      <div className='page-content'>
        <div className='container'>
          <div className='row justify-content-center'>
            <aside className='col-md-9'>
              <div className='card bg-white'>
                <div className='card-body pt-5 px-5 py-4'>
                  <table className='table table-responsive table-borderless' style={{ tableLayout: "fixed" }}>
                    <thead>
                      <tr>
                        <td>
                          <p className='m-0'>Customer: {order.name}</p>
                          <p className='m-0'>Email: {order.email}</p>
                          <p className='m-0'>Phone: {order.phone}</p>
                          <p className='m-0'>Address: {!_.isEmpty(address) ? address.address : ""}</p>
                        </td>
                        <td></td>
                        <td></td>
                        <td>
                          <p className='m-0'>
                            <b>{order.trxId ? "Initial Paid" : "UNPAID"}</b>
                          </p>
                          <p className='m-0'>
                            <span className='mr-2'>Method:</span>
                            {order.pay_method === "bkash_payment" && `Bkash`}
                            {order.pay_method === "nagad_payment" && `Nagod`}
                            {order.pay_method === "bank_payment" && `Bank`}
                          </p>
                          <p className='m-0'>
                            <span className='mr-2'>Wallet:</span>
                            {order.pay_method === "bkash_payment" && `01811355678`}
                            {order.pay_method === "nagad_payment" && `01911712769`}
                            {order.pay_method === "bank_payment" && `${bankId}`}
                          </p>
                          <p className='m-0'>Transaction Number : {order.trxId}</p>
                          <p className='m-0'>Reference Number : {order.refNumber}</p>
                        </td>
                      </tr>
                    </thead>
                  </table>

                  <hr />
                  <table className='table table-responsive table-bordered table-cart'>
                    <thead>
                      <tr>
                        <th> Image</th>
                        <th>Title</th>
                        <th>Quantity</th>
                        <th>TotalAmount</th>
                        {/* <th>FirstPayment</th> */}
                        {/* <th>DuePayment</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {orderItems.length > 0 ? (
                        orderItems.map((item, index) => (
                          <>
                            <tr key={index}>
                              <td>
                                <img src={item.image} style={{ width: "100px" }} alt='' />
                              </td>
                              <td> {item.name} </td>
                              <td> {item.quantity}</td>
                              <td>
                                {currency} {item.product_value}
                              </td>
                              {/* <td> {item.first_payment}</td>
                              <td> {item.due_payment}</td> */}
                            </tr>
                          </>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className='text-center bg-lighter'>
                            You have no cart!
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={4}>
                          <h3 className='border-0 m-0 py-3 summary-title'>Cart Total Summary</h3>
                        </td>
                      </tr>
                      <tr className='summary-total'>
                        <td colSpan={3} className='text-right'>
                          Subtotal:
                        </td>
                        <td className='text-right'>{`${currency} ${order.amount}`}</td>
                      </tr>
                      <tr className='summary-total'>
                        <td colSpan={3} className='text-right'>
                          Need To Pay:
                        </td>
                        <td className='text-right'>{`${currency} ${order.needToPay}`}</td>
                      </tr>
                      <tr className='summary-total'>
                        <td colSpan={3} className='text-right'>
                          Due Amount:
                        </td>
                        <td className='text-right'>{`${currency} ${order.dueForProducts}`}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </aside>
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </div>
    </main>
  );
};

OrderDetails.propTypes = {
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
  shipping_address: state.CART.shipping_address,
});

export default connect(mapStateToProps, { confirmCustomerOrder })(withRouter(OrderDetails));
