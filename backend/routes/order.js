const express = require("express");
const auth = require("../middleware/authentication");

const {
  cancelOrder,
  createOrder,
  getAllOrders,
  getOrderDetails,
  getSellerOrders,
  updateOrderStatus,
  generateInvoice,
  getSellerSummary,
} = require("../controllers/order");

const orderRouter = express.Router();

orderRouter.post("/", auth, createOrder);
orderRouter.delete("/:id", auth, cancelOrder);
orderRouter.get("/", auth, getAllOrders);
orderRouter.get("/details/:id", auth, getOrderDetails);
orderRouter.get("/seller/summary", auth, getSellerSummary);
orderRouter.get("/seller/:sellerId", auth, getSellerOrders);
orderRouter.put("/:id/status", auth, updateOrderStatus);
orderRouter.get("/:id/invoice", generateInvoice);

module.exports = orderRouter;
