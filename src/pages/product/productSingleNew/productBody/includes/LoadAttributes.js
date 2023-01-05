import _ from "lodash";
import React from "react";
import PropTypes from "prop-types";
import {
  configAttrToConfigured,
  selectedActiveAttributes,
  selectedActiveConfiguredItems,
} from "../../../../../utils/GlobalStateControl";
import {
  activeProductAllConfigurators,
  checkExistConfiguredItem,
  colorAttributes,
  ConfiguratorAttributes,
  findProductCartFromState,
  getCartConfiguredItems,
  getCartSelectedConfig,
  getProductAttributes,
  getProductGroupedAttributes,
  getProductKeyItem,
  matchAttributesConfigurator,
} from "../../../../../utils/CartHelpers";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const LoadAttributes = (props) => {
  const { product, ConfiguredItems, colorAttributes, cartAttribute, cartConfigured } = props;

  if (_.isEmpty(colorAttributes)) {
    return false;
  }

  const groupBy = getProductGroupedAttributes(colorAttributes);
  const groupItems = () => {
    let returnGroup = [];

    for (const property in groupBy) {
      returnGroup.push(property);
    }
    return returnGroup;
  };

  const getGroupAllAttributes = (PropertyName) => {
    const Property = groupBy[PropertyName];
    return !_.isEmpty(Property) && _.isArray(Property) ? Property : [];
  };

  const selectAttribute = (e, Attribute) => {
    e.preventDefault();
    selectedActiveAttributes(Attribute);
  };

  const isSelect = (Attribute) => {
    if (!_.isEmpty(cartAttribute)) {
      return cartAttribute.Pid === Attribute.Pid && cartAttribute.Vid === Attribute.Vid;
    }
    return false;
  };

  const setFirstAttributes = (index2, Attribute) => {
    if (index2 === 0) {
      if (_.isEmpty(cartAttribute)) {
        selectedActiveAttributes(Attribute);
      }
    }
  };

  const selectedColor = (PropertyName) => {
    const color = getGroupAllAttributes(PropertyName).find((Attribute) => isSelect(Attribute));
    return color;
  };

  return (
    <div>
      {groupItems().map((PropertyName, index) => (
        <div key={index} className='details-filter-row details-row-size'>
          <label style={{ fontWeight: "bold" }}>
            {PropertyName}:{selectedColor(PropertyName)?.Value || ""}
          </label>
          <div className='product-nav product-nav-thumbs'>
            {getGroupAllAttributes(PropertyName).map((Attribute, index2) => (
              <a
                href={`/select`}
                key={index2}
                onClick={(e) => selectAttribute(e, Attribute)}
                className={`subImages text-center ${isSelect(Attribute) ? "isSelect" : ""} ${
                  Attribute.MiniImageUrl ? "hasImage" : "noImage"
                }`}
                title={Attribute.Value && Attribute.Value}
              >
                {setFirstAttributes(index2, Attribute)}
                {Attribute.MiniImageUrl ? (
                  <img
                    src={Attribute.MiniImageUrl}
                    onClick={() => props.setActiveImg(Attribute.ImageUrl)}
                    alt={Attribute.Value}
                    style={{ width: "3.5rem" }}
                  />
                ) : (
                  Attribute.Value
                )}
                {/* {!_.isEmpty(activeCartProduct) && <span class='count'>{activeCartProduct.Quantity}</span>} */}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

LoadAttributes.propTypes = {
  product: PropTypes.object.isRequired,
  general: PropTypes.object.isRequired,
  ConfigAttributes: PropTypes.array.isRequired,
  ConfiguredItems: PropTypes.array.isRequired,
  cartAttribute: PropTypes.array.isRequired,
  cartConfigured: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  cartAttribute: state.CART.Attribute,
  cartConfigured: state.CART.configured,
});

export default connect(mapStateToProps, {})(withRouter(LoadAttributes));
