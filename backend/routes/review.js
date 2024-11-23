const express = require("express");
const {
  createReview,
  updateReview,
  removeReview,
  getProductReviews,
  createSellerReviews,
  getSellerReviews,
  updateSellerReviews,
  removeSellerReviews,
} = require("../controllers/review");

const auth = require("../middleware/authentication");

const reviewRouter = express.Router();

reviewRouter.post("/:pId", auth, createReview);
reviewRouter.put("/:id", updateReview);
reviewRouter.delete("/:id", removeReview);
reviewRouter.get("/:id", getProductReviews);
reviewRouter.post("/seller/:id", createSellerReviews);
reviewRouter.get("/seller/:sellerId", getSellerReviews);
reviewRouter.put("/seller/:id", updateSellerReviews);
reviewRouter.delete("/seller/:id", removeSellerReviews);

module.exports = reviewRouter;
