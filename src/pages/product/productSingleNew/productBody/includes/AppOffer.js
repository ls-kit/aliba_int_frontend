import React, { useEffect, useState } from "react";
import _ from "lodash";
import { getProductPageCard } from "../../../../../utils/Services";
import parse from "html-react-parser";
import ProductSkeleton from "../../../../../skeleton/productSkeleton/ProductSkeleton";
import CardSkelton from "../../../../../skeleton/productSkeleton/CardSkelton";

const AppOffer = () => {
  const [loading, setLoading] = useState(true);
  const [cardRespose, setCardRespose] = useState([]);
  useEffect(() => {
    cardContent();
  }, []);

  const cardContent = async () => {
    const response = await getProductPageCard("card_one");
    if (!_.isEmpty(response)) {
      setCardRespose(response);
    }
    setLoading(false);
  };
  // console.log("cardRespose", cardRespose);

  const content = `${cardRespose?.content}`;

  if (loading) return <CardSkelton />;

  return (
    <div
      className='cardHighlight saleChinaOff mb05'
      style={{
        borderRadius: "8px",
        padding: "0.75rem 1rem",
      }}
    >
      <div className='app-in'>
        {parse(content)}
        {/* <h3 style={{ fontWeight: "bold", margin: "0.5rem 0px 0.375rem" }}>3% Cashback Offer</h3>
        <p class='mbMobile mb05' style={{ fontSize: "14px", marginRight: "1rem" }}>
          বিকাশ অথবা ব্যাংকে পেমেন্ট করলেই পাচ্ছেন ৩% ইনস্ট্যান্ট ক্যাশব্যাক, যত খুশি ততবার।
        </p> */}
        <a
          href='#'
          target='_blank'
          rel='noreferrer'
        >
          <button class='bt darkBtn' style={{ color: "white", display: "flex", alignItems: "center" }}>
            <img
              src='data:image/png;base64,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'
              alt=''
              style={{ width: "20px", marginRight: "0.5rem" }}
            />
            Download Mobile App
          </button>
        </a>
      </div>
    </div>
  );
};

export default AppOffer;
