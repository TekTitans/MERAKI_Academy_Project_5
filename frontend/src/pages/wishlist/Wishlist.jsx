import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { decrementCount } from "../../components/redux/reducers/product/product";
import axios from "axios";
import "./style.css";
import Modal from "../modal/Modal";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const closeModal = () => {
    setModalVisible(false); // This function hides the modal
  };

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
        }
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
        setWishlist(wishlist.filter((item) => item.product_id !== productId));
        setModalMessage(response.data.message);
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      setModalMessage(error.data.message);
      setModalVisible(true);
    }
  };

  return (
    <div className="wishlist-container">
      <h2>Your Wishlist</h2>
      {wishlist.length === 0 ? (
        <p className="no-results1"> Wishlist Empty!...</p>
      ) : (
        <table className="wishlist-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {wishlist.map((item) => (
              <tr key={item.product_id}>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>
                  <button
                    onClick={() => removeFromWishlist(item.product_id)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Modal
        isOpen={modalVisible}
        autoClose={closeModal} // Pass closeModal as the autoClose handler
        message={modalMessage}
      />
    </div>
  );
};

export default Wishlist;
