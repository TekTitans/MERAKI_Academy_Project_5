const express = require("express");
const auth = require("../middleware/authentication");

const {
    addToCart,removeFromCart,getCartItems


  
} = require("../controllers/cart");



const cartRouter = express.Router();

cartRouter.post("/:id", addToCart);
cartRouter.delete("/:id",removeFromCart);
cartRouter.get("/",auth, getCartItems);











module.exports = cartRouter;