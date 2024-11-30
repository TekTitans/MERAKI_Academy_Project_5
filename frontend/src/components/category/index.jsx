import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setProducts, incrementCount } from "../redux/reducers/product/product";
import { setLoading, setError, setMessage } from "../redux/reducers/orders";
import "./style.css";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../../pages/modal/Modal";
import Breadcrumb from "../Breadcrumb";
import {
  FaArrowLeft,
  FaArrowRight,
  FaSortAmountUp,
  FaSortAmountDown,
} from "react-icons/fa";
const Category = () => {
  const { cId } = useParams();
  const [wishlist, setWishlist] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState({});

  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    stock_status: "in_stock",
    stock_quantity: "",
    color_options: "",
    size_options: "",
    product_image: "",
    category_id: "",
    subcategory_id: "",
  });
  const [sortOption, setSortOption] = useState("price-highest");
  const [activeSortType, setActiveSortType] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.order);
  const products = useSelector((state) => state.product.products);
  const { token } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    selectedDate: "",
    search: "",
    minPrice: "",
    maxPrice: "",
    status: "",
    selectedCategory: 0,
    selectedSubcategory: 0,
  });
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const history = useNavigate();
  const [filterRating, setFilterRating] = useState(0);
  const closeModal = () => {
    setModalVisible(false);
  };
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        console.log("cId", cId);

        const response = await axios.get(
          `http://localhost:5000/subcategory/${cId}`
        );
        setSubcategories(response.data.subCategory);
        console.log("response", response);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchSubcategories();
  }, []);

  const fetchProducts = async (page = 1) => {
    if (!token) {
      dispatch(setLoading(false));
      dispatch(setError("No token found."));
      return;
    }

    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const response = await axios.get(
        `http://localhost:5000/products/category/${cId}?page=${page}&size=${pageSize}`
      );

      if (response.data.products) {
        dispatch(setProducts(response.data.products));
        console.log(products);
      }
      setTotalPages(Math.ceil(response.data.totalProducts / pageSize));
      dispatch(setLoading(false));
      console.log("products: ", products);
      console.log("response", response);
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(setError("Error fetching seller products"));
    }
  };

  useEffect(() => {
    if (token) {
      fetchWishlist();
    }
  }, [token]);

  const addToWishlist = async (productId) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/wishlist",
        { productId },
        { headers }
      );
      if (response.data.success) {
        setWishlist((prevWishlist) => [...prevWishlist, productId]);
        setModalMessage("Product added to wishlist!");
      }
    } catch (error) {
      if (error.response?.status === 400) {
        setModalMessage("Product is already in your wishlist.");
      } else {
        setModalMessage("Error adding to wishlist. Please try again.");
      }
    } finally {
      setModalVisible(true);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/wishlist/${productId}`,
        {
          headers,
        }
      );
      if (response.data.success) {
        setWishlist((prevWishlist) =>
          prevWishlist.filter((id) => id !== productId)
        );
        setModalMessage("Product removed from wishlist.");
      }
    } catch (error) {
      setModalMessage("Error removing from wishlist. Please try again.");
    } finally {
      setModalVisible(true);
    }
  };

  const toggleWishlist = async (productId) => {
    setLoadingWishlist((prevState) => ({ ...prevState, [productId]: true }));

    if (wishlist.includes(productId)) {
      setWishlist((prevWishlist) =>
        prevWishlist.filter((id) => id !== productId)
      );

      try {
        await removeFromWishlist(productId);
      } catch (error) {
        setWishlist((prevWishlist) => [...prevWishlist, productId]);
        console.error("Error removing from wishlist:", error);
      }
    } else {
      setWishlist((prevWishlist) => [...prevWishlist, productId]);

      try {
        await addToWishlist(productId);
      } catch (error) {
        setWishlist((prevWishlist) =>
          prevWishlist.filter((id) => id !== productId)
        );
        console.error("Error adding to wishlist:", error);
      }
    }

    setLoadingWishlist((prevState) => ({ ...prevState, [productId]: false }));
  };

  const fetchWishlist = async () => {
    try {
      const response = await axios.get("http://localhost:5000/wishlist", {
        headers,
      });
      if (response.data.success) {
        setWishlist(response.data.wishlists.map((item) => item.product_id));
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [dispatch, token, currentPage]);

  const handleStarClick = (star) => {
    setFilterRating(star);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      selectedDate: "",
      search: "",
      minPrice: "",
      maxPrice: "",
      status: "",
      selectedCategory: 0,
      selectedSubcategory: 0,
    });
    setFilterRating(0);
    setSortOption("");
    setActiveSortType("");
  };
  const handleSortChange = (type) => {
    setSortOption((prev) => {
      const [prevType, prevOrder] = prev.split("-");
      if (prevType === type) {
        return prevOrder === "highest" ? `${type}-lowest` : `${type}-highest`;
      }
      return `${type}-highest`;
    });
    setActiveSortType(type);
  };

  const filteredProducts = products
    .filter((product) => {
      const matchesDate =
        !filters.selectedDate ||
        new Date(product.created_at) <= new Date(filters.selectedDate);

      const matchesSearch =
        !filters.search ||
        product.title.toLowerCase().includes(filters.search.toLowerCase());

      const matchesPrice =
        (!filters.minPrice || product.price >= parseFloat(filters.minPrice)) &&
        (!filters.maxPrice || product.price <= parseFloat(filters.maxPrice));

      const matchesSubcategory =
        !filters.selectedSubcategory ||
        product.subcategory_id === filters.selectedSubcategory;

      const matchesRating =
        !filterRating || product.average_rating >= parseFloat(filterRating);

      const matchesStock =
        !filters.status || product.stock_status === filters.status;

      return (
        matchesDate &&
        matchesSearch &&
        matchesPrice &&
        matchesSubcategory &&
        matchesRating &&
        matchesStock
      );
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "price-highest":
          return b.price - a.price;
        case "price-lowest":
          return a.price - b.price;
        case "rating-highest":
          return b.average_rating - a.average_rating;
        case "rating-lowest":
          return a.average_rating - b.average_rating;
        case "time-highest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "time-lowest":
          return new Date(a.created_at) - new Date(b.created_at);
        default:
          return 0;
      }
    });

  const paginationControls = (
    <div className="pagination-controls">
      <div
        className={`pagination-arrow ${
          currentPage === 1 || totalPages === 0 ? "disabled" : ""
        }`}
        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
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
          currentPage < totalPages && setCurrentPage(currentPage + 1)
        }
        aria-disabled={currentPage === totalPages}
      >
        <FaArrowRight size={20} />
      </div>
    </div>
  );

  useEffect(() => {
    if (error || message) {
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
    <div className="category-page-container">
      <Breadcrumb />
      <div className="category-page-content">
        {error && <div className="alert-error">Error: {error}</div>}
        {message && <div className="alert-success">{message}</div>}
        <div id="filter-sort-section" className="filter-sort-section">
          <div id="filters-container" className="filters">
            <input
              id="filter-date"
              type="date"
              name="selectedDate"
              placeholder="Before Date"
              value={filters.selectedDate}
              onChange={handleFilterChange}
            />

            <input
              id="filter-min-price"
              type="number"
              name="minPrice"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={handleFilterChange}
            />
            <input
              id="filter-max-price"
              type="number"
              name="maxPrice"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={handleFilterChange}
            />
            <select
              id="filter-subcategory"
              name="selectedSubcategory"
              value={product.subcategory_id}
              onChange={handleFilterChange}
              required
              disabled={!filters.selectedCategory}
            >
              <option value="" disabled>
                All SubCategories
              </option>
              {filteredSubcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
            <select
              id="filter-status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">Status</option>
              <option value="in_stock">In Stock</option>
              <option value="out_of_stock">Out Of Stock</option>
              <option value="on_demand">On Demand</option>
            </select>
            <input
              id="filter-search"
              type="text"
              name="search"
              placeholder="Search"
              value={filters.search}
              onChange={handleFilterChange}
            />
            <div id="star-filter-container" className="star-filter">
              {Array.from({ length: 5 }, (_, index) => (
                <span
                  id={`star`}
                  key={index}
                  className={`star ${
                    filterRating >= index + 1 ? "selected" : ""
                  }`}
                  onClick={() => handleStarClick(index + 1)}
                >
                  ★
                </span>
              ))}
            </div>
            <button
              id="clear-filters-button"
              className="clear-filters-button"
              onClick={handleClearFilters}
            >
              Clear
            </button>
            <div id="sort-buttons-container" className="sort-buttons-modern">
              <h3>Sort By:</h3>
              {["price", "time", "rating"].map((type) => {
                const isActive = sortOption.startsWith(type);
                const order = sortOption.endsWith("highest")
                  ? "highest"
                  : "lowest";

                return (
                  <button
                    id={`sort-button-${type}`}
                    key={type}
                    className={`sort-button ${isActive ? "active" : ""}`}
                    onClick={() => {
                      handleSortChange(type);
                    }}
                  >
                    {type === activeSortType && (
                      <>
                        {sortOption.endsWith("highest") ? (
                          <FaSortAmountDown />
                        ) : (
                          <FaSortAmountUp />
                        )}
                      </>
                    )}
                    {type.charAt(0).toUpperCase() + type.slice(1)}{" "}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="main_product-grid">
          {loading ? (
            <div className="loader-container">
              <div className="loader-circle"></div>
            </div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((prod) => {
              const isWishlisted =
                Array.isArray(wishlist) && wishlist.includes(prod.id);

              return (
                <div
                  key={prod.id}
                  className="modern-product-card"
                  onClick={() => history(`/shop/${cId}/${prod.id}`)}
                >
                  <div
                    className={`modern-stock-badge ${
                      prod.stock_status
                        ? prod.stock_status.toLowerCase()
                        : "unknown"
                    }`}
                  >
                    {prod.stock_status
                      ? prod.stock_status.replace("_", " ")
                      : "Unknown"}
                  </div>

                  <img
                    src={
                      prod.product_image ||
                      "https://res.cloudinary.com/drhborpt0/image/upload/v1732778621/6689747_xi1mhr.jpg"
                    }
                    alt={prod.title}
                    className="modern-product-image"
                    onError={(e) =>
                      (e.target.src =
                        "https://res.cloudinary.com/drhborpt0/image/upload/v1732778621/6689747_xi1mhr.jpg")
                    }
                  />

                  <button
                    className={`modern-wishlist-icon ${
                      wishlist.includes(prod.id) ? "active" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(prod.id);
                    }}
                    disabled={loadingWishlist[prod.id]}
                  >
                    {loadingWishlist[prod.id] ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <i
                        className={
                          wishlist.includes(prod.id)
                            ? "fas fa-heart"
                            : "far fa-heart"
                        }
                      ></i>
                    )}
                  </button>

                  <div className="modern-product-info">
                    <h3 className="modern-product-title">{prod.title}</h3>

                    <div className="modern-product-price-row">
                      <div className="modern-product-price">
                        {prod.price
                          ? `${prod.price} JD`
                          : "Price Not Available"}
                      </div>
                      <button
                        className="modern-cart-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(prod.id);
                        }}
                        aria-label="Add to Cart"
                      >
                        <i className="fas fa-shopping-cart"></i>
                      </button>
                    </div>

                    <div className="modern-product-rating">
                      <div className="rating-container">
                        {Array.from({ length: 5 }, (_, index) => (
                          <i
                            key={index}
                            className={`rating-star ${
                              index < prod.average_rating
                                ? "fas fa-star"
                                : "far fa-star"
                            }`}
                          ></i>
                        ))}
                        <span className="rating-count">
                          ({prod.number_of_reviews}{" "}
                          {prod.number_of_reviews === 1 ? "rating" : "ratings"})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="no-products">No products found.</p>
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
  );
};

export default Category;
