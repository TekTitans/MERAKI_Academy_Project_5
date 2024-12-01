import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import {
  removeFromCart,
  updateCart,
  setCart,
} from "../../components/redux/reducers/cart";
import {
  setLoading,
  setError,
  setMessage,
} from "../../components/redux/reducers/orders";
import "./cart.css";

const Loading = () => (
  <div className="loading-container">
    <div className="loading-circle"></div>
  </div>
);

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, message } = useSelector((state) => state.order);

  const [debounceTimer, setDebounceTimer] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = useSelector((state) => state.auth.token);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const cart = useSelector((state) => state.cart.cart);
  const count = useSelector((state) => state.cart.count);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    axios
      .get("http://localhost:5000/cart", { headers })
      .then((response) => {
        dispatch(setCart(response.data.result));
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching cart data:", err);
        setLoading(false);
      });
  }, [dispatch, token]);

  const handleQuantityChange = (newQuantity, item) => {
    dispatch(updateCart({ id: item.id, quantity: newQuantity }));

    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => {
      axios
        .put(
          `http://localhost:5000/cart/${item.id}`,
          { quantity: newQuantity },
          { headers }
        )
        .then(() => console.log("Quantity updated."))
        .catch((error) => console.error("Error updating quantity:", error));
    }, 300);
    setDebounceTimer(timer);
  };

  const removeItem = (id) => {
    axios
      .delete(`http://localhost:5000/cart/${id}`, { headers })
      .then(() => {
        dispatch(removeFromCart(id));
        dispatch(setMessage("Item Removed Successfully !"));
      })
      .catch((error) => console.error("Error removing item:", error));
  };

  const clearAllCart = () => {
    axios
      .delete("http://localhost:5000/cart/cart", { headers })
      .then(() => {
        dispatch(setCart([]));
        dispatch(setMessage("Cart Cleared Successfully !"));
      })
      .catch((error) => {
        console.error("Error Clearing Cart:", error);
      });
  };

  useEffect(() => {
    if (error || message) {
      const timer = setTimeout(() => {
        dispatch(setError(null));
        dispatch(setMessage(null));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, message, dispatch]);

  return (
    <>
      {" "}
      <div>
        {loading && (
          <div className="loading-container">
            <div className="loader">
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
            </div>
            <span>Loading...</span>
          </div>
        )}
      </div>
      <div className="myCart-container">
        <h2 class="cart-heading">
         
          <i class="fas fa-shopping-cart cart-icon"></i>
          My Cart{" "}
        </h2>
        <>
            {error && <div className="error-message">Error: {error}</div>}
            {message && <div className="success-message">{message}</div>}
          </>
        <div className="myCart">
          {loading ? (
            <Loading />
          ) : cart.length > 0 ? (
            <div className="cartTableWrapper">
              <table className="cartTable">
                <thead>
                  <tr>
                    <th>Remove</th>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <button
                          className="remove-btn"
                          onClick={() => removeItem(item.id)}
                        >
                          Remove
                        </button>
                      </td>
                      <td>
                        <img
                          src={
                            item.product_image ||
                            "https://via.placeholder.com/150"
                          }
                          alt={item.title}
                          className="product-images"
                        />
                      </td>
                      <td>{item.title}</td>
                      <td>{item.price} JD</td>
                      <td>
                        <div className="quantity-controls">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                Math.max(1, item.quantity - 1),
                                item
                              )
                            }
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            min={1}
                            onChange={(e) =>
                              handleQuantityChange(
                                Math.max(1, parseInt(e.target.value) || 1),
                                item
                              )
                            }
                          />
                          <button
                            onClick={() =>
                              handleQuantityChange(item.quantity + 1, item)
                            }
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td>{(item.price * item.quantity).toFixed(2)}.00 JD</td>
                    </tr>
                  ))}
                </tbody>
                <thead>
                  <tr>
                    <th colSpan="6">
                      Total:{" "}
                      {cart
                        .reduce(
                          (total, item) => total + item.price * item.quantity,
                          0
                        )
                        .toFixed(2)}{" "}
                      JD
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
          ) : (
            <div className="empty-cart-message" id="emptyCartMessage">
              <h2>Your Cart is Empty</h2>
              <p>
                It looks like you haven't added anything to your cart yet. Start
                shopping now!
              </p>
              <button onClick={() => navigate("/shop")}>Go to Shop</button>
            </div>
          )}

          {cart.length > 0 && (
            <div className="checkout">
              <button
                className="checkout-btn"
                onClick={() => navigate("/placeorder")}
              >
                Checkout
              </button>
              <button onClick={clearAllCart} className="clear-cart-btn">
                Clear Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
