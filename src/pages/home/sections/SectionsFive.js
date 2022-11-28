import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getSetting } from "../../../utils/Helpers";
import _ from "lodash";
import { loadSectionsProducts } from "../../../utils/Services";
import ProductSectionSkeleton from "../../../skeleton/productSkeleton/ProductSectionSkeleton";
import RecentItems from "../includes/Products/recentProduct/includes/RecentItems";
import SectionsOne from "./SectionsOne";

const SectionsFive = (props) => {
  const { general, style } = props;
  const section_three_title = getSetting(general, "section_five_title");
  const query_url = getSetting(general, "section_five_query_url");
  const query_type = getSetting(general, "section_five_query_type");

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (_.isEmpty(products)) {
      loadSectionsProducts("section_five").then((response) => {
        if (!_.isEmpty(response)) {
          const products = JSON.parse(response.products);
          if (!_.isEmpty(products)) {
            const Content = products.Content;
            if (!_.isEmpty(Content)) {
              setProducts(Content);
            }
          }
        }
        setLoading(false);
      });
    }
  }, []);

  return (
    <div className='container deal-section' style={{ display: `${style}` }}>
      <div className='row mt-2 mb-0 mb-md-2 mb-md-3'>
        <div className='col-6'>
          <h3 className='title '> {section_three_title || "..."}</h3>
        </div>
        <div className='col-6 text-right'>
          {query_type === "search_query" ? (
            <a href={`/search${query_url}`} className='btn btn-default px-4 py-2 py-md-3 rounded'>
              View All
            </a>
          ) : (
            <a href={`/shop${query_url}`} className='btn btn-default px-4 py-2 py-md-3 rounded'>
              View All
            </a>
          )}
        </div>
      </div>

      {loading && <ProductSectionSkeleton />}
      {!loading && products.length > 0 && <RecentItems products={products} />}
    </div>
  );
};

SectionsOne.propTypes = {
  general: PropTypes.object.isRequired,
};

export default SectionsFive;
