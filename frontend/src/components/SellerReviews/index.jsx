import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUserAlt } from "react-icons/fa";
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

  const [filterRating, setFilterRating] = useState(0); 
  const [generalRating, setGeneralRating] = useState(null); 

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
        const fetchedReviews = response.data.result;
        dispatch(setSellerReviews(fetchedReviews));

        // Calculate general rating (average)
        const totalRating = fetchedReviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        const avgRating =
          fetchedReviews.length > 0
            ? (totalRating / fetchedReviews.length).toFixed(1)
            : null;
        setGeneralRating(avgRating);
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

  const renderStars = (rating) => {
    const maxStars = 5;
    return (
      <span className="rating-stars">
        {Array.from({ length: maxStars }, (_, i) =>
          i < rating ? "★" : "☆"
        ).join("")}
      </span>
    );
  };

  const handleStarClick = (star) => {
    setFilterRating(star); // Update filter rating
  };

  const filteredReviews =
    filterRating > 0
      ? reviews.filter((review) => review.rating <= filterRating)
      : reviews;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="reviews-container">
      <div className="header_seller_reviews">
        <h2 className="page-title">Seller Reviews</h2>
        <div className="general-rating">
          <h4>General Rating: {generalRating || "No reviews yet"}</h4>
          {generalRating && <div>{renderStars(Math.round(generalRating))}</div>}
        </div>
      </div>
      <div className="filter-section">
        <p>Filter by Rating:</p>
        <div className="star-filter">
          {Array.from({ length: 5 }, (_, index) => (
            <span
              key={index}
              className={`star ${filterRating >= index + 1 ? "selected" : ""}`}
              onClick={() => handleStarClick(index + 1)}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      {filteredReviews.length === 0 ? (
        <p>No reviews found for the selected filter.</p>
      ) : (
        <div className="reviews-list">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="review-card"
              data-rating={
                review.rating >= 4
                  ? "positive"
                  : review.rating === 3
                  ? "neutral"
                  : "negative"
              }
            >
              <div className="profile-wrapper">
                {review.profile_image ? (
                  <img
                    src={review.profile_image}
                    alt={`${review.user_name}'s profile`}
                    className="review-profile-image"
                  />
                ) : (
                  <FaUserAlt className="fallback-icon" />
                )}
              </div>
              <div className="review-content">
                <div className="review-header">
                  <strong>{review.user_name}</strong> -{" "}
                  {formatDate(review.created_at)}
                </div>
                {renderStars(review.rating)}
                <p className="review-comment">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerReviews;
