import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import _ from "lodash";
import { useLocation, useParams } from "react-router-dom";
import { goPageTop } from "../../utils/Helpers";
import { loadSameSellerProducts } from "../../utils/Services";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import ProductListSkeleton from "../../skeleton/productSkeleton/ProductListSkeleton";
import CategoryProductList from "../product/productList/CategoryProductList";

const VendorSearchProducts = () => {
  const { vendorId } = useParams();
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  const query = useQuery();
  let page = query.get("page");
  page = page ? page : 1;

  const perPage = 36;
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  useEffect(() => {
    goPageTop();
    if (page !== currentPage) {
      let selected = parseInt(page) - 1;
      setCurrentPage(page);
      let offset = Math.ceil(selected * perPage);
      loadingProduct(offset);
    } else {
      loadingProduct(0);
    }
  }, [page]);

  const loadingProduct = (loadOffset = 0) => {
    setLoading(true);
    loadSameSellerProducts(vendorId, loadOffset, perPage).then((response) => {
      let newProducts = JSON.parse(response.VendorProducts);
      if (!_.isEmpty(newProducts)) {
        setProducts(newProducts.Content);
        setTotalCount(newProducts.TotalCount);
      }
      setLoading(false);
    });
  };

  return (
    <main className='main'>
      <Breadcrumb current={"searching for"} collections={[{ name: "Search" }]} />
      <div className='page-content'>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-12'>
              {loading ? (
                <ProductListSkeleton />
              ) : (
                <CategoryProductList
                  pageName={`vendorSearch`}
                  products={products}
                  slugKey={vendorId}
                  perPage={perPage}
                  currentPage={currentPage}
                  TotalCount={totalCount}
                  sellerId={vendorId}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default VendorSearchProducts;
