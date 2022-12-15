import _ from "lodash";
import { configAttrToConfigured } from "./GlobalStateControl";

export const getLocalCart = () => {
  const data = window.localStorage.getItem("_configured");
  return !_.isNaN(data) ? JSON.parse(data) : [];
};

export const storelocalCart = (cartData) => {
  if (!_.isEmpty(cartData)) {
    window.localStorage.setItem("_configured", JSON.stringify(cartData));
  } else {
    destroyLocalCart();
  }
  return getLocalCart();
};

export const destroyLocalCart = () => {
  window.localStorage.removeItem("_configured");
  return getLocalCart();
};

export const getProductKeyItem = (product, keyName, returnDefault = null) => {
  if (!_.isEmpty(product) && _.isObject(product)) {
    return product[keyName];
  }
  return returnDefault;
};

export const find_product_from_state = (detailsState, item_id) => {
  if (!_.isEmpty(detailsState) && _.isArray(detailsState)) {
    const findItem = detailsState.find((findItem) => findItem.Id === item_id);
    if (!_.isEmpty(findItem) && _.isObject(findItem)) {
      return findItem;
    }
  }
  return {};
};

export const findProductCartFromState = (oldConfigured, product_id) => {
  if (_.isArray(oldConfigured)) {
    const findItem = oldConfigured.find((findItem) => findItem.Id === product_id);
    return !_.isEmpty(findItem) ? findItem : {};
  }
  return {};
};

export const numberWithCommas = (numericDtaa) => {
  if (numericDtaa) {
    let floatNum = Number(numericDtaa).toFixed(2);
    return floatNum.toString().split(".")[0].length > 3
      ? floatNum
          .toString()
          .substring(0, floatNum.toString().split(".")[0].length - 3)
          .replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
          "," +
          floatNum.toString().substring(floatNum.toString().split(".")[0].length - 3)
      : floatNum.toString();
  }
  return "0.00";
};

export const findOldConfiguredExpectCurrent = (findItem, selectedConfig) => {
  if (_.isObject(selectedConfig) && _.isObject(findItem)) {
    if (!_.isEmpty(selectedConfig) && !_.isEmpty(findItem)) {
      return findItem.ConfiguredItems.filter((filter) => filter.Id !== selectedConfig.Id);
    }
  }
  return [];
};

export const findOldCartItemExpectCurrent = (oldConfigured, productId) => {
  if (!_.isArray(oldConfigured) && !_.isEmpty(oldConfigured)) {
    return oldConfigured.filter((filter) => filter.Id !== productId);
  }
  return [];
};

export const getProductAttributes = (product) => {
  if (_.isObject(product)) {
    const Attributes = product.Attributes;
    return _.isArray(Attributes) ? Attributes : [];
  }
  return [];
};

export const getProductGroupedAttributes = (Attributes) => {
  if (!_.isEmpty(Attributes) && _.isArray(Attributes)) {
    return _.groupBy(Attributes, "PropertyName");
  }
  return {};
};

export const GetOriginalPriceFromPrice = (Price, rate) => {
  let sellPrice = 0;

  if (!_.isEmpty(Price)) {
    if (_.isObject(Price)) {
      sellPrice = Number(Price.OriginalPrice) * Number(rate);
    }
    if (_.isArray(Price)) {
      sellPrice = Number(Price[0].OriginalPrice) * Number(rate);
    }
  }
  return _.round(sellPrice);
};

export const getUpdatedProductPrice = (totalQtyInCart, bulkPriceQuantity, rate = 15) => {
  let sellPrice = 0;
  let first = bulkPriceQuantity[0];
  let second = bulkPriceQuantity[1];
  let third = bulkPriceQuantity[2];

  let firstMinQuantityPrice = bulkPriceQuantity[0]?.Price.Base;
  let secondMinQuantityPrice = bulkPriceQuantity[1]?.Price.Base;
  let thirdMinQuantityPrice = bulkPriceQuantity[2]?.Price.Base;

  // if (!totalQtyInCart) {
  //   return GetOriginalPriceFromPrice({ OriginalPrice: firstMinQuantityPrice }, rate);
  // } else {
  //   if (totalQtyInCart > 0 && totalQtyInCart <= first?.MaxQuantity) {
  //     return GetOriginalPriceFromPrice({ OriginalPrice: firstMinQuantityPrice }, rate);
  //   } else if (totalQtyInCart < second?.MaxQuantity && totalQtyInCart > second?.MinQuantity) {
  //     return GetOriginalPriceFromPrice({ OriginalPrice: secondMinQuantityPrice }, rate);
  //   } else if (totalQtyInCart < third?.MaxQuantity && totalQtyInCart > third?.MinQuantity) {
  //     return GetOriginalPriceFromPrice({ OriginalPrice: thirdMinQuantityPrice }, rate);
  //   }
  // }

  if (totalQtyInCart > 0 && totalQtyInCart <= first?.MaxQuantity) {
    return GetOriginalPriceFromPrice({ OriginalPrice: firstMinQuantityPrice }, rate);
  } else if (totalQtyInCart >= second?.MinQuantity && totalQtyInCart <= second?.MaxQuantity) {
    return GetOriginalPriceFromPrice({ OriginalPrice: secondMinQuantityPrice }, rate);
  } else if (totalQtyInCart >= third?.MinQuantity) {
    return GetOriginalPriceFromPrice({ OriginalPrice: thirdMinQuantityPrice }, rate);
  } else {
    return GetOriginalPriceFromPrice({ OriginalPrice: firstMinQuantityPrice }, rate);
  }

  return sellPrice;
};

/**
 *
 * @param product
 * @param rate
 * @param ConfiguredItem
 * @returns {number|*}
 */
export const getProductPrice = (product, rate = 15, ConfiguredItem = {}) => {
  let sellPrice = 0;
  if (!_.isEmpty(product)) {
    let Price = product.Price;
    let configuredId = null;
    if (!_.isEmpty(ConfiguredItem)) {
      Price = ConfiguredItem.Price;
      configuredId = ConfiguredItem.Id;
    }
    const Promotions = product.Promotions;
    if (!_.isEmpty(Promotions) && _.isArray(Promotions)) {
      Price = Promotions.map((promotion) => {
        const promoConfig = promotion.ConfiguredItems;
        const promoPrice = promotion.Price;
        if (_.isArray(promoConfig)) {
          const findPromoConfig = promotion.ConfiguredItems.find(
            (configFilter) => configFilter.Id === configuredId
          );
          return !_.isEmpty(findPromoConfig) ? findPromoConfig.Price : promoPrice;
        }
        return promoPrice;
      });
    }

    if (!_.isEmpty(Price)) {
      return GetOriginalPriceFromPrice(Price, rate);
    }
  }
  return sellPrice;
};

export const getDBProductPrice = (product, rate = 15, selectedConfig = {}) => {
  let sellPrice = 0;
  if (!_.isEmpty(product) && _.isObject(product)) {
    let Price = JSON.parse(product.Price);
    if (!_.isEmpty(Price)) {
      if (_.isObject(Price)) {
        sellPrice = Number(Price.OriginalPrice) * Number(rate);
      }
      if (_.isArray(Price)) {
        sellPrice = Number(Price[0].OriginalPrice) * Number(rate);
      }
      return _.round(sellPrice);
    }
  }
  return sellPrice;
};

/**
 *
 * @param words
 * @returns {boolean}
 */
export const is_colour = (words) => {
  if (words.indexOf("colour") >= 0) {
    return true;
  }
  if (words.indexOf("Colour") >= 0) {
    return true;
  }
  if (words.indexOf("color") >= 0) {
    return true;
  }
  return words.indexOf("Color") >= 0;
};

export const is_size = (words) => {
  if (words.indexOf("Size") >= 0) {
    return true;
  }
  if (words.indexOf("size") >= 0) {
    return true;
  }
  return false;
};

/**
 *
 * @param Attributes
 * @returns {*[]|*}
 */
export const getColorAttributes = (Attributes) => {
  if (!_.isEmpty(Attributes)) {
    return Attributes.filter((filter) => {
      if (filter.IsConfigurator === true) {
        return is_colour(filter.PropertyName);
      }
      return false;
    });
  }
  return [];
};

export const getSizeAttributes = (Attributes) => {
  if (!_.isEmpty(Attributes)) {
    return Attributes.filter((filter) => {
      if (filter.IsConfigurator === true) {
        return is_size(filter.PropertyName);
      }
      return false;
    });
  }
  return [];
};

export const findFirstConfigurators = (ConfiguredItems) => {
  return [];
  let FirstConfig = [];
  if (_.isArray(ConfiguredItems)) {
    let ConfiguredItem = ConfiguredItems.length > 0 ? ConfiguredItems[0] : {};
    if (!_.isEmpty(ConfiguredItem) && _.isObject(ConfiguredItem)) {
      FirstConfig = ConfiguredItem.Configurators;
    }
  }

  return FirstConfig;
};

/**
 *
 * @param Product
 * @returns {*[]|*}
 */
export const ConfiguratorAttributes = (Product) => {
  const Attributes = getProductAttributes(Product);
  if (Attributes.length > 0) {
    return Attributes.filter((filter) => filter.IsConfigurator === true);
  }
  return [];
};

/**
 *
 * @param product
 * @returns {*[]|any}
 * @constructor
 */
export const ConfiguredItems = (product) => {
  if (!_.isEmpty(product) && _.isObject(product)) {
    const configItems = product.ConfiguredItems;
    return !_.isEmpty(configItems) && _.isArray(configItems) ? configItems : [];
  }
  return [];
};

/**
 *
 * @param product
 * @param common
 * @returns {number|*}
 */
export const getProductApproxWeight = (product, common = 0) => {
  if (_.isObject(product)) {
    const PhysicalParameters = product.PhysicalParameters;
    if (!_.isEmpty(PhysicalParameters) && _.isObject(PhysicalParameters)) {
      const ManualWeight = PhysicalParameters.ManualWeight;
      if (ManualWeight) {
        return ManualWeight ? ManualWeight : common;
      }
      const weight = PhysicalParameters.ApproxWeight;
      return weight ? weight : common;
    }
  }
  return common;
};

export const getProductDeliveryCost = (product, rate = 15) => {
  let shipping = 0;
  if (!_.isEmpty(product) && _.isObject(product)) {
    // const HasInternalDelivery = product.HasInternalDelivery;
    const DeliveryCosts = product.DeliveryCosts;
    if (_.isArray(DeliveryCosts)) {
      const DeliveryCost = DeliveryCosts.length > 0 ? DeliveryCosts[0] : {};
      if (!_.isEmpty(DeliveryCost)) {
        const Price = DeliveryCost.Price;
        const OriginalPrice = !_.isEmpty(Price) ? Price.OriginalPrice : 0;
        shipping = (Number(OriginalPrice) * Number(rate)).toFixed(2);
      }
    }
  }
  return shipping;
};

export const getProductFeaturedValues = (product, keyName, common = 0) => {
  if (!_.isEmpty(product) && _.isObject(product)) {
    const FeaturedValues = product.FeaturedValues;
    if (!_.isEmpty(FeaturedValues) && _.isArray(FeaturedValues)) {
      const FeatureItem = FeaturedValues.find((find) => find.Name === keyName);
      return !_.isEmpty(FeatureItem) && _.isObject(FeatureItem) ? FeatureItem.Value : common;
    }
  }
  return common;
};

export const matchAttributesConfigurator = (selectAttributes = [], ConfiguredItems = []) => {
  const remakeAttributes = selectAttributes.map((item) => {
    return { Pid: item.Pid, Vid: item.Vid };
  });
  return ConfiguredItems.filter((filter) => {
    const difference = _.differenceWith(remakeAttributes, filter.Configurators, _.isEqual);
    return _.isEmpty(difference);
  });
};

export const getCartConfiguredItems = (cartConfigured, productId) => {
  if (!_.isEmpty(cartConfigured) && _.isArray(cartConfigured)) {
    const findItem = cartConfigured.find((find) => find.Id === productId);
    if (!_.isEmpty(findItem) && _.isObject(findItem)) {
      const ConfiguredItems = findItem.ConfiguredItems;
      return !_.isEmpty(ConfiguredItems) && _.isArray(ConfiguredItems) ? ConfiguredItems : [];
    }
  }
  return [];
};

export const getCartSelectedConfig = (ConfiguredItems) => {
  if (!_.isEmpty(ConfiguredItems) && _.isArray(ConfiguredItems)) {
    const returnKey = ConfiguredItems.length === 1 ? ConfiguredItems[0] : {};
    return !_.isEmpty(returnKey) && _.isObject(returnKey) ? returnKey : {};
  }
  return {};
};

export const activeProductAllConfigurators = (activeCartProduct) => {
  if (_.isObject(activeCartProduct)) {
    return !_.isEmpty(activeCartProduct) ? activeCartProduct.ConfiguredItems : [];
  }
  return [];
};

export const checkExistConfiguredItem = (activeCartProduct, product_id, selectConfigId) => {
  const activeConfiguredItems = activeProductAllConfigurators(activeCartProduct);
  const activeFind = activeConfiguredItems.find((find) => find.Id === selectConfigId);
  return !_.isEmpty(activeFind) ? activeFind : {};
};

export const calculateAirShippingCharge = (subTotal, shipping_charges) => {
  let charges = shipping_charges ? JSON.parse(shipping_charges) : [];
  let chargeAmount = 880;
  let dCharge = null;
  for (let i = 0; i < charges.length; i++) {
    dCharge = charges[i];
    if (dCharge.minimum <= subTotal && dCharge.maximum >= subTotal) {
      chargeAmount = dCharge.rate;
      break;
    }
  }
  return parseInt(chargeAmount);
};

// Customer cart calculation functions

export const cartProductTotal = (Product, ShippingCharges) => {
  let ConfiguredItems = Product.ConfiguredItems;
  let ApproxWeight = Product.ApproxWeight;
  let totalPrice = 0;
  let totalQty = 0;
  if (!_.isEmpty(ConfiguredItems)) {
    ConfiguredItems.map((summary) => {
      let Qty = Number(summary.Quantity);
      let Price = Number(summary.Price);
      totalQty += Qty;
      totalPrice += Price * Qty;
      return "";
    });
  }

  let ShippingRate = calculateAirShippingCharge(totalPrice, ShippingCharges);

  return {
    totalPrice: totalPrice,
    totalQty: totalQty,
    ShippingRate: ShippingRate,
    ApproxWeight: ApproxWeight,
    totalWeight: (Number(ApproxWeight) * Number(totalQty)).toFixed(3),
  };
};

export const cartProductTotalExceptConfiguredItems = (Product, ShippingCharges) => {
  let ApproxWeight = Product.ApproxWeight;
  let totalPrice = 0;
  let totalQty = 0;

  let Qty = Number(Product.Quantity);
  let Price = Number(Product.Price);
  totalQty += Qty;
  totalPrice += Price * Qty;

  let ShippingRate = calculateAirShippingCharge(totalPrice, ShippingCharges);

  return {
    totalPrice: totalPrice,
    totalQty: totalQty,
    ShippingRate: ShippingRate,
    ApproxWeight: ApproxWeight,
    totalWeight: (Number(ApproxWeight) * Number(totalQty)).toFixed(3),
  };
};

export const cartCheckedProductTotal = (Product) => {
  let ApproxWeight = Product.ApproxWeight;
  let totalPrice = 0;
  let totalQty = 0;
  if (Product.hasConfigurators) {
    let ConfiguredItems = Product.ConfiguredItems;
    ConfiguredItems = ConfiguredItems.filter((fitler) => fitler.isChecked === true);
    ConfiguredItems.map((summary) => {
      let Quantity = Number(summary.Quantity);
      let Price = Number(summary.Price);
      totalPrice += Price * Quantity;
      totalQty += Quantity;
      return summary;
    });
  } else {
    if (Product.isChecked === true) {
      let Quantity = Number(Product.Quantity);
      let Price = Number(Product.Price);
      totalPrice += Price * Quantity;
      totalQty += Quantity;
    }
  }
  let totalWeight = Number(ApproxWeight) * Number(totalQty);
  return { totalPrice: totalPrice, totalQty: totalQty, totalWeight: totalWeight };
};

export const cartColorAttributes = (attributes, product) => {
  if (_.isArray(attributes)) {
    return attributes.filter((filter) => filter.MiniImageUrl !== undefined);
  }
  return product.MainPictureUrl;
};

export const CartSizeAttributes = (attributes) => {
  if (_.isArray(attributes)) {
    return attributes.filter((filter) => filter.MiniImageUrl === undefined);
  }
  return [];
};

export const CartChinaShippingCost = (Product, ShippingCharges) => {
  let productTotal = cartProductTotal(Product);
  let DeliveryCost = Product.DeliveryCost ? Product.DeliveryCost : 0;
  let totalWeight = productTotal.totalWeight;
  let calculateCharge = calculateAirShippingCharge(productTotal.totalPrice, ShippingCharges);
  let totalCost = Number(DeliveryCost) + Number(totalWeight) * Number(calculateCharge);
  return Number(totalCost).toFixed(2);
};

export const CartCheckedChinaShippingCost = (Product, ShippingCharges) => {
  let productTotal = cartCheckedProductTotal(Product);
  let DeliveryCost = Product.DeliveryCost ? Product.DeliveryCost : 0;
  let totalWeight = productTotal.totalWeight;
  let calculateCharge = calculateAirShippingCharge(productTotal.totalPrice, ShippingCharges);
  let totalCost = Number(DeliveryCost) + Number(totalWeight) * Number(calculateCharge);
  return Number(totalCost).toFixed(2);
};

export const CartProductSubTotal = (Product, ShippingCharges) => {
  let productTotal = cartProductTotal(Product);
  let Subtotal = 0;
  if (!_.isEmpty(productTotal)) {
    let otherCost = CartChinaShippingCost(Product, ShippingCharges);
    Subtotal = Number(productTotal.totalPrice) + Number(otherCost);
  }
  return numberWithCommas(Subtotal);
};

export const CartCheckedProductSubTotal = (Product) => {
  let productTotal = cartCheckedProductTotal(Product);
  let Subtotal = 0;
  if (!_.isEmpty(productTotal)) {
    if (productTotal.totalPrice) {
      let otherCost =
        Number(Product.DeliveryCost) + Number(Product.totalWeight) * Number(Product.ShippingRate);
      Subtotal = Number(productTotal.totalPrice) + Number(otherCost);
    }
  }
  return Subtotal;
};

export const CartProductSummary = (cartConfigured, ShippingCharges) => {
  let totalQty = 0;
  let grossTotalPrice = 0;
  if (_.isArray(cartConfigured)) {
    cartConfigured.map((Product) => {
      const checkItemSubTotal = cartCheckedProductTotal(Product);
      const totalPrice = checkItemSubTotal.totalPrice;
      const totalWeight = checkItemSubTotal.totalWeight;
      const DeliveryCost = Product.DeliveryCost;
      const ShippingRate = calculateAirShippingCharge(totalPrice, ShippingCharges);

      let weightCost = Number(totalWeight) * Number(ShippingRate);
      weightCost = weightCost < 100 ? 100 : weightCost;

      const totalItemShipping = Number(DeliveryCost) + Number(weightCost);

      grossTotalPrice += Number(totalPrice) + Number(totalItemShipping);
      return false;
    });
  }
  return { totalQty: totalQty, totalPrice: grossTotalPrice };
};

export const cartCalculateNeedToPay = (totalPrice, percent = 50) => {
  return (Number(totalPrice) * percent) / 100;
};

export const cartProductQuantityUpdate = (
  qty,
  newPrice,
  cartConfigured,
  product_id,
  existsConfigId,
  ShippingCharges
) => {
  let reConfig = cartConfigured.map((mapItem) => {
    if (mapItem.Id === product_id) {
      let ConfiguredItems = [];
      if (qty <= 0) {
        ConfiguredItems = mapItem.ConfiguredItems.filter((filter) => filter.Id !== existsConfigId);
      } else {
        ConfiguredItems = mapItem.ConfiguredItems.map((config) => {
          if (config.Id === existsConfigId) {
            return { ...config, Price: newPrice, Quantity: qty };
          }
          return config;
        });
      }
      let activeProduct = mapItem;
      let ProductSummary = {};
      if (existsConfigId === undefined) {
        ProductSummary = cartProductTotalExceptConfiguredItems(activeProduct, ShippingCharges);
      } else {
        activeProduct = { ...mapItem, ConfiguredItems: ConfiguredItems };
        ProductSummary = cartProductTotal(activeProduct, ShippingCharges);
      }

      if (!_.isEmpty(ProductSummary)) {
        activeProduct = {
          ...activeProduct,
          totalPrice: ProductSummary.totalPrice,
          Quantity: ProductSummary.totalQty,
          totalQty: ProductSummary.totalQty,
          ShippingRate: ProductSummary.ShippingRate,
          ApproxWeight: ProductSummary.ApproxWeight,
          totalWeight: ProductSummary.totalWeight,
        };
      }
      return activeProduct;
    }
    return mapItem;
  });
  configAttrToConfigured(reConfig);
};

export const cartPlainProductQuantityUpdate = (
  newQty,
  newPrice,
  cartConfigured,
  product_id,
  ShippingCharges
) => {
  let reConfig = cartConfigured.map((mapItem) => {
    if (mapItem.Id === product_id) {
      if (newQty > 0) {
        let activeProduct = { ...mapItem, Quantity: newQty, Price: newPrice };
        let ProductSummary = cartProductTotalExceptConfiguredItems(activeProduct, ShippingCharges);
        if (!_.isEmpty(ProductSummary)) {
          activeProduct = {
            ...activeProduct,
            totalPrice: ProductSummary.totalPrice,
            totalQty: ProductSummary.totalQty,
            ShippingRate: ProductSummary.ShippingRate,
            ApproxWeight: ProductSummary.ApproxWeight,
            totalWeight: ProductSummary.totalWeight,
          };
        }
        return activeProduct;
      } else {
        return { notItem: true };
      }
    }
    return mapItem;
  });
  reConfig = reConfig.filter((filter) => !filter.notItem);

  configAttrToConfigured(reConfig);
};
