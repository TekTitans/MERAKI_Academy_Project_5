import React, { useEffect, useState } from "react";
import "./style.css";
import {
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaShoppingBag,
  FaHeart,
} from "react-icons/fa";
//import { RiAccountCircleFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../redux/reducers/auth";
import { clearRecived } from "../../components/redux/reducers/auth";
import axios from "axios";
import { setCartNum } from "../redux/reducers/orders";

const Navbar = () => {
  const allMessages = useSelector((state) => state.auth.allMessages);
  const count = useSelector((state) => state.cart.count);

  const wishlistCount = useSelector((state) => state.product.count);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const history = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [itemCount, setItemCount] = useState(3);

  const recived = useSelector((state) => state.auth.recived);

  const { userName } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      history(`/search/${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // Clear the search input after redirection
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen), console.log(isOpen);
  };

  const handleLogout = () => {
    dispatch(setLogout());
    history("/"); // Redirect to homepage after logout
  };

  return (
    <div className="navbar_container">
      <nav className="navbar">
        <div className="nav-lift">
          <div className="logo">
            <div className="icon">
              <i className="fas fa-shopping-cart"></i>
            </div>
            <Link className="blogo" to="/">
              <span className="brand">SmartCart</span>
            </Link>
          </div>
          <div className="nav-center">
            <form
              className="navbar-search"
              id="main_navbar-search"
              onSubmit={handleSearch}
            >
              <input
                type="text"
                className="search-input"
                id="main_search-input"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
        </div>

        {/* Icons for Desktop Navbar */}
        <div className={`navbar-icons ${isOpen ? "open" : ""}`}>
          {!isOpen && (
            <>
              <Link
                to="/wishlist"
                className="navbar-wishlist"
                aria-label="Go to Wishlist"
              >
                <FaHeart />
              </Link>
              <a className="main_cart-icon">
                <FaShoppingCart onClick={() => history("/cart")} />
              </a>
              <a className="main_cart-icon">
                <FaShoppingBag onClick={() => history("/myorders")} />
              </a>
              <button
                onClick={() => dispatch(clearRecived())}
                type="button"
                className="Notification"
                aria-label="Clear Notifications"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-bell"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6" />
                </svg>
              </button>
              <div
                className="navbar-user"
                onClick={() => history("/Profile")}
                aria-label="Go to Profile"
              >
                {userName}
              </div>
              <div
                className="login-btn"
                onClick={() => {
                  if (isLoggedIn) {
                    handleLogout();
                    history("/users/login");
                  } else {
                    history("/users/login");
                  }
                }}
              >
                {isLoggedIn ? "Logout" : "Login"}
              </div>
            </>
          )}
        </div>

        {/* Options for Mobile Toggle List */}
        {isOpen && (
          <div className="toggle-options">
            <Link to="/wishlist" className="toggle-option">
              Wishlist
            </Link>
            <Link to="/cart" className="toggle-option">
              View Cart
            </Link>
            <Link to="/myorders" className="toggle-option">
              My Orders
            </Link>
            <Link to="/notifications" className="toggle-option">
              Notifications
            </Link>
            <Link to="/Profile" className="toggle-option">
              My Profile
            </Link>
            <div
              className="toggle-option"
              onClick={() => {
                if (isLoggedIn) {
                  handleLogout();
                  history("/users/login");
                } else {
                  history("/users/login");
                }
              }}
            >
              {isLoggedIn ? "Logout" : "Login"}
            </div>
          </div>
        )}
        <button
          className="main_navbar-toggle"
          onClick={toggleMenu}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>
    </div>
  );
};

export default Navbar;
