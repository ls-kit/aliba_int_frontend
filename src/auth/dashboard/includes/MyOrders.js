import React, { useEffect, useState } from "react";
import { cancelOrder, getCustomerAllOrders } from "../../../utils/Services";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import _ from "lodash";
import { useLayoutEffect } from "react";
import { numberWithCommas } from "../../../utils/CartHelpers";

const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }

    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
};

const MyOrders = (props) => {
  const { status, orderText } = props;
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [cancel, setCancel] = useState(false);

  let [width, height] = useWindowSize();

  width = width ? width : window.innerWidth;

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

  let ordersData;
  if (status === "orders") {
    ordersData = orders;
  } else if (status === "pending-orders") {
    ordersData = orders.filter((order) => order.status === "waiting-for-payment");
  } else if (status === "processing-orders") {
    ordersData = orders.filter((order) => order.status === "full-paid" || order.status === "partial-paid");
  } else if (status === "complete-orders") {
    ordersData = orders.filter((order) => order.status === "order-completed");
  } else {
    ordersData = orders;
  }

  if (width < 768)
    return (
      <div className='card my-2'>
        <div className='card-header border  p-4 mb-1'>
          <h4 className='card-title'>{orderText}</h4>
        </div>
        <div className=''>
          {loading && (
            <div className='text-center'>
              <div className='spinner-border text-secondary' role='status'>
                <span className='sr-only'>Loading...</span>
              </div>
            </div>
          )}
          {ordersData.length > 0 ? (
            ordersData.map((order) => (
              <div className='card-body px-1 py-2 my-3 shadow  border'>
                <div className='px-4'>
                  <div className='row '>
                    <div className='col-7'>
                      <span className='bold'>Date:</span>
                      {order.created_at}
                    </div>
                    <div className='col-5 text-right'>
                      <span className='bold'>Order id:</span>
                      {order.order_number}
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-6'>
                      <span className='bold'>Amount:</span>
                      {numberWithCommas(order.amount)}
                    </div>
                    <div className='col-6 text-right'>
                      <span className='bold'>1stPayment:</span>
                      {numberWithCommas(order.needToPay)}
                    </div>
                    <div className='col-6'>
                      <span className='bold'>Due:</span>
                      {numberWithCommas(order.dueForProducts)}
                    </div>
                    <div className='col-6 text-right'>
                      <span className='bold'>Total:</span>
                      {numberWithCommas(order.amount)}
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-6'>
                      <span className='bold'>TRX:</span>
                      {order?.trxId}
                    </div>
                    <div className='col-6 text-right'>
                      <span className='bold'>REF:</span>
                      {order.refNumber}
                    </div>
                    <div className='col-12 text-right'>
                      <span className='bold'>Status:</span>
                      {order.status}
                    </div>
                  </div>
                </div>

                <div className='flexEnd mobileOAC text-center'>
                  <Link to={`/details/${order.id}`} className='homeReg-btn order-disable mx-4'>
                    Details
                  </Link>
                  <Link
                    onClick={() => handleCancelOrder(order.id)}
                    className='homeReg-btn order-disable mx-4'
                  >
                    Cancel
                  </Link>
                  <Link to={`/payment/${order.id}`} className='homeLogin-btn dobt mx-4'>
                    Pay now
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className='card-body px-1 py-2 shadow text-center border'>You have no orders</div>
          )}
        </div>
      </div>
    );

  return (
    <div className='card'>
      <div className='card-header border border-bottom-0 p-4'>
        <h4 className='card-title'>{orderText}</h4>
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
              ) : ordersData.length > 0 ? (
                ordersData.map((order) => (
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
