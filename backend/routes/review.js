const express = require("express");
const {
  createReview,
  updateReview,
  removeReview,
  getProductReviews,
  createSellerReviews,
  getSellerReviews,
  updateSellerReviews,
  removeSellerReviews

  
} = require("../controllers/review");



const reviewRouter = express.Router();

reviewRouter.post("/", createReview);
reviewRouter.put("/:id", updateReview);
reviewRouter.delete("/:id", removeReview);
reviewRouter.get("/:id", getProductReviews);
reviewRouter.post("/seller/:id", createSellerReviews);
reviewRouter.get("/seller/:id", getSellerReviews);
reviewRouter.put("/seller/:id", updateSellerReviews);
reviewRouter.delete("/seller/:id", removeSellerReviews);








module.exports = reviewRouter;