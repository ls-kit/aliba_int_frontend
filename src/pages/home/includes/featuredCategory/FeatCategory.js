import React from "react";
import { Link } from "react-router-dom";
import { loadAsset } from "../../../../utils/Helpers";

export const SubFeatCat = ({ section }) => {
  const { banner, url } = section;

  return (
    <div className='col-4'>
      <Link to={`/shop/${url}`}>
        <img className='fcatIm' src={loadAsset(banner)} alt='' />
      </Link>
    </div>
  );
};

const FeatCategory = ({ cat }) => {
  const { name, url, sections } = cat;

  return (
    <div className='col-lg-4 col-md-6 my-2 '>
      <div className='singleFeatCat'>
        <Link to={`/shop/${url}`}>
          <h6 className='fcatName'>{name}</h6>
        </Link>

        <div className='row'>
          {sections.map((section, index) => (
            <SubFeatCat section={section} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatCategory;
