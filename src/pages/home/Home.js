import React from "react";
import Intro from "./includes/intro/Intro";
import ProductsLoving from "./includes/Products/productsLoving/ProductsLoving";
// import IconBoxes from './includes/iconBoxes/IconBoxes'
import PopularCategory from "./includes/popularCategory/PopularCategory";
// import BrandProduct from './includes/brand/brandProduct/BrandProduct'
// import Blog from './includes/blog/Blog'
// import LandingPopup from './includes/Products/TodayProducts/TodayProducts'

import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { getSetting } from "../../utils/Helpers";
import SectionsOne from "./sections/SectionsOne";
import SectionsTwo from "./sections/SectionsTwo";
import SectionsThree from "./sections/SectionsThree";
import SectionsFour from "./sections/SectionsFour";
import SectionsFive from "./sections/SectionsFive";
import { useState } from "react";
import TopCategories from "./includes/intro/topCategory/TopCategories";
import FeaturedCategories from "./includes/featuredCategory/FeaturedCategories";
import SuperDeals from "./includes/superDeals/SuperDeals";
import SectionSuperDeals from "./sections/SectionSuperDeals";

const Home = (props) => {
  const { general } = props;

  const section_super_deals_active = getSetting(general, "section_super_deals_active");
  const section_one_active = getSetting(general, "section_one_active");
  const section_two_active = getSetting(general, "section_two_active");
  const section_three_active = getSetting(general, "section_three_active");
  const section_four_active = getSetting(general, "section_four_active");
  const section_five_active = getSetting(general, "section_five_active");
  const [style, setStyle] = useState("none");
  const [btnstyle, setBtnStyle] = useState("block");

  const handleTogle = () => {};

  return (
    <main className='main' style={{ backgroundColor: "#F2F2F2" }}>
      <Intro />
      {section_super_deals_active === "enable" && <SectionSuperDeals general={general} />}
      <FeaturedCategories />
      {/*<IconBoxes/>*/}
      {/* <PopularCategory /> */}
      <TopCategories />

      {section_one_active === "enable" && <SectionsOne general={general} />}
      {section_two_active === "enable" && <SectionsTwo general={general} />}
      {section_three_active === "enable" && <SectionsThree general={general} />}
      {section_four_active === "enable" && <SectionsFour general={general} />}
      {section_five_active === "enable" && <SectionsFive style={style} general={general} />}
      <div className='text-center'>
        <button className='btn btn-default' onClick={() => setStyle("block")}>
          Load More
        </button>
      </div>

      <ProductsLoving />
      {/*<RecentProduct/>*/}
      {/*<BrandProduct/>*/}
      {/*<Blog/>*/}
    </main>
  );
};

SectionsOne.propTypes = {
  general: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  general: JSON.parse(state.INIT.general),
});

export default connect(mapStateToProps, {})(withRouter(Home));
