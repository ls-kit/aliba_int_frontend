import React from "react";

const PriceRange = (props) => {
  console.log("props from pricerange", props);
  const { totalQty, bulkPriceQuantity } = props;

  let first = bulkPriceQuantity[0]?.MinQuantity;
  let second = bulkPriceQuantity[1]?.MinQuantity;
  let third = bulkPriceQuantity[2]?.MinQuantity;

  // quantity box active deactive
  const addActiveClass = (MinQuantity, MaxQuantity) => {
    let a = totalQty;
    let b = document.querySelectorAll(".range");
    let i;
    for (i = 0; i < b.length; i++) {
      if (a < first) {
        b[i].classList.remove("rangeActive");
      } else if (a == first || a < second) {
        b[1].classList.remove("rangeActive");
        b[2].classList.remove("rangeActive");
        b[0].classList.add("rangeActive");
      } else if (a == second || a < third) {
        b[0].classList.remove("rangeActive");
        b[2].classList.remove("rangeActive");
        b[1].classList.add("rangeActive");
      } else if (a == third) {
        b[1].classList.remove("rangeActive");
        b[2].classList.add("rangeActive");
      }
    }
  };
<<<<<<< HEAD
=======
  console.log("bulkPriceQuantity", bulkPriceQuantity);
  // console.log("first", first);
  // console.log("first", second);
  // console.log("first", third);
  // console.log("quantity", totalQty);
>>>>>>> 5c21ff8c140f509a8eae1717eb77dbe46737a210

  return (
    <div className='ranges'>
      {bulkPriceQuantity.map((pqR, index) => {
        // console.log(pqR);
        const {
          MaxQuantity,
          MinQuantity,
          Price: { Base },
        } = pqR;
        // console.log("MinQuantity", MinQuantity);
        addActiveClass(MinQuantity, MaxQuantity);

        return (
          <div className='range' key={index}>
            <span className='amount'>৳ {Base}</span>
            <div className='piece'>{MinQuantity} or more</div>
          </div>
        );
      })}
    </div>
  );
};

export default PriceRange;
