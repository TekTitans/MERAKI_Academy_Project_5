const express = require("express");
const {
    cancelOrder,createOrder,getAllOrders,getOrderDetails


  
} = require("../controllers/order");



const orderRouter = express.Router();

orderRouter.post("/", createOrder);
orderRouter.delete("/:id", cancelOrder);
orderRouter.get("/", getAllOrders);
orderRouter.get("/details/:id", getOrderDetails);









module.exports = orderRouter;