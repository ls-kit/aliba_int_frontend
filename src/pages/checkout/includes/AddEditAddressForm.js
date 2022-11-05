import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {updatedShippingAddress} from "../../../utils/GlobalStateControl";
import _ from "lodash";
import swal from "sweetalert";
import {storeNewAddress} from "../../../utils/Services";

const AddEditAddressForm = props => {

   const {editAddress} = props;

   const [Id, setId] = useState(null);
   const [name, setName] = useState('');
   const [phone, setPhone] = useState('');
   const [district, setDistrict] = useState('');
   const [address, setAddress] = useState('');

   useEffect(() => {
      if (!_.isEmpty(editAddress)) {
         setId(editAddress.id);
         setName(editAddress.name);
         setPhone(editAddress.phone_one);
         setDistrict(editAddress.phone_three);
         setAddress(editAddress.address);
      }
   }, []);


   const submitShippingAddress = (e) => {
      e.preventDefault();
      let proceed = true;
      if (!name && !phone && !district && !address) {
         proceed = false;
         swal({
            title: "Address fields is are required",
            icon: "warning",
            buttons: "Ok, Understood"
         });
      }

      if (proceed) {
         storeNewAddress({
            id: Id,
            name: name,
            phone: phone,
            district: district,
            address: address,
         }).then(response => {
            if (response.status) {
               cancelAddEditAddress();
            }
         });
      }
   };

   const cancelAddEditAddress = () => {
      if (Id) {
         props.setEdit(false)
      } else {
         props.setNewAddress(false)
      }
   };

   return (
      <form onSubmit={e => submitShippingAddress(e)}>
         <input type="hidden" value={Id}/>
         <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
               type="text"
               id="name"
               value={name}
               onChange={e => setName(e.target.value)}
               placeholder="Your Name"
               required={true}
               className="form-control"/>
         </div>
         <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
               type="text"
               id="phone"
               value={phone}
               onChange={e => setPhone(e.target.value)}
               placeholder="Your Phone"
               required={true}
               className="form-control"/>
         </div>

         <div className="form-group">
            <label htmlFor="district">District</label>
            <input
               type="text"
               id="district"
               value={district}
               placeholder="You District"
               required={true}
               onChange={e => setDistrict(e.target.value)}
               className="form-control"/>
         </div>

         <div className="form-group">
            <label htmlFor="address">Full Address</label>
            <input
               type="text"
               id="address"
               value={address}
               onChange={e => setAddress(e.target.value)}
               required={true}
               placeholder="You Address"
               className="form-control"/>
         </div>

         <div className="form-group">
            <button type="submit" className="btn btn-default mr-2">
               Save Address
            </button>
            <button
               type="button"
               onClick={() => cancelAddEditAddress()}
               className="btn btn-secondary rounded">
               Cancel
            </button>
         </div>


      </form>
   );
};

AddEditAddressForm.propTypes = {};

export default AddEditAddressForm;