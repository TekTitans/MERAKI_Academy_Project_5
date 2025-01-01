import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../redux/reducers/product/product";
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
import { addToCart } from "../../components/redux/reducers/cart";

const Category = () => {
  const { cId } = useParams();
  const [loadingWishlist, setLoadingWishlist] = useState({});
  const [loadingCart, setLoadingCart] = useState({});

  const [sortOption, setSortOption] = useState("");
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
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const response = await axios.get(
        `http://localhost:5000/products/category/${cId}?page=${page}&size=${pageSize}`
      );

      if (response.data.products) {
        dispatch(setProducts(response.data.products));
        console.log("products: ", response.data.products);
      }
      setTotalPages(Math.ceil(response.data.totalProducts / pageSize));
      dispatch(setLoading(false));
      console.log("products: ", products);
      console.log("response", response);
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(setError("Error fetching products"));
    }
  };

  useEffect(() => {
    if (token) {
      fetchWishlist();
    }
  }, [token]);

  /*******************  WishList  ********************* */

  const [wishlist, setWishlist] = useState(() => {
    const storedWishlist = sessionStorage.getItem("wishlist");
    try {
      return storedWishlist ? JSON.parse(storedWishlist) : [];
    } catch (error) {
      console.error("Failed to parse wishlist from sessionStorage:", error);
      return [];
    }
  });

  // Save wishlist to sessionStorage whenever it changes
  useEffect(() => {
    console.log("Saving wishlist to sessionStorage:", wishlist);
    sessionStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get("http://localhost:5000/wishlist", {
        headers,
      });

      if (response.data.success) {
        console.log(response.data);
        const wishlistProducts = Array.isArray(response.data.wishlists)
          ? response.data.wishlists.map((item) => item.id)
          : [];
        setWishlist(wishlistProducts); // Update state
      } else {
        console.error("Failed to fetch wishlist:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/wishlist",
        { productId },
        { headers }
      );

      if (response.data.success) {
        setWishlist((prevWishlist) => [...prevWishlist, productId]); // Add to state

      } else {
        console.error("Add to wishlist failed:", response.data.message);
      }
    } catch (error) {
      dispatch(setError("Error adding to wishlist. Please try again."));
    } finally {
      setLoadingWishlist((prevState) => ({ ...prevState, [productId]: false }));
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/wishlist/${productId}`,
        { headers }
      );

      if (response.data.success) {
        setWishlist((prevWishlist) =>
          prevWishlist.filter((id) => id !== productId)
        ); // Remove from state
      } else {
        console.error("Remove from wishlist failed:", response.data.message);
      }
    } catch (error) {
      dispatch(setError("Error removing from wishlist. Please try again."));
    } finally {
      setLoadingWishlist((prevState) => ({ ...prevState, [productId]: false }));
    }
  };

  const toggleWishlist = async (productId) => {
    if (!token) {
      setModalMessage("You need to log in to manage your wishlist.");
      setModalVisible(true);
      return;
    }

    setLoadingWishlist((prevState) => ({ ...prevState, [productId]: true }));

    if (wishlist.includes(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }

    setLoadingWishlist((prevState) => ({ ...prevState, [productId]: false }));
  };

  useEffect(() => {
    if (token) {
      fetchWishlist();
    }
  }, [token]);

  /*******************  WishList  ********************* */

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
        String(product.subcategory_id) === String(filters.selectedSubcategory);

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
      console.log("Sort Option:", sortOption);
      switch (sortOption) {
        case "Price-highest":
          return b.price - a.price;
        case "Price-lowest":
          return a.price - b.price;
        case "Rating-highest":
          return b.average_rating - a.average_rating;
        case "Rating-lowest":
          return a.average_rating - b.average_rating;
        case "New-highest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "New-lowest":
          return new Date(a.created_at) - new Date(b.created_at);
        default:
          return 0;
      }
    });

  console.log("Final Filtered and Sorted Products:", filteredProducts);

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
  const addCart = async (productId) => {
    if (!token) {
      setModalMessage("You need to log in to manage your cart.");
      setModalVisible(true);
      return;
    }

    setLoadingCart((prevState) => ({ ...prevState, [productId]: true }));

    try {
      const quantity = 1;
      const response = await axios.post(
        `http://localhost:5000/cart/${productId}`,
        { quantity },
        { headers }
      );

      if (response.data.success) {
        const product = response.data.product;
        console.log("Product added to cart:", product);
        dispatch(
          addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            quantity: parseInt(product.quantity, 10),
          })
        );
        dispatch(setMessage("Product added to cart successfully!"));
        setLoadingCart((prevState) => ({ ...prevState, [productId]: false }));

        console.log("Cart state after adding:", cart);
        console.log("Total unique items in cart:", count);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingCart((prevState) => ({ ...prevState, [productId]: false }));
    }
  };

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
        <div className="category-page-container">
          <Breadcrumb />
          <div className="category-page-content">
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
                  value={filters.selectedSubcategory}
                  onChange={handleFilterChange}
                  required
                >
                  <option value="">All SubCategories</option>
                  {subcategories.map((subcategory) => (
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
                      id={`star-${index}`}
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
                <div
                  id="sort-buttons-container"
                  className="sort-buttons-modern"
                >
                  <h3>Sort By:</h3>
                  {["Price", "New", "Rating"].map((type) => {
                    const isActive = sortOption.startsWith(type);

                    return (
                      <button
                        id={`sort-button-${type}`}
                        key={type}
                        className={`sort-button ${isActive ? "active" : ""}`}
                        onClick={() => {
                          handleSortChange(type);
                        }}
                      >
                        {sortOption.startsWith(type) &&
                          (sortOption.endsWith("highest") ? (
                            <FaSortAmountDown />
                          ) : (
                            <FaSortAmountUp />
                          ))}
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <>
                  {error && <div className="error-message">Error: {error}</div>}
                  {message && <div className="success-message">{message}</div>}
                </>
            <div className="main_product-grid">
                {filteredProducts.length > 0 ? (
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
                            isWishlisted ? "active" : ""
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
                                isWishlisted ? "fas fa-heart" : "far fa-heart"
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
                                addCart(prod.id);
                              }}
                              disabled={
                                loadingCart[prod.id] ||
                                prod.stock_status === "out_of_stock"
                              }
                              aria-label="Add to Cart"
                            >
                              {loadingCart[prod.id] ? (
                                <div className="modern-spinner">
                                  <div></div>
                                  <div></div>
                                  <div></div>
                                  <div></div>
                                </div>
                              ) : (
                                <i className="fas fa-shopping-cart"></i>
                              )}
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
                                {prod.number_of_reviews === 1
                                  ? "rating"
                                  : "ratings"}
                                )
                              </span>
                            </div>
                          </div>
                          <div>
                            <p
                              className={`product-stock_quantity ${
                                prod.stock_status === "in_stock"
                                  ? "in-stock"
                                  : prod.stock_status === "out_of_stock"
                                  ? "out-of-stock"
                                  : "on-demand"
                              }`}
                            >
                              {prod.stock_status === "in_stock"
                                ? `${prod.stock_quantity} in stock`
                                : prod.stock_status === "out_of_stock"
                                ? "Out of Stock"
                                : "Available on Demand"}
                            </p>
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
      )}
    </>
  );
};
export default Category;
