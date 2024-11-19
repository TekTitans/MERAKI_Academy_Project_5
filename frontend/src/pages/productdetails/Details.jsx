import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Link, useParams } from "react-router-dom";
import "./details.css";

export const Details = () => {
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const token = useSelector((state) => {
    return state.auth.token;
  });
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const Navigate = useNavigate();
  const { pId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [reviews, setReviews] = useState([]);
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
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
  const createReview = () => {
    axios
      .post(
        `http://localhost:5000/review/${pId}`,
        { rating, comment },
        { headers }
      )
      .then((response) => {})
      .catch((err) => {});
  };

  const addToCart = () => {
    console.log(token);
    console.log("this is token");

    if (isLoggedIn === false) {
      Navigate("/users/login");
      return 0;
    }
    axios
      .post(` http://localhost:5000/cart/${pId}`, { quantity }, { headers })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  console.log(token);
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

  const rev = reviews?.map((reviwe, index) => {
    return (
      <div key={reviwe.id}>
        <div>{reviwe.comment}</div>
        <div>{reviwe.avgrating}</div>
      </div>
    );
  });

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
  return (
    <>
      <div className="container">
        <div>{product.title}</div>
        <div>{product.price}</div>
        <div>{product.description}</div>

        <button
          onClick={() => {
            addToCart();
          }}
        >
          add to cart
        </button>
        <input
          onChange={(e) => {
            if (e.target.value < 1 || !true) {
              setQuantity(1);
            } else {
              setQuantity(e.target.value);
            }
            console.log(e.target.value);
          }}
          type="number"
          value={quantity}
          min={1}
        />
      </div>
      <h2>Reviews</h2>
      <div className="container">
        {rev}

        <div>
          <button onClick={createReview}>Add Review</button>
        </div>
      </div>
    </>
  );
};

export default Details;
