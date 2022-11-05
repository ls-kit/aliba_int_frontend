import * as Types from '../actions/types'

const CartReducer = (state = {
   Attribute: {},
   SelectConfiguredItems: [],
   configured: [],
   shipping_address: {},
   billing_address: {},
}, action) => {
   switch (action.type) {
      case Types.SELECT_ATTRIBUTE: {
         return {...state, Attribute: action.payload.Attribute}
      }
      case Types.SELECT_CONFIGURED_ITEMS: {
         return {...state, SelectConfiguredItems: action.payload.SelectConfiguredItems}
      }
      case Types.SELECT_CONFIGURED: {
         return {...state, configured: action.payload.configured}
      }
      case Types.SELECT_SHIPPING_ADDRESS: {
         return {...state, shipping_address: action.payload.shipping_address}
      }
      case Types.SELECT_BILLING_ADDRESS: {
         return {...state, billing_address: action.payload.billing_address}
      }
      default:
         return state
   }
};

export default CartReducer;