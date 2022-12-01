import React from "react";

const PriceRange = (props) => {
  // console.log("props", props);
  const { totalQty, bulkPriceQuantity } = props;
  return (
    <div className='ranges'>
      {bulkPriceQuantity.map((pqR, index) => {
        // console.log(pqR);
        const {
          MaxQuantity,
          MinQuantity,
          Price: { Base },
        } = pqR;
        return (
          <div className={`range ${MinQuantity <= totalQty && "rangeActive"}`} key={index}>
            <span className='amount'>৳ {Base}</span>
            <div className='piece'>{MinQuantity} or more</div>
          </div>
        );
      })}
    </div>
  );
};

export default PriceRange;
