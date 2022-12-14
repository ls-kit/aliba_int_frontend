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
import CopyToClipboard from "react-copy-to-clipboard";

const ProductBody = (props) => {
  const { product, general, cartConfigured, ConfiguredItems } = props;

  const product_id = !_.isEmpty(product) ? product.Id : 0;
  const firstConfigurators = findFirstConfigurators(ConfiguredItems);
  const ConfigAttributes = ConfiguratorAttributes(product);
  const colorAttributes = getColorAttributes(ConfigAttributes);
  const copyText = window.location.href;
  let activeProduct = findProductCartFromState(cartConfigured, product_id);
  // const totalQty = cartConfigured[0] ? cartConfigured[0]?.totalQty : 0;
  const totalQty = activeProduct.totalQty;
  const [activeImg, setActiveImg] = useState("");
  const [bulkPriceQuantity, setBulkPriceQuantity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copy, setCopy] = useState(false);

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
  // let bulkProductContent = null;
  // if (loading) {
  //   bulkProductContent = <CardSkelton />;
  // }
  // if (!loading && bulkPriceQuantity.length > 1) {
  //   bulkProductContent = (
  //     <PriceRange
  //       product={product}
  //       general={general}
  //       totalQty={totalQty}
  //       bulkPriceQuantity={bulkPriceQuantity}
  //     />
  //   );
  // }

  const onCopy = () => {
    setCopy(true);
  };

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
          <div className='product-details' id='hello'>
            <AppOffer />
            {/* {bulkProductContent} */}
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
              totalQtyInCart={totalQty}
              bulkPriceQuantity={bulkPriceQuantity}
            />
            {/* <AirFilter /> */}
            <div className='details-filter-row'>
              <ProductSummary product={product} general={general} />
            </div>

            {/* End .details-filter-row */}

            <div className='product-details-action'>
              {/* <div class='flexRow' style={{ marginTop: "20px", flexWrap: "wrap" }}>
                <div className='pd-btn'>
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
                <div className='pd-btn' style={{ marginLeft: "0.75rem", marginRight: "0.75rem" }}>
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
                  <div className='pd-btn'>
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
                  <div className='pd-btn'>
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
              </div> */}

              <a
                href={"/add-to-wishlist"}
                onClick={(e) => addToWishlist(e, product)}
                className='btn-product btn-wishlist'
              >
                <span>Save</span>
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
              )}
            </div>

            {/* End .product-details-action */}

            {/* group data */}
            <div className='mt2 groupData'>
              <div>
                <b>Product Code: </b>
                <span>{product_id}</span>
              </div>
              {/* <div>
                <b>Category: </b>
                <span>Printed circuit boards</span>
              </div> */}
              {/* <div>
                <b>Total Sold: </b>
                <span>{product.total_sold}</span>
              </div>
              <div>
                <b>Seller Score: </b>
                <span>10/10</span>
              </div> */}
              <div class='flexRow' style={{ marginTop: "20px", flexWrap: "wrap" }}>
                <div>
                  <Link to={`/seller/${product.VendorId}?page=1`}>
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
                {/* <div style={{ marginLeft: "0.75rem", marginRight: "0.75rem" }}>
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
                      <span className='ml01'>View Sellers</span>
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
                </div> */}
              </div>
            </div>

            <div className='product-details-footer'>
              <div className='social-icons social-icons-sm'>
                <span className='social-label'>Share:</span>
                <a
                  href={`https://www.facebook.com/share.php?u=https://1688cart.com/product/${product.Id}&title=${product.Title}`}
                  className='social-icon'
                  title='Facebook'
                  target='_blank'
                >
                  <i className='icon-facebook-f' />
                </a>
                <a
                  href={`https://www.messenger.com/`}
                  className='social-icon'
                  title='Messenger'
                  target='_blank'
                >
                  <i className='icon-facebook-messenger' />
                </a>
                <a
                  href={`https://web.whatsapp.com/`}
                  className='social-icon'
                  title='Whatsapp'
                  target='_blank'
                >
                  <i className='icon-whatsapp' />
                </a>
                <a
                  class='social-icon'
                  href={`https://mail.google.com/mail/u/0/#inbox?compose=new=https://1688cart.com/product/${product.Id}`}
                  data-action='share/messenger/share'
                  target='blank'
                >
                  <i class='icon-envelope' />
                </a>
                <div>
                  <CopyToClipboard onCopy={onCopy} text={copyText}>
                    <button
                      class='bt copyLink'
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
                      <span style={{ fontSize: "14px", marginLeft: "0.5rem" }}>
                        {copy ? "Copied " : "Copy"}
                      </span>
                    </button>
                  </CopyToClipboard>
                </div>
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
