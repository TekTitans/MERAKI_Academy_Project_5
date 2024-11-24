import React, { useEffect } from "react";
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
      if (!sellerId) {
        throw new Error("Seller ID is not available.");
      }

      const response = await axios.get(
        `http://localhost:5000/review/seller/${sellerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        dispatch(setSellerReviews(response.data.result));
        console.log("Seller Reviews: ", response.data.result);
      } else {
        dispatch(setError("No reviews found for this seller"));
      }
    } catch (err) {
      dispatch(
        setError(err.response?.data?.message || "Failed to fetch reviews")
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (sellerId && token) {
      fetchReviews();
    }
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
              <div className="review-header">
                <strong>{review.user_name}</strong> -{" "}
                {formatDate(review.created_at)}
              </div>
              <div className="review-rating">Rating: {review.rating} / 5</div>
              <div className="review-comment">{review.comment}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerReviews;
