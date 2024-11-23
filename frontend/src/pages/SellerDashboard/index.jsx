import React, { useState, useEffect } from "react";
import SellerProducts from "../../components/SellerProducts";
import AddProduct from "../../components/AddProduct";
import "./style.css";
import SellerOrders from "../../components/SellerOrders";

const SellerDashboard = () => {
  const [activeSection, setActiveSection] = useState("manageProduct");
  const [message, setMessage] = useState(null);

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "addProduct":
        return (
          <AddProduct
            handleCancelAdd={() => setActiveSection("manageProduct")}
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
        return (
          <div className="product-management-page">
            <h2 className="page-title">Reviews</h2>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="seller-dashboard-container">
      <div className="SDB_Navbar">
        <h1>Seller Dashboard</h1>
        <div className="SDB_Btns">
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
