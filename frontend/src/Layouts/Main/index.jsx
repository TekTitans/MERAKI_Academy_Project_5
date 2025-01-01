import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import "./style.css";
import Navbar from "../../components/Navbar";
import SellerNavbar from "../../components/SellerNavbar";
import AdminNavbar from "../../components/AdminNavbar";
import Footer from "../../components/Footer/Footer";

export default function Main() {
  const roleId = useSelector((state) => state.auth.roleId);

  return (
    <div className="root-layout">
    <header>
      {roleId === 1 && <SellerNavbar />}
      {roleId === 2 && <AdminNavbar />}
      {(roleId === 3 || !roleId) && <Navbar />}
    </header>
    <main className="main-content">
      <Outlet />
    </main>
    <Footer />
  </div>
  
  );
}
