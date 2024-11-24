import React, { useState } from "react";
import "./style.css";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { RiAccountCircleFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../redux/reducers/auth";
import { setSearch } from "../redux/reducers/product/product";

const Navbar = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const history = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { userName } = useSelector((state) => state.auth);

  const handleSearch = (e) => {
    dispatch(setSearch(e.target.value));
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    dispatch(setLogout());
  };

  return (
    <div className="navbar_container">
      <nav className="navbar">
        <div className="nav-lift">
          <div className="navbar-logo">
            <h2>BrandLogo</h2>
          </div>

          <div className={`navbar-links ${isOpen ? "active" : ""}`}>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/Contact">Contact Us</Link>
              </li>
              <li>
                <Link to="/About">About</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="navbar-icons">
          <div className="navbar-search">
            <input
              type="text"
              placeholder="Search..."
              onChange={handleSearch}
            />
          </div>
          <a className="cart-icon">
            <FaShoppingCart onClick={() => history("/cart")} />
          </a>

          {isLoggedIn && (
            <div className="navbar-user" onClick={() => history("/Profile")}>
              <span className="navbar-username">{userName}</span>
            </div>
          )}

          <Link
            to={isLoggedIn ? "/users/login" : "/users/login"}
            className="login-btn"
            onClick={isLoggedIn ? handleLogout : null}
          >
            {isLoggedIn ? "Logout" : "Login"}
          </Link>

          <button className="navbar-toggle" onClick={toggleMenu}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
