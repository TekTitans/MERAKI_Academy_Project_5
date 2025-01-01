import React from "react";
import { useOutletContext } from "react-router-dom";
import SellerProducts from "../../components/SellerProducts";
import AddProduct from "../../components/AddProduct";
import SellerOrders from "../../components/SellerOrders";
import SellerSummary from "../../components/SellerSummary";
import SellerReviews from "../../components/SellerReviews";
import "./style.css";
import UserProfile from "../UserProfile";

const SellerDashboard = () => {
  const { activeSection } = useOutletContext();

  const renderSection = () => {
    switch (activeSection) {
      case "summary":
        return <SellerSummary />;
      case "addProduct":
        return <AddProduct />;
      case "manageProduct":
        return <SellerProducts />;
      case "myOrders":
        return <SellerOrders />;
      case "myReviews":
        return <SellerReviews />;
      case "Profile":
        return <UserProfile />;
      default:
        return null;
    }
  };

  return (
    <div className="seller-dashboard-container">
      <div className="seller-dashboard-content">{renderSection()}</div>
    </div>
  );
};

export default SellerDashboard;
