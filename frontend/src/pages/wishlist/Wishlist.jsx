import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";
import { useSelector } from "react-redux";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState(null);
  const { token } = useSelector((state) => state.auth);

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
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError("Unable to fetch wishlist. Please try again later.");
      }
    };

    fetchWishlist();
  }, []);

  return (
    <div className="wishlist-container">
      <h1>Your Wishlist</h1>
      {error ? (
        <p className="error-message">{error}</p>
      ) : wishlist.length > 0 ? (
        <table className="wishlist-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>

              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {wishlist.map((item, index) => (
              <tr key={item.product_id}>
                <td>{index + 1}</td>
                <td>
                  <div className="product-info">
                    <span>{item.title}</span>
                  </div>
                </td>

                <td>{item.price} JD</td>
                <td>
                  <button
                    className="remove-btn"
                    onClick={async () => {
                      try {
                        await axios.delete(
                          `http://localhost:5000/wishlist/${item.product_id}`,
                          {
                            headers,
                          }
                        );
                        setWishlist(
                          wishlist.filter(
                            (w) => w.product_id !== item.product_id
                          )
                        );
                      } catch (err) {
                        alert("Failed to remove item. Try again.");
                      }
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="empty-message">Your wishlist is empty.</p>
      )}
    </div>
  );
};

export default Wishlist;
