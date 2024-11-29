import { useEffect, useState } from "react";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";

import Modal from "../modal/Modal";
import {
  setLoading,
  setError,
  setMessage,
} from "../../components/redux/reducers/orders";
import "./style.css";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";

const CategoriesPage = () => {
  const history = useNavigate();
  const { loading, error, message } = useSelector((state) => state.order);
  const { token } = useSelector((state) => state.auth);

  const userId = useSelector((state) => state.auth.userId);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(9);
  const [totalPages, setTotalPages] = useState(0);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const dispatch = useDispatch();
  const closeModal = () => {
    setModalVisible(false);
  };

  const [filters, setFilters] = useState({
    search: "",
  });

  const fetchCategories = async (page = 1) => {
    try {
      dispatch(setLoading(true));

      if (!token) {
        dispatch(setLoading(false));
        dispatch(setError("No token found."));
        return;
      }
      const response = await axios.get(
        `http://localhost:5000/category?page=${page}&size=${pageSize}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTotalPages(Math.ceil(response.data.totalCategories / pageSize));
      dispatch(setLoading(false));
      setCategories(response.data.category);
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(setError("Error fetching Categories"));
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories(currentPage);
  }, [dispatch, token, currentPage]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    setCurrentPage(1);
  };
  const handleClearFilters = () => {
    setFilters({ search: "" });
    setCurrentPage(1);
  };

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      !filters.search ||
      category.name
        .toString()
        .toLowerCase()
        .includes(filters.search.toLowerCase());

    return matchesSearch;
  });

  useEffect(() => {
    fetchCategories(currentPage);
  }, [currentPage, selectedCategory]);

  useEffect(() => {
    if (error || message) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      const timer = setTimeout(() => {
        dispatch(setError(null));
        dispatch(setMessage(null));
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, message, dispatch]);

  if (loading)
    return (
      <div class="loading-container_Main">
        <div class="loading-circle"></div>
      </div>
    );

  return (
    <div className="All_Cat_Page_Container">
      <Breadcrumb />

      <div className="all-cat-page-content">
        <div className="category-page">
          {error && (
            <div className="categories_error-message">Error: {error}</div>
          )}
          {message && (
            <div className="categories_success-message">{message}</div>
          )}

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

          {loading ? (
            <div className="loading-container">
              <div className="loading-circle"></div>
            </div>
          ) : (
            <div className="categories-container">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="category-card"
                  onClick={() => history(`/shop/${cat.id}`)}
                >
                  <div className="category-badge">
                    {cat.length || 0} items
                  </div>

                  <div className="image-container">
                    <img
                      src={
                        cat.category_image ||
                        "https://res.cloudinary.com/drhborpt0/image/upload/v1732778621/6689747_xi1mhr.jpg"
                      }
                      alt={cat.name}
                      className="category-image"
                      onError={(e) =>
                        (e.target.src =
                          "https://res.cloudinary.com/drhborpt0/image/upload/v1732778621/6689747_xi1mhr.jpg")
                      }
                    />
                    <div className="hover-overlay">View Category</div>
                  </div>

                  <div className="category-info">
                    <h3 className="category-title">{cat.name}</h3>
                    <p className="category-description">
                      {cat.description || "Explore this category!"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Modal
          isOpen={modalVisible}
          autoClose={closeModal}
          message={modalMessage}
        />
      </div>
    </div>
  );
};

export default CategoriesPage;
