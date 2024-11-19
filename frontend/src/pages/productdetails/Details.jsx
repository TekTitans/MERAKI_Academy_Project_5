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
  const [msg, setMsg] = useState("");
  const [reviews, setReviews] = useState({});
  const [product, setProduct] = useState({});
const [quantity,setQuantity]=useState(1)
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
    .post(` http://localhost:5000/cart/${pId}`,{quantity},{headers})
    .then((response)=>{
      console.log(response.data)

    })
    .catch((error)=>{
      
      console.log(error)

    })
      
    }
  console.log(token)

  useEffect(() => {
    axios
      .get(`http://localhost:5000/review/${pId}`)
      .then((response) => {
        if (response.data.success) {
          console.log(response.data);
          setReviews(response.data.result);

          setMsg(response.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        setMsg(err.response.data.message);
      });
  }, []);
  console.log(reviews);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/review/${pId}`)
      .then((response) => {
        if (response.data.success) {
          console.log(response.data);
          setReviews(response.data.result);

          setMsg(response.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        setMsg(err.response.data.message);
      });
  }, []);
  console.log(reviews);

  return (

   
    <>
      <div className="container">
        <div>{product.title}</div>
        <div>{product.price}</div>
        <div>{product.description}</div>
      <button onClick={()=>{addToCart()}}>add to cart</button>
      <input  onChange={(e)=>{if(e.target.value<1||!true){setQuantity(1)}else{setQuantity(e.target.value)};  console.log(e.target.value)
}} type="number" value={quantity} min={1}/>
      </div>
      <h2>Reviews</h2>
      <div className="container">
        <div>{reviews.comment}</div>
        <div>{reviews.rating}</div>
        <div>{msg}</div>
      </div>
    </>
  );
};

export default Details;
