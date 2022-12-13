import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import SearchForm from "./includes/SearchForm";
import { loadAsset } from "../../utils/Helpers";
import { FaShoppingCart, FaRegUserCircle } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";

const Header = (props) => {
  const { auth, total_wishlist, user, site_name, frontend_logo_menu } = props;

  return (
    <header className='header header-intro-clearance header-26 shadow-0'>
      <div className='header-middle'>
        <div className='container'>
          <div className='header-left'>
            <a href='/' className='logo'>
              <img src={loadAsset(frontend_logo_menu)} alt={site_name} />
            </a>
          </div>

          <div className='header-center'>
            <SearchForm />
          </div>

          <div className='header-right'>
            <div className='header-dropdown-link'>
              <div className='wishlist'>
                <Link to='/pages/blog'>
                  <div className='icon'>
                    <span className='ml-2 fw-bold d-md-inline d-none nav-item-text'>Blog</span>
                  </div>
                </Link>
              </div>
              <div className='wishlist'>
                <Link to='/checkout'>
                  <div className='icon'>
                    <FaShoppingCart />
                    <span className='wishlist-count badge'>{props.cartCount()}</span>
                  </div>
                </Link>
              </div>
              <div className='wishlist'>
                <Link to='/wishlist' title='Wishlist'>
                  <div className='icon'>
                    <FiHeart />
                    <span className='wishlist-count badge'>{total_wishlist}</span>
                  </div>
                </Link>
              </div>

              {auth.isAuthenticated ? (
                <div className='dropdown cart-dropdown'>
                  <Link
                    to='/dashboard'
                    className='dropdown-toggle'
                    role='button'
                    data-toggle='dropdown'
                    aria-haspopup='true'
                    aria-expanded='false'
                    data-display='static'
                    id='cd1'
                  >
                    <div className='icon'>
                      <FaRegUserCircle />
                      <span className='ml-2 fw-bold d-md-inline d-none nav-item-text'>
                        {user.name || "Customer"}
                      </span>
                    </div>
                  </Link>
                  <div className='dropdown-menu dropdown-menu-right nav_customer_menus'>
                    <Link to='/dashboard' className='dropdown-item'>
                      Dashboard
                    </Link>
                    <Link to='/dashboard/orders' className='dropdown-item'>
                      My Orders
                    </Link>
                    <Link to='/dashboard/account' className='dropdown-item'>
                      Account
                    </Link>
                    <a href={`/logout`} className='dropdown-item' onClick={(e) => props.authLogoutProcess(e)}>
                      Logout
                    </a>
                  </div>
                  {/* End .dropdown-menu */}
                </div>
              ) : (
                <div className='cart-dropdown'>
                  <Link to='/login' className='dropdown-toggle' role='button' id='cd'>
                    <div className='icon'>
                      <FaRegUserCircle />
                      <span className='ml-2 fw-bold d-md-inline d-none nav-item-text'>Login</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  site_name: PropTypes.string.isRequired,
  frontend_logo_menu: PropTypes.string.isRequired,
  authLogoutProcess: PropTypes.func.isRequired,
  cartCount: PropTypes.func.isRequired,
  total_wishlist: PropTypes.number.isRequired,
};

export default Header;
