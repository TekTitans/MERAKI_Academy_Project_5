import React, { useState } from "react";
import "./style.css";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../redux/reducers/auth";
import { setProducts } from "../redux/reducers/product/product";

import axios from "axios";

const Navbar = () => {
  const [name, setName] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const history = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const products = useSelector((state) => {
    return state.product.products;
  });

  const toggleMenu = () => setIsOpen(!isOpen);
  const handleSearch = () => {
    axios
      .get(`http://localhost:5000/products/serach/${name}`)
      .then((respone) => {
        console.log(respone.data.product);
        dispatch(setProducts(respone.data.product));
        setIsSearched(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //console.log(products);

  const handleLogout = () => {
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
          <a href="#contact">Contact Us</a>
        </li>
        <li>
          <a href="#about">About</a>
        </li>
      </ul>

      {/* Search Bar */}
      <div className="navbar-search">
        <form>
          <input
            type="text"
            onClick={handleSearch}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="Search..."
          />
        </form>
      </div>

      {/* Cart & Login */}
      <div className="navbar-icons">
        <a href="#cart">
          <FaShoppingCart />
        </a>
        {isLoggedIn ? (
          <Link to="/users/login" className="login-btn" onClick={handleLogout}>
            Logout
          </Link>
        ) : (
          <Link to="/users/login" className="login-btn">
            Login
          </Link>
        )}

        {/* <a href="#login" className="login-btn">
          Login
        </a> */}
      </div>

      {/* Mobile Menu Toggle */}
      <button className="navbar-toggle" onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>
    </nav>
  );
};

export default Navbar;
