import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { getSetting } from "../../../utils/Helpers";
import { toggleMobileMenu } from "../../../utils/jQueryImplement";

const StickyFooter = (props) => {
  const { general } = props;
  const office_phone = getSetting(general, "office_phone");

  useEffect(() => {
    toggleMobileMenu();
  }, []);

  return (
    <nav className='stick_footer_nav'>
      <div className='container'>
        <div className='row'>
          <div className='col text-center'>
            <a href='/category' className='nav-link toggleMobileMenu'>
              <span className=' sticky_nav_icon'>
                <i className='icon-shopping-bag' />
              </span>
              <p className='mb-0'>Category</p>
            </a>
          </div>
          <div className='col text-center'>
            <Link className='nav-link' to='/dashboard'>
              <span className=' sticky_nav_icon'>
                <i className='icon-user' />
              </span>
              <p className='mb-0'>Account</p>
            </Link>
          </div>
          <div className='col text-center'>
            <Link className='nav-link' to='/'>
              <span className='sticky_nav_icon'>
                <i className='icon-home' />
              </span>
              <p className='mb-0'>Home</p>
            </Link>
          </div>

          <div className='col text-center'>
            <a className='nav-link' href={`tel:${office_phone}`}>
              <span className=' sticky_nav_icon'>
                <i className='icon-phone' />
              </span>
              <p className='mb-0'>Call</p>
            </a>
          </div>
          <div className='col text-center'>
            <a
              className='nav-link'
              href={`https://m.me/${process.env.REACT_APP_FACEBOOK_PAGE_KEY}`}
              rel='noreferrer'
              target='_blank'
            >
              <span className=' sticky_nav_icon'>
                <i className='icon-facebook-messenger' />
              </span>
              <p className='mb-0'>Chat</p>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default StickyFooter;
