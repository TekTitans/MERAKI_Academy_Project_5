import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "./style.css";
import Modal from "../modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import { incrementCount } from "../../components/redux/reducers/product/product";
const SearchResults = () => {
  const token = useSelector((state) => state.auth.token);
  const { query } = useParams();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const closeModal = () => {
    setModalVisible(false); // This function hides the modal
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/products/search/${encodeURIComponent(query)}`
        );
        if (response.data.success) {
          setProducts(response.data.products);
        } else {
          setError(response.data.message || "No products found");
        }
      } catch (err) {
        setError("Something went wrong");
      }
    };

    fetchProducts();
  }, [query]);

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
  return (
    <div className="search-results-container">
      <div className="hero-section">
        <h1>Results for "{query}"</h1>
      </div>

      <div className="error-message-container">
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="product-grid">
        {products.length === 0 ? (
          <p className="no-results">No products found matching your query.</p>
        ) : (
          products.map((product) => (
            <div className="product-card" key={product.id}>
              <div className="product-image-container">
                <img
                  src={product.image_url || "https://via.placeholder.com/150"}
                  alt={product.title}
                  className="product-image"
                />
              </div>
              <button
                className="wishlist-button"
                onClick={() => handleWishlist(product.id)}
              >
                <FontAwesomeIcon icon={faHeart} />
              </button>
              <div className="product-info">
                <h3>{product.title}</h3>

                <div className="product-category">
                  Category: {product.category_name}
                </div>
                <div className="product-price">Price: {product.price} JD</div>
              </div>
              <Link to={`/details/${product.id}`} className="view-details-link">
                View Details
              </Link>
            </div>
          ))
        )}
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
