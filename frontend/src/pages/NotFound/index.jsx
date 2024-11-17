import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import "./style.css";

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-box">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Oops! Page not found</h2>
        <p className="not-found-description">
          Sorry, the page you're looking for might have been moved or no longer exists. Let’s get you back on track!
        </p>
        <NavLink to="/" className="home-link">
          <FaHome className="home-icon" /> Go to Home
        </NavLink>
      </div>
    </div>
  );
}
