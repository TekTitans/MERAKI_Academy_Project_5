const pool = require("../models/db");

const createReview = async (req, res) => {
  const { rating, comment } = req.body;
  const { pId } = req.params;
  const userId = req.token.userId;

  try {
    console.log("userId", userId);
    const newReview = await pool.query(
      `INSERT INTO reviews (rating, comment, user_id, product_id) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [rating, comment, userId, pId]
    );

    const user = await pool.query(
      `SELECT first_name, last_name, profile_image FROM users WHERE id = $1`,
      [userId]
    );

    res.status(201).json({
      result: {
        ...newReview.rows[0],
        user_name: `${user.rows[0].first_name} ${user.rows[0].last_name}`,
        profile_image: user.rows[0].profile_image || null,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to create review." });
  }
};

const updateReview = async (req, res) => {
  const reviewId = req.params.reviewId;
  const { comment, rating } = req.body;
  const userId = req.token.userId;

  try {
    const result = await pool.query(
      "SELECT * FROM reviews WHERE id = $1 AND user_id = $2",
      [reviewId, userId]
    );

    if (result.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "You can only edit your own reviews" });
    }

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
  const userId = req.token.userId;

  try {
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

const getProductReviews = async (req, res) => {
  const product_id = parseInt(req.params.id);

  const query = `
    SELECT 
      reviews.id, 
      reviews.rating, 
      reviews.comment, 
      reviews.created_at, 
      reviews.user_id,
      CONCAT(users.first_name, ' ', users.last_name) AS user_name, 
      users.userName
    FROM reviews
    JOIN users ON reviews.user_id = users.id
    WHERE reviews.product_id = $1
  `;

  const aggregateQuery = `
    SELECT 
      COUNT(*) AS number_of_reviews,
      COALESCE(AVG(rating), 0) AS average_rating
    FROM reviews
    WHERE product_id = $1
  `;

  const data = [product_id];

  try {
    const reviewsResult = await pool.query(query, data);

    if (reviewsResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No reviews found",
        reviews: [],
        number_of_reviews: 0,
        average_rating: 0,
      });
    }

    const aggregateResult = await pool.query(aggregateQuery, data);

    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      reviews: reviewsResult.rows,
      number_of_reviews: parseInt(
        aggregateResult.rows[0].number_of_reviews,
        10
      ),
      average_rating: parseFloat(aggregateResult.rows[0].average_rating),
    });
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      err: err.message,
    });
  }
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
      console.log(err);

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

  const data = [sellerId]; //sellerId
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
