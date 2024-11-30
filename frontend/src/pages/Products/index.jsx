import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Modal from "../modal/Modal";
import Breadcrumb from "../../components/Breadcrumb";
import {
  setLoading,
  setError,
  setMessage,
} from "../../components/redux/reducers/orders/";
import { setCategories } from "../../components/redux/reducers/Category";
import "./style.css";

const CategoriesPage = () => {
  const history = useNavigate();
  const { loading, error, message } = useSelector((state) => state.order);
  const categories = useSelector((state) => state.category.categories || []);

  const [filters, setFilters] = useState({ search: "" });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  const dispatch = useDispatch();

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [dispatch, categories.length]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

  const fetchCategories = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get(`http://localhost:5000/category`);
      dispatch(setLoading(false));
      dispatch(setCategories(response.data.category));
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(setError("Error fetching categories"));
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleClearFilters = () => setFilters({ search: "" });

  const filteredCategories = categories.filter((category) =>
    category.category_name
      .toLowerCase()
      .includes(debouncedFilters.search.toLowerCase())
  );

  const renderCategories = () => {
    if (categories.length === 0) {
      return <div>No categories available.</div>;
    }

    if (filteredCategories.length === 0) {
      return <div>No categories match your search.</div>;
    }

    return filteredCategories.map((cat) => (
      <div
        key={cat.category_id} 
        className="category-card"
        id="unique_category"
        onClick={() => history(`/shop/${cat.category_id}`)} 
        aria-label={`View ${cat.category_name} category`}
      >
        <div className="category-badge">
          {cat.product_count} {cat.product_count === 1 ? "item" : "items"}
        </div>

        <div className="image-container">
          <img
            src={
              cat.category_image ||
              "https://res.cloudinary.com/drhborpt0/image/upload/v1732778621/6689747_xi1mhr.jpg"
            }
            alt={cat.category_name}
            className="category-image"
            onError={(e) =>
              (e.target.src =
                "https://res.cloudinary.com/drhborpt0/image/upload/v1732778621/6689747_xi1mhr.jpg")
            }
          />
          <div className="hover-overlay">View Category</div>
        </div>
        <div className="category-info">
          <h3 className="category-title">{cat.category_name}</h3>{" "}
          <p className="category-description">
            {cat.category_description || "Explore this category!"}{" "}
          </p>
        </div>
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="loading-container_Main">
        <div className="loading-circle"></div>
      </div>
    );
  }

  if (error) {
    return <div className="categories_error-message">Error: {error}</div>;
  }

  return (
    <div className="All_Cat_Page_Container">
      <Breadcrumb />
      <div className="all-cat-page-content">
        <div className="category-header">
          <div className="filters-container">
            <input
              type="text"
              name="search"
              placeholder="Search by Category Name"
              value={filters.search}
              onChange={handleFilterChange}
              className="categories_filter-search"
            />
            <button
              className="categories_clear-filters-button"
              onClick={handleClearFilters}
            >
              Clear
            </button>
          </div>
        </div>
        <div className="categories-container">{renderCategories()}</div>
      </div>
    </div>
  );
};

export default CategoriesPage;
