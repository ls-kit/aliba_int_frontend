import React from "react";
import PropTypes from "prop-types";
import MyAccount from "./MyAccount";
import MyOrders from "./MyOrders";
import AddressBook from "./AddressBook";
import DashboardDefault from "./DashboardDefault";
import Profile from "./Profile";
import PendingOrders from "./PendingOrders";
import ProcessingOrders from "./ProcessingOrders";
import CompleteOrders from "./CompleteOrders";

const SwitchSection = (props) => {
  switch (props.section) {
    case "dashboard":
      return <DashboardDefault />;

    case "orders":
      return <MyOrders />;

    case "pending-orders":
      return <PendingOrders />;
    case "processing-orders":
      return <ProcessingOrders />;
    case "complete-orders":
      return <CompleteOrders />;

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
