import React, { useEffect, useState } from "react";
import { getCustomerAllOrders } from "../../../utils/Services";
import conplteOreder from "../../../assets/images/cd/completed-order.png";
import processing from "../../../assets/images/cd/processing .png";
import pending from "../../../assets/images/cd/pending.png";
import allOrder from "../../../assets/images/cd/allOrder.png";
// import PropTypes from 'prop-types';

const DashboardDefault = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setLoading(true);
    getCustomerAllOrders().then((response) => {
      setLoading(false);
      setOrders(response.orders);
    });
  }, []);

  const pendingOrders = orders.filter((order) => order.status === "waiting-for-payment");
  const processingOrders = orders.filter((order) => order.status === "partial-paid");
  const completeOrders = orders.filter((order) => order.status === "delivered");

  return (
    <div className='card'>
      <div className='card-header py-2 px-1 px-md-2'>
        <h4 className='card-title'>Dashboard</h4>
      </div>
      <div className='card-body p-2 p-md-4'>
        <div className='row'>
          <div className='col-3 col-md-3 my-2 my-md-0 di-1'>
            <div className=' h-100 card-body p-1 p-md-3 p-lg-5 shadow text-center border flexCenter flex-column'>
              <div className='flexCenter mb-1 mb-md-2'>
                <img className='cd-img' src={allOrder} alt='' />
              </div>
              <h3 className='d-title '>Total Orders</h3>
              <h1 className='mb-0 d-title '>{orders.length}</h1>
            </div>
          </div>
          <div className='col-3 col-md-3 my-2 my-md-0 di-2'>
            <div className=' h-100 card-body p-1 p-md-3 p-lg-5 shadow text-center border flexCenter flex-column'>
              <div className='flexCenter mb-1 mb-md-2'>
                <img className='cd-img' src={pending} alt='' />
              </div>
              <h3 className='d-title'>Pending Orders</h3>
              <h1 className='mb-0 d-title'>{pendingOrders.length}</h1>
            </div>
          </div>
          <div className='col-3 col-md-3 my-2 my-md-0 di-2'>
            <div className=' h-100 card-body p-1 p-md-3 p-lg-5 shadow text-center border flexCenter flex-column'>
              <div className='flexCenter mb-1 mb-md-2'>
                <img className='cd-img' src={processing} alt='' />
              </div>
              <h3 className=' d-title '>Processing Orders</h3>
              <h1 className='mb-0 d-title '>{processingOrders.length}</h1>
            </div>
          </div>
          <div className='col-3 col-md-3 my-2 my-md-0 di-3'>
            <div className=' h-100 card-body p-1 p-md-3 p-lg-5 shadow text-center border flexCenter flex-column'>
              <div className='flexCenter mb-1 mb-md-2'>
                <img className='cd-img' src={conplteOreder} alt='' />
              </div>
              <h3 className='d-title '>Completed Orders</h3>
              <h1 className='mb-0 d-title '>0</h1>
            </div>
          </div>
        </div>

        <hr />

        <div className='card-body mb-4 p-5 shadow'>
          <h2 className='d-title'>Notifications</h2>
          <ul className='list-group'>
            <li className='list-group-item'>No Notifications</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardDefault;
