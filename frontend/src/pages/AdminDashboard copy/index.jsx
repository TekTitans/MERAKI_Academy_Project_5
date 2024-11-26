import React, { useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import AdminManageProducts from "../../components/AdminManageProducts";
import AddCategories from "../../components/AddCategory";
import AdminManageOrders from "../../components/AdminManageOrders";
import AdminSummary from "../../components/AdminSummary";
import "./style.css";
import AdminManageUsers from "../../components/AdminManageUsers";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("summary");

  const renderSection = () => {
    switch (activeSection) {
      case "summary":
        return <AdminSummary />;
      case "addCategory":
        return <AddCategories />;
      case "manageUsers":
        return <AdminManageUsers />;
      case "manageProducts":
        return <AdminManageProducts />;
      case "manageOrders":
        return <AdminManageOrders />;

      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard-container">
      <AdminNavbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <div className="admin-dashboard-content">{renderSection()}</div>
    </div>
  );
};

export default AdminDashboard;
