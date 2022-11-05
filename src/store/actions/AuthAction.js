import _ from 'lodash';
import * as Types from "./types";
import {axiosInstance, instanceAuthToken} from "../../utils/AxiosDefault";
import {setGlobalErrors} from "../../utils/GlobalStateControl";
import {in_loading, out_loading} from "../../utils/LoadingState";


export const loginWithEmailPassword = (data, history) => (dispatch) => {
   in_loading();
   axiosInstance.post('/login', data)
      .then(response => {
         const responseData = response.data;
         if (!_.isEmpty(responseData)) {
            const getData = responseData.data;
            const token = getData.token;
            const user = getData.user;
            if (!_.isEmpty(user)) {
               dispatch({
                  type: Types.SET_USER,
                  payload: {
                     isAuthenticated: true,
                     token: token,
                     user: user
                  },
               });
               instanceAuthToken(token);
               window.localStorage.setItem('_auth', JSON.stringify(getData));
               history.push("/dashboard");
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


export const loginPhoneSubmitForOtp = (data) => (dispatch) => {
   in_loading();
   axiosInstance.post('/submit-for-otp', data)
      .then(response => {
         const responseData = response.data;
         if (!_.isEmpty(responseData)) {
            const getData = responseData.data;
            if (!_.isEmpty(getData)) {
               dispatch({
                  type: Types.OTP_SUBMIT,
                  payload: {
                     OTP_response: {
                        status: getData.status,
                        message: getData.status,
                        data: getData.data,
                     }
                  },
               });
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


export const resendCustomerOTP = (data) => (dispatch) => {
   in_loading();
   axiosInstance.post('/resend-otp', data)
      .then(response => {
         const responseData = response.data;
         if (!_.isEmpty(responseData)) {
            const getData = responseData.data;
            if (!_.isEmpty(getData)) {
               dispatch({
                  type: Types.OTP_SUBMIT,
                  payload: {
                     OTP_response: {
                        status: getData.status,
                        message: getData.status,
                        data: getData.data,
                     }
                  },
               });
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


export const submitCustomerOTP = (data, history) => (dispatch) => {
   in_loading();
   axiosInstance.post('/submit-otp', data)
      .then(response => {
         const responseData = response.data;
         if (!_.isEmpty(responseData)) {
            const getData = responseData.data;
            const token = getData.token;
            const user = getData.user;
            if (!_.isEmpty(user)) {
               dispatch({
                  type: Types.SET_USER,
                  payload: {
                     isAuthenticated: true,
                     token: token,
                     user: user,
                     OTP_response: {},
                  },
               });
               instanceAuthToken(token);
               window.localStorage.setItem('_auth', JSON.stringify(getData));
               history.push("/dashboard");
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


// social login
export const customerSocialLogin = (socialData, history) => (dispatch) => {
   in_loading();
   axiosInstance.post('/social-login', {socialData: JSON.stringify(socialData)})
      .then(response => {
         const responseData = response.data;
         if (!_.isEmpty(responseData)) {
            const getData = responseData.data;
            const token = getData.token;
            const user = getData.user;
            if (!_.isEmpty(user)) {
               dispatch({
                  type: Types.SET_USER,
                  payload: {
                     isAuthenticated: true,
                     token: token,
                     user: user,
                     OTP_response: {},
                  },
               });
               instanceAuthToken(token);
               window.localStorage.setItem('_auth', JSON.stringify(getData));
               history.push("/dashboard");
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


export const backToLogin = () => (dispatch) => {
   dispatch({
      type: Types.OTP_SUBMIT,
      payload: {
         OTP_response: {
            status: false,
            message: "",
            data: [],
         }
      },
   });
};


export const authLogout = (history) => dispatch => {
   localStorage.removeItem("_auth");
   instanceAuthToken('');
   history.push("/login");
   dispatch({
      type: Types.SET_USER,
      payload: {
         isAuthenticated: false,
         user: {},
         token: false,
      },
   });
};




export const productAddToWishlist = (product) => (dispatch) => {
   axiosInstance.post('/add-to-wishlist',{product: JSON.stringify(product)})
      .then(response => {
         const responseData = response.data;
         if (!_.isEmpty(responseData)) {
            const getData = responseData.data;
            dispatch({
               type: Types.WISHLIST,
               payload: {
                  wishlist: getData.wishlists,
               },
            });
         }
      })
      .catch((error) => {
         dispatch({
            type: Types.WISHLIST,
            payload: {
               wishlist: [],
            },
         });
      });
};


export const customerWishlist = () => (dispatch) => {
   axiosInstance.post('/get-wishlist')
      .then(response => {
         const responseData = response.data;
         if (!_.isEmpty(responseData)) {
            const getData = responseData.data;
            dispatch({
               type: Types.WISHLIST,
               payload: {
                  wishlist: getData.wishlists,
               },
            });
         }
      })
      .catch((error) => {
         dispatch({
            type: Types.WISHLIST,
            payload: {
               wishlist: [],
            },
         });
      });
};

export const RemoveCustomerWishlist = (item_id) => (dispatch) => {
   axiosInstance.post('/remove-wishlist', {item_id: item_id})
      .then(response => {
         const responseData = response.data;
         if (!_.isEmpty(responseData)) {
            const getData = responseData.data;
            dispatch({
               type: Types.WISHLIST,
               payload: {
                  wishlist: getData.wishlists,
               },
            });
         }
      })
      .catch((error) => {
         dispatch({
            type: Types.WISHLIST,
            payload: {
               wishlist: [],
            },
         });
      });
};