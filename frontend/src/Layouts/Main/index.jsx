import { Outlet } from "react-router-dom";
import "./style.css";
import Navbar from "../../components/Navbar";
import Category from "../../components/category";

export default function Main() {
  return (
    <div className="root-layout">
      <header>
        <Navbar />
        <Category />
      </header>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
