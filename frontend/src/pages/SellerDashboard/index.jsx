import React, { useState, useEffect } from "react";
import SellerProducts from "../../components/SellerProducts";
import AddProduct from "../../components/AddProduct";
import "./style.css";
import SellerOrders from "../../components/SellerOrders";
import SellerSummary from "../../components/SellerSummary";
import SellerReviews from "../../components/SellerReviews";

const SellerDashboard = () => {
  const [activeSection, setActiveSection] = useState("summary");
  const [message, setMessage] = useState(null);

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "summary":
        return (
          <SellerSummary
            message={message}
            setMessage={setMessage}
            showMessage={showMessage}
          />
        );
      case "addProduct":
        return (
          <AddProduct
            handleCancelAdd={() => setActiveSection("summary")}
            message={message}
            setMessage={setMessage}
            showMessage={showMessage}
          />
        );
      case "manageProduct":
        return (
          <SellerProducts
            message={message}
            setMessage={setMessage}
            showMessage={showMessage}
          />
        );
      case "myOrders":
        return <SellerOrders />;
      case "myReviews":
        return <SellerReviews />;
      default:
        return null;
    }
  };

  return (
    <div className="seller-dashboard-container">
      <div className="SDB_Navbar">
        <h1>Seller Dashboard</h1>
        <div className="SDB_Btns">
          <button className="SDB" onClick={() => setActiveSection("summary")}>
            Summary
          </button>
          <button
            className="SDB"
            onClick={() => setActiveSection("manageProduct")}
          >
            Products Management
          </button>
          <button
            className="SDB"
            onClick={() => setActiveSection("addProduct")}
          >
            Add Product
          </button>
          <button className="SDB" onClick={() => setActiveSection("myOrders")}>
            Orders
          </button>
          <button className="SDB" onClick={() => setActiveSection("myReviews")}>
            Reviews{" "}
          </button>
        </div>
      </div>
      <div className="seller-products-section">{renderSection()}</div>
    </div>
  );
};

export default SellerDashboard;
