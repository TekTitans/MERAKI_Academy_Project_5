import axios from "axios";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";



const PlaceOrder=()=>{
    const [myCart, setMyCart] = useState([]);
    const token = useSelector((state) => state.auth.token);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const headers = {
    Authorization: `Bearer ${token}`,
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


    return (<div>
        
  <table className="cartTable">
        <thead>
        <tr>
          <th colSpan="4">Your Order</th>
        </tr>
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
              <td>{elem.price} </td>
              <td>
                {elem.quantity}
              </td>
              <td>{elem.price * elem.quantity}.00</td>
              
            </tr>
          ))}
        </tbody>
        <tr>
          <th colSpan="4">{totalAmount}.00</th>
        </tr>
      </table> 
      <div className="placeorder">
      <button>place order</button>
      </div>
      
         </div>)

}
export default PlaceOrder;