const express = require("express");
const auth = require("../middleware/authentication");

const {
  addToCart,
  removeFromCart,
  getCartItems,
  clearCart,
  updateCartQuantity,
} = require("../controllers/cart");

const cartRouter = express.Router();

cartRouter.delete("/cart", auth, clearCart);
cartRouter.get("/", auth, getCartItems);
cartRouter.post("/:id", auth, addToCart);
cartRouter.delete("/:id", auth, removeFromCart);
cartRouter.put("/:id", auth, updateCartQuantity);

module.exports = cartRouter;
