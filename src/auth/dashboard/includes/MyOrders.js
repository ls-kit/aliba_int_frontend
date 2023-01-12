import React, { useEffect, useState } from "react";
import { cancelOrder, getCustomerAllOrders } from "../../../utils/Services";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import _ from "lodash";
// import PropTypes from 'prop-types';

const MyOrders = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [cancel, setCancel] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCustomerAllOrders().then((response) => {
      setLoading(false);
      setOrders(response.orders);
    });
  }, [cancel]);

  const handleCancelOrder = (orderId) => {
    swal({
      title: "Are you sure to cancel this order?",
      icon: "warning",
      buttons: ["No, cancel it!", "Yes, I am sure!"],
      dangerMode: true,
    }).then(function (isConfirm) {
      if (isConfirm) {
        cancelOrder(orderId).then((response) => {
          if (!_.isEmpty(response)) {
            const resData = response.data;
            if (!_.isEmpty(resData)) {
              if (resData.status === "success") {
                setCancel(true);
                swal({
                  title: `${resData.message}`,
                  icon: "success",
                  buttons: "Ok, Understood",
                });
              } else {
                swal({
                  title: `${resData.message}`,
                  icon: "warning",
                  buttons: "Ok, Understood",
                });
              }
            }
          }
        });
      } else {
      }
    });
  };

  return (
    <div className='card'>
      <div className='card-header border border-bottom-0 p-4'>
        <h4 className='card-title'>My Orders</h4>
      </div>
      <div className='card-body border p-4'>
        <div className='table-responsive'>
          <table className='table'>
            <thead>
              <tr>
                <th>Date</th>
                <th>OrderId</th>
                <th>Amount</th>
                <th>1stPayment</th>
                <th>Due</th>
                <th>Total</th>
                <th>Trx ID</th>
                <th>Ref.</th>
                <th>Status</th>
                <th>Pay</th>
                <th>Details</th>
                <th>Cancel</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className='text-center'>
                    <div className='spinner-border text-secondary' role='status'>
                      <span className='sr-only'>Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <tr>
                    <td>{order.created_at}</td>
                    <td>{order.order_number}</td>
                    <td>{Math.round(order.amount)}</td>
                    <td>{Math.round(order.needToPay)}</td>
                    <td>{Math.round(order.dueForProducts)}</td>
                    <td>{Math.round(order.amount)}</td>
                    <td>{order?.trxId}</td>
                    <td>{order?.refNumber}</td>
                    <td>{order.status}</td>
                    <td>
                      <Link to={`/payment/${order.id}`} className='btn btn-default px-0'>
                        Pay now
                      </Link>
                    </td>
                    <td>
                      <Link to={`/details/${order.id}`} className='btn btn-default px-0'>
                        Details
                      </Link>
                    </td>
                    <td>
                      <button onClick={() => handleCancelOrder(order.id)} className='btn btn-default px-0'>
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9}>You have no orders</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// MyAccount.propTypes = {
//
// };

export default MyOrders;
