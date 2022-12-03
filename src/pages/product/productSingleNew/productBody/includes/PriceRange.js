import React from "react";

const PriceRange = (props) => {
  // console.log("props", props);
  const { totalQty, bulkPriceQuantity } = props;

  // quantity box active deactive 
  let a = totalQty;
  let b = document.querySelectorAll('.range');
  let i;
  for (i = 0; i < b.length; i++) {
    if (a < 20) {
      b[i].classList.remove("mystyle");
    } else if (a == 20 || a < 30) {
      b[1].classList.remove("mystyle");
      b[2].classList.remove("mystyle");
      b[0].classList.add("mystyle");
    } else if (a == 30 || a < 40) {
      b[0].classList.remove("mystyle");
      b[2].classList.remove("mystyle");
      b[1].classList.add("mystyle");
    } else if (a == 40) {
      b[1].classList.remove("mystyle");
      b[2].classList.add("mystyle");
    } 
  }

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
          <div className={`range`} key={index}>
            <span className='amount'>৳ {Base}</span>
            <div className='piece'>{MinQuantity} or more</div>
          </div>
        );
      })}
    </div>
  );
};

export default PriceRange;
