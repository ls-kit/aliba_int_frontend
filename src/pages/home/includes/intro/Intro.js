import React, {useEffect, useState} from "react";
import BrowseCategories from "./includes/BrowseCategories";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {loadBanners} from "../../../../store/actions/InitAction"
import OwlCarousel from "react-owl-carousel";
import {loadAsset} from "../../../../utils/Helpers";
import BannerSkeleton from "../../../../skeleton/BannerSkeleton";


const Intro = (props) => {
   const {banners} = props;

   const [loading, setLoading] = useState(false);

   useEffect(() => {
      if (!loading) {
         props.loadBanners();
      }
   }, []);


   useEffect(() => {
      setLoading(false);
   }, [loading]);

   return (
      <div className="intro-section">
         <div className="container mt-0 mt-md-2">
            <div className="row">
               <div className="col-lg-3 cols d-none d-lg-block">
                  <BrowseCategories/>
               </div>
               <div className="col-lg-9 cols col-md-12 col-12 mb-md-0 mb-2">
                  <div className="intro-slider-container">
                     {
                        banners.length > 0 && !loading ?
                           <OwlCarousel
                              className="intro-slider owl-carousel owl-theme owl-nav-inside row cols-1"
                              loop={false}
                              margin={0}
                              dots={false}
                              nav={false}
                              autoplayTimeout={10000}
                              responsive={{
                                 0: {items: 1},
                                 480: {items: 1},
                                 576: {items: 1},
                                 768: {items: 1},
                                 992: {items: 1},
                                 1200: {items: 1},
                              }}
                           >
                              {
                                 banners.map(banner =>
                                    <div
                                       key={banner.id}
                                       className="intro-slide bg-image d-flex align-items-center"
                                       style={{
                                          backgroundColor: "#e9e9e9",
                                          backgroundImage: `url(${loadAsset(banner.post_thumb)})`,
                                       }}
                                    >
                                    </div>
                                 )
                              }
                           </OwlCarousel>
                           :
                           <BannerSkeleton/>
                     }
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
   banners: state.INIT.banners
});

export default connect(mapStateToProps, {loadBanners})(
   withRouter(Intro)
);

