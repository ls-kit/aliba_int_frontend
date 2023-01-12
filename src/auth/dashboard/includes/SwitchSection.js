import React from "react";
import PropTypes from "prop-types";
import MyAccount from "./MyAccount";
import MyOrders from "./MyOrders";
import AddressBook from "./AddressBook";
import DashboardDefault from "./DashboardDefault";
import Profile from "./Profile";

const SwitchSection = (props) => {
  switch (props.section) {
    case "dashboard":
      return <DashboardDefault />;

    case "orders":
      return <MyOrders status={"orders"} orderText={"My Orders"} />;

    case "pending-orders":
      return <MyOrders status={"pending-orders"} orderText={"Pending Orders"} />;

    case "processing-orders":
      return <MyOrders status={"processing-orders"} orderText={"Processing Orders"} />;

    case "complete-orders":
      return <MyOrders status={"complete-orders"} orderText={"Completed Orders"} />;

    case "addresses":
      return <AddressBook />;

    case "account":
      return <Profile />;

    default:
      return <MyAccount />;
  }
};

SwitchSection.propTypes = {
  section: PropTypes.string.isRequired,
};

export default SwitchSection;
