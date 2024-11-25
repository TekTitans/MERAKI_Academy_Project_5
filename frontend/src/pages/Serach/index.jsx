import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import "./style.css";

const SearchResults = () => {
  const { query } = useParams(); // Access the path parameter
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

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
        setError("No Product Found");
      }
    };

    fetchProducts();
  }, [query]);

  return (
    <div className="search-results-container">
      <h2 className="search-header">Results for "{query}"</h2>
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="products-grid">
          {products.length === 0 ? (
            <p className="no-results">No products match your search criteria.</p>
          ) : (
            products.map((product) => (
              <div className="product-card" key={product.id}>
                <img
                  src={product.image_url || "https://via.placeholder.com/150"}
                  alt={product.title}
                  className="product-image"
                />
                <div className="product-info">
                  <h3 className="product-title">{product.title}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-details">
                    <p className="product-category">
                      <strong>Category:</strong> {product.category_name}
                    </p>
                    <p className="product-price">
                      <strong>Price:</strong> {product.price} JD
                    </p>
                  </div>
                </div>
                <Link to={`/details/${product.id}`} className="details-link">
                  View Details
                </Link>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
