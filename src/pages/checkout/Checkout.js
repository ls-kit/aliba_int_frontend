import React, { useEffect, useState } from "react";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import { connect } from "react-redux";
import { loadGeneral } from "../../store/actions/InitAction";
import { authLogout } from "../../store/actions/AuthAction";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { getSetting, goPageTop } from "../../utils/Helpers";
import {
  numberWithCommas,
  cartCheckedProductTotal,
  calculateAirShippingCharge,
  findProductCartFromState,
  totalPriceWithoutShippingCharge,
} from "../../utils/CartHelpers";
import { configAttrToConfigured } from "../../utils/GlobalStateControl";
import CheckoutSidebar from "./includes/CheckoutSidebar";

import swal from "sweetalert";
import TableConfigItems from "./includes/TableConfigItems";
import TablePlainItem from "./includes/TablePlainItem";
import { useLayoutEffect } from "react";

const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }

    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
};

const Checkout = (props) => {
  const { cartConfigured, general } = props;
  const [allCheck, setAllCheck] = useState(false);

  const currency = getSetting(general, "currency_icon");
  //   const ShippingCharges = getSetting(general, "air_shipping_charges");
  const ShippingCharges = getSetting(general, "china_local_delivery_charge");
  const chinaLocalShippingChargeLimit = getSetting(general, "china_local_delivery_charge_limit");
  const totalPriceWithoutShipping = totalPriceWithoutShippingCharge(cartConfigured);
  console.log("totalPriceWithoutShipping", totalPriceWithoutShipping);

  const getChinaLocalShippingCost = (totalPrice) => {
    let localShippingCost = ShippingCharges;
    localShippingCost = Number(totalPrice) >= chinaLocalShippingChargeLimit ? 0 : localShippingCost;
    return Number(localShippingCost);
  };

  useEffect(() => {
    checkedAllItem();
  }, []);

  useEffect(() => {
    goPageTop();
  }, []);

  const removeItemFromCart = (e) => {
    e.preventDefault();
    swal({
      title: "Are you want to remove?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        let modified = cartConfigured.map((mapItem) => {
          let ConfiguredItems = mapItem.ConfiguredItems.map((mapConfig) =>
            !mapConfig.isChecked ? mapConfig : { notFound: true }
          );
          ConfiguredItems = ConfiguredItems.filter((filter) => filter.notFound !== true);
          if (ConfiguredItems.length > 0) {
            return { ...mapItem, ConfiguredItems: ConfiguredItems };
          }
          return { notFound: true };
        });
        modified = modified.filter((filter) => filter.notFound !== true);
        configAttrToConfigured(modified);
      }
    });
  };

  const totalShippingCost = (product, isChecked = false) => {
    let returnValue = 0;
    if (isChecked) {
      const checkItemSubTotal = cartCheckedProductTotal(product);
      const totalPrice = checkItemSubTotal.totalPrice;
      returnValue = getChinaLocalShippingCost(totalPrice);
    }
    return returnValue;
  };

  const productTotalCost = (product, isChecked) => {
    const checkItemSubTotal = cartCheckedProductTotal(product);
    const totalPrice = checkItemSubTotal.totalPrice;
    const ShippingCost = totalShippingCost(product, isChecked);
    return Number(totalPrice) + Number(ShippingCost);
  };
  const configuredProductTotalCost = (product, config, isChecked) => {
    const totalPrice = config.Price * config.Quantity;
    const ShippingCost = totalShippingCost(product, isChecked);
    return Number(totalPrice) + Number(ShippingCost);
  };

  const checkedAllItem = () => {
    const checking = !allCheck;
    setAllCheck(checking);
    let modified = cartConfigured.map((product) => {
      let ConfiguredItems = product.ConfiguredItems.map((configMap) => {
        return { ...configMap, isChecked: checking };
      });
      return { ...product, ConfiguredItems: ConfiguredItems, isChecked: checking };
    });
    configAttrToConfigured(modified);
  };

  let [width, height] = useWindowSize();

  width = width ? width : window.innerWidth;

  const checkboxToggle = (product) => {
    let updatedProduct = { ...product, isChecked: !product.isChecked };

    let modified = cartConfigured.map((mapItem) =>
      mapItem.Id === updatedProduct.Id ? updatedProduct : mapItem
    );
    configAttrToConfigured(modified);
  };

  return (
    <main className='main'>
      <Breadcrumb current='Checkout' />

      <div className='page-content'>
        <div className='cart'>
          <div className='container'>
            <div className='row'>
              <div className='col-lg-9'>
                <div className='card'>
                  <div className='checkTable table-responsive-sm '>
                    <table className='table table table-cart'>
                      <thead>
                        <tr>
                          <th className='text-start'>
                            <input
                              type='checkbox'
                              checked={allCheck}
                              onChange={(e) => checkedAllItem()}
                              name='checked_all'
                            />
                          </th>
                          <th colSpan={2}>
                            <span>Product</span>
                            <a
                              href='/remove'
                              onClick={(e) => removeItemFromCart(e)}
                              title='Remove'
                              className='cart-remove'
                            >
                              Remove
                            </a>
                          </th>
                          <th className='text-center totalWi'>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartConfigured.length > 0 ? (
                          <>
                            {cartConfigured.map((product, index) => {
                              return (
                                <>
                                  {product.hasConfigurators ? (
                                    <tr>
                                      <td className='text-start'>
                                        <input
                                          type='checkbox'
                                          name='checked_all'
                                          id='checked_item'
                                          checked={product.isChecked}
                                          onChange={(event) => checkboxToggle(product)}
                                        />
                                      </td>
                                      <td className='text-center mainImg'>
                                        {
                                          <figure className='m-0'>
                                            <Link to={`/product/${product.Id}`}>
                                              <img src={product.MainPictureUrl} alt={product.Title} />
                                            </Link>
                                          </figure>
                                        }
                                      </td>
                                      <td>
                                        <div className='product-title mb-0 bb-0'>
                                          <Link
                                            className='dotText bold'
                                            to={`/product/${product.Id}`}
                                            title={product.Title}
                                          >
                                            {product.Title}
                                          </Link>
                                        </div>
                                        <div>
                                          {product.ConfiguredItems.map((config, index2) => (
                                            <div className='singleVariant'>
                                              <TableConfigItems
                                                key={index2}
                                                currency={currency}
                                                product={product}
                                                config={config}
                                                cartConfigured={cartConfigured}
                                                ShippingCharges={ShippingCharges}
                                                general={general}
                                                width={width}
                                              />
                                            </div>
                                          ))}
                                        </div>
                                      </td>
                                      <td className='align-middle text-center bold'>{`${currency} ${numberWithCommas(
                                        productTotalCost(product)
                                      )}`}</td>
                                    </tr>
                                  ) : (
                                    <>
                                      <TablePlainItem
                                        currency={currency}
                                        product={product}
                                        cartConfigured={cartConfigured}
                                        ShippingCharges={ShippingCharges}
                                        general={general}
                                        width={width}
                                      />

                                      <tr key={index + 1}>
                                        <td colSpan={3} className='text-right bold'>
                                          Sub Total:
                                        </td>
                                        <td className='text-center'>{`${currency} ${numberWithCommas(
                                          productTotalCost(product)
                                        )}`}</td>
                                      </tr>
                                    </>
                                  )}
                                </>
                              );
                            })}
                            <tr>
                              <td colSpan={3} className='text-right bold'>
                                China Local Shipping cost:
                              </td>
                              <td className='text-center bold'>{`${currency} ${numberWithCommas(
                                getChinaLocalShippingCost(totalPriceWithoutShipping)
                              )}`}</td>
                            </tr>
                          </>
                        ) : (
                          <tr>
                            <td colSpan={4} className='text-center bg-lighter'>
                              You have no cart!
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/* End .col-lg-9 */}

              <CheckoutSidebar currency={currency} ShippingCharges={ShippingCharges} />

              {/* End .col-lg-3 */}
            </div>
            {/* End .row */}
          </div>
          {/* End .container */}
        </div>
        {/* End .cart */}
      </div>
      {/* End .page-content */}
    </main>
  );
};

Checkout.propTypes = {
  general: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  cartConfigured: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  general: JSON.parse(state.INIT.general),
  user: state.AUTH.user,
  cartConfigured: state.CART.configured,
});

export default connect(mapStateToProps, { loadGeneral, authLogout })(withRouter(Checkout));
