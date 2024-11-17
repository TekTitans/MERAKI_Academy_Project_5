import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Link, useParams } from "react-router-dom";
import "./style.css";

export const Details = () => {
  const token = useSelector((state) => {
    return state.auth.token;
  });
  const  headers= {
    Authorization: `Bearer ${token}`,
  }

  const Navigate=useNavigate()
  const { pId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState({});
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);


  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`http://localhost:5000/products/${pId}`)
      .then((response) => {
        console.log(response.data);
        setProduct(response.data.product);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  ///////////////////////////////////////////////////
  const addToCart=()=>{
    console.log(token)
    console.log("this is token")

    if(isLoggedIn===false){
      Navigate("/users/login")
return 0
    }
    axios
    .post(` http://localhost:5000/cart/${pId}`,{},{headers})
    .then((response)=>{
      console.log(response.data)

    })
    .catch((error)=>{
      console.log(error)

    })
      
    }
  

  return (
    <div className="container">
      <div>{product.title}</div>
      <div>{product.price}</div>
      <div>{product.description}</div>
      <button onClick={()=>{addToCart()}}>add to cart</button>
    </div>
  )}


export default Details;
