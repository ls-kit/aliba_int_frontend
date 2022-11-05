import React, {useEffect, useState} from 'react';
import {getCustomerAllOrders} from "../../../utils/Services";
import {Link} from 'react-router-dom';
// import PropTypes from 'prop-types';

const MyOrders = () => {


   const [loading, setLoading] = useState(false);
   const [orders, setOrders] = useState([]);

   useEffect(() => {
      setLoading(true);
      getCustomerAllOrders()
         .then(response => {
            setLoading(false);
            setOrders(response.orders);
         })

   }, []);


   return (
      <div className="card">
         <div className="card-header border border-bottom-0 p-4">
            <h4 className="card-title">My Orders</h4>
         </div>
         <div className="card-body border p-4">
            <div className="table-responsive">
               <table className="table">
                  <thead>
                  <tr>
                     <th>Date</th>
                     <th>OrderId</th>
                     <th>Amount</th>
                     <th>1stPayment</th>
                     <th>Due</th>
                     <th>Total</th>
                     <th>Status</th>
                     <th>Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {
                     loading ?
                        <tr>
                           <td colSpan={9} className="text-center">
                              <div className="spinner-border text-secondary" role="status">
                                 <span className="sr-only">Loading...</span>
                              </div>
                           </td>
                        </tr>
                        :
                        orders.length > 0 ?
                           orders.map(order =>
                              <tr>
                                 <td>{order.created_at}</td>
                                 <td>{order.order_number}</td>
                                 <td>{Math.round(order.amount)}</td>
                                 <td>{Math.round(order.needToPay)}</td>
                                 <td>{Math.round(order.dueForProducts)}</td>
                                 <td>{Math.round(order.amount)}</td>
                                 <td>{order.status}</td>
                                 <td>
                                    {
                                       order.status === 'waiting-for-payment' ?
                                          <Link to={`/details/${order.id}`} className="btn btn-default px-0">PayNow</Link>
                                          :
                                          <Link to={`/details/${order.id}`} className="btn btn-default px-0">Details</Link>
                                    }
                                 </td>
                              </tr>
                           )
                           :
                           <tr>
                              <td colSpan={9}>You have no orders</td>
                           </tr>
                  }
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