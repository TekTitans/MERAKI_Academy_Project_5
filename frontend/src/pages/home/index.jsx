import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCategories } from "../../components/redux/reducers/Category/";
import axios from "axios";
import "./style.css";
import {
  setLoading,
  setError,
  setMessage,
} from "../../components/redux/reducers/orders";
import Navbar from "../../components/Navbar";
const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.order);

  const categories = useSelector((state) => state.category.categories);
  const roleId = useSelector((state) => state.auth.roleId);

  useEffect(() => {

    const fetchCategories = async () => {
      try {
        dispatch(setLoading(true));

        const response = await axios.get(`http://localhost:5000/category`);
        dispatch(setCategories(response.data.category));
        dispatch(setLoading(false));
      } catch (error) {
        console.error("Error fetching categories:", error);
        dispatch(setError("Error fetching categories"));

        dispatch(setLoading(false));
      }
    };

    fetchCategories();
  }, [dispatch]);

  useEffect(() => {
    if (error || message) {
      const timer = setTimeout(() => {
        dispatch(setError(null));
        dispatch(setMessage(null));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, message, dispatch]);
  return (
    <>
      <div>
        {loading ? (
          <div className="loading-container">
            <div className="loader">
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
            </div>
            <span>Loading...</span>
          </div>
        ) : (
          <>
            {error && <div className="error-message">Error: {error}</div>}
            {message && <div className="success-message">{message}</div>}
          </>
        )}
      </div>

      <div className="homepage">
        <header className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to <span>SmartCart</span>
            </h1>
            <p className="hero-subtitle">
              Discover amazing products, great deals, and fast shipping. Your
              one-stop shop for everything you need.
            </p>
            <button
              className="shop-now-button"
              onClick={() => navigate("/shop")}
            >
              Shop Now
            </button>
          </div>
        </header>

        <section className="categories-section">
          <h2 className="section-title">Shop by Categories</h2>

          {categories.length === 0 ? (
            <p>Loading categories...</p>
          ) : (
            <div
              id="categoriesCarousel"
              className="carousel slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-indicators">
                {categories.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    data-bs-target="#categoriesCarousel"
                    data-bs-slide-to={index}
                    className={index === 0 ? "active" : ""}
                    aria-current={index === 0 ? "true" : undefined}
                    aria-label={`Slide ${index + 1}`}
                  ></button>
                ))}
              </div>

              <div className="carousel-inner">
                {categories.map((category, index) => (
                  <div
                    key={category.category_id}
                    className={`carousel-item ${index === 0 ? "active" : ""}`}
                    onClick={() => navigate(`/shop/${category.category_id}`)}
                  >
                    <img
                      src={
                        category.category_image ||
                        "https://via.placeholder.com/800x400"
                      }
                      className="d-block w-100 category-image"
                      alt={category.category_name}
                    />
                    <div className="carousel-caption d-none d-md-block">
                      <h5 className="category-name">
                        {category.category_name}
                      </h5>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#categoriesCarousel"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#categoriesCarousel"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default HomePage;
