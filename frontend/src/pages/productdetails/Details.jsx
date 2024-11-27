import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "./details.css";
import Modal from "../modal/Modal";

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
      console.log(response.data);
    });
    axios.get(`http://localhost:5000/review/${pId}`).then((response) => {
      const allReview = response.data.result;
      setReviews(allReview);
      const total = allReview.reduce((sum, review) => sum + review.rating, 0);
      const avg =
        allReview.length > 0 ? (total / allReview.length).toFixed(2) : null;
      setAvgrate(avg);
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
    <div className="details-container">
      <div className="productpage">
        <div className="productimage">
          <img
            src={product.product_image || "https://via.placeholder.com/400x400"}
            alt={product.title}
          />
        </div>

        <div className="productdetails">
          <h1 className="producttitle">{product.title}</h1>
          <p className="productprice">{product.price} JD</p>
          <p className="productdescription">{product.description}</p>

          <div className="add-to-cart">
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
          <p>
            <strong>Added by:</strong>
            <Link to={`/seller/${product.seller_id}`} className="user-link">
              {product.user_name}
            </Link>
          </p>
        </div>
      </div>
      <div className="avgrating">
        <span className="ratingstart">Rating</span>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${avgrate >= star ? "filled" : ""}`}
          >
            ★
          </span>
        ))}
      </div>
      <div className="reviews-section">
        <h2>Reviews</h2>

        <div className="new-review-form">
          <div className="rating">
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
          />
          <button onClick={createReview}>Submit Review</button>
        </div>

        <div>
          {reviews.length > 0 ? (
            reviews
              .slice(0, showAllComments ? reviews.length : 5)
              ?.map((review) => (
                <div className="review-card" key={review?.id}>
                  <div className="review-header">
                    <span className="review-author">{review.user_name}</span>
                    <span className="review-date">
                      {new Date(review.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="review-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star ${
                          review?.rating >= star ? "filled" : ""
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="review-comment">{review?.comment}</p>

                  {review?.user_id === parseInt(userId) && (
                    <div className="edit-delete-buttons">
                      <button
                        className="edit"
                        onClick={() => handleEdit(review)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete"
                        onClick={() => deleteReview(review.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}

                  {editingReview?.id === review?.id && (
                    <div>
                      <div className="rating">
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
                      />
                      <button onClick={() => handleUpdate(review.id)}>
                        Update
                      </button>
                      <button onClick={() => setEditingReview(null)}>
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))
          ) : (
            <p>No reviews yet. Be the first to review!</p>
          )}

          {reviews.length > 5 && (
            <button onClick={toggleShowAllComments} className="show-all-button">
              {showAllComments ? "Show Less" : "Show All"}
            </button>
          )}
        </div>

        <Modal
          isOpen={modalVisible}
          autoClose={closeModal} // Pass closeModal as the autoClose handler
          message={modalMessage}
        />
      </div>
    </div>
  );
};

export default Details;
