import React, {useState} from "react";
import LoadAttributes from "./includes/LoadAttributes";
import ProductSummary from "./includes/ProductSummary";
import MediaPart from "./includes/MediaPart";
import {
   ConfiguratorAttributes, findFirstConfigurators,
   findProductCartFromState, getColorAttributes
} from "../../../../utils/CartHelpers";
import PropTypes from "prop-types";
import _ from "lodash";
import {connect} from "react-redux";
import {withRouter, Link} from "react-router-dom";
import ProductConfiguredItems from "./ProductConfiguredItems";
import swal from "sweetalert";
import {productAddToWishlist} from "../../../../store/actions/AuthAction";
import SingleAttributeGroup from "./includes/SingleAttributeGroup";

const ProductBody = (props) => {
   const {product, general, cartConfigured, ConfiguredItems} = props;
   const product_id = !_.isEmpty(product) ? product.Id : 0;

   const firstConfigurators = findFirstConfigurators(ConfiguredItems);

   const ConfigAttributes = ConfiguratorAttributes(product);
   const colorAttributes = getColorAttributes(ConfigAttributes);

   let activeProduct = findProductCartFromState(cartConfigured, product_id);

   const [activeImg, setActiveImg] = useState('');

   const alertForQuantity = (e) => {
      e.preventDefault();
      swal({
         text: "Add your quantity first!",
         icon: "warning",
         buttons: "Ok, Understood"
      });
   };

   const addToWishlist = (e, product) => {
      e.preventDefault();
      props.productAddToWishlist(product);
   };


   return (
      <div className="product-details-top">
         <h1
            className="product-title"
            style={{
               lineHeight: "1.4",
               fontSize: "1.5rem",
               textOverflow: "unset",
               overflow: "unset",
               whiteSpace: "break-spaces",
            }}
         >
            {product.Title && product.Title}
         </h1>

         <div className="row">
            <div className="col-md-6">
               <MediaPart activeImg={activeImg} setActiveImg={setActiveImg} product={product}/>
            </div>
            {/* End .col-md-6 */}
            <div className="col-md-6">
               <div className="product-details">

                  {
                     _.isArray(firstConfigurators) &&
                     firstConfigurators.map((singleConfig, index) =>
                        <SingleAttributeGroup
                           key={index}
                           singleConfig={singleConfig}
                           ConfigAttributes={ConfigAttributes}/>
                     )
                  }

                  <LoadAttributes
                     setActiveImg={setActiveImg}
                     product={product}
                     general={general}
                     colorAttributes={colorAttributes}
                     ConfiguredItems={ConfiguredItems}
                  />

                  <ProductConfiguredItems
                     product={product}
                     general={general}
                     colorAttributes={colorAttributes}
                     ConfiguredItems={ConfiguredItems}/>

                  <div className="details-filter-row">
                     <ProductSummary product={product} general={general}/>
                  </div>

                  {/* End .details-filter-row */}


                  <div className="product-details-action">
                     <a href={"/add-to-wishlist"}
                        onClick={(e) => addToWishlist(e, product)}
                        className="btn-product btn-wishlist">
                        <span>Add To Wishlist</span>
                     </a>
                     {
                        Number(activeProduct.totalQty) > 0 ?
                           <Link to="/checkout"
                                 className="btn-product btn-cart"
                                 style={{background: "#9b9b9b", marginLeft: "10px"}}>
                              <span>Buy Now</span>
                           </Link>
                           :
                           <a href={"/buy-now"}
                              onClick={e => alertForQuantity(e)}
                              className="btn-product btn-cart"
                              style={{background: "#9b9b9b", marginLeft: "10px"}}>
                              <span>Buy Now</span>
                           </a>
                     }
                  </div>


                  {/* End .product-details-action */}
                  <div className="product-details-footer">
                     <div className="social-icons social-icons-sm">
                        <span className="social-label">Share:</span>
                        <a
                           href={`https://www.facebook.com/share.php?u=https://uniqaz.com/product/${product.Id}&title=${product.Title}`}
                           className="social-icon"
                           title="Facebook"
                           target="_blank"
                        >
                           <i className="icon-facebook-f"/>
                        </a>
                        <a class="social-icon" href={`fb-messenger://share/?link=https://www.uniqaz.com/product/${product.Id}`}
                           data-action="share/messenger/share" target="blank">
                           <i class="icon-envelope"/>
                        </a>
                     </div>
                  </div>
                  {/* End .product-details-footer */}
               </div>
               {/* End .product-details */}
            </div>
            {/* End .col-md-6 */}
         </div>
         {/* End .row */}
      </div>
   );
};

ProductBody.propTypes = {
   product: PropTypes.object.isRequired,
   general: PropTypes.object.isRequired,
   ConfiguredItems: PropTypes.array.isRequired,
   cartConfigured: PropTypes.array.isRequired,
};


const mapStateToProps = (state) => ({
   general: JSON.parse(state.INIT.general),
   cartConfigured: state.CART.configured,
});

export default connect(mapStateToProps, {productAddToWishlist})(
   withRouter(ProductBody)
);



