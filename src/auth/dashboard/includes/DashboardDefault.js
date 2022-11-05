import React from 'react';
// import PropTypes from 'prop-types';

const DashboardDefault = () => {
   return (
      <div className="card">
         <div className="card-header p-4">
            <h4 className="card-title">Dashboard</h4>
         </div>
         <div className="card-body p-4">

            <div className="row">
               <div className="col-md-4">
                  <div className="card-body p-5 shadow text-center border">
                     <h3>Total Orders</h3>
                     <h1 className="mb-0">0</h1>
                  </div>
               </div>
               <div className="col-md-4">
                  <div className="card-body p-5 shadow text-center border">
                     <h3>Pending Orders</h3>
                     <h1 className="mb-0">0</h1>
                  </div>
               </div>
               <div className="col-md-4">
                  <div className="card-body p-5 shadow text-center border">
                     <h3>Completed Orders</h3>
                     <h1 className="mb-0">0</h1>
                  </div>
               </div>
            </div>

            <hr/>

            <div className="card-body mb-4 p-5 shadow">
               <h2>Notifications</h2>
               <ul className="list-group">
                  <li className="list-group-item">No Notifications</li>
               </ul>
            </div>


         </div>
      </div>
   );
};

// MyAccount.propTypes = {
//
// };

export default DashboardDefault;