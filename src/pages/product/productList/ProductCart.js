import React from "react";
import PropTypes from "prop-types";
import { getSetting } from "../../../utils/Helpers";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { loadProductDetails } from "../../../store/actions/ProductAction";
import { productAddToWishlist } from "../../../store/actions/AuthAction";

const ProductCart = (props) => {
  const { product, general, productClass } = props;
  const currency_icon = getSetting(general, "currency_icon");
  // console.log("product form product cart", product);

  const addToWishlist = (e, product) => {
    e.preventDefault();
    props.productAddToWishlist(product);
  };
  const product_code = product.product_code ? product.product_code : product.ItemId;

  return (
    <div className={productClass ? productClass : "col-6 col-sm-4 col-lg-4 col-xl-3"}>
      <div className='product product-7 mb-10x'>
        <figure className='product-media'>
          <Link to={`/product/${product_code}`}>
            <img src={product.img} className='product-image object-cover' alt={product.name} />
          </Link>
          <div className='product-action-vertical'>
            <a
              href={`/add-to-wishlist`}
              onClick={(e) => addToWishlist(e, product)}
              className='btn-product-icon btn-wishlist btn-expandable'
            >
              <span>add to wishlist</span>
            </a>
            <Link
              to={`/product/${product_code}`}
              className='btn-product-icon btn-quickview'
              title='Quick view'
            >
              <span>Quick view</span>
            </Link>
          </div>
        </figure>
        {/* End .product-media */}
        <div className='product-body'>
          {/* End .product-cat */}
          <h3
            className='product-title'
            style={{
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
            title={product.name}
          >
            <Link to={`/product/${product_code}`}>{product.name}</Link>
          </h3>
          {/* End .product-title */}
          <div className='clearfix d-block product-price'>
            <span className='float-left'>
              {`${currency_icon}`} <span className='price_span'>{product.sale_price}</span>
            </span>
            <span className='sold_item_text'>SOLD: {product.total_sold}</span>
          </div>
        </div>
        {/* End .product-body */}
      </div>
    </div>
  );
};

ProductCart.propTypes = {
  general: PropTypes.object.isRequired,
  product: PropTypes.object.isRequired,
  productClass: PropTypes.string,
};

const mapStateToProps = (state) => ({
  general: JSON.parse(state.INIT.general),
});

export default connect(mapStateToProps, { loadProductDetails, productAddToWishlist })(
  withRouter(ProductCart)
);
