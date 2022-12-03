import React, { useEffect, useState } from "react";
import _ from "lodash";
import ProductSectionSkeleton from "../../../../skeleton/productSkeleton/ProductSectionSkeleton";
import { loadSameSellerProducts } from "../../../../utils/Services";
import RecentItems from "../../../home/includes/Products/recentProduct/includes/RecentItems";
import { Link } from "react-router-dom";

const SameSellerProducts = ({ vendorId }) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    getSameSellerProduct();
  }, [vendorId]);

  const getSameSellerProduct = async () => {
    const response = await loadSameSellerProducts(vendorId);
    if (!_.isEmpty(response)) {
      const products = JSON.parse(response.VendorProducts);
      if (!_.isEmpty(products)) {
        const Content = products.Content;
        if (!_.isEmpty(Content)) {
          setProducts(Content);
        }
      }
    }
    setLoading(false);
  };

  // console.log("products", products);
  return (
    <div className='container deal-section'>
      <div className='row mt-2 mb-0 mb-md-2 mb-md-3'>
        <div className='col-6'>
          <h3 className='title '>From The Same Seller</h3>
        </div>
        <div className='col-6 text-right'>
          <a href={`/seller/${vendorId}?page=2`} className='btn btn-default px-4 py-2 py-md-3 rounded'>
            View All
          </a>
        </div>
      </div>

      {loading && <ProductSectionSkeleton />}
      {!loading && products.length > 0 && <RecentItems products={products} />}
    </div>
  );
};

export default SameSellerProducts;
