import React, { useEffect, useState } from "react";
import BrowseCategories from "./includes/BrowseCategories";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { loadBanners } from "../../../../store/actions/InitAction";
import OwlCarousel from "react-owl-carousel";
import { loadAsset } from "../../../../utils/Helpers";
import BannerSkeleton from "../../../../skeleton/BannerSkeleton";
import SSlider from "./slick/SSlider";
import offers from "../../../../assets/images/offers.png";
import review from "../../../../assets/images/review.png";
import arr1 from "../../../../assets/images/arr1.png";
import arr2 from "../../../../assets/images/arr2.png";
import cateImg from "../../../../assets/images/TopCat/shose.png";

const Intro = (props) => {
  const { banners } = props;

  const imageArr = [
    "https://wholesalecart.com/static/media/cashback_offer.6d82c6ee.jpg",
    "https://wholesalecart.com/static/media/shipping_charge_banner_after.32f355fb.jpg",
    "https://wholesalecart.com/static/media/process.56f6fb77.jpg",
  ];

  const catArr = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1, 1, 1, 1, 1, 1, 1];
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loading) {
      props.loadBanners();
    }
  }, [loading, props]);

  useEffect(() => {
    setLoading(false);
  }, [loading]);

  return (
    <div className='intro-section' style={{ backgroundColor: "#eaeaea" }}>
      <div className='mb-md-0 mb-2 mt-0 mt-md-2'>
        <div className='bannerSection my-2'>
          <div className=''>
            <img
              className='slImg'
              src='https://wholesalecart.com/static/media/cashback_offer.6d82c6ee.jpg'
              alt=''
            />
            {/* <SSlider imageArr={imageArr} /> */}
          </div>
          <div className='offer-box'>
            <a aria-label='Offers' className='promotions' href='/offers'>
              <img src={offers} alt='offers' />
            </a>
          </div>
        </div>
        <div className='homeBoxContainer my-2'>
          <Link className='homeComp' to='/'>
            <img src={review} alt='' />
            <h3>হ্যাপি কাস্টমার রিভিউ</h3>
            <button className='bt'>সেমিনার দেখুন</button>
          </Link>
          <Link className='homeComp' to='/'>
            <img src={review} alt='' />
            <h3>হ্যাপি কাস্টমার রিভিউ</h3>
            <button className='bt'>সেমিনার দেখুন</button>
          </Link>
          <Link className='homeComp' to='/'>
            <img src={review} alt='' />
            <h3>হ্যাপি কাস্টমার রিভিউ</h3>
            <button className='bt'>সেমিনার দেখুন</button>
          </Link>
          <Link className='homeComp' to='/'>
            <img src={review} alt='' />
            <h3>হ্যাপি কাস্টমার রিভিউ</h3>
            <button className='bt'>সেমিনার দেখুন</button>
          </Link>
        </div>

        <div className='m-card mt05'>
          <div className='topCatContainer  flex flexRow flexBetween'>
            <h4 className='bold topTitle'>TOP CATEGORIES</h4>
            <div className='flex'>
              <img className='topAr1' src={arr1} alt='' />
              <img className='topAr2' src={arr2} alt='' />
            </div>
          </div>
          <div className='responsiveOverflow'>
            <div className='sellerCategoryContainer'>
              {catArr.map((cat, index) => (
                <Link key={index} className='category'>
                  <img className='cat-img' src={cateImg} alt='' />
                  <span>Shoes</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* <div className='intro-slider-container'>
              {banners.length > 0 && !loading ? (
                <OwlCarousel
                  className='intro-slider owl-carousel owl-theme owl-nav-inside row cols-1'
                  loop={false}
                  margin={0}
                  dots={false}
                  nav={false}
                  autoplayTimeout={10000}
                  responsive={{
                    0: { items: 1 },
                    480: { items: 1 },
                    576: { items: 1 },
                    768: { items: 1 },
                    992: { items: 1 },
                    1200: { items: 1 },
                  }}
                >
                  {banners.map((banner) => (
                    <div
                      key={banner.id}
                      className='intro-slide bg-image d-flex align-items-center'
                      style={{
                        backgroundColor: "#e9e9e9",
                        backgroundImage: `url(${loadAsset(banner.post_thumb)})`,
                      }}
                    ></div>
                  ))}
                </OwlCarousel>
              ) : (
                <BannerSkeleton />
              )}
            </div> */}
      </div>
    </div>
  );
};

Intro.propTypes = {
  banners: PropTypes.array.isRequired,
  loadBanners: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  banners: state.INIT.banners,
});

export default connect(mapStateToProps, { loadBanners })(withRouter(Intro));
