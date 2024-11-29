import axios from "axios";
import { useSelector,useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import "./placeorder.css";
import CheckoutForm from "../../components/Checkoutform/CheckoutForm";
import "./deliveryForm.css";
import { useNavigate } from "react-router-dom";
import { setCartNum } from "../../components/redux/reducers/orders";

const PlaceOrder = () => {
  const dispatch=useDispatch()
  const cartNum = useSelector((state) => state.order.cartnum);


  const [isVisa, setIsVisa] = useState("cash");
  const navigate = useNavigate();
  const jordanGovernorates =[
    { name: "Amman", deliveryPrice: 3 },
    { name: "Zarqa", deliveryPrice: 4 },
    { name: "Irbid", deliveryPrice: 7 },
    { name: "Mafraq", deliveryPrice: 6 },
    { name: "Karak", deliveryPrice: 6 },
    { name: "Tafilah", deliveryPrice: 8 },
    { name: "Ma'an", deliveryPrice: 10 },
    { name: "Aqaba", deliveryPrice: 12 },
    { name: "Balqa", deliveryPrice: 4 },
    { name: "Jarash", deliveryPrice: 7 },
    { name: "Ajloun", deliveryPrice: 7 },
    { name: "Madaba", deliveryPrice: 5 },
    { name: "Al-Karak", deliveryPrice: 6 },
    { name: "Al-Mafraq", deliveryPrice: 6 }
  ]
  

  const [deliveryPrice, setDeliveryPrice] = useState(null);
  const [myCart, setMyCart] = useState([]);
  const [street, setStreet] = useState("");
  const [country, setCountry] = useState("");


  const [phone_number, setPhoneNumber] = useState("");

  const token = useSelector((state) => state.auth.token);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  useEffect(()=>{
    const selectedGovernorate = jordanGovernorates.find(
      (governorate) => governorate.name === country
    );
    
    if (selectedGovernorate) {
      setDeliveryPrice(selectedGovernorate.deliveryPrice);
    } else{
      setDeliveryPrice(0)
    }
  },[country])

 

 
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
      .post(`http://localhost:5000/order`, { phone_number,street,country,isVisa,deliveryPrice }, { headers })
      .then((response) => {
        console.log(response.data)
       dispatch( setCartNum(0))

        navigate("/myorders")
      })
      .catch((error) => {
        console.log(error);
      });
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
  
  const handleCounty=(e)=>{
    setCountry(e.target.value)
   
  };
  return (
    <div className="placeOrderPage">
      <div className="orderDetailsCard">
        <h2>Your Order</h2>
        <table className="cartTable">
          <thead>
            <tr>
              <th>image</th>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {myCart?.map((elem, index) => (
              <tr key={index}>
                <td>  <img
                src={elem.product_image || "https://via.placeholder.com/150"}
                alt={elem.title}
                className="product-images"
              /></td>
                <td>{elem.title}</td>
                <td>{elem.price} JD</td>
                <td>{elem.quantity}</td>
                <td>{elem.price * elem.quantity}.00 JD</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan="4">Total</th>
              <th>{totalAmount+deliveryPrice}.00 JD</th>
            </tr>
          </tfoot>
          <tfoot>
            <tr>
              <th colSpan="4">Shipping</th>
              <th>{deliveryPrice}.00 JD</th>
            </tr>
          </tfoot>
        </table>
        <div className="placeOrderActions">
          <button onClick={() => { navigate("/cart") }}>Edit Cart</button>
        </div>
      </div>

      <div className="deliveryForm" onSubmit={handleSubmit}>
        <h2>Delivery Information</h2>
       
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          onChange={(e) => { setPhoneNumber(e.target.value) }}
          required
        />

       
        <div>
          <select
            id="governorate"
            name="governorate"
            onChange={(e)=>{handleCounty(e)}}
          >
            
            <option value="">Select your City</option>
            {jordanGovernorates.map((governorate, index) => (
              <option key={index} value={governorate.name} >
                {governorate.name}
              </option>
            ))}
          </select>
          <br/>
          <br/>
          <input
          type="text"
          name="street"
          placeholder="street"
          onChange={(e)=>{setStreet(e.target.value)}}
          required
        />

          <br/>
          <br/>

          <div className="payment">
            <label>
              <input
                onChange={() => { setIsVisa("cash") }}
                type="radio"
                name="paymentMethod"
                value="cashOnDelivery"
                checked={isVisa === "cash"} 
              />
              <span>Cash on Delivery</span>
            </label>
          </div>
          
          <div className="payment">
            <label>
              <input
                onChange={() => { setIsVisa("visa") }}
                type="radio"
                name="paymentMethod"
                value="creditCard"
                checked={isVisa === "visa"}
              />
              <span>Visa (Credit Card)</span>
            </label>
          </div>

          {isVisa === "visa" ? (
            <div>
              <CheckoutForm  phone_number={phone_number} street={street} country={country} isVisa={isVisa} deliveryPrice={deliveryPrice}/>
            </div>
          ) : (
<button 
  onClick={() => { createOrder(); }} 
  disabled={country === ""} 
  className={country === "" ? "disabled-button" : ""}
>
  Complete Payment
</button>          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
