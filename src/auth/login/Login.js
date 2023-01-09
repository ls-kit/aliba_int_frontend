import React, { useEffect, useState } from "react";
import _ from "lodash";
import Breadcrumb from "../../pages/breadcrumb/Breadcrumb";
import { connect } from "react-redux";
import {
  loginWithEmailPassword,
  loginPhoneSubmitForOtp,
  customerSocialLogin,
} from "../../store/actions/AuthAction";
import { withRouter } from "react-router-dom";
import OTPSubmit from "./include/OTPSubmit";
import SocialButton from "./SocialButton";
import axios from "axios";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { goPageTop } from "../../utils/Helpers";

const Login = (props) => {
  const { OTPResponse, isAuthenticated } = props;
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const [remember, setRemember] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      props.history.push("/dashboard");
    }
    goPageTop();
  }, []);

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${response.access_token}`,
          },
        });
        // console.log(res.data);
        props.customerSocialLogin(res.data, props.history);
      } catch (err) {
        console.log(err);
      }
    },
  });

  // const googleLogin = (response) => {
  //   var decoded = jwt_decode(response.credential);
  //   console.log(decoded);
  // };

  const formSubmitForOtpSubmit = (e) => {
    e.preventDefault();
    if (phone !== "") {
      const sendData = {
        phone: phone,
        remember: remember,
      };
      props.loginPhoneSubmitForOtp(sendData);
    } else {
      alert("Please provide phone");
    }
  };

  if (!_.isEmpty(OTPResponse)) {
    const status = OTPResponse.status;
    const data = OTPResponse.data;

    if (status && !_.isEmpty(data)) {
      return <OTPSubmit />;
    }
  }

  const handleSocialLogin = (user) => {
    console.log("user", user);
    props.customerSocialLogin(user, props.history);
  };

  const handleSocialLoginFailure = (err) => {
    console.error(err);
  };

  return (
    <main className='main'>
      <Breadcrumb current='Login' />
      <div className='login-page pb-8 pb-md-12 pt-lg-17 pb-lg-17'>
        <div className='container'>
          <div className='form-box'>
            <div className='form-tab'>
              <h1 className='text-center'>Login</h1>
              <div className='tab-content'>
                <div
                  className='tab-pane fade show active'
                  id='otp_login'
                  role='tabpanel'
                  aria-labelledby='otp_login-tab'
                >
                  {/* <form onSubmit={(e) => formSubmitForOtpSubmit(e)}>
                    <div className='form-group'>
                      <label htmlFor='phone'>
                        Phone Number <span className='text-danger'>*</span>
                      </label>
                      <input
                        type='text'
                        className='form-control'
                        id='phone'
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required={true}
                        placeholder='Phone'
                      />
                    </div>
                    <div className='form-footer'>
                      <button type='submit' className='btn py-2 btn-block btn-default'>
                        <span>SUBMIT</span>
                        <i className='icon-long-arrow-right' />
                      </button>
                      <div className='custom-control custom-checkbox'>
                        <input
                          type='checkbox'
                          className='custom-control-input'
                          defaultChecked={remember}
                          onChange={() => setRemember(!remember)}
                          id='signin-remember-2'
                        />
                        <label className='custom-control-label' htmlFor='signin-remember-2'>
                          Remember Me
                        </label>
                      </div>
                    </div>
                   
                  </form> */}

                  <div className='form-choice'>
                    <p className='text-center'>Sign in with</p>
                    {/* <SocialButton
                      provider='google'
                      appId='661276138407-252qctok1c1it53u0gu3vroojbouhtl7.apps.googleusercontent.com'
                      onLoginSuccess={handleSocialLogin}
                      onLoginFailure={handleSocialLoginFailure}
                    >
                      <span className='btn-g'>
                        <i className='icon-google' />
                      </span>{" "}
                      Login with Google
                    </SocialButton> */}
                    {/* <GoogleLogin
                      onSuccess={googleLogin}
                      onError={() => {
                        console.log("Login Failed");
                      }}
                    /> */}
                    <button className='btn btn-block btn-login mb-1' onClick={() => loginWithGoogle()}>
                      <span className='btn-g'>
                        <i className='icon-google' />
                      </span>{" "}
                      Login with google
                    </button>

                    <SocialButton
                      provider='facebook'
                      appId={process.env.REACT_APP_FACEBOOK_APP_KEY}
                      onLoginSuccess={handleSocialLogin}
                      onLoginFailure={handleSocialLoginFailure}
                    >
                      <span className='btn-f'>
                        <i className='icon-facebook-f' />
                      </span>{" "}
                      Login with Facebook
                    </SocialButton>
                  </div>

                  {/* End .form-choice */}
                </div>
              </div>
              {/* End .tab-content */}
            </div>
            {/* End .form-tab */}
          </div>
          {/* End .form-box */}
        </div>
        {/* End .container */}
      </div>
    </main>
  );
};

const mapStateToProps = (state) => ({
  general: JSON.parse(state.INIT.general),
  isAuthenticated: state.AUTH.isAuthenticated,
  OTPResponse: state.AUTH.OTP_response,
  cartConfigured: state.CART.configured,
});

export default connect(mapStateToProps, {
  loginWithEmailPassword,
  loginPhoneSubmitForOtp,
  customerSocialLogin,
})(withRouter(Login));
