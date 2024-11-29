import { useEffect, useState } from "react";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import {
  setProducts,
  incrementCount,
} from "../../components/redux/reducers/product/product";
import { Link } from "react-router-dom";

import Modal from "../modal/Modal";
import {
  setLoading,
  setError,
  setMessage,
} from "../../components/redux/reducers/orders";
import "./style.css";
import { FaArrowLeft, FaArrowRight, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";

const CategoriesPage = () => {
  const history = useNavigate();
  const { loading, error, message } = useSelector((state) => state.order);
  const { token } = useSelector((state) => state.auth);

  const userId = useSelector((state) => state.auth.userId);
  const [categories, setCategories] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);
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
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const search = useSelector((state) => {
    return state.product.search;
  });
  const products = useSelector((state) => {
    return state.product.products;
  });

  const [filters, setFilters] = useState({
    search: "",
  });

  const handleWishlist = (productId) => {
    if (!token) {
      setModalMessage("Login First");
      setModalVisible(true);
    } else {
      axios
        .post("http://localhost:5000/wishlist", { productId }, { headers })
        .then((response) => {
          if (response.data.success) {
            console.log(response);
          }
        });
    }
  };
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

  const allCategories = categories.map((elem, index) => (
    <div className="category-card" key={index}>
      <button
        className="category-button"
        onClick={() => fetchProducts(elem.id, 1)}
      >
        {elem.name}
      </button>
    </div>
  ));

  const showAllProducts = (filterProducts || []).map((product, index) => (
    <div key={index} className="product-card">
      <img
        src={product.product_image || "https://via.placeholder.com/150"}
        alt={product.title}
        className="product-image"
      />
      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-price">{product.price} JD</div>
        <Link to={`/details/${product.id}`} className="details-link">
          View Details
        </Link>
      </div>
    </div>
  ));

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

  const paginationControls = (
    <div className="pagination-controls">
      <div
        className={`pagination-arrow ${
          currentPage === 1 || totalPages === 0 ? "disabled" : ""
        }`}
        onClick={() => currentPage > 1 && setCurrentPage((prev) => prev - 1)}
        aria-disabled={currentPage === 1}
      >
        <FaArrowLeft size={20} />
      </div>
      <span className="pagination-info">
        Page {currentPage} of {totalPages}
      </span>
      <div
        className={`pagination-arrow ${
          currentPage === totalPages || totalPages === 0 ? "disabled" : ""
        }`}
        onClick={() =>
          currentPage < totalPages && setCurrentPage((prev) => prev + 1)
        }
        aria-disabled={currentPage === totalPages}
      >
        <FaArrowRight size={20} />
      </div>
    </div>
  );

  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategories(currentPage, selectedCategory);
    } else {
      fetchCategories(currentPage);
    }
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
          {error && <div className="error-message">Error: {error}</div>}
          {message && <div className="success-message">{message}</div>}

          <div className="category-header">
            <div className="filters-container">
              <input
                type="text"
                name="search"
                placeholder="Search by Category Name"
                value={filters.search}
                onChange={handleFilterChange}
                className="filter-search"
              />
              <button
                className="clear-filters-button"
                onClick={handleClearFilters}
              >
                Clear
              </button>
            </div>
          </div>

          <div className="category-grid">
            {loading ? (
              <div className="loading-container">
                <div className="loading-circle"></div>
              </div>
            ) : (
              filteredCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="category-card"
                  onClick={() => history(`/shop/${cat.id}`)}
                >
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
                  <div className="category-info">
                    <h3 className="category-title">{cat.name}</h3>
                    <p className="category-description">
                      {cat.description || "No Description"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {paginationControls}
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
