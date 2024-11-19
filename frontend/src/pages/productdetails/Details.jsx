import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import "./style.css";

export const Details = () => {
  const { pId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [reviews, setReviews] = useState({});
  const [product, setProduct] = useState({});

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
