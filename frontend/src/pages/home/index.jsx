import React, { useEffect, useState } from "react";
import "./style.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../../components/redux/reducers/product/product";
import { Link, useNavigate } from "react-router-dom";

export const Home = () => {
  const search = useSelector((state) => {
    return state.product.search;
  });
  const Navigate = useNavigate();

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Our Store</h1>
          <p>Discover the best products at unbeatable prices.</p>
          <button onClick={() => Navigate("/Shop")}>Shop Now</button>
        </div>
      </section>

      <section className="featured-products">
        <h2>Featured Products</h2>
        <div className="product-grid">
          <div className="product-card">
            <img src="product-image.jpg" alt="Product" />
            <h3>Product Name</h3>
            <p>$Price</p>
            <button onClick={() => console.log("Buy Now clicked")}>
              Buy Now
            </button>
          </div>
        </div>
      </section>

      <footer>
        <div className="social-media">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        </div>
        <div className="footer-links">
          <a href="/about">About Us</a>
          <a href="/terms">Terms & Conditions</a>
          <a href="/privacy">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
};
export default Home;
