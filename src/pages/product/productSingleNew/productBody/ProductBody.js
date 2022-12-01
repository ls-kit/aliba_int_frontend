import React, { useEffect, useState } from "react";
import LoadAttributes from "./includes/LoadAttributes";
import ProductSummary from "./includes/ProductSummary";
import MediaPart from "./includes/MediaPart";
import { AiOutlineShopping } from "react-icons/ai";
import { RiGroupLine } from "react-icons/ri";
import { BsImage, BsCart3, BsFillCartDashFill, BsHeart } from "react-icons/bs";

import {
  ConfiguratorAttributes,
  findFirstConfigurators,
  findProductCartFromState,
  getColorAttributes,
} from "../../../../utils/CartHelpers";
import PropTypes from "prop-types";
import _ from "lodash";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import ProductConfiguredItems from "./ProductConfiguredItems";
import swal from "sweetalert";
import { productAddToWishlist } from "../../../../store/actions/AuthAction";
import SingleAttributeGroup from "./includes/SingleAttributeGroup";
import AppOffer from "./includes/AppOffer";
import AirFilter from "./includes/AirFilter";
import { FaRegCopy } from "react-icons/fa";
import PriceRange from "./includes/PriceRange";
import { loadBulkProductsPrice } from "../../../../utils/Services";
import CardSkelton from "../../../../skeleton/productSkeleton/CardSkelton";

const ProductBody = (props) => {
  const { product, general, cartConfigured, ConfiguredItems } = props;
  const product_id = !_.isEmpty(product) ? product.Id : 0;
  const totalQty = cartConfigured[0] ? cartConfigured[0]?.totalQty : 0;
  const firstConfigurators = findFirstConfigurators(ConfiguredItems);

  const ConfigAttributes = ConfiguratorAttributes(product);
  const colorAttributes = getColorAttributes(ConfigAttributes);

  let activeProduct = findProductCartFromState(cartConfigured, product_id);

  const [activeImg, setActiveImg] = useState("");
  const [bulkPriceQuantity, setBulkPriceQuantity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bulkPriceQuantityRange(product_id);
  }, [product_id]);

  const bulkPriceQuantityRange = async (product_id) => {
    const response = await loadBulkProductsPrice(product_id);
    setBulkPriceQuantity(response.bulkPrices.Configuration.QuantityRanges);
    setLoading(false);
  };

  const alertForQuantity = (e) => {
    e.preventDefault();
    swal({
      text: "Add your quantity first!",
      icon: "warning",
      buttons: "Ok, Understood",
    });
  };

  const addToWishlist = (e, product) => {
    e.preventDefault();
    props.productAddToWishlist(product);
  };

  // decide what is render for bulk product
  let bulkProductContent = null;
  if (loading) {
    bulkProductContent = <CardSkelton />;
  }
  if (!loading && bulkPriceQuantity.length > 0) {
    bulkProductContent = <PriceRange totalQty={totalQty} bulkPriceQuantity={bulkPriceQuantity} />;
  }
  return (
    <div className='product-details-top'>
      <h1
        className='product-title'
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

      <div className='row'>
        <div className='col-md-6'>
          <MediaPart activeImg={activeImg} setActiveImg={setActiveImg} product={product} />
        </div>
        {/* End .col-md-6 */}
        <div className='col-md-6'>
          <div className='product-details'>
            <AppOffer />
            {bulkProductContent}
            {_.isArray(firstConfigurators) &&
              firstConfigurators.map((singleConfig, index) => (
                <SingleAttributeGroup
                  key={index}
                  singleConfig={singleConfig}
                  ConfigAttributes={ConfigAttributes}
                />
              ))}
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
              ConfiguredItems={ConfiguredItems}
            />
            <AirFilter />
            <div className='details-filter-row'>
              <ProductSummary product={product} general={general} />
            </div>

            {/* End .details-filter-row */}

            <div className='product-details-action'>
              <div class='flexRow' style={{ marginTop: "20px", flexWrap: "wrap" }}>
                <div>
                  <a href={"/add-to-wishlist"} onClick={(e) => addToWishlist(e, product)}>
                    <div
                      className='imageBt bt ripple disabled mobilefont'
                      style={{
                        width: "auto",
                        height: "auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "auto",
                      }}
                    >
                      <BsHeart style={{ fontSize: "16px" }} />
                      <span className='ml01'>Save</span>
                    </div>
                  </a>
                </div>
                <div style={{ marginLeft: "0.75rem", marginRight: "0.75rem" }}>
                  <a href={"/add-to-wishlist"} onClick={(e) => addToWishlist(e, product)}>
                    <div
                      className='imageBt bt ripple disabled mobilefont'
                      style={{
                        width: "auto",
                        height: "auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "auto",
                      }}
                    >
                      <BsFillCartDashFill style={{ fontSize: "16px" }} />
                      <span className='ml01'>Add to cart</span>
                    </div>
                  </a>
                </div>

                {Number(activeProduct.totalQty) > 0 ? (
                  <div>
                    <Link to='/checkout'>
                      <div
                        className='imageBt bt ripple disabled mobilefont'
                        style={{
                          height: "auto",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "auto",
                        }}
                      >
                        <BsCart3 style={{ fontSize: "16px" }} />
                        <span className='ml01'>Buy Now</span>
                      </div>
                    </Link>
                  </div>
                ) : (
                  <div>
                    <a href={"/buy-now"} onClick={(e) => alertForQuantity(e)}>
                      <div
                        className='imageBt bt ripple disabled mobilefont'
                        style={{
                          height: "auto",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "auto",
                        }}
                      >
                        <BsCart3 style={{ fontSize: "16px" }} />
                        <span className='ml01'>Buy Now</span>
                      </div>
                    </a>
                  </div>
                )}
              </div>

              {/* <a
                href={"/add-to-wishlist"}
                onClick={(e) => addToWishlist(e, product)}
                className='btn-product btn-wishlist'
              >
                <span>Save</span>
              </a>
              <a
                href={"/add-to-wishlist"}
                onClick={(e) => addToWishlist(e, product)}
                className='btn-product btn-cart'
                style={{ marginLeft: "10px" }}
              >
                <span>Add To Cart</span>
              </a>
              {Number(activeProduct.totalQty) > 0 ? (
                <Link
                  to='/checkout'
                  className='btn-product btn-cart'
                  style={{ background: "#9b9b9b", marginLeft: "10px" }}
                >
                  <span>Buy Now</span>
                </Link>
              ) : (
                <a
                  href={"/buy-now"}
                  onClick={(e) => alertForQuantity(e)}
                  className='btn-product btn-cart'
                  style={{ marginLeft: "10px" }}
                >
                  <span>Buy Now</span>
                </a>
              )} */}
            </div>

            {/* End .product-details-action */}

            {/* group data */}
            <div className='mt2 groupData'>
              <div>
                <b>Product Code: </b>
                <span>abb-589157047512</span>
              </div>
              <div>
                <b>Category: </b>
                <span>Printed circuit boards</span>
              </div>
              <div>
                <b>Total Sold: </b>
                <span>6090656</span>
              </div>
              <div>
                <b>Seller Score: </b>
                <span>10/10</span>
              </div>
              <div class='flexRow' style={{ marginTop: "20px", flexWrap: "wrap" }}>
                <div>
                  <Link to='/'>
                    <div
                      className='imageBt bt ripple disabled mobilefont'
                      style={{
                        width: "auto",
                        height: "auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "auto",
                      }}
                    >
                      <AiOutlineShopping style={{ fontSize: "16px" }} />
                      <span className='ml01'>Visit Seller Store</span>
                    </div>
                  </Link>
                </div>
                <div style={{ marginLeft: "0.75rem", marginRight: "0.75rem" }}>
                  <Link to='/'>
                    <div
                      className='imageBt bt ripple disabled mobilefont'
                      style={{
                        width: "auto",
                        height: "auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "auto",
                      }}
                    >
                      <RiGroupLine style={{ fontSize: "16px" }} />
                      <span className='ml01'>Add to cart</span>
                    </div>
                  </Link>
                </div>
                <div>
                  <Link to='/'>
                    <div
                      className='imageBt bt ripple disabled mobilefont'
                      style={{
                        width: "auto",
                        height: "auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "auto",
                      }}
                    >
                      <BsImage style={{ fontSize: "16px" }} />
                      <span className='ml01'>Image Search</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <div className='product-details-footer'>
              <div className='social-icons social-icons-sm'>
                <a href={general.facebook} className='social-icon' title='Facebook' target='_blank'>
                  <svg viewBox='0 0 64 64' width='32' height='32'>
                    <circle cx='32' cy='32' r='31' fill='#3b5998'></circle>
                    <path
                      d='M34.1,47V33.3h4.6l0.7-5.3h-5.3v-3.4c0-1.5,0.4-2.6,2.6-2.6l2.8,0v-4.8c-0.5-0.1-2.2-0.2-4.1-0.2 c-4.1,0-6.9,2.5-6.9,7V28H24v5.3h4.6V47H34.1z'
                      fill='white'
                    ></path>
                  </svg>
                </a>
                <a
                  href={`https://www.facebook.com/share.php?u=https://aliba-int.com/product/${product.Id}&title=${product.Title}`}
                  className='social-icon'
                  title='Facebook'
                  target='_blank'
                >
                  <svg viewBox='0 0 64 64' width='32' height='32'>
                    <circle cx='32' cy='32' r='31' fill='#00aced'></circle>
                    <path
                      d='M48,22.1c-1.2,0.5-2.4,0.9-3.8,1c1.4-0.8,2.4-2.1,2.9-3.6c-1.3,0.8-2.7,1.3-4.2,1.6 C41.7,19.8,40,19,38.2,19c-3.6,0-6.6,2.9-6.6,6.6c0,0.5,0.1,1,0.2,1.5c-5.5-0.3-10.3-2.9-13.5-6.9c-0.6,1-0.9,2.1-0.9,3.3 c0,2.3,1.2,4.3,2.9,5.5c-1.1,0-2.1-0.3-3-0.8c0,0,0,0.1,0,0.1c0,3.2,2.3,5.8,5.3,6.4c-0.6,0.1-1.1,0.2-1.7,0.2c-0.4,0-0.8,0-1.2-0.1 c0.8,2.6,3.3,4.5,6.1,4.6c-2.2,1.8-5.1,2.8-8.2,2.8c-0.5,0-1.1,0-1.6-0.1c2.9,1.9,6.4,2.9,10.1,2.9c12.1,0,18.7-10,18.7-18.7 c0-0.3,0-0.6,0-0.8C46,24.5,47.1,23.4,48,22.1z'
                      fill='white'
                    ></path>
                  </svg>
                </a>
                <a
                  class='social-icon'
                  href={`fb-messenger://share/?link=https://www.aliba-int.com/product/${product.Id}`}
                  data-action='share/messenger/share'
                  target='blank'
                >
                  <svg viewBox='0 0 64 64' width='32' height='32'>
                    <circle cx='32' cy='32' r='31' fill='#25D366'></circle>
                    <path
                      d='m42.32286,33.93287c-0.5178,-0.2589 -3.04726,-1.49644 -3.52105,-1.66732c-0.4712,-0.17346 -0.81554,-0.2589 -1.15987,0.2589c-0.34175,0.51004 -1.33075,1.66474 -1.63108,2.00648c-0.30032,0.33658 -0.60064,0.36247 -1.11327,0.12945c-0.5178,-0.2589 -2.17994,-0.80259 -4.14759,-2.56312c-1.53269,-1.37217 -2.56312,-3.05503 -2.86603,-3.57283c-0.30033,-0.5178 -0.03366,-0.80259 0.22524,-1.06149c0.23301,-0.23301 0.5178,-0.59547 0.7767,-0.90616c0.25372,-0.31068 0.33657,-0.5178 0.51262,-0.85437c0.17088,-0.36246 0.08544,-0.64725 -0.04402,-0.90615c-0.12945,-0.2589 -1.15987,-2.79613 -1.58964,-3.80584c-0.41424,-1.00971 -0.84142,-0.88027 -1.15987,-0.88027c-0.29773,-0.02588 -0.64208,-0.02588 -0.98382,-0.02588c-0.34693,0 -0.90616,0.12945 -1.37736,0.62136c-0.4712,0.5178 -1.80194,1.76053 -1.80194,4.27186c0,2.51134 1.84596,4.945 2.10227,5.30747c0.2589,0.33657 3.63497,5.51458 8.80262,7.74113c1.23237,0.5178 2.1903,0.82848 2.94111,1.08738c1.23237,0.38836 2.35599,0.33657 3.24402,0.20712c0.99159,-0.15534 3.04985,-1.24272 3.47963,-2.45956c0.44013,-1.21683 0.44013,-2.22654 0.31068,-2.45955c-0.12945,-0.23301 -0.46601,-0.36247 -0.98382,-0.59548m-9.40068,12.84407l-0.02589,0c-3.05503,0 -6.08417,-0.82849 -8.72495,-2.38189l-0.62136,-0.37023l-6.47252,1.68286l1.73463,-6.29129l-0.41424,-0.64725c-1.70875,-2.71846 -2.6149,-5.85116 -2.6149,-9.07706c0,-9.39809 7.68934,-17.06155 17.15993,-17.06155c4.58253,0 8.88029,1.78642 12.11655,5.02268c3.23625,3.21036 5.02267,7.50812 5.02267,12.06476c-0.0078,9.3981 -7.69712,17.06155 -17.14699,17.06155m14.58906,-31.58846c-3.93529,-3.80584 -9.1133,-5.95471 -14.62789,-5.95471c-11.36055,0 -20.60848,9.2065 -20.61625,20.52564c0,3.61684 0.94757,7.14565 2.75211,10.26282l-2.92557,10.63564l10.93337,-2.85309c3.0136,1.63108 6.4052,2.4958 9.85634,2.49839l0.01037,0c11.36574,0 20.61884,-9.2091 20.62403,-20.53082c0,-5.48093 -2.14111,-10.64081 -6.03239,-14.51915'
                      fill='white'
                    ></path>
                  </svg>
                </a>
                <a
                  class='social-icon'
                  href={`fb-messenger://share/?link=https://www.aliba-int.com/product/${product.Id}`}
                  data-action='share/messenger/share'
                  target='blank'
                >
                  <svg viewBox='0 0 64 64' width='32' height='32'>
                    <circle cx='32' cy='32' r='31' fill='#7f7f7f'></circle>
                    <path
                      d='M17,22v20h30V22H17z M41.1,25L32,32.1L22.9,25H41.1z M20,39V26.6l12,9.3l12-9.3V39H20z'
                      fill='white'
                    ></path>
                  </svg>
                </a>
                {/* <div
                  class='bt'
                  style={{
                    borderRadius: "64px",
                    width: "80px",
                    height: "31px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <FaRegCopy />
                  <span style={{ fontSize: "14px", marginLeft: "0.5rem" }}>Copy</span>
                </div> */}
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

export default connect(mapStateToProps, { productAddToWishlist })(withRouter(ProductBody));
