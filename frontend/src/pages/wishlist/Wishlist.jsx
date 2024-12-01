import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { decrementCount } from "../../components/redux/reducers/product/product";
import axios from "axios";
import "./style.css";
import Modal from "../modal/Modal";
import { useNavigate } from "react-router-dom";
import {
  setLoading,
  setError,
  setMessage,
} from "../../components/redux/reducers/orders";
import { addToCart } from "../../components/redux/reducers/cart";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [loadingWishlist, setLoadingWishlist] = useState({});
  const [loadingCart, setLoadingCart] = useState({});

  const closeModal = () => {
    setModalVisible(false);
  };
  const history = useNavigate();

  const token = useSelector((state) => state.auth.token);
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const { loading, error, message } = useSelector((state) => state.order);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get("http://localhost:5000/wishlist", {
          headers,
        });
        if (response.data.success) {
          setWishlist(response.data.wishlists);
          console.log("wishlists", response.data.wishlists);
        }
        console.log("wishlists: ", response.data.wishlists);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };

    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/wishlist/${productId}`,
        {
          headers,
        }
      );
      if (response.data.success) {
        dispatch(decrementCount());
        setWishlist(wishlist.filter((item) => item.id !== productId));
        dispatch(setMessage(response.data.message));
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };
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
      {" "}
      {loading && (
        <div className="loading-container">
          <div className="loader">
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
          </div>
          <span>Loading...</span>
        </div>
      )}
      <div className="wishlist-grid">
        <div className="wishlist-heading-container">
          <h2 class="wishlist-heading">
            <i class="fas fa-heart wishlist-icon"></i>
            Your Wishlist
          </h2>
          <>
            {error && <div className="error-message">Error: {error}</div>}
            {message && <div className="success-message">{message}</div>}
          </>
        </div>
        {wishlist.length === 0 ? (
          <p className="no-results1"> Wishlist Empty!...</p>
        ) : (
          <div className="main_product-grid">
            {wishlist.map((item) => (
              <div
                className="modern-product-card"
                onClick={() => history(`/shop/${item.category_id}/${item.id}`)}
                key={item.id}
              >
                <div
                  className={`modern-stock-badge ${
                    item.stock_status
                      ? item.stock_status.toLowerCase()
                      : "unknown"
                  }`}
                >
                  {item.stock_status
                    ? item.stock_status.replace("_", " ")
                    : "Unknown"}
                </div>
                <img
                  src={item.product_image || "/default-product-image.jpg"}
                  alt={item.title}
                  className="modern-product-image"
                />
                <div className="modern-product-info">
                  <h3 className="modern-product-title">{item.title}</h3>
                  <div className="modern-product-price">
                    {item.price ? `${item.price} JD` : "Price Not Available"}
                  </div>
                  <div className="modern-product-rating">
                    <div className="rating-container">
                      {Array.from({ length: 5 }, (_, index) => (
                        <i
                          key={index}
                          className={`rating-star ${
                            index < item.average_rating
                              ? "fas fa-star"
                              : "far fa-star"
                          }`}
                        ></i>
                      ))}
                      <span className="rating-count">
                        ({item.number_of_reviews}{" "}
                        {item.number_of_reviews === 1 ? "rating" : "ratings"})
                      </span>
                    </div>
                  </div>
                  <div className="modern-product-price-row">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWishlist(item.id);
                      }}
                      className="wishlist-card-remove-btn"
                    >
                      Remove
                    </button>

                    <button
                      className="modern-cart-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        addCart(item.id);
                      }}
                      disabled={
                        loadingCart[item.id] ||
                        item.stock_status === "out_of_stock"
                      }
                      aria-label="Add to Cart"
                    >
                      {loadingCart[item.id] ? (
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
                  <div>
                    <p
                      className={`product-stock_quantity ${
                        item.stock_status === "in_stock"
                          ? "in-stock"
                          : item.stock_status === "out_of_stock"
                          ? "out-of-stock"
                          : "on-demand"
                      }`}
                    >
                      {item.stock_status === "in_stock"
                        ? `${item.stock_quantity} in stock`
                        : item.stock_status === "out_of_stock"
                        ? "Out of Stock"
                        : "Available on Demand"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <Modal
          isOpen={modalVisible}
          autoClose={closeModal}
          message={modalMessage}
        />
      </div>
    </>
  );
};

export default Wishlist;
