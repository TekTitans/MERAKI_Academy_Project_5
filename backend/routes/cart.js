const express = require("express");
const {
    addToCart,removeFromCart,getCartItems


  
} = require("../controllers/cart");



const cartRouter = express.Router();

cartRouter.post("/", addToCart);
cartRouter.delete("/:id", removeFromCart);
cartRouter.get("/", getCartItems);











module.exports = cartRouter;