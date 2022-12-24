import { axiosFileUpload, axiosInstance } from "./AxiosDefault";
import _ from "lodash";
import { CheckAndSetErrors, setGlobalErrors } from "./GlobalStateControl";
import { in_loading, out_loading } from "./LoadingState";

export const getSinglePageBySlug = async (slug) => {
  return await axiosInstance.get(`/single-page/${slug}`).then((res) => {
    const resData = res.data;
    if (!_.isEmpty(resData)) {
      return resData.data;
    }
    return {};
  });
};

export const getProductDescription = async (product_id) => {
  return await axiosInstance.get(`/product-description/${product_id}`).then((res) => {
    const resData = res.data;
    if (!_.isEmpty(resData)) {
      return resData.data;
    }
    return {};
  });
};

export const getProductSellerInfo = async (VendorId) => {
  return await axiosInstance.get(`/product-seller-information/${VendorId}`).then((res) => {
    const resData = res.data;
    if (!_.isEmpty(resData)) {
      return resData.data;
    }
    return {};
  });
};

export const loadRecentProducts = async () => {
  return await axiosInstance
    .get("/recent-products")
    .then((res) => {
      const resData = res.data;
      if (!_.isEmpty(resData)) {
        return resData.data;
      }
      return {};
    })
    .catch((error) => {
      setGlobalErrors(error.response);
    });
};

export const loadLovingProducts = async () => {
  return await axiosInstance
    .get("/loving-products")
    .then((res) => {
      const resData = res.data;
      if (!_.isEmpty(resData)) {
        return resData.data;
      }
      return {};
    })
    .catch((error) => {
      setGlobalErrors(error.response);
    });
};

export const loadSectionsProducts = async (section) => {
  return await axiosInstance
    .get(`/get-section-products/` + section)
    .then((res) => {
      const resData = res.data;
      if (!_.isEmpty(resData)) {
        return resData.data;
      }
      return {};
    })
    .catch((error) => {
      setGlobalErrors(error.response);
    });
};

export const loadRelatedProducts = async (item_id) => {
  return await axiosInstance
    .get(`/related-products/${item_id}`)
    .then((res) => {
      const resData = res.data;
      if (!_.isEmpty(resData)) {
        return resData.data;
      }
      return {};
    })
    .catch((error) => {
      setGlobalErrors(error.response);
    });
};

export const storeNewAddress = async (storeData) => {
  return await axiosInstance
    .post("/store-new-address", storeData)
    .then((res) => {
      const resData = res.data;
      if (!_.isEmpty(resData)) {
        return resData.data;
      }
      return {};
    })
    .catch((error) => {
      setGlobalErrors(error.response);
    });
};

export const deleteCustomerAddress = async (deleteData) => {
  return await axiosInstance
    .post("/delete-address", deleteData)
    .then((res) => {
      const resData = res.data;
      if (!_.isEmpty(resData)) {
        return resData.data;
      }
      return {};
    })
    .catch((error) => {
      setGlobalErrors(error.response);
    });
};

export const getAllAddress = async () => {
  return await axiosInstance
    .get("/address")
    .then((res) => {
      const resData = res.data;
      if (!_.isEmpty(resData)) {
        return resData.data;
      }
      return {};
    })
    .catch((error) => {
      setGlobalErrors(error.response);
    });
};

export const getCustomerAllOrders = async () => {
  return await axiosInstance
    .get("/orders")
    .then((res) => {
      const resData = res.data;
      if (!_.isEmpty(resData)) {
        return resData.data;
      }
      return {};
    })
    .catch((error) => {
      setGlobalErrors(error.response);
    });
};

export const loadCategoryProducts = async (slug, offset, limit) => {
  return await axiosInstance
    .post(`/category-products/${slug}`, { offset: offset, limit: limit })
    .then((response) => {
      const responseData = response.data;
      if (!_.isEmpty(responseData)) {
        return responseData.data;
      }
      return [];
    })
    .catch((error) => {
      setGlobalErrors(error.response);
    });
};

export const loadTextSearchProducts = async (searchKey, offset, limit) => {
  return await axiosInstance
    .post(`/get-search-result/${searchKey}`, { offset: offset, limit: limit })
    .then((response) => {
      const responseData = response.data;
      if (!_.isEmpty(responseData)) {
        return responseData.data;
      }
      return [];
    })
    .catch((error) => {
      setGlobalErrors(error.response);
    });
};

export const loadPictureSearchProducts = async (data) => {
  return await axiosFileUpload
    .post(`/search-picture`, data)
    .then((response) => {
      const responseData = response.data;
      if (!_.isEmpty(responseData)) {
        return responseData.data;
      }
      return [];
    })
    .catch((error) => {
      setGlobalErrors(error.response);
    });
};

export const loadPictureSearchProductsData = async (search_id, offset, limit) => {
  return await axiosInstance
    .post(`/get-picture-result/${search_id}`, { offset: offset, limit: limit })
    .then((response) => {
      const responseData = response.data;
      if (!_.isEmpty(responseData)) {
        return responseData.data;
      }
      return [];
    })
    .catch((error) => {
      setGlobalErrors(error.response);
    });
};

export const getOrderDetails = async (order_id) => {
  return await axiosInstance.post(`/order/${order_id}`).then((res) => {
    const resData = res.data;
    if (!_.isEmpty(resData)) {
      return resData.data;
    }
    return {};
  });
};

export const getProductPageCard = async (card_no) => {
  return await axiosInstance.get(`/get-products-page-cards/${card_no}`).then((res) => {
    const resData = res.data;

    if (!_.isEmpty(resData)) {
      return resData.data;
    }
    return {};
  });
};
export const loadBulkProductsPrice = async (itemId) => {
  return await axiosInstance.get(`/products-bulk-prices/${itemId}`).then((res) => {
    const resData = res.data;
    if (!_.isEmpty(resData)) {
      return resData.data;
    }
    return {};
  });
};

export const loadSameSellerProducts = async (vendorId, loadOffset, perPage) => {
  return await axiosInstance
    .get(`/vendor-products/${vendorId}`, { params: { offset: loadOffset, limit: perPage } })
    .then((res) => {
      const resData = res.data;
      if (!_.isEmpty(resData)) {
        return resData.data;
      }
      return {};
    });
};

export const getFooterBrand = async () => {
  return await axiosInstance.get(`/footer-brands`).then((res) => {
    const resData = res.data;
    if (!_.isEmpty(resData)) {
      return resData.data;
    }
    return {};
  });
};
export const getHomePageCards = async () => {
  return await axiosInstance.get(`/get-homepage-cards`).then((res) => {
    const resData = res.data;
    if (!_.isEmpty(resData)) {
      return resData.data;
    }
    return {};
  });
};
export const getFeaturedCategories = async () => {
  return await axiosInstance.get(`/get-featured-categories`).then((res) => {
    const resData = res.data;
    if (!_.isEmpty(resData)) {
      return resData.data;
    }
    return {};
  });
};
export const getExclusiveOffer = async () => {
  return await axiosInstance.get(`/get-homepage-featured-items-card`).then((res) => {
    const resData = res.data;
    if (!_.isEmpty(resData)) {
      return resData.data;
    }
    return {};
  });
};
export const getSuperDeals = async () => {
  return await axiosInstance.get(`/get-super-deals`).then((res) => {
    const resData = res.data;
    console.log("super data", resData);
    if (!_.isEmpty(resData)) {
      return resData.data;
    }
    return {};
  });
};
