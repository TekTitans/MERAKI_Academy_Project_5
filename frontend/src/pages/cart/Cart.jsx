import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import "./cart.css";

const Cart = () => {
  const [myCart, setMyCart] = useState([]);
  const [localCart, setLocalCart] = useState([]);
  const [debounceTimer, setDebounceTimer] = useState(null);

  const token = useSelector((state) => state.auth.token);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/cart", { headers })
      .then((response) => {
        setMyCart(response.data.result);
        setLocalCart(response.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const sendQuantityUpdate = (id, quantity) => {
    axios
      .post(`http://localhost:5000/cart/${id}`, { quantity }, { headers })
      .then((response) => {
        console.log("UPDATED", response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleQuantityChange = (e, elem) => {
    const newQuantity = Math.max(1, e.target.value);
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
        console.log(error);
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
              </td>
              <td>{elem.price * elem.quantity}.00</td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="cartTable">
        <tr>
          <th colSpan="2">Your Order</th>
        </tr>
        <tr>
          <td>Total</td>
          <td>{totalAmount}.00</td>
        </tr>
        <tr>
          <td colSpan="2">
            <button onClick={()=>{navigate("/placeOrder")}}>Checkout</button>
          </td>
        </tr>
      </table>
    </div>
  );
};

export default Cart;
