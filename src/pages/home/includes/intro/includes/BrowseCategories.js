import React from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { Link, withRouter } from "react-router-dom";
import MegaMenuItem from "./MegaMenuItem";
import BrowseCategorySkeleton from "../../../../../skeleton/sectionSkeleton/BrowseCategorySkeleton";
import { filter_children_cats, filter_parent_cats, loadAsset } from "../../../../../utils/Helpers";

const BrowseCategories = (props) => {
  const { categories, category_loading } = props;

  if (category_loading) {
    return <BrowseCategorySkeleton />;
  }

  const mainParent = filter_parent_cats(categories);
  // console.log("mainParent from BC", mainParent[0].otc_id);

  const parents = filter_children_cats(categories, mainParent[0]?.otc_id);
  // console.log("parents from BC", parents);

  return (
    <nav className='side-nav'>
      {/* <div className='sidenav-title letter-spacing-normal font-size-normal d-flex justify-content-xl-between align-items-center bg-primary justify-content-center text-truncate'>
        Categories
        <i className='icon-bars float-right h5 text-white m-0 d-none d-xl-block' />
      </div> */}
      <ul className='menu-vertical sf-arrows sf-js-enabled p-0' style={{ touchAction: "pan-y" }}>
        {parents.length > 0 &&
          parents.map((parent, index) => {
            console.log("parent from bc", parent);
            if (parent.children_count) {
              return <MegaMenuItem key={index} parent={parent} categories={categories} />;
            } else {
              return (
                <li key={index}>
                  <Link to={`/shop/${parent.slug}`} className='text-dark'>
                    {parent.icon ? (
                      <img
                        src={loadAsset(parent.icon)}
                        style={{ width: "22px", display: "inline", marginRight: "1rem" }}
                        alt={parent.name}
                      />
                    ) : (
                      <i className='icon-laptop' />
                    )}
                  </Link>
                </li>
              );
            }
          })}
      </ul>
    </nav>
  );
};

const mapStateToProps = (state) => ({
  categories: state.INIT.categories,
  category_loading: state.LOADING.category_loading,
});

export default connect(mapStateToProps, {})(withRouter(BrowseCategories));
