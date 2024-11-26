import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import "./style.css";

const SearchResults = () => {
  const { query } = useParams();
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
        setError("Something went wrong");
      }
    };

    fetchProducts();
  }, [query]);

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
              <div className="product-info">
                <h3>{product.title}</h3>
                
                <div className="product-category">Category: {product.category_name}</div>
                <div className="product-price">Price: {product.price} JD</div>
              </div>
              <Link to={`/details/${product.id}`} className="view-details-link">
                View Details
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchResults;
