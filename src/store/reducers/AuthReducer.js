import * as Types from '../actions/types'


const AuthReducer = (state = {
   isAuthenticated: false,
   token: null,
   user: {},
   OTP_response: {
      status: false,
      message: "",
      data: [],
   },
   wishlist: [],
}, action) => {
   switch (action.type) {
      case Types.SET_USER: {
         return {
            ...state,
            user: action.payload.user,
            token: action.payload.token,
            isAuthenticated: action.payload.isAuthenticated,
            OTP_response: action.payload.OTP_response
         }
      }
      case Types.OTP_SUBMIT: {
         return {
            ...state,
            OTP_response: action.payload.OTP_response
         }
      }
      case Types.WISHLIST: {
         return {
            ...state,
            wishlist: action.payload.wishlist
         }
      }
      default:
         return state
   }
};

export default AuthReducer