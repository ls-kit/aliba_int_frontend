import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import { getSetting } from "../../../../../utils/Helpers";
import { findProductCartFromState, numberWithCommas } from "../../../../../utils/CartHelpers";

const ProductSummary = (props) => {
  const { product, general, cartConfigured } = props;
  const product_id = !_.isEmpty(product) ? product.Id : "";
  const activeCartProduct = findProductCartFromState(cartConfigured, product_id);

  const currency = getSetting(general, "currency_icon");
  const china_to_bd_bottom_message = getSetting(general, "china_to_bd_bottom_message");

  const totalWeight = activeCartProduct.totalWeight;
  const totalPrice = activeCartProduct.totalPrice;
  const totalQty = activeCartProduct.totalQty;
  const DeliveryCost = activeCartProduct.DeliveryCost;
  const ShippingRate = activeCartProduct.ShippingRate;
  const totalShippingCost = () => {
    let weightCharge = Number(totalWeight) * Number(ShippingRate);
    weightCharge = weightCharge < 100 ? 100 : weightCharge;
    return Number(DeliveryCost) + weightCharge;
  };

  const productTotalCost = () => {
    return Number(totalPrice) + totalShippingCost();
  };

  return (
    <table className='table table-sm table-bordered product_summary_table'>
      <tbody>
        <tr>
          <td className='bg-gray text-center' colSpan={2}>
            <b>CHINA TO BANGLADESH</b>
          </td>
        </tr>
        <tr>
          <td style={{ width: "65%" }}>Total Quantity:</td>
          <td>{`${totalQty || 0}`}</td>
        </tr>
        <tr>
          <td>Product Price:</td>
          <td>{`${currency} ${numberWithCommas(totalPrice)}`}</td>
        </tr>
        {/*<tr>*/}
        {/*   <td>Approx. Weight:</td>*/}
        {/*   <td>{totalWeight || '0.000'} kg</td>*/}
        {/*</tr>*/}
        <tr>
          <td>China to BD Shipping cost:</td>
          <td>{`${currency} ${numberWithCommas(totalShippingCost())}`}</td>
        </tr>
        <tr>
          <td>Total Products Price:</td>
          <td>{`${currency} ${numberWithCommas(productTotalCost())}`}</td>
        </tr>
        <tr>
          <td colSpan={2}>{china_to_bd_bottom_message}</td>
        </tr>
        <tr>
          <td colSpan={2}>
            <span>
              উপরে উল্লেখিত মুল্য শুধুমাত্র চায়না থেকে বাংলাদেশে আসার ক্রয়মুল্য, পণ্য আসার পর লোকাল শিপিং
              চার্জ আলাদা যোগ হবে।
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

ProductSummary.propTypes = {
  general: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  cartConfigured: state.CART.configured,
});

export default connect(mapStateToProps, {})(withRouter(ProductSummary));
