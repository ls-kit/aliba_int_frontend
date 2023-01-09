import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "../pages/home/Home";
import Login from "../auth/login/Login";
import My404Component from "../pages/404/My404Component";
import Faq from "../pages/faq/Faq";
import Contact from "../pages/contact/Contact";
import ProductSingle from "../pages/product/productSingleNew/ProductSingle";
import Checkout from "../pages/checkout/Checkout";
import Wishlist from "../pages/wishlist/Wishlist";
import SinglePage from "../pages/single/SinglePage";
import LoadCategory from "../pages/category/LoadCategory";
import LoadShopProducts from "../pages/shop/LoadShopProducts";
import LoadSearchProducts from "../pages/search/LoadSearchProducts";
import Dashboard from "../auth/dashboard/Dashboard";
import AuthRoute from "./AuthRoute";
import Payment from "../pages/payment/Payment";
import PaymentSuccessFail from "../pages/payment/PaymentSuccessFail";
import LoadPictureSearchProduct from "../pages/search/LoadPictureSearchProduct";
import OrderDetails from "../auth/dashboard/orders/OrderDetails";
import VendorSearchProducts from "../pages/search/VendorSearchProducts";

const Routing = () => {
  return (
    <Switch>
      <Route path='/' exact component={Home} />
      <Route path='/home' exact component={Home} />
      <Route path='/login' exact component={Login} />
      <Route path='/faq' exact component={Faq} />
      <Route path='/contact' exact component={Contact} />

      <Route path='/pages/:slug' exact component={SinglePage} />
      <Route path='/product/:item_id' exact component={ProductSingle} />
      <Route path='/search/:searchKey' exact component={LoadSearchProducts} />
      <Route path='/seller/:vendorId' exact component={VendorSearchProducts} />
      <Route path='/search/picture/:search_id' exact component={LoadPictureSearchProduct} />
      <Route path='/shop/:category_slug' exact component={LoadShopProducts} />

      <AuthRoute path='/dashboard/:section?' exact component={Dashboard} />
      <AuthRoute path='/checkout' exact component={Checkout} />
      <AuthRoute path='/payment' exact component={Payment} />
      <AuthRoute path='/wishlist' exact component={Wishlist} />
      <AuthRoute path='/details/:id' exact component={OrderDetails} />

      <AuthRoute path='/online/payment/:status/:tran_id' exact component={PaymentSuccessFail} />

      <Route path='/:category_slug/:sub_slug?' exact component={LoadCategory} />

      <Route path='*' exact component={My404Component} />
    </Switch>
  );
};

export default Routing;
