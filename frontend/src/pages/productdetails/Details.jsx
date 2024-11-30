import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "./details.css";
import Modal from "../modal/Modal";
import Breadcrumb from "../../components/Breadcrumb";

const Details = () => {
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);
  const userName = useSelector((state) => state.auth.userName);
  const headers = { Authorization: `Bearer ${token}` };
  const Navigate = useNavigate();
  const { pId } = useParams();
  const [product, setProduct] = useState({});
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [newComment, setNewComment] = useState("");
  const [editingReview, setEditingReview] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [avgrate, setAvgrate] = useState();
  //comment
  useEffect(() => {
    axios.get(`http://localhost:5000/products/${pId}`).then((response) => {
      setProduct(response.data.product);
      console.log("product", response.data.product);
    });
    axios.get(`http://localhost:5000/review/${pId}`).then((response) => {
      const allReview = response.data.reviews;
      setReviews(allReview);
      setAvgrate(response.data.average_rating);
      console.log("Review", response.data.reviews);
      console.log("average_rating", response.data.average_rating);
    });
  }, [pId]);
  console.log(reviews);

  const addToCart = () => {
    if (!token) {
      Navigate("/users/login");
    }
    axios
      .post(`http://localhost:5000/cart/${pId}`, { quantity }, { headers })
      .then((response) => {
        Navigate("/cart");
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const deleteReview = (reviewId) => {
    axios
      .delete(`http://localhost:5000/review/${reviewId}`, { headers })
      .then((response) => {
        setReviews((prevReviews) =>
          prevReviews.filter((review) => review.id !== reviewId)
        );
        setModalMessage(response.data.message);
      })
      .catch((err) => {
        console.error("Error deleting review:", err);
        setModalMessage("Failed to delete review.");
      });
  };

  const createReview = () => {
    if (!token) {
      setModalMessage("Need to login first ");
      setModalVisible(true);
    } else if (newComment.trim() && rating > 0) {
      axios
        .post(
          `http://localhost:5000/review/${pId}`,
          { rating, comment: newComment },
          { headers }
        )
        .then((response) => {
          console.log(response.data);

          setReviews([...reviews, response.data.result]);
          setNewComment("");
          setRating(0);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setModalMessage("Please provide a valid rating and comment!");
      setModalVisible(true);
    }
  };
  const closeModal = () => {
    setModalVisible(false); // This function hides the modal
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setEditComment(review.comment);
    setEditRating(review.rating);
  };

  const handleUpdate = (reviewId) => {
    if (editComment.trim() && editRating > 0) {
      axios
        .put(
          `http://localhost:5000/review/${reviewId}`,
          { rating: editRating, comment: editComment },
          { headers }
        )
        .then((response) => {
          setReviews(
            reviews?.map((review) =>
              review.id === reviewId ? response.data : review
            )
          );
          setEditingReview(null);
          setEditComment("");
          setEditRating(0);
          setModalMessage(response.data.message);
        })

        .catch((error) => {
          console.error(error);
        });
    } else {
      setModalMessage("Enter A valid input");
    }
  };

  const toggleShowAllComments = () => {
    setShowAllComments(!showAllComments);
  };

  return (
    <>
      <Breadcrumb />

      <div className="product-details-container">
  <div className="product-main">
    {/* Full-Height Product Image */}
    <div className="product-image-container">
      <img
        src={
          product.product_image || "https://via.placeholder.com/600x600"
        }
        alt={product.title}
        className="product-image"
      />
    </div>

    {/* Product Details */}
    <div className="product-info-container">
      <h1 className="product-title">{product.title}</h1>

      {/* Product Rating */}
      <div className="product-rating-container">
        <div className="product-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <i
              key={star}
              className={`star-icon ${
                avgrate >= star ? "fas fa-star" : "far fa-star"
              }`}
            ></i>
          ))}
        </div>
      </div>

      <p className="product-price">{product.price} JD</p>
      <p className="product-description">{product.description}</p>

      <div className="product-seller">
        <strong>Added by: </strong>
        <Link to={`/users/${product.seller_id}`} className="seller-link">
          {product.user_name}
        </Link>
      </div>

      <div className="add-to-cart-section">
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="1"
          className="quantity-input"
        />
        <button className="add-to-cart-button" onClick={addToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  </div>
</div>




      <div>
        {/* Reviews Section */}
        <div className="reviews-container">
          <h2>Reviews</h2>

          {/* New Review Form */}
          <div className="new-review-form">
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`star ${rating >= star ? "filled" : ""}`}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your review..."
              className="review-textarea"
            />
            <button onClick={createReview} className="submit-review-button">
              Submit Review
            </button>
          </div>

          {/* Review Cards */}
          <div className="review-cards">
            {reviews.length > 0 ? (
              reviews
                .slice(0, showAllComments ? reviews.length : 5)
                .map((review) => (
                  <div className="review-card" key={review.id}>
                    <div className="review-header">
                      <span className="review-author">{review.user_name}</span>
                      <span className="review-date">
                        {new Date(review.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="review-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`star ${
                            review.rating >= star ? "filled" : ""
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="review-comment">{review.comment}</p>

                    {review.user_id === parseInt(userId) && (
                      <div className="review-actions">
                        <button
                          className="edit-review-button"
                          onClick={() => handleEdit(review)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-review-button"
                          onClick={() => deleteReview(review.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}

                    {editingReview?.id === review?.id && (
                      <div className="edit-review-form">
                        <div className="rating-input">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              onClick={() => setEditRating(star)}
                              className={`star ${
                                editRating >= star ? "filled" : ""
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <textarea
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          placeholder="Edit your review..."
                          className="review-textarea"
                        />
                        <button
                          onClick={() => handleUpdate(review.id)}
                          className="update-review-button"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => setEditingReview(null)}
                          className="cancel-edit-button"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                ))
            ) : (
              <p className="no-reviews-message">
                No reviews yet. Be the first to review!
              </p>
            )}
          </div>

          {/* Show All Button */}
          {reviews.length > 5 && (
            <button
              onClick={toggleShowAllComments}
              className="toggle-reviews-button"
            >
              {showAllComments ? "Show Less" : "Show All"}
            </button>
          )}
        </div>

        {/* Modal */}
        <Modal
          isOpen={modalVisible}
          autoClose={closeModal}
          message={modalMessage}
        />
      </div>
    </>
  );
};

export default Details;
