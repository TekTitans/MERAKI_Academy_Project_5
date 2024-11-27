const express = require("express");

const auth = require("../middleware/authentication");
const authorization = require("../middleware/authorization");

const wishRouter = express.Router();
const {
  addTowishlist,
  removeFromwishlist,
  getwishlist,
  clearWishlist,
  getWishlistCount,
} = require("../controllers/wishlist");

wishRouter.post("/", auth, addTowishlist);

wishRouter.delete(
  "/clear",
  auth,
  authorization("can_clear_wishlist"),
  clearWishlist
);

wishRouter.get("/", auth, getwishlist);

wishRouter.delete(
  "/:productId",
  auth,
  removeFromwishlist
);

wishRouter.get(
  "/count",
  auth,
  getWishlistCount
);

module.exports = wishRouter;
