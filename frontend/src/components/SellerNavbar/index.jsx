import React, { useState } from "react";
import "./style.css";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaBoxOpen,
  FaPlus,
  FaShoppingCart,
  FaStar,
} from "react-icons/fa";

const SellerNavbar = ({ activeSection, setActiveSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="seller-navbar">
      <div className="seller_navbar-logo">
        <h1>Seller Dashboard</h1>
       
      </div>
      <button className="seller_navbar-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      <ul className={`seller_navbar-links ${isMenuOpen ? "open" : ""}`}>
        <li
          className={activeSection === "summary" ? "active" : ""}
          onClick={() => {
            setActiveSection("summary");
            setIsMenuOpen(false);
          }}
        >
          <FaHome className="seller_navbar-icon" />
          Summary
        </li>
        <li
          className={activeSection === "manageProduct" ? "active" : ""}
          onClick={() => {
            setActiveSection("manageProduct");
            setIsMenuOpen(false);
          }}
        >
          <FaBoxOpen className="seller_navbar-icon" />
          Products Management
        </li>
        <li
          className={activeSection === "addProduct" ? "active" : ""}
          onClick={() => {
            setActiveSection("addProduct");
            setIsMenuOpen(false);
          }}
        >
          <FaPlus className="seller_navbar-icon" />
          Add Product
        </li>
        <li
          className={activeSection === "myOrders" ? "active" : ""}
          onClick={() => {
            setActiveSection("myOrders");
            setIsMenuOpen(false);
          }}
        >
          <FaShoppingCart className="seller_navbar-icon" />
          Orders
        </li>
        <li
          className={activeSection === "myReviews" ? "active" : ""}
          onClick={() => {
            setActiveSection("myReviews");
            setIsMenuOpen(false);
          }}
        >
          <FaStar className="seller_navbar-icon" />
          Reviews
        </li>
      </ul>
    </nav>
  );
};

export default SellerNavbar;
