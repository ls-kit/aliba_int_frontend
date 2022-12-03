import React from "react";
import { BrowserRouter } from "react-router-dom";
import Routing from "./Routing";

import HeaderManage from "./header/HeaderManage";
import Footer from "./footer/Footer";
import ErrorHandling from "../errorHandler/ErrorHandling";
import GlobalLoading from "../loader/GlobalLoading";
import BrowseCategories from "../pages/home/includes/intro/includes/BrowseCategories";

const App = () => {
  return (
    <BrowserRouter>
      <GlobalLoading />
      <HeaderManage />
      <ErrorHandling />
      <div className='page-wrapper'>
        <div className=''>
          <div className='cols d-none d-lg-block fixed-sidebar' style={{ backgroundColor: "#fff" }}>
            <BrowseCategories />
          </div>
          <div
            className='cols mb-md-0 mb-2 main-area'
            style={{ backgroundColor: "#eaeaea" }}
          >
            <Routing />
            <Footer />
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
