import React from "react";
import { BrowserRouter } from "react-router-dom";
import Routing from "./Routing";
import HeaderManage from "./header/HeaderManage";
import Footer from "./footer/Footer";
import ErrorHandling from "../errorHandler/ErrorHandling";
import GlobalLoading from "../loader/GlobalLoading";

const App = () => {
  return (
    <BrowserRouter>
      <GlobalLoading />
      <HeaderManage />
      <ErrorHandling />
      <div className='page-wrapper'>
        <Routing />
      </div>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
