import React from "react";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
const BannerRight = () => {
  return (
    <div className='bRightBox flex flexCol'>
      <div>
        <div className='fCenter flexCol'>
          <CgProfile className='profile' />
          <h6 className='bold '>Welcome to Aliba int!</h6>
        </div>
        <div className='flexBetween'>
          <div>
            <Link to='/login'>
              <span className='homeLogin-btn'>Register</span>
            </Link>
          </div>
          <div>
            <Link to='/login'>
              <span className='homeReg-btn'>Sign in</span>
            </Link>
          </div>
        </div>
      </div>
      <div>test</div>
    </div>
  );
};

export default BannerRight;
