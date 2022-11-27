import React from "react";
import Intro from "./includes/intro/Intro";
import ProductsLoving from "./includes/Products/productsLoving/ProductsLoving";
// import IconBoxes from './includes/iconBoxes/IconBoxes'
// import PopularCategory from './includes/popularCategory/PopularCategory'
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

const Home = (props) => {
  const { general } = props;
  console.log("general", general);
  const section_one_active = getSetting(general, "section_one_active");
  const section_two_active = getSetting(general, "section_two_active");
  const section_three_active = getSetting(general, "section_three_active");
  const section_four_active = getSetting(general, "section_four_active");
  const section_five_active = getSetting(general, "section_five_active");

  return (
    <main className='main' style={{ backgroundColor: "#fafafa" }}>
      <Intro />
      {/*<IconBoxes/>*/}
      {/*<PopularCategory/>*/}

      {section_one_active === "enable" && <SectionsOne general={general} />}
      {section_two_active === "enable" && <SectionsTwo general={general} />}
      {section_three_active === "enable" && <SectionsThree general={general} />}
      {section_four_active === "enable" && <SectionsFour general={general} />}
      {section_five_active === "enable" && <SectionsFive general={general} />}

      {/* <ProductsLoving /> */}
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
