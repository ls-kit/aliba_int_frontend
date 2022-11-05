import _ from 'lodash';
import * as Types from "./types";
import {CheckAndSetErrors, configAttrToConfigured, setGlobalErrors} from "../../utils/GlobalStateControl";
import {in_loading, out_loading} from "../../utils/LoadingState";
import {axiosInstance} from "../../utils/AxiosDefault";
import {destroyLocalCart} from "../../utils/CartHelpers";

export const loadCart = () => (dispatch) => {
   in_loading();
   axiosInstance.get("/load-cart")
      .then((response) => {
         const responseData = response.data;
         const noError = CheckAndSetErrors(responseData);
         if (noError) {
            const getData = [];
            if (!_.isEmpty(getData)) {
               const general = getData.general;
               dispatch({
                  type: Types.LOAD_GENERAL,
                  payload: {
                     general: general,
                  },
               });
               window.localStorage.setItem('_general', general);
            }
         }
      })
      .catch((error) => {
         setGlobalErrors(error.response);
      })
      .then(() => {
         out_loading()
      });
};


export const confirmCustomerOrder = (orderData) => (dispatch) => {
   in_loading();
   axiosInstance.post("/confirm-order", orderData)
      .then((response) => {
         const responseData = response.data;
         const noError = CheckAndSetErrors(responseData);
         if (noError) {
            const getData = responseData.data;
            if (!_.isEmpty(getData)) {
               const redirect = getData.redirect;
               if (redirect) {
                  destroyLocalCart();
                  configAttrToConfigured([]);
                  window.location.assign(redirect);
               }
               if (getData.safsdfsadf !== undefined) {
                  dispatch({
                     type: Types.LOAD_FAKE,
                     payload: {
                        fake: {},
                     },
                  });
               }
            }
         }
      })
      .catch((error) => {
         setGlobalErrors(error.response);
      })
      .then(() => {
         out_loading()
      });
};


export const changesPaymentsStatusToConfirm = (orderData) => (dispatch) => {
   in_loading();
   axiosInstance.post("/payment-confirm", orderData)
      .then((response) => {
         const responseData = response.data;
         const noError = CheckAndSetErrors(responseData);
         if (noError) {
            const getData = responseData.data;
            if (!_.isEmpty(getData)) {
               const redirect = getData.redirect;
               if (redirect) {
                  window.location.assign(redirect);
               }
               if (getData.safsdfsadf !== undefined) {
                  dispatch({
                     type: Types.LOAD_FAKE,
                     payload: {
                        fake: {},
                     },
                  });
               }
            }
         }
      })
      .catch((error) => {
         setGlobalErrors(error.response);
      })
      .then(() => {
         out_loading()
      });
};