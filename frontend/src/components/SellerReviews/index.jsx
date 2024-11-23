import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSellerReviews,
  setLoading,
  setError,
} from "../redux/reducers/sellerReviews";
import axios from "axios";
import "./style.css";

const SellerReviews = () => {
  const dispatch = useDispatch();
  const sellerId = useSelector((state) => state.auth.userId);
  const { token } = useSelector((state) => state.auth);
  const { reviews, loading, error } = useSelector(
    (state) => state.sellerReview
  );

  const fetchReviews = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const response = await axios.get(
        `http://localhost:5000/review/seller/${sellerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response) {
        throw new Error("Failed to fetch reviews");
      }

      if (response.data.success) {
        dispatch(setSellerReviews(response.data.result));
      } else {
        dispatch(setError("No reviews found for this seller"));
      }
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [sellerId, token]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="reviews-container">
      <h3>Seller Reviews</h3>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <p>
                <strong>{review.user_name}</strong> -{" "}
                {formatDate(review.created_at)}
              </p>
              <p>Rating: {review.rating} / 5</p>
              <p>{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerReviews;
