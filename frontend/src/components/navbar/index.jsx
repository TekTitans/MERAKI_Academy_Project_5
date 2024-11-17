import { useState } from "react";
import "./style.css";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../redux/reducers/auth";

const Navbar = () => {
  const Navigate=useNavigate()
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  //const history = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = (e) => {
    dispatch(setLogout());
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <h2>BrandLogo</h2>
      </div>

      {/* Navbar Links */}
      <ul className={`navbar-links ${isOpen ? "open" : ""}`}>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/Contact">Contact us</Link>
        </li>
        <li>
          <Link to="/About">About</Link>
        </li>
      </ul>

      {/* Search Bar */}
      <div className="navbar-search">
        <input type="text" placeholder="Search..." />
      </div>

      {/* Cart & Login */}
      <div className="navbar-icons">
<<<<<<< HEAD:frontend/src/components/navbar/Navbar.jsx
        <a href="#cart">
          <FaShoppingCart onClick={()=>{Navigate("/Cart")}} />
        </a>
=======
        <Link to="/Cart">
          {" "}
          <FaShoppingCart />
        </Link>
>>>>>>> f085199ff4434d15d81b43e2ded0939985f3e56f:frontend/src/components/navbar/index.jsx
        {isLoggedIn ? (
          <Link to="/users/login" className="login-btn" onClick={handleLogout}>
            Logout
          </Link>
        ) : (
          <Link to="/users/login" className="login-btn">
            Login
          </Link>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button className="navbar-toggle" onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>
    </nav>
  );
};

export default Navbar;
