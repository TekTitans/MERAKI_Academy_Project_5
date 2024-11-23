const express = require("express");
const auth = require("../middleware/authentication");

const {
  cancelOrder,
  createOrder,
  getAllOrders,
  getOrderDetails,
  getSellerOrders,
  updateOrderStatus,
} = require("../controllers/order");

const orderRouter = express.Router();

orderRouter.post("/", auth, createOrder);
orderRouter.delete("/:id", auth, cancelOrder);
orderRouter.get("/", auth, getAllOrders);
orderRouter.get("/details/:id", auth, getOrderDetails);
orderRouter.get("/seller/:sellerId", auth, getSellerOrders);
orderRouter.put("/:id/status", auth, updateOrderStatus);

module.exports = orderRouter;
