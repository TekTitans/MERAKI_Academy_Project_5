const pool = require("../models/db");

const createReview = (req, res) => {
  const { rating, comment } = req.body;
  const product_id = req.params.pId;

  const user_id = req.token.userId;

  const query = `INSERT INTO reviews (product_id, user_id, rating,comment) VALUES ($1,$2,$3,$4)RETURNING *;`;
  const data = [product_id, user_id, rating, comment];
  pool
    .query(query, data)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "review created successfully",
        result: result.rows[0],
      });
    })
    .catch((err) => {
      console.log(err);

      res.status(500).json({
        success: false,
        message: "Server error",
        err: err,
      });
    });
};
const updateReview = async (req, res) => {
  const reviewId = req.params.reviewId;
  const { comment, rating } = req.body;
  const userId = req.token.userId; // Get user ID from the JWT token

  try {
    // Check if the review exists and belongs to the logged-in user
    const result = await pool.query(
      "SELECT * FROM reviews WHERE id = $1 AND user_id = $2",
      [reviewId, userId]
    );

    if (result.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "You can only edit your own reviews" });
    }

    // Update the review
    const updatedReview = await pool.query(
      "UPDATE reviews SET comment = $1, rating = $2 WHERE id = $3 RETURNING *",
      [comment || null, rating || null, reviewId]
    );

    return res.status(200).json(updatedReview.rows[0]);
  } catch (err) {
    console.error("Error updating review:", err);
    return res.status(500).json({ message: "Error updating review" });
  }
};
const removeReview = async (req, res) => {
  const reviewId = req.params.reviewId;
  const userId = req.token.userId; // User who is logged in

  try {
    // Check if the review exists and belongs to the logged-in user
    const result = await pool.query(
      "SELECT * FROM reviews WHERE id = $1 AND user_id = $2",
      [reviewId, userId]
    );

    if (result.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "You can only delete your own reviews" });
    }

    // Delete the review
    await pool.query("DELETE FROM reviews WHERE id = $1", [reviewId]);
    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Error deleting review:", err);
    return res.status(500).json({ message: "Error deleting review" });
  }
};

const getProductReviews = (req, res) => {
  const product_id = req.params.id;

  const query = `SELECT *,CAST(ROUND(AVG(rating) OVER (PARTITION BY product_id), 2) AS DECIMAL(10, 2)) AS avgrating 
FROM reviews 
WHERE product_id = $1; `;

  const data = [product_id];
  pool
    .query(query, data)
    .then((result) => {
      if (result.rows.length == 0) {
        res.status(404).json({
          success: false,
          message: "no data",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "review selected successfully",
          result: result.rows,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err,
      });
    });
};
const createSellerReviews = (req, res) => {
  const { user_id, rating, comment } = req.body;
  const id = req.token.userId;

  const query = `INSERT INTO sellerreviews (seller_id, user_id, rating,comment) VALUES ($1,$2,$3,$4) RETURNING *;`;
  const data = [id, user_id, rating, comment];
  pool
    .query(query, data)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "review created successfully",
        result: result.rows[0],
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err,
      });
    });
};

const getSellerReviews = (req, res) => {
  const sellerId = parseInt(req.params.sellerId);

  const query = `
    SELECT 
      reviews.id, 
      reviews.rating, 
      reviews.comment, 
      reviews.created_at, 
      CONCAT(users.first_name, ' ', users.last_name) AS user_name, 
      users.userName, 
      users.profile_image
    FROM sellerReviews reviews
    JOIN users ON reviews.user_id = users.id
    WHERE reviews.seller_id = $1
      AND reviews.is_deleted = false
    ORDER BY reviews.created_at DESC;
  `;

  const data = [78];//sellerId
  pool
    .query(query, data)
    .then((result) => {
      console.log("Seller reviews retrieved:", result.rows);
      res.status(200).json({
        success: true,
        message: "Seller reviews retrieved successfully",
        result: result.rows,
      });
    })
    .catch((err) => {
      console.error("Error retrieving seller reviews:", err);
      res.status(500).json({
        success: false,
        message: "Server error. Please try again later.",
      });
    });
};

const updateSellerReviews = (req, res) => {
  const { rating, comment } = req.body;
  const id = req.params.id;

  // const user_id = u_id//req.token.userId;

  const query = `UPDATE sellerreviews  SET comment=$3,rating=$2 WHERE id=$1 RETURNING *;`;
  const data = [id, rating, comment];
  pool
    .query(query, data)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "review updated successfully",
        result: result.rows[0],
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err,
      });
    });
};
const removeSellerReviews = (req, res) => {
  const id = req.params.id;

  // const user_id = u_id//req.token.userId;

  const query = `DELETE FROM sellerreviews WHERE id=$1;`;
  const data = [id];
  pool
    .query(query, data)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "sellerreview removed successfully",
        result: result.rows[0],
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err,
      });
    });
};
module.exports = {
  createReview,
  updateReview,
  removeReview,
  getProductReviews,
  createSellerReviews,
  getSellerReviews,
  updateSellerReviews,
  removeSellerReviews,
};
