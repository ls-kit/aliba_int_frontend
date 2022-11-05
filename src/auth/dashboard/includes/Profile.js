import React from 'react';
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import PropTypes from 'prop-types';

const Profile = (props) => {

   const {auth: {user}} = props;


   return (
      <div className="card">
         <div className="card-header border border-bottom-0 p-4">
            <h4 className="card-title">Profile Information</h4>
         </div>
         <div className="card-body border p-4 mb-3">
            <table className="table">
               <tbody>
               <tr>
                  <th>Name:</th>
                  <td>{user.name}</td>
               </tr>
               <tr>
                  <th>Phone:</th>
                  <td>{user.phone || 'Add Phone'}</td>
               </tr>
               <tr>
                  <th>Email:</th>
                  <td>{user.email}</td>
               </tr>
               </tbody>
            </table>

            <button type="button" className="btn btn-default">Update information</button>

         </div>
      </div>
   );
};

Profile.propTypes = {
   auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
   auth: state.AUTH
});

export default connect(mapStateToProps, {})(
   withRouter(Profile)
);
