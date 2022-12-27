import React from "react";
import { useLayoutEffect } from "react";
import { useState } from "react";
import MessengerCustomerChat from "react-messenger-customer-chat";
const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }

    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
};

const MessengerChat = () => {
  let [width, height] = useWindowSize();

  width = width ? width : window.innerWidth;
  height = height ? height : window.innerHeight;
  if (width <= 751) {
    return "";
  }

  return (
    <MessengerCustomerChat
      pageId={process.env.REACT_APP_FACEBOOK_PAGE_KEY}
      appId={process.env.REACT_APP_FACEBOOK_APP_KEY}
    />
  );
};

export default MessengerChat;
