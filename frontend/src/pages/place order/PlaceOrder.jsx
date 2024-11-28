import axios from "axios";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import "./placeorder.css";
import CheckoutForm from "../../components/Checkoutform/CheckoutForm";
import "./deliveryForm.css";
import { useNavigate } from "react-router-dom";


const PlaceOrder = () => {
  const navigate=useNavigate()
  const jordanGovernorates = [
    { name: "Amman", deliveryPrice: 5 },
    { name: "Zarqa", deliveryPrice: 4 },
    { name: "Irbid", deliveryPrice: 6 },
    { name: "Mafraq", deliveryPrice: 7 },
    { name: "Karak", deliveryPrice: 8 },
    { name: "Tafilah", deliveryPrice: 9 },
    { name: "Ma'an", deliveryPrice: 10 },
    { name: "Aqaba", deliveryPrice: 12 },
    { name: "Balqa", deliveryPrice: 5 },
    { name: "Jarash", deliveryPrice: 6 },
    { name: "Ajloun", deliveryPrice: 7 },
    { name: "Madaba", deliveryPrice: 6 },
    { name: "Al-Karak", deliveryPrice: 8 },
    { name: "Al-Mafraq", deliveryPrice: 7 }
  ];
  
  
  const [myCart, setMyCart] = useState([]);
  const [phone_number, setPhoneNumber] = useState("");

  const token = useSelector((state) => state.auth.token);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };


  useEffect(() => {
    axios
      .get("http://localhost:5000/cart", { headers })
      .then((response) => {
        setMyCart(response.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const totalAmount = myCart?.reduce(
    (acc, elem) => acc + elem.price * elem.quantity,
    0
  );

  const createOrder = () => {
    axios
      .post(`http://localhost:5000/order`, {phone_number}, { headers })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="placeOrderPage">
      <div className="orderDetailsCard">
        <h2>Your Order</h2>
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
            {myCart?.map((elem, index) => (
              <tr key={index}>
                <td>{elem.title}</td>
                <td>{elem.price} JD</td>
                <td>{elem.quantity}</td>
                <td>{elem.price * elem.quantity}.00 JD</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan="3">Total</th>
              <th>{totalAmount}.00 JD</th>
            </tr>
          </tfoot>
          <tfoot>
            <tr>
              <th colSpan="3">Tax</th>
              <th>{totalAmount}.00 JD</th>
            </tr>
          </tfoot>
        </table>
        <div className="placeOrderActions">
          <button onClick={() => {navigate("/cart")}}>Edit Cart</button>
        </div>
      </div>
      <div className="deliveryForm" onSubmit={handleSubmit}>
      <h2>Delivery Information</h2>
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        onChange={()=>{setPhoneNumber(e.target.value)}}
        required
      />
     
      <input
        type="text"
        name="city"
        placeholder="City"
        value={formData.city}
        onChange={handleChange}
        required
      />
      <div>
      <select
        id="governorate"
        name="governorate"
        onChange={handleChange}
      >
        <option value="">Select your City</option>
        {jordanGovernorates.map((governorate, index) => (
          <option key={index} value={governorate}>
            {governorate.name}
          </option>
        ))}
      </select>
      <div>
         <div className="payment">
          <label>
            <input type="radio" name="paymentMethod" value="creditCard" />
            Visa (Credit Card)
          </label>
        </div>
        <div className="payment">
          <label>
            <input type="radio" name="paymentMethod" value="cashOnDelivery" />
            Cash on Delivery
          </label>
        </div>
    </div>
      <div>
      < CheckoutForm/>
      </div>

      
    </div>
    </div>
    </div>
  );
};

export default PlaceOrder;
