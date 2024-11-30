import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "./style.css";
import Modal from "../modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import { incrementCount } from "../../components/redux/reducers/product/product";
import {
  FaArrowLeft,
  FaArrowRight,
  FaSortAmountUp,
  FaSortAmountDown,
} from "react-icons/fa";
const SearchResults = () => {
  const token = useSelector((state) => state.auth.token);
  const { query } = useParams();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const { loading, error, message } = useSelector((state) => state.order);
  const history = useNavigate();
  const closeModal = () => {
    setModalVisible(false); // This function hides the modal
  };

  useEffect(() => {
    const fetchProducts = async (page = 1) => {
      try {
        const response = await axios.get(
          `http://localhost:5000/products/search/${encodeURIComponent(
            query
          )}?page=${page}&size=${pageSize}`
        );
        if (response.data.success) {
          console.log("products", response.data.products);
          setProducts(response.data.products);
          setTotalPages(response.data.totalPages);
        } else {
          setError(response.data.message || "No products found");
        }
      } catch (err) {
        setError("Something went wrong");
      }
    };

    fetchProducts(currentPage); // Fetch products for the current page
  }, [query, currentPage]);

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

            setModalMessage("Product added to wishlist!");
            dispatch(incrementCount());
          } else {
            setModalMessage("Failed to add product to wishlist.");
          }
          setModalVisible(true);
        })
        .catch((error) => {
          console.error("Error adding to wishlist:", error);
          setModalMessage("Product already in your wishlist");
          setModalVisible(true);
        });
    }
  };

  const addToCart = (pId) => {
    if (!token) {
      history("/users/login");
    }
    console.log("pId", pId);
    const quantity = 1;
    axios
      .post(`http://localhost:5000/cart/${pId}`, { quantity }, { headers })
      .then((response) => {})
      .catch((error) => {
        console.error(error);
      });
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
  console.log(products.image_url);

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
      <div className="loading-container_Main">
        <div className="loading-circle"></div>
      </div>
    );

  return (
    <div className="category-page-container">
      <div className="hero-section">
        <h1>Results for {query}</h1>
      </div>

      <div className="error-message-container">
        {error && <p className="error-message">{error}</p>}
      </div>
      <div className="category-page-content">
        <div className="main_product-grid">
          {loading ? (
            <div className="loading-container_Main">
              <div className="loading-circle"></div>
            </div>
          ) : products.length > 0 ? (
            products.map((prod) => {
              const isWishlisted =
                Array.isArray(wishlist) && wishlist.includes(prod.id);

              return (
                <div
                  key={prod.id}
                  className="modern-product-card"
                  onClick={() =>
                    history(`/shop/${prod.category_id}/${prod.id}`)
                  }
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
        autoClose={closeModal} // Pass closeModal as the autoClose handler
        message={modalMessage}
      />
    </div>
  );
};

export default SearchResults;
