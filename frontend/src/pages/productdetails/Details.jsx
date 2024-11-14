import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import "./style.css";

export const Details = () => {
  const { pId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
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

  return (
    <div className="container">
      <div>{product.title}</div>
      <div>{product.price}</div>
      <div>{product.description}</div>
    </div>
  );
};

export default Details;
