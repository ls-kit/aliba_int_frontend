import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getSetting, loadAsset } from "../../../utils/Helpers";
import _ from "lodash";
import { getSuperDeals, loadSectionsProducts } from "../../../utils/Services";
import ProductSectionSkeleton from "../../../skeleton/productSkeleton/ProductSectionSkeleton";
import RecentItems from "../includes/Products/recentProduct/includes/RecentItems";
import Countdown from "react-countdown";

// Random component
const Completionist = () => <span>Deals closed !</span>;

// Renderer callback with condition
const renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <Completionist />;
  } else {
    // Render a countdown
    return (
      <span className='bold'>
        <span className='timeBox'>{hours}</span>: <span className='timeBox'>{minutes}</span>:
        <span className='timeBox'>{seconds}</span>
      </span>
    );
  }
};

const SectionSuperDeals = (props) => {
  const { general } = props;
  // console.log("general", general);

  const section_super_deals_title = getSetting(general, "section_super_deals_title");
  const section_one_title_image = getSetting(general, "section_one_title_image");
  const section_one_visible_title = getSetting(general, "section_one_visible_title");
  const query_url = getSetting(general, "section_super_deals_query_url");
  const query_type = getSetting(general, "section_super_deals_query_type");

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [expiredDate, setExpiredDate] = useState("");
  const acceptedDate = Date.parse("25 Dec 2022 00:12:00 GMT");
  console.log("acceptedDate", ` ${expiredDate + " " + "GMT"}`);
  useEffect(() => {
    if (_.isEmpty(products)) {
      getSuperDeals().then((response) => {
        if (!_.isEmpty(response)) {
          const products = response.SuperDealProducts;
          const timer = response.timer;
          if (!_.isEmpty(products)) {
            setProducts(products);
          }
          if (!_.isEmpty(timer)) {
            setExpiredDate(timer);
          }
        }
        setLoading(false);
      });
    }
  }, []);

  return (
    <div className='container deal-section'>
      <div className='row mt-0 mb-0 mb-md-1 mb-md-1'>
        <div className='col-9 d-flex'>
          <h4 className='bold topTitle'>
            SUPER <span className='hi-color'>DEALS</span>
          </h4>
          <div className='pl-4 flex'>
            <h4 className='bold topTitle text-muted'>Top Products, Incredible Price !</h4>
            <div className='pl-2'>
              <Countdown date={acceptedDate} renderer={renderer} />
            </div>
          </div>
        </div>
        <div className='col-3 text-right'>
          {" "}
          <a href={`/seller/${"vendorId"}?page=2`} className='btn btn-default px-4 py-2 py-md-3 rounded'>
            View All
          </a>
        </div>

        {/* <div className='col-6 text-right'>
          {query_type === "search_query" ? (
            <a href={`/search${query_url}`} className='btn btn-default px-4 py-2 py-md-3 rounded'>
              View All
            </a>
          ) : (
            <a href={`/shop${query_url}`} className='btn btn-default px-4 py-2 py-md-3 rounded'>
              View All
            </a>
          )}
        </div> */}
      </div>

      {loading && <ProductSectionSkeleton />}
      {/* {!loading && products.length > 0 && <RecentItems products={products} />} */}
    </div>
  );
};

SectionSuperDeals.propTypes = {
  general: PropTypes.object.isRequired,
};

export default SectionSuperDeals;
