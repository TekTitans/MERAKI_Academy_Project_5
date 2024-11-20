import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setProducts } from "../redux/reducers/product/product";

const SellerProducts = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const [loading, setLoading] = useState(true);

  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProducts = async () => {
      console.log("Fetching products...");

      if (!token) {
        console.error("No token found.");
        setLoading(false);
        return;
      }

      try {
        console.log("Token found. Making API request...", token);
        const response = await axios.get(
          "http://localhost:5000/products/seller",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API response received:", response);

        if (response.data.products) {
          console.log("Products found:", response.data.products);
          dispatch(setProducts(response.data.products));
        } else {
          console.log("No products in response.");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching seller products", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [dispatch, token]);

  return (
    <div>
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div>
          <h2>Your Products</h2>
          <div>
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product.id}>
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                  <p>Price: ${product.price}</p>
                  <p>Stock: {product.stock_quantity}</p>
                  <button>Edit</button>
                  <button>Delete</button>
                </div>
              ))
            ) : (
              <p>No products found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProducts;
