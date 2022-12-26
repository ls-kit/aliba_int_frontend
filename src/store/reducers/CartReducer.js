import * as Types from "../actions/types";

const CartReducer = (
  state = {
    Attribute: {},
    SelectConfiguredItems: [],
    configured: [],
    shipping_address: {},
    billing_address: {},
    advance_percent: { advance_percent: 50 },
    discount_percent: { discount_percent: 2 },
  },
  action
) => {
  switch (action.type) {
    case Types.SELECT_ATTRIBUTE: {
      return { ...state, Attribute: action.payload.Attribute };
    }
    case Types.SELECT_CONFIGURED_ITEMS: {
      return { ...state, SelectConfiguredItems: action.payload.SelectConfiguredItems };
    }
    case Types.SELECT_CONFIGURED: {
      return { ...state, configured: action.payload.configured };
    }
    case Types.SELECT_SHIPPING_ADDRESS: {
      return { ...state, shipping_address: action.payload.shipping_address };
    }
    case Types.SELECT_BILLING_ADDRESS: {
      return { ...state, billing_address: action.payload.billing_address };
    }
    case Types.SELECT_ADVANCE_PERCENT: {
      return { ...state, advance_percent: action.payload.advance_percent };
    }
    case Types.SELECT_DISCOUNT_PERCENT: {
      return { ...state, discount_percent: action.payload.discount_percent };
    }
    default:
      return state;
  }
};

export default CartReducer;
