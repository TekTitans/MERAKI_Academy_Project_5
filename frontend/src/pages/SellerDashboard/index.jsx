import React, { useState } from "react";
import SellerNavbar from "../../components/SellerNavbar";
import SellerProducts from "../../components/SellerProducts";
import AddProduct from "../../components/AddProduct";
import SellerOrders from "../../components/SellerOrders";
import SellerSummary from "../../components/SellerSummary";
import SellerReviews from "../../components/SellerReviews";
import "./style.css";
import ProfilePage from "../ProfilePage";
import UserProfile from "../UserProfile";

const SellerDashboard = () => {
  const [activeSection, setActiveSection] = useState("summary");

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
      <SellerNavbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <div className="seller-dashboard-content">{renderSection()}</div>
    </div>
  );
};

export default SellerDashboard;
