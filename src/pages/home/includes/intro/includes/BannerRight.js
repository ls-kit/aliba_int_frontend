import _ from "lodash";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
import CardSkelton from "../../../../../skeleton/productSkeleton/CardSkelton";
import { loadAsset } from "../../../../../utils/Helpers";
import { getExclusiveOffer } from "../../../../../utils/Services";
const BannerRight = () => {
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
        className='mt-2 exOffBox'
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
          {offerData.products.map((product) => (
            <div className='col-md-6'>
              <Link to={`/product/${product.id}`}>
                <div className='position-relative'>
                  <img src={product.image} alt='' />
                  <div className='flexCenter exPriceBox'>
                    <span className='bt'>{product.price}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );

  return (
    <div className='bRightBox flex flexCol h-100'>
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
      {content}
    </div>
  );
};

export default BannerRight;
