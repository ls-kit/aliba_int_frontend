import React from "react";
import MessengerCustomerChat from "react-messenger-customer-chat";

const MessengerChat = () => {
  return (
    <MessengerCustomerChat
      pageId={process.env.REACT_APP_FACEBOOK_PAGE_KEY}
      appId={process.env.REACT_APP_FACEBOOK_APP_KEY}
    />
  );
};

export default MessengerChat;
