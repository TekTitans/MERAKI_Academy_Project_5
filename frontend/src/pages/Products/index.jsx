import React, { useEffect, useState } from "react";
import "./style.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../../components/redux/reducers/product/product";
import { Link } from "react-router-dom";

const Products = () => {
  const [categories, setCategories] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const search = useSelector((state) => {
    return state.product.search;
  });
  const products = useSelector((state) => {
    return state.product.products;
  });

  const dispatch = useDispatch();
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
        src={product.image || "https://via.placeholder.com/150"}
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

  const paginationControls = (
    <div className="pagination-controls">
      <button
        className="pagination-button"
        onClick={() => fetchProducts(selectedCategory, currentPage - 1)}
        disabled={currentPage === 1 || filterProducts.length === 0}
      >
        Previous
      </button>
      <span className="pagination-info">
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="pagination-button"
        onClick={() => fetchProducts(selectedCategory, currentPage + 1)}
        disabled={currentPage === totalPages || filterProducts.length === 0}
      >
        Next
      </button>
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
    </div>
  );
};

export default Products;
