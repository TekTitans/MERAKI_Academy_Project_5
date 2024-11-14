
import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import "./index.css";
import Navbar from "./components/navbar/Navbar";

import ResetPassword from "./components/ResetPassword";
import { Home } from "./pages/home/Home";
import Details from "./pages/productdetails/Details";

function App() {
  return (
    <div className="App">
      <Navbar />
      <>
        <Link className="Link" to="/users">
          Register
        </Link>
        <Link className="Link" to="/users/login">
          Login
        </Link>
        <Link className="Link" to="/users/reset-password/:resetToken">
          Reset Password
        </Link>
      </>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Register />} />
        <Route path="/users/login" element={<Login />} />
        <Route path="/details/:pId" element={<Details />} />
        <Route
          path="/users/reset-password/:resetToken"
          element={<ResetPassword />}
        />
        <Route path="/users/verifyEmail/:token" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
