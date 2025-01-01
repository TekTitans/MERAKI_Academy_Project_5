import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "./style.css";
import Navbar from "../../components/Navbar";
import SellerNavbar from "../../components/SellerNavbar";
import AdminNavbar from "../../components/AdminNavbar";
import Footer from "../../components/Footer/Footer";
import { useState } from "react";

export default function Main() {
  const roleId = useSelector((state) => state.auth.roleId);
  const [activeSection, setActiveSection] = useState("summary");

  const location = useLocation();

  return (
    <div className="root-layout">
      <header>
        {roleId == 2 && (
          <SellerNavbar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        )}
        {roleId == 1 && (
          <AdminNavbar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        )}
        {(roleId == 3 || !roleId) && <Navbar />}
      </header>
      <main className="main-content">
        {location.pathname === "/seller" ? (
          <Outlet context={{ activeSection, setActiveSection }} />
        ) : location.pathname === "/admin" ? (
          <Outlet context={{ activeSection, setActiveSection }} />
        ) : (
          <Outlet />
        )}
      </main>
      <Footer />
    </div>
  );
}
