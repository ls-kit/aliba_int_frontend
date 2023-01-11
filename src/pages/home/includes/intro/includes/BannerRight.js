import _ from "lodash";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
import CardSkelton from "../../../../../skeleton/productSkeleton/CardSkelton";
import { getSetting, loadAsset } from "../../../../../utils/Helpers";
import { getExclusiveOffer } from "../../../../../utils/Services";
import profileImg from "../../../../../assets/images/icon/profile.webp";
import proTop from "../../../../../assets/images/icon/proTop.png_.webp";
import OwlCarousel from "react-owl-carousel";
const BannerRight = ({ general }) => {
  const currency_icon = getSetting(general, "currency_icon");
  const [loading, setLoading] = useState(true);
  const [offerData, setOfferData] = useState([]);

  useEffect(() => {
    loadExclusiveOffer();
  }, []);

  const loadExclusiveOffer = async () => {
    const response = await getExclusiveOffer();

    const data = response[0];
    if (!_.isEmpty(data)) {
      setOfferData(data);
    }
    setLoading(false);
  };

  let content;
  if (loading)
    content = (
      <div>
        <CardSkelton />
        <CardSkelton />
      </div>
    );
  if (!loading && offerData)
    content = (
      <div
        className='mt-4 exOffBox'
        style={{
          backgroundImage: `url(${loadAsset(offerData.image)})`,
          height: "100%",
        }}
      >
        <div>
          <p className='t-white'>Exclusive Offers</p>
          <h6 className='bold t-white'>{offerData.text}</h6>
        </div>
        <div className='row'>
          <OwlCarousel
            className='owl-carousel owl-theme owl-nav-inside row cols-3'
            loop={true}
            margin={10}
            dots={false}
            nav={false}
            autoplay={true}
            autoplayTimeout={3000}
            responsiveClass={true}
            responsive={{
              0: {
                items: 1,
                nav: true,
              },
              600: {
                items: 4,
                nav: false,
              },
              1000: {
                items: 2,
                nav: true,
                loop: false,
              },
            }}
          >
            {offerData.products.map((product, index) => {
              return (
                <div key={index}>
                  <Link to={`/product/${product.id}`}>
                    <div className='position-relative'>
                      <img src={product.image} alt='' />
                      <div className='flexCenter exPriceBox'>
                        <span className='bt'>
                          {`${currency_icon}`} {_.round(product.price)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </OwlCarousel>

          {/* {offerData.products.map((product) => (
            <div className='col-md-6'>
              <Link to={`/product/${product.id}`}>
                <div className='position-relative'>
                  <img src={product.image} alt='' />
                  <div className='flexCenter exPriceBox'>
                    <span className='bt'>
                      {`${currency_icon}`} {_.round(product.price)}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))} */}
        </div>
      </div>
    );

  return (
    <div className='bRightBox flex flexCol h-100 proTop' style={{ backgroundImage: `url(${proTop})` }}>
      <div className=''>
        <div className='fCenter flexCol'>
          {/* <CgProfile className='profile' /> */}
          <img className='proImg' src={profileImg} alt='' />
          <h6 className='bold '>Welcome to Aliba int!</h6>
        </div>
        <div className='flexBetween' style={{ paddingTop: "10px" }}>
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
      {content}
    </div>
  );
};

export default BannerRight;
