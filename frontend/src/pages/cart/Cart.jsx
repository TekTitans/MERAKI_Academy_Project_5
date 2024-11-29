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
      
  <div className="cartTableWrapper">
    {localCart.length>0?<table className="cartTable">
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
        {localCart?.map((elem, index) => (
          <tr key={index}>
            <td>
              <button
                className="remove-btn"
                onClick={() => removeFromCart(elem.id)}
              >
                Remove
              </button>
            </td>
            <td>
              <img
                src={elem.product_image || "https://via.placeholder.com/150"}
                alt={elem.title}
                className="product-images"
              />
            </td>
            <td>{elem.title}</td>
            <td>{elem.price} JD</td>
            <td>
              <input
                type="number"
                value={elem.quantity}
                min={1}
                onChange={(e) => handleQuantityChange(e, elem)}
              />
            </td>
            <td>{elem.price * elem.quantity}.00 JD</td>
          </tr>
        ))}
      </tbody>
      <thead>
        <tr>
        <th colSpan="6">total : {totalAmount} JD</th>
        </tr>
      </thead>
    </table>:<div className="empty-cart-message" id="emptyCartMessage">
  <h2>Your Cart is Empty</h2>
  <p>It looks like you haven't added anything to your cart yet. Start shopping now!</p>
  <button onClick={()=>{navigate("/shop")}}>Go to Shop</button>
</div>}
  </div>
 {localCart.length>0? <div className="checkout"> 
  <button onClick={()=>{navigate("/placeorder")}} className="checkoutB">checkout</button>
  </div>:null}
</div>

  
  );
};

export default Cart;
