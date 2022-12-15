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
                <i className='icon-bars' />
              </span>
            </a>
          </div>
          <div className='col text-center'>
            <Link className='nav-link' to='/dashboard'>
              <span className=' sticky_nav_icon'>
                <i className='icon-user' />
              </span>
            </Link>
          </div>
          <div className='col text-center'>
            <Link className='nav-link' to='/'>
              <span className='sticky_nav_icon'>
                <i className='icon-home' />
              </span>
            </Link>
          </div>

          <div className='col text-center'>
            <a className='nav-link' href={`tel:${office_phone}`}>
              <span className=' sticky_nav_icon'>
                <i className='icon-phone' />
              </span>
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
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default StickyFooter;
