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

wishRouter.get("/", auth, authorization("can_view_wishlist"), getwishlist);

wishRouter.delete(
  "/:productId",
  auth,
  authorization("can_remove_from_wishlist"),
  removeFromwishlist
);

wishRouter.get(
  "/count",
  auth,
  authorization("can_view_wishlist"),
  getWishlistCount
);

module.exports = wishRouter;
