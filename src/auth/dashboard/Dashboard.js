import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Breadcrumb from "../../pages/breadcrumb/Breadcrumb";
import {connect} from "react-redux";
import {authLogout} from "../../store/actions/AuthAction";
import {withRouter, NavLink} from "react-router-dom";
import SwitchSection from "./includes/SwitchSection";
import My404Component from "../../pages/404/My404Component";
import {goPageTop} from "../../utils/Helpers";

const Dashboard = props => {
   const [section, setSection] = useState('dashboard');
   const newSection = props.match.params.section;

   useEffect(() => {
      goPageTop();
   }, []);

   useEffect(() => {
      if (newSection) {
         if (section !== newSection) {
            setSection(newSection);
            goPageTop();
         }
      }
   }, [section]);

   const authLogoutProcess = (e) => {
      e.preventDefault();
      props.authLogout(props.history)
   };

   const activeRoutes = ["dashboard", "account", "orders", "wishlist", "addresses", "account"];

   if (!activeRoutes.includes(section)) {
      return <My404Component/>
   }

   return (
      <main className="main bg-gray">
         <Breadcrumb current={section} collections={[
            {'name': "Dashboard", url: 'dashboard'}
         ]}/>

         <div className="page-content">
            <div className="dashboard">
               <div className="container">
                  <div className="row">
                     <aside className="col-md-3 col-lg-3">
                        <div className="card bg-white">
                           <div className="card-body px-5 py-4">
                              <ul
                                 className="nav nav-dashboard flex-column mb-3 mb-md-0"
                              >
                                 <li className="nav-item">
                                    <NavLink
                                       to="/dashboard"
                                       exact
                                       className="nav-link"
                                    >
                                       Dashboard
                                    </NavLink>
                                 </li>
                                 <li className="nav-item">
                                    <NavLink
                                       className="nav-link"
                                       to={`/dashboard/orders`}
                                    >
                                       Orders
                                    </NavLink>
                                 </li>
                                 <li className="nav-item">
                                    <NavLink
                                       className="nav-link"
                                       to={`/dashboard/addresses`}
                                    >
                                       Addresses
                                    </NavLink>
                                 </li>
                                 <li className="nav-item">
                                    <NavLink
                                       className="nav-link"
                                       to={`/dashboard/account`}
                                    >
                                       Account Details
                                    </NavLink>
                                 </li>
                                 <li className="nav-item">
                                    <a
                                       className="nav-link"
                                       onClick={e => authLogoutProcess(e)}
                                       href="/logout">
                                       Sign Out
                                    </a>
                                 </li>
                              </ul>
                           </div>
                        </div>
                     </aside>
                     {/* End .col-lg-3 */}
                     <div className="col-md-9 col-lg-9">
                        <SwitchSection section={newSection ? newSection : 'dashboard'}/>
                     </div>
                     {/* End .col-lg-9 */}
                  </div>
                  {/* End .row */}
               </div>
               {/* End .container */}
            </div>
            {/* End .dashboard */}
         </div>
         {/* End .page-content */}
      </main>
   );
};

Dashboard.propTypes = {
   history: PropTypes.object.isRequired,
   authLogout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   general: JSON.parse(state.INIT.general),
   auth: state.AUTH,
});

export default connect(mapStateToProps, {authLogout})(
   withRouter(Dashboard)
);
