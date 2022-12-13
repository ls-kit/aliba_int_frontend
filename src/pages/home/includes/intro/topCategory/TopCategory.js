import React from "react";
import { Link } from "react-router-dom";
import { filter_children_cats, loadCatImg } from "../../../../../utils/Helpers";
import cateImg from "../../../../../assets/images/TopCat/shose.png";
export const CateGory = (props) => {
  const { parent, categories } = props;
  const children_cats = filter_children_cats(categories, parent.otc_id);
  return (
    <>
      {children_cats.slice(0, 20).map((child, index) => {
        const { name } = child;
        return (
          <Link
            key={index}
            className='category border-0'
            to={child.children_count ? `/${parent.slug}/${child.slug}` : `/shop/${child.slug}`}
          >
            <figure>
              <span>
                <img className='cat-img' src={loadCatImg(child)} alt={child.name} />
              </span>
            </figure>
            <span>{name}</span>
          </Link>
        );
      })}
    </>
  );
};

const TopCategory = (props) => {
  const { categories, parents } = props;
  return (
    <>
      {parents.map((parent) => (
        <CateGory parent={parent} categories={categories} />
      ))}
    </>
  );
};

export default TopCategory;
