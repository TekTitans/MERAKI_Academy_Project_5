import { Outlet } from "react-router-dom";
import "./style.css";
import Navbar from "../../components/Navbar";

export default function Main() {
  return (
    <div className="root-layout">
      <header>
      <Navbar />
      </header>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
