import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section about">
          <h3>About Us</h3>
          <p>
            We are dedicated to providing the best shopping experience. Our
            mission is to deliver quality and satisfaction to every customer.
          </p>
        </div>
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link to="/About">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              <a href="/faq">FAQ</a>
            </li>
            <li>
              <Link to="/privacy">Privacy</Link>
            </li>
          </ul>
        </div>
        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <p>Email: support@example.com</p>
          <p>Phone: +123 456 789</p>
          <p>Address: Amman Jordan</p>
        </div>
        <div className="footer-section social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <Link to="/"> 📘</Link>
            <Link to="/">🐦</Link>
            <Link to="/"> 📸</Link>
            <Link to="/">🔗</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="colo">&copy; 2024 Your Company. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
