import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [avgrate, setAvgrate] = useState();
  //comment
  useEffect(() => {
    axios.get(`http://localhost:5000/products/${pId}`).then((response) => {
      setProduct(response.data.product);
    });
    axios.get(`http://localhost:5000/review/${pId}`).then((response) => {
      setReviews(response.data.result);
      console.log(response.data.result);
      setAvgrate(response.data.result[0].avgrating);
    });
  }, [pId]);

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
    if (newComment.trim() && rating > 0) {
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
      setShowModal(true);
    }
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
        {/* Product Image Section */}
        <div className="productimage">
          <img
            src={product.product_image || "https://via.placeholder.com/400x400"}
            alt={product.title}
          />
        </div>

        {/* Product Details Section */}
        <div className="productdetails">
          <h1 className="producttitle">{product.title}</h1>
          <p className="productprice">{product.price} JD</p>
          <p className="productdescription">{product.description}</p>
          {/* Add to Cart Section */}
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
        </div>
      </div>
      <div className="avgrating">
        <h1>Rating {avgrate}/5</h1>
      </div>
      <div className="reviews-section">
        <h2>Reviews</h2>

        {/* New Review Form */}
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

        {/* Reviews List */}
        <div>
          {reviews.length > 0 ? (
            reviews
              .slice(0, showAllComments ? reviews.length : 5)
              .map((review) => (
                <div className="review-card" key={review?.id}>
                  <div className="review-header">
                    <span className="review-author">User {userName}</span>
                    {/* <span className="review-date">
                      {new Date(review.created_at).toLocaleString()}
                    </span> */}
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
                  {/* Edit and Delete buttons */}
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

                  {/* Edit Review Form */}
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
          {/* Show 'Show All' or 'Show Less' button */}
          {reviews.length > 5 && (
            <button onClick={toggleShowAllComments} className="show-all-button">
              {showAllComments ? "Show Less" : "Show All"}
            </button>
          )}
        </div>
        {/* Modal Component */}
        {showModal && (
          <Modal message={modalMessage} onClose={() => setShowModal(false)} />
        )}
      </div>
    </div>
  );
};

export default Details;
