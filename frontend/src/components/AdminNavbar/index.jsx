import React, { useState } from "react";
import "./style.css";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaBoxOpen,
  FaPlus,
  FaShoppingCart,
  FaUserCog,
  FaClipboardList,
} from "react-icons/fa";

const AdminNavbar = ({ activeSection, setActiveSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="admin-navbar">
      <div className="navbar-logo">
        <h1>Admin Dashboard</h1>
      </div>
      <button className="menu-toggle" onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </button>
      <ul className={`navbar-links ${isMenuOpen ? "open" : ""}`}>
        <li
          className={activeSection === "summary" ? "active" : ""}
          onClick={() => {
            setActiveSection("summary");
            setIsMenuOpen(false);
          }}
        >
          <FaHome className="navbar-icon" />
          Summary
        </li>
        <li
          className={activeSection === "manageCategories" ? "active" : ""}
          onClick={() => {
            setActiveSection("manageCategories");
            setIsMenuOpen(false);
          }}
        >
          <FaClipboardList className="navbar-icon" />
          Categories
        </li>
        <li
          className={activeSection === "addCategory" ? "active" : ""}
          onClick={() => {
            setActiveSection("addCategory");
            setIsMenuOpen(false);
          }}
        >
          <FaPlus className="navbar-icon" />
        </li>
        <li
          className={activeSection === "manageUsers" ? "active" : ""}
          onClick={() => {
            setActiveSection("manageUsers");
            setIsMenuOpen(false);
          }}
        >
          <FaUserCog className="navbar-icon" />
          Manage Users
        </li>
        <li
          className={activeSection === "manageOrders" ? "active" : ""}
          onClick={() => {
            setActiveSection("manageOrders");
            setIsMenuOpen(false);
          }}
        >
          <FaShoppingCart className="navbar-icon" />
          Manage Orders
        </li>
        <li
          className={activeSection === "manageProduct" ? "active" : ""}
          onClick={() => {
            setActiveSection("manageProduct");
            setIsMenuOpen(false);
          }}
        >
          <FaBoxOpen className="navbar-icon" />
          Products Management
        </li>
      </ul>
    </nav>
  );
};

export default AdminNavbar;
