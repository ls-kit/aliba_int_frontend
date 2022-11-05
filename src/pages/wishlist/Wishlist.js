import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types';
import WishlistPage from './wishlistPage/WishlistPage'
import Breadcrumb from "../breadcrumb/Breadcrumb";
import {connect} from "react-redux";
import {customerWishlist, RemoveCustomerWishlist} from "../../store/actions/AuthAction";
import {withRouter} from "react-router-dom";
import swal from "sweetalert";
import SpinnerButtonLoader from "../../loader/SpinnerButtonLoader";

const Wishlist = (props) => {
   const {wishlist} = props;
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      if (!loading) {
         setLoading(true);
         props.customerWishlist();
      }
   }, []);

   useEffect(() => {
      setLoading(false);
   }, [wishlist]);


   const removeFromWishlist = (ItemId) => {
      swal({
         icon: "warning",
         text: "Are sure to remove from wishlist!",
         buttons: true,
      })
         .then((willDelete) => {
            if (willDelete) {
               props.RemoveCustomerWishlist(ItemId);
            }
         });
   };

   return (
      <div>
         <Breadcrumb current="Wishlist"/>
         <div className="row justify-content-center">
            <div className="col-md-8">
               {
                  loading ?
                     <SpinnerButtonLoader/>
                     :
                     <WishlistPage wishlist={wishlist} removeFromWishlist={removeFromWishlist}/>
               }
            </div>
         </div>
      </div>
   )
};

Wishlist.propTypes = {
   wishlist: PropTypes.array.isRequired,
   customerWishlist: PropTypes.func.isRequired,
};


const mapStateToProps = (state) => ({
   wishlist: state.AUTH.wishlist,
});

export default connect(mapStateToProps, {customerWishlist, RemoveCustomerWishlist})(
   withRouter(Wishlist)
);

