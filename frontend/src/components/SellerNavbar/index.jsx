import React from "react";
import "./style.css";
import {
  FaHome,
  FaBoxOpen,
  FaPlus,
  FaShoppingCart,
  FaStar,
} from "react-icons/fa";

const SellerNavbar = ({ activeSection, setActiveSection }) => {
  return (
    <nav className="seller-navbar">
      <div className="navbar-logo">
        <h1>Seller Dashboard</h1>
      </div>
      <ul className="navbar-links">
        <li
          className={activeSection === "summary" ? "active" : ""}
          onClick={() => setActiveSection("summary")}
        >
          <FaHome className="navbar-icon" />
          Summary
        </li>
        <li
          className={activeSection === "manageProduct" ? "active" : ""}
          onClick={() => setActiveSection("manageProduct")}
        >
          <FaBoxOpen className="navbar-icon" />
          Products Management
        </li>
        <li
          className={activeSection === "addProduct" ? "active" : ""}
          onClick={() => setActiveSection("addProduct")}
        >
          <FaPlus className="navbar-icon" />
          Add Product
        </li>
        <li
          className={activeSection === "myOrders" ? "active" : ""}
          onClick={() => setActiveSection("myOrders")}
        >
          <FaShoppingCart className="navbar-icon" />
          Orders
        </li>
        <li
          className={activeSection === "myReviews" ? "active" : ""}
          onClick={() => setActiveSection("myReviews")}
        >
          <FaStar className="navbar-icon" />
          Reviews
        </li>
      </ul>
    </nav>
  );
};

export default SellerNavbar;
