import React from "react";
import { useOutletContext } from "react-router-dom";

import AdminManageProducts from "../../components/AdminManageProducts";
import AddCategories from "../../components/AddCategory";
import AdminManageOrders from "../../components/AdminManageOrders";
import AdminSummary from "../../components/AdminSummary";
import "./style.css";
import AdminManageUsers from "../../components/AdminManageUsers";
import AdminManageCatigories from "../../components/AdminManageCategories";

const AdminDashboard = () => {
  const { activeSection } = useOutletContext();

  const renderSection = () => {
    switch (activeSection) {
      case "summary":
        return <AdminSummary />;
      case "manageCategories":
        return <AdminManageCatigories />;
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
      <div className="admin-dashboard-content">{renderSection()}</div>
    </div>
  );
};

export default AdminDashboard;
