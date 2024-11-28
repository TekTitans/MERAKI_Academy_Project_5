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

const CategoriesPage = () => {
  const history = useNavigate();
  const { loading, error, message } = useSelector((state) => state.order);
  const { token } = useSelector((state) => state.auth);
  const [isInWishlist, setIsInWishlist] = useState(false);
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
    setModalVisible(false); // This function hides the modal
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
      <div className="All_Cat_Page_content">
        <div className="cat-page">
          {error && <div className="error-message">Error: {error}</div>}
          {message && <div className="success-message">{message}</div>}

          <div className="SDB_product-list">
            <div className="Cat_Header">
              <div className="filters">
                <input
                  type="text"
                  name="search"
                  placeholder="Search By Category Name"
                  value={filters.search}
                  onChange={handleFilterChange}
                />
                <button
                  className="clear-filters-button"
                  onClick={handleClearFilters}
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="SDB_product-grid">
              {loading ? (
                <div class="loading-container">
                  <div class="loading-circle"></div>
                </div>
              ) : (
                filteredCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className="Category-card"
                    onClick={() => {
                      history(`/category/${cat.id}`);
                    }}
                  >
                    <img
                      src={
                        cat.category_image ||
                        "https://res.cloudinary.com/drhborpt0/image/upload/v1732778621/6689747_xi1mhr.jpg"
                      }
                      alt={cat.name}
                      className="SDB_product-image"
                      onError={(e) =>
                        (e.target.src =
                          "https://res.cloudinary.com/drhborpt0/image/upload/v1732778621/6689747_xi1mhr.jpg")
                      }
                    />

                    <button
                      className="wishlist-button"
                      onClick={() => handleWishlist(product.id)}
                    >
                      ♥
                    </button>

                    <div className="SDB_product-info">
                      <h3 className="SDB_product-title">{cat.name}</h3>
                      <p className="SDB_product-description">
                        {cat.description || "No Description"}
                      </p>

                      <div className="product-actions"></div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {paginationControls}
          </div>
        </div>

        <Modal
          isOpen={modalVisible}
          autoClose={closeModal} // Pass closeModal as the autoClose handler
          message={modalMessage}
        />
      </div>
    </div>
  );
};

export default CategoriesPage;
