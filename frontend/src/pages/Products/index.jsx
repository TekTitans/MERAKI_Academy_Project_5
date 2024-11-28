import React, { useEffect, useState } from "react";
import "./style.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setProducts,
  incrementCount,
} from "../../components/redux/reducers/product/product";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Modal from "../modal/Modal";

const Products = () => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const userId = useSelector((state) => state.auth.userId);
  const [categories, setCategories] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);
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
 
  useEffect(() => {
    const filtered = products?.filter((product) =>
      product.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilterProducts(filtered);
  }, [search, products]);
  useEffect(() => {
    axios
      .get(`http://localhost:5000/category`)
      .then((result) => {
        setCategories([
          { id: "all", name: "All Products" },
          ...result.data.category,
        ]);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }, []);

  const fetchProducts = async (categoryId, page = 1) => {
    setLoading(true);
    try {
      let response;
      if (categoryId === "all") {
        response = await axios.get(
          `http://localhost:5000/products?page=${page}&size=${pageSize}`
        );
      } else {
        response = await axios.get(
          `http://localhost:5000/products/category/${categoryId}?page=${page}&size=${pageSize}`
        );
      }

      console.log("API Response:", response.data);
      if (response.data.success) {
        const products = response.data.products || [];

        if (products.length === 0) {
          setMessage("No products available in this category yet.");
        } else {
          setMessage("");
        }

        setFilterProducts(products);
        dispatch(setProducts(products));
        setSelectedCategory(categoryId);
        setCurrentPage(page);
        setTotalPages(Math.ceil(response.data.totalProducts / pageSize));
      } else {
        console.log("Error message from server:", response.data.message);
        setMessage(response.data.message || "No products found.");
        setFilterProducts([]);
      }
    } catch (error) {
      console.error("API error:", error.message);
      setMessage("Failed to fetch products. Please try again.");
      setFilterProducts([]);
    } finally {
      setLoading(false);
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
      <button
        className="wishlist-button"
        onClick={() => handleWishlist(product.id)}
      >
        ♥
      </button>
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

  const paginationControls = (
    <div className="pagination-controls">
      <div
        className={`pagination-arrow ${
          currentPage === 1 || filterProducts.length === 0 ? "disabled" : ""
        }`}
        onClick={() =>
          currentPage > 1 && fetchProducts(selectedCategory, currentPage - 1)
        }
        aria-disabled={currentPage === 1}
      >
        <FaArrowLeft size={20} />
      </div>
      <span className="pagination-info">
        Page {currentPage} of {totalPages}
      </span>
      <div
        className={`pagination-arrow ${
          currentPage === totalPages || filterProducts.length === 0
            ? "disabled"
            : ""
        }`}
        onClick={() =>
          currentPage < totalPages &&
          fetchProducts(selectedCategory, currentPage + 1)
        }
        aria-disabled={currentPage === totalPages}
      >
        <FaArrowRight size={20} />
      </div>
    </div>
  );

  return (
    <div className="products-page">
      {selectedCategory === null ? (
        <>
          <div className="categories-container">{allCategories}</div>
          {loading && <div className="loading-spinner">Loading...</div>}
        </>
      ) : (
        <div className="products-container">
          <button
            className="back-button"
            onClick={() => {
              setSelectedCategory(null);
              setFilterProducts([]);
              setMessage("");
              setCurrentPage(1);
              setTotalPages(0);
            }}
          >
            &larr; Back to Categories
          </button>
          <div className="products-grid">
            {loading ? (
              <div className="loading-spinner">Loading...</div>
            ) : filterProducts.length > 0 ? (
              showAllProducts
            ) : (
              <p className="no-products-message">
                {message || "No products found."}
              </p>
            )}
          </div>

          {filterProducts.length > 0 && paginationControls}
        </div>
      )}

      <Modal
        isOpen={modalVisible}
        autoClose={closeModal} // Pass closeModal as the autoClose handler
        message={modalMessage}
      />
    </div>
  );
};

export default Products;
