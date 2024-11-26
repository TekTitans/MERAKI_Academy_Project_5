import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import "./cart.css";

const Cart = () => {
  const [localCart, setLocalCart] = useState([]);
  const [debounceTimer, setDebounceTimer] = useState(null);

  const token = useSelector((state) => state.auth.token);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const navigate = useNavigate();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    axios
      .get("http://localhost:5000/cart", { headers })
      .then((response) => {
        setLocalCart(response.data.result);
      })
      .catch((err) => {
        console.log("Error fetching cart data:", err);
      });
  }, []);

  const sendQuantityUpdate = (id, quantity) => {
    axios
      .post(`http://localhost:5000/cart/${id}`, { quantity }, { headers })
      .then((response) => {
        console.log("Updated cart item:", response.data);
      })
      .catch((error) => {
        console.log("Error updating cart item:", error);
      });
  };

  const handleQuantityChange = (e, elem) => {
    const newQuantity = Math.max(1, parseInt(e.target.value) || 1);
    const updatedCart = localCart.map((item) =>
      item.id === elem.id ? { ...item, quantity: newQuantity } : item
    );
    setLocalCart(updatedCart);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      sendQuantityUpdate(elem.id, newQuantity);
    }, 500);

    setDebounceTimer(timer);
  };

  const removeFromCart = (id) => {
    axios
      .delete(`http://localhost:5000/cart/${id}`, { headers })
      .then((response) => {
        const updatedCart = localCart.filter((item) => item.id !== id);
        setLocalCart(updatedCart);
      })
      .catch((error) => {
        console.log("Error removing item from cart:", error);
      });
  };

  const totalAmount = localCart?.reduce(
    (acc, elem) => acc + elem.price * elem.quantity,
    0
  );

  return (
    <div className="myCart">
      <table className="cartTable">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {localCart?.map((elem, index) => (
            <tr key={index}>
              <td>{elem.title}</td>
              <td>{elem.price}</td>
              <td>
                <button onClick={() => removeFromCart(elem.id)}>remove</button>
                <input
                  type="number"
                  value={elem.quantity}
                  min={1}
                  onChange={(e) => handleQuantityChange(e, elem)}
                />
                {console.log(elem.quantity)}
              </td>
              <td>{elem.price * elem.quantity}.00</td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="cartTable">
        <thead>
          <tr>
            <th colSpan="2">Your Order</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Total</td>
            <td>{totalAmount}.00</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="2">
              <button onClick={() => navigate("/placeOrder")}>Checkout</button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default Cart;
