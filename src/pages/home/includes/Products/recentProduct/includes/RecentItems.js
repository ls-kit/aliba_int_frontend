import React from 'react';
import PropTypes from 'prop-types';
import OwlCarousel from "react-owl-carousel";
import SectionProductCard from "../../../../../product/card/SectionProductCard";
import ProductCart from "../../../../../product/productList/ProductCart";

const RecentItems = props => {
   const {products, sectionCart} = props;
   return (
      <div className="row">
         {
            products.map((product, index) => {
                  // if (sectionCart) {
                  //    return <SectionProductCard key={index} product={product}/>
                  // }
                  return <ProductCart key={index} productClass={`col-6 col-md-4 col-lg-3`} product={product}/>
               }
            )
         }
      </div>
   );
};

RecentItems.propTypes = {};

export default RecentItems;