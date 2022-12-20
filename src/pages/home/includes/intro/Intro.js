import React, { useEffect, useState } from "react";
import BrowseCategories from "./includes/BrowseCategories";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { loadBanners } from "../../../../store/actions/InitAction";
import OwlCarousel from "react-owl-carousel";
import { loadAsset } from "../../../../utils/Helpers";
import BannerSkeleton from "../../../../skeleton/BannerSkeleton";
import parser from "html-react-parser";
import { getHomePageCards } from "../../../../utils/Services";
import _ from "lodash";
import LargeCardSkelton from "../../../../skeleton/productSkeleton/LargeCardSkelton";
import BannerRight from "./includes/BannerRight";

const Intro = (props) => {
  const { banners } = props;

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
        <img className='' src={loadAsset(cart.image)} alt='' />
        <h3>{cart.titleText}</h3>
        <button className='bt'>{cart.btn_name}</button>
      </Link>
    ));
  }

  return (
    <div className='intro-section'>
      <div className='container mt-0 mt-md-1'>
        <div className='row'>
          <div className='col-lg-3 cols d-none d-lg-block mb-1 pr-0'>
            <BrowseCategories />
          </div>
          <div className='col-lg-6 cols col-md-12 col-12 mb-md-0 mb-2'>
            <div className='intro-slider-container mb-1'>
              {banners.length > 0 && !loading ? (
                <OwlCarousel
                  className='intro-slider owl-carousel owl-theme owl-nav-inside row cols-1'
                  loop={false}
                  margin={0}
                  dots={false}
                  nav={false}
                  autoplay={true}
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
                  {banners.map((banner) => {
                    const content = `${banner?.post_content}`;

                    return (
                      <div
                        key={banner.id}
                        className='intro-slide bg-image d-flex align-items-center'
                        style={{
                          backgroundColor: "#e9e9e9",
                          backgroundImage: `url(${loadAsset(banner.post_thumb)})`,
                        }}
                      >
                        {parser(content)}
                      </div>
                    );
                  })}
                </OwlCarousel>
              ) : (
                <BannerSkeleton />
              )}
            </div>
            <div className='row'>
              <div className='col-lg-3 fCenter'>
                <div className=''>
                  <h3 className='bold'>Your fave shopping guide</h3>
                  <p className='bold' style={{ lineHeight: "normal", fontSize: "12px" }}>
                    Checkout the latest new Deals
                  </p>
                </div>
              </div>
              <div className='col-lg-9'>
                <div className='homeBoxContainer mb-1'>{homePageContent}</div>
              </div>
            </div>
          </div>
          <div className='col-lg-3 cols d-none d-lg-block mb-1 pr-0'>
            <BannerRight />
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
