import { Outlet } from "react-router-dom";
import "./style.css";
import Navbar from "../../components/Navbar";
import Category from "../../components/category";
import Footer from "../../components/Footer/Footer";

export default function Main() {
  return (
    <div className="root-layout">
      <header>
        <Navbar />
      </header>
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
