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
  const [sortOption, setSortOption] = useState("");

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
    setFilterRating(star);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const handleClearFilters = () => {
    setFilterRating(0);
    setSortOption("");
  };

  const filteredReviews = reviews
    .filter((review) => {
      return filterRating === 0 || review.rating === filterRating;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        case "username":
          return a.user_name.localeCompare(b.user_name);
        default:
          return 0;
      }
    });

  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="reviews-container">
      <div className="header-seller-reviews">
        <div>
          <h2 className="page-title">Seller Reviews</h2>
        </div>
        <div className="general-rating">
          <div className="general-rating-content">
            <h3>General Rating</h3>
            {generalRating ? (
              <div className="star-general">
                {renderStars(Math.round(generalRating))}
              </div>
            ) : (
              <p>No reviews yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="filter-sort-section">
        <div className="filter-section">
          <h4>Filter Reviews</h4>
          <div className="star-filter">
            {Array.from({ length: 5 }, (_, index) => (
              <span
                key={index}
                className={`star ${
                  filterRating >= index + 1 ? "selected" : ""
                }`}
                onClick={() => handleStarClick(index + 1)}
              >
                ★
              </span>
            ))}
          </div>
          <button
            className="seller_review_clear-filter-btn"
            onClick={handleClearFilters}
          >
            Clear
          </button>
        </div>

        <div className="sort-section">
          <label htmlFor="sort-select" className="sort-label">
            Sort By:
          </label>
          <div className="custom-select">
            <button className="select-btn">
              {sortOption ? capitalizeFirstLetter(sortOption) : "Sort Options"}
              <span className="arrow">&#x25BC;</span>
            </button>
            <ul className="select-options">
              <li
                className="select-option"
                onClick={() => handleSortChange("newest")}
              >
                <span className="icon">🆕</span> Newest
              </li>
              <li
                className="select-option"
                onClick={() => handleSortChange("oldest")}
              >
                <span className="icon">🕒</span> Oldest
              </li>
              <li
                className="select-option"
                onClick={() => handleSortChange("highest")}
              >
                <span className="icon">⭐</span> Highest Rating
              </li>
              <li
                className="select-option"
                onClick={() => handleSortChange("lowest")}
              >
                <span className="icon">⭐</span> Lowest Rating
              </li>
              <li
                className="select-option"
                onClick={() => handleSortChange("username")}
              >
                <span className="icon">👤</span> Username (A-Z)
              </li>
            </ul>
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default SellerReviews;
