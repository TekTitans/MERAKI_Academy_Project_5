import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { decrementCount } from "../../components/redux/reducers/product/product";
import axios from "axios";
import "./style.css";
import Modal from "../modal/Modal";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const closeModal = () => {
    setModalVisible(false);
  };
  const history = useNavigate();

  const token = useSelector((state) => state.auth.token);
  const headers = {
    Authorization: `Bearer ${token}`,
  };

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
        setModalMessage(response.data.message);
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      setModalMessage(error.data.message);
      setModalVisible(true);
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
  return (
    <div className="wishlist-grid">
      <h2 class="wishlist-heading">
        <i class="fas fa-heart wishlist-icon"></i>
        Your Wishlist
      </h2>
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
                    id="modern-cart-icon_WishList"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item.id);
                    }}
                    aria-label="Add to Cart"
                  >
                    <i className="fas fa-shopping-cart"></i>
                  </button>
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
  );
};

export default Wishlist;
