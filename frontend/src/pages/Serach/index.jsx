// SearchPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const SearchPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log(query);

    if (query) {
      axios
        .get(
          `http://localhost:5000/products/search?query=${encodeURIComponent(
            query
          )}`
        )
        .then((response) => {
          setProducts(response.data.products);
          console.log(response);

          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
          setIsLoading(false);
        });
    }
  }, [query]);

  return (
    <div>
      <h2>Search Results for "{query}"</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : products.length > 0 ? (
        <div className="product-list">
          {products.map((product) => (
            <div key={product.id} className="product-item">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.price} JD</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default SearchPage;
