import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "./cart.css";



const Cart = () => {
  
  const [myCart, setMyCart] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const uId = useSelector((state) => state.auth.userId);
  
 
  const  headers= {
    Authorization: `Bearer ${token}`,
  }
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/cart`, { headers })
      .then((response) => {
        setMyCart(response.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  ///////////////////////////////////////////////////////////////
  const addToCart=()=>{
    console.log(token)
    console.log("this is token")

    if(isLoggedIn===false){
      Navigate("/users/login")
return 0
    }
    axios
    .post(` http://localhost:5000/cart/${pId}`,{quantity},{headers})
    .then((response)=>{
      console.log(response.data)

    })
    .catch((error)=>{
      
      console.log(error)

    })
      
    }

  const totalAmount = myCart?.reduce((acc, elem) => acc + elem.price * elem.quantity, 0);

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
          {myCart?.map((elem, index) => (
            <tr key={index}>
              <td>{elem.title}</td>
              <td>{elem.price}</td>
              <td> <input type="number" defaultValue={elem.quantity} m/></td>
              
              <td>{elem.price * elem.quantity}.00</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h1>Total: {totalAmount}</h1>
    </div>
  );
};

export default Cart;
