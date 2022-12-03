import React, { useEffect, useRef, useState } from "react";
import BrowseCategories from "./includes/BrowseCategories";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { loadBanners } from "../../../../store/actions/InitAction";
import OwlCarousel from "react-owl-carousel";
import { filter_parent_cats, loadAsset } from "../../../../utils/Helpers";
import BannerSkeleton from "../../../../skeleton/BannerSkeleton";
import SSlider from "./slick/SSlider";
import offers from "../../../../assets/images/offers.png";
import review from "../../../../assets/images/review.png";
import seminar from "../../../../assets/images/seminar.png";
import customer from "../../../../assets/images/customer.png";
import order from "../../../../assets/images/order.png";
import arr1 from "../../../../assets/images/arr1.png";
import arr2 from "../../../../assets/images/arr2.png";
import cateImg from "../../../../assets/images/TopCat/shose.png";
import TopCategory from "./topCategory/TopCategory";
import { getHomePageCards } from "../../../../utils/Services";
import _ from "lodash";
import LargeCardSkelton from "../../../../skeleton/productSkeleton/LargeCardSkelton";

const Intro = (props) => {
  const { banners, categories, category_loading } = props;

  const ref = useRef(null);
  const scroll = (scrollOffset) => {
    ref.current.scrollLeft += scrollOffset;
  };
  const parents = filter_parent_cats(categories);
  const imageArr = [
    "https://wholesalecart.com/static/media/cashback_offer.6d82c6ee.jpg",
    "https://wholesalecart.com/static/media/shipping_charge_banner_after.32f355fb.jpg",
    "https://wholesalecart.com/static/media/process.56f6fb77.jpg",
  ];

  const topCardArr = [
    {
      id: 1,
      imgUrl: `${review}`,
      btnText: "রিভিউ পড়ুন",
      titleText: "হ্যাপি কাস্টমার রিভিউ",
      redirect: "/review",
    },
    {
      id: 2,
      imgUrl: `${seminar}`,
      btnText: "সেমিনার দেখুন",
      titleText: "নিজেই গড়ি নিজ ব্যবসা",
      redirect: "/seminar",
    },
    { id: 3, imgUrl: `${offers}`, btnText: "আপনার অফার", titleText: "দারুন অফার", redirect: "/" },
    {
      id: 4,
      imgUrl: `${order}`,
      btnText: "কিভাবে অর্ডার করবেন?",
      titleText: "ইজি অর্ডার প্রসেস",
      redirect: "/",
    },
  ];

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loading) {
      props.loadBanners();
    }
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [loading]);

  const [cardLoading, setHomeCardLoading] = useState(true);
  const [homePageCards, setHomePageCards] = useState({});

  useEffect(() => {
    homePageCard();
  }, []);

  const homePageCard = async () => {
    const response = await getHomePageCards();

    if (!_.isEmpty(response)) {
      setHomePageCards(response);
    }
    setHomeCardLoading(false);
  };

  // decide what is render for home page card
  let homePageContent = null;
  if (cardLoading) {
    homePageContent = <LargeCardSkelton />;
  }
  if (!cardLoading) {
    homePageContent = homePageCards.map((cart, index) => (
      <Link className='homeComp' to={`/${cart.btn_url}`} key={index}>
        <img className='mb-4' src={loadAsset(cart.image)} alt='' />
        <h3>{cart.titleText}</h3>
        <button className='bt'>{cart.btn_name}</button>
      </Link>
    ));
  }

  return (
    <div className='intro-section' style={{ backgroundColor: "#eaeaea" }}>
      <div>
        {/* <div className='bannerSection mb-2'>
          <div className=''>
            <img
              className='slImg'
              src='https://wholesalecart.com/static/media/cashback_offer.6d82c6ee.jpg'
              alt=''
            />
            <SSlider imageArr={imageArr} />
          </div>
          <div className='offer-box'>
            <a aria-label='Offers' className='promotions' href='/offers'>
              <img src={offers} alt='offers' />
            </a>
          </div>
        </div> */}
        <div className='intro-slider-container'>
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
        </div>
        <div className='homeBoxContainer mb-1'>{homePageContent}</div>

        <div className='m-card mb-1'>
          <div className='topCatContainer  flex flexRow flexBetween'>
            <h4 className='bold topTitle'>TOP CATEGORIES</h4>
            <div className='flex'>
              <img onClick={() => scroll(-700)} className='topAr1' src={arr1} alt='' />
              <img onClick={() => scroll(700)} className='topAr2' src={arr2} alt='' />
            </div>
          </div>
          <div ref={ref} className='responsiveOverflow'>
            <div className='sellerCategoryContainer'>
              <TopCategory categories={categories} category_loading={category_loading} parents={parents} />
            </div>
          </div>
        </div>
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
  categories: state.INIT.categories,
  category_loading: state.LOADING.category_loading,
});

export default connect(mapStateToProps, { loadBanners })(withRouter(Intro));
