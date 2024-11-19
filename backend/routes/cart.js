const express = require("express");
const auth = require("../middleware/authentication");

const {
    addToCart,removeFromCart,getCartItems


  
} = require("../controllers/cart");



const cartRouter = express.Router();

cartRouter.post("/:id",auth, addToCart);
cartRouter.delete("/:id",auth,removeFromCart);
cartRouter.get("/",auth, getCartItems);











module.exports = cartRouter;