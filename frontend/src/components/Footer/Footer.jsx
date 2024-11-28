import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <Link to="/" className="footer-logo-link">
            <span className="brand">SmartCart</span>
          </Link>
        </div>

        <div className="footer-links">
          <ul>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms-and-conditions">Terms & Conditions</Link>
            </li>
          </ul>
        </div>

        <div className="footer-socials">
          <Link to="/">
            <FaFacebook />
          </Link>
          <Link to="/">
            <FaInstagram />
          </Link>
          <Link to="/">
            {" "}
            <FaTwitter />
          </Link>
          <Link to="/">
            <FaLinkedin />
          </Link>
        </div>

        <div className="footer-copy">
          <p className="copy">&copy; 2024 SmartCart. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
