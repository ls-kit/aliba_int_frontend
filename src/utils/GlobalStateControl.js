import * as Types from "../store/actions/types";
import _ from "lodash";
import store from "../store";
import {
   storelocalCart
} from "./CartHelpers";


export const CheckAndSetErrors = (responseData, errorShow = true) => {
   const errors = !_.isEmpty(responseData) ? responseData.errors : {};
   if (errorShow) {
      if (!_.isEmpty(errors)) {
         store.dispatch({
            type: Types.GQL_ERRORS,
            payload: {
               errors: errors
            },
         });
      }
   }
   return _.isEmpty(errors);
};


export const setGlobalErrors = (errors) => {
   errors = errors ? errors : {};
   store.dispatch({
      type: Types.GLOBAL_ERROR,
      payload: {
         data: errors.data ? errors.data : {},
         status: errors.status ? errors.status : '',
         statustext: errors.statustext ? errors.statustext : '',
         request: errors.request ? errors.request : {}
      },
   });
};

export const clearGlobalErrors = () => {
   store.dispatch({
      type: Types.GLOBAL_ERROR,
      payload: {
         errors: [],
         data: {},
         status: '',
         statustext: '',
         request: {}
      },
   });
};


export const configAttrToConfigured = (makeConfigured) => {
   store.dispatch({
      type: Types.SELECT_CONFIGURED,
      payload: {
         configured: makeConfigured
      }
   });
   storelocalCart(makeConfigured);
};


export const selectedActiveAttributes = (Attribute) => {
   store.dispatch({
      type: Types.SELECT_ATTRIBUTE,
      payload: {
         Attribute: Attribute
      }
   });
};

export const selectedActiveConfiguredItems = (SelectConfiguredItems) => {
   store.dispatch({
      type: Types.SELECT_CONFIGURED_ITEMS,
      payload: {
         SelectConfiguredItems: SelectConfiguredItems
      }
   });
};


export const updatedShippingAddress = (addressData) => {
   store.dispatch({
      type: Types.SELECT_SHIPPING_ADDRESS,
      payload: {
         shipping_address: addressData
      }
   });
};




